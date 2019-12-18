/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 29.11.2019
 * Time: 19:22
 */

import fs from 'fs'
import { loadYaml, saveTempSqlFile } from './utils'
import isObject from 'lodash-es/isObject'
import { loadStateYaml } from './state-loader-yml'
import State from './State'
import { TREE_INITIALIZED } from './PluginEvent'
import isString from 'lodash-es/isString'
import ValidationContext from './ValidationContext'
import Changes from './Changes'

/**
 * @typedef {object} DbAsCodeConfig
 * @property {string[]} dbVars
 * @property {string[]|PluginDescriptor[]} plugins
 * @property {string} source
 * @property {string} dbms
 * @property {boolean} wsl
 */
/**
 * Main class of the DbAsCode tool
 */
export default class DbAsCode {
  static version = 2
  /**
   * @type {DbAsCodeConfig}
   */
  config = {
    dbVars: [],
    source: '',
    plugins: [],
    dbms: '',
    wsl: false,
  }
  /**
   * @type {number}
   */
  version
  /**
   * @type {string[]|PluginDescriptor[]}
   * @private
   */
  _predefinedPlugins = []
  /**
   * @type {PluginDescriptor[]}
   * @private
   */
  _plugins = []
  /**
   * @type {Object.<string, PluginDescriptor>}
   * @private
   */
  _pluginsMap = {}
  /**
   * @type {Changes}
   */
  changes
  /**
   * @type {string}
   * @private
   */
  _dbPluginName

  /**
   * Constructor
   * @param {DbAsCodeConfig} config
   * @param {string[]|PluginDescriptor[]} predefinedPlugins
   * @param {Changes} changes
   */
  constructor (
    config = {},
    predefinedPlugins = [],
    changes,
  ) {
    if (changes === undefined) {
      changes = new Changes()
    }
    this.changes = changes
    this._predefinedPlugins = predefinedPlugins
    this.config = { ...this.config, ...config }
  }

  /**
   * Returns plugin by its name
   * @param name
   * @return {PluginDescriptor}
   */
  getPlugin (name) {
    const plugin = this._pluginsMap[name]
    if (!plugin) {
      throw new Error(`Plugin ${name} not found`)
    }
    if (!plugin.initialized) {
      plugin.init(this.config)
    }
    return plugin
  }

  /**
   * Returns current DB plugin
   * @return {PluginDescriptor}
   */
  getDbPlugin () {
    return this.getPlugin(this._dbPluginName)
  }

  /**
   * Resolve all plugins and load its modules
   * @return {Promise<void>}
   */
  async initializePlugins () {
    const plugins = []
    for (const pluginOrImportPathSpec of [...this._predefinedPlugins, ...this.config.plugins]) {
      plugins.push(
        isString(pluginOrImportPathSpec) || pluginOrImportPathSpec instanceof URL
          ? (async () => {
            const module = await import(pluginOrImportPathSpec);
            return module.default
          })()
          : pluginOrImportPathSpec
      )
    }
    this._plugins = await Promise.all(plugins)
    for (const plugin of this._plugins) {
      this._pluginsMap[plugin.name] = plugin
    }
  }

  /**
   * Find out the current DBMS and initialize db plugin
   * @param {string} forcedValue - Enforced DBMS value (to use when loading an existing plan)
   * @return {Promise<void>}
   */
  async determineCurrentDbmsType (forcedValue = undefined) {
    let dbms = forcedValue || this.config.dbms
    if (!dbms) {
      const stateFile = this.config.source
      if (!stateFile || !fs.existsSync(stateFile)) {
        throw new Error(`Current state file ${stateFile} not set or not found`)
      }
      const state = await loadYaml(stateFile)
      if (!isObject(state)) {
        throw new Error("Current state configuration file must be a valid yaml file")
      }
      dbms = state.dbms
    }
    if (!dbms) {
      throw new Error('DBMS is not defined')
    }
    for (const p of this._plugins) {
      if (p.dbClass && p.dbClass.dbms.toLowerCase() === dbms.toLowerCase()) {
        this._dbPluginName = p.name
        break
      }
    }
    if (!this._dbPluginName) {
      throw new Error(`Can not find implementation plugin for the ${dbms} DBMS`)
    }
    if (!this.getDbPlugin().stateStoreClass) {
      throw new Error(`DBMS plugin for ${dbms} was found, but it doesn't expose the StateStorage class`)
    }
  }

