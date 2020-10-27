/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
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
import isArray from 'lodash-es/isArray'

/**
 * @typedef {object} DbAsCodeConfig
 * @property {string[]} dbVars
 * @property {string[]|PluginDescriptor[]} plugins
 * @property {string} source
 * @property {string} dbms
 * @property {boolean} wsl
 */
/**
 * Main class of the DbAsCode tool.
 */
export default class DbAsCode {
  static version = 3
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
   * @param {{source: string}} config
   * @param {string[]|PluginDescriptor[]} predefinedPlugins
   */
  constructor (
    config = {},
    predefinedPlugins = [],
  ) {
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
      if (!stateFile) {
        throw new Error(`Current state file not set`)
      }
      if (!fs.existsSync(stateFile)) {
        throw new Error(`Current state file ${stateFile} not found`)
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
      if (p.dbClass) {
        const dbClass = p.dbClass
        if (isString(dbClass.dbms)) {
          if (dbClass.dbms.toLowerCase() === dbms.toLowerCase()) {
            this._dbPluginName = p.name
            break
          }
        } else if (isArray(dbClass.dbms)) {
          if (dbClass.dbms.map(name => name.toLowerCase()).indexOf(dbms.toLowerCase()) >= 0) {
            this._dbPluginName = p.name
            break
          }
        }
      }
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
   * @return {Promise<State>}
   */
  async createPlan ({ forceOldState = false, oldStateConfig = undefined, forceNewState = false, newStateConfig = undefined }) {
    console.log('Loading current/old DB state...')
    const dbPlugin = this.getDbPlugin()
    let oldState
    if (forceOldState) {
      oldState = new State({id: 0})
    } else {
      oldState = await dbPlugin.getStateStore().getState()
    }
    console.log('Loading new state...')
    if (!forceNewState) {
      newStateConfig = await loadStateYaml([
        await dbPlugin.getStateStore().getStorageConfigPath(),
        this.config.source,
      ])
    }
    const dbClass = dbPlugin.dbClass
    const oldTree = dbClass.createFromState(
      dbClass,
      {...oldState.raw, name: dbPlugin.getDbName()},
      oldState.dbAsCodeVersion,
      oldState.pluginVersion,
      false,
    )
    if (oldTree) {
      this.pluginEvent(TREE_INITIALIZED, [oldTree])
      oldTree.setupDependencies()
    }
    const newTree = dbClass.createFromState(
      dbClass,
      {...newStateConfig, name: dbPlugin.getDbName()},
      DbAsCode.version,
      dbPlugin.version,
      true,
    )
    if (newTree) {
      this.pluginEvent(TREE_INITIALIZED, [newTree])
      newTree.setupDependencies();
      const validationContext = new ValidationContext(oldTree, newTree)
      newTree.validate(oldTree, validationContext)
      if (validationContext.hasErrors()) {
        console.log(validationContext.printErrors())
        throw new Error('New state validation has failed')
      }
    }

    this.changes = new Changes(oldTree, newTree)
    this.changes.collectChanges(true)

    const sql = this.getMigrationSql()
    return new State({
      oldId: oldState.id || 0,
      id: (oldState.id || 0) + 1,
      raw: newStateConfig,
      migrationSql: sql,
      dbAsCodeVersion: DbAsCode.version,
      pluginVersion: dbPlugin.version,
      hasChanges: this.changes.hasChanges(),
      hasSqlChanges: this.changes.hasSqlChanges(),
    })
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
   * @returns {string}
   */
  getMigrationSql () {
    let sqlDump = this.changes.getChangesSql()
    if (this.changes.hasSqlChanges()) {
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
   * @param {array} args
   */
  pluginEvent (eventName, args = []) {
    for (const name of Object.keys(this._pluginsMap)) {
      this.getPlugin(name).event(eventName, args)
    }
  }
}