  /**
   * Create migration plan.
   * @return {Promise<(State|ChangesContext)[]>}
   */
  async createPlan () {
    console.log('Loading current DB state...')
    const dbPlugin = this.getDbPlugin()
    // const prevState = await dbPlugin.getStateStore().getState()
    const prevState = JSON.parse(fs.readFileSync('1.json'))
    // fs.writeFileSync('1.json', JSON.stringify(prevState))
    console.log('Loading new state...')
    const curStateRaw = await loadStateYaml([
      await dbPlugin.getStateStore().getStorageConfigPath(),
      this.config.source,
    ])
    const dbClass = dbPlugin.dbClass
    /**
     * @var {AbstractDataBase} prevTree
     */
    const prevTree = dbClass.createFromState(
      dbClass,
      prevState.raw,
      prevState.dbAsCodeVersion,
      prevState.pluginVersion,
    )
    if (prevTree) {
      this.pluginEvent(TREE_INITIALIZED, [prevTree])
    }
    /**
     * @var {AbstractDataBase} curTree
     */
    const curTree = dbClass.createFromState(
      dbClass,
      curStateRaw,
      DbAsCode.version,
      dbPlugin.version
    )
    if (curTree) {
      this.pluginEvent(TREE_INITIALIZED, [curTree])
      const validationContext = new ValidationContext(prevTree, curTree)
      curTree.validate(prevTree, validationContext)
      if (validationContext.hasErrors()) {
        console.log(validationContext.printErrors())
        throw new Error('Current state validation has failed')
      }
    }

    const changes = this.changes.collectChanges(prevTree, curTree, true)

    try {
      const sql = this.getMigrationSql(changes, prevTree, curTree)
      return [
        new State({
          id: (prevState.id || 0) + 1,
          raw: curStateRaw,
          migrationSql: sql,
          dbAsCodeVersion: DbAsCode.version,
          pluginVersion: dbPlugin.version,
        }),
        changes,
      ]
    } finally {
      this.disposeTrees(prevTree, curTree)
    }
  }

  /**
   * Runs SQL migration of the plan
   * @param {State} newState
   * @return {Promise<number>}
   */
  async migrate (newState) {
    const dbPlugin = this.getDbPlugin()
    const sql =
      newState.migrationSql + "\n" +
      await dbPlugin.getStateStore().getStateSaveSql(newState)

    const tmpDumpFile = await saveTempSqlFile(sql)
    let result = {}
    try {
      result = await dbPlugin.getSqlExec().executeSql(tmpDumpFile, { isFile: true })
      console.log(result.stderr ? result.stderr : result.stdout)
      if (result.exitCode === 0) {
        console.log('Done')
      } else {
        console.log('Migration failed')
      }
    } catch (e) {
      result = {
        exitCode: -1,
      }
      console.log(e)
    } finally {
      fs.unlinkSync(tmpDumpFile)
    }
    return result.exitCode
  }

  /**
   * @private
   * @param changes
   * @param prevTree
   * @param curTree
   * @returns {string}
   */
  getMigrationSql (changes, prevTree, curTree) {
    let sqlDump = this.changes.getChangesSql(prevTree, curTree, changes)
    if (changes.hasChanges()) {
      if (sqlDump.trim().length === 0) {
        throw new Error('Changes in state detected, but SQL dump is empty.')
      }
    }
    return sqlDump
  }

  /**
   * @private
   * @param prevTree
   * @param curTree
   */
  disposeTrees (prevTree, curTree) {
    if (curTree) {
      curTree.dispose()
    }
    if (prevTree) {
      prevTree.dispose()
    }
  }

  /**
   * Execute plugin event
   * @param {string} eventName
   * @param {*[]} args
   */
  pluginEvent (eventName, args = []) {
    for (const name of Object.keys(this._pluginsMap)) {
      this.getPlugin(name).event(eventName, args)
    }
  }
}
