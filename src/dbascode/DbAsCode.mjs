/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 29.11.2019
 * Time: 19:22
 */

import path from 'path'
import os from 'os'
import fs from 'fs'
import { loadYaml } from './utils'
import isObject from 'lodash-es/isObject'
import { loadStateYaml } from './state-loader-yml'
import { collectChanges, getChangesSql } from './changes'
import State from './State'
import { TREE_INITIALIZED } from './PluginEvent'
import isString from 'lodash-es/isString'

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
   * @type {string}
   */
  _dbPluginName

  /**
   * Constructor
   * @param {DbAsCodeConfig} config
   * @param {string[]|PluginDescriptor[]} predefinedPlugins
   * @param {number} version
   */
  constructor (
    config = {},
    predefinedPlugins = [],
    version,
  ) {
    this.version = version
    this._predefinedPlugins = predefinedPlugins
    this.config = config
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
        isString(pluginOrImportPathSpec)
          ? (async () => { const module = await import(pluginOrImportPathSpec); return module.default })()
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
   * @return {Promise<void>}
   */
  async determineCurrentDbmsType () {
    let dbms = this.config.dbms
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
      if (p.dbClass && p.dbClass.dbms === dbms) {
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
    fs.writeFileSync('1.json', JSON.stringify(prevState))
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
    this.pluginEvent(TREE_INITIALIZED, [prevTree])
    /**
     * @var {AbstractDataBase} curTree
     */
    const curTree = dbClass.createFromState(
      dbClass,
      curStateRaw,
      this.version,
      dbPlugin.version
    )
    this.pluginEvent(TREE_INITIALIZED, [curTree])

    const changes = collectChanges(prevTree, curTree, true)

    try {
      const sql = getMigrationSql(changes, prevTree, curTree)
      return [
        new State({
          id: prevState.id + 1,
          raw: curStateRaw,
          migrationSql: sql,
          dbAsCodeVersion: this.version,
          pluginVersion: dbPlugin.version,
        }),
        changes,
      ]
    } finally {
      disposeTrees(prevTree, curTree)
    }
  }

  /**
   * Runs SQL migration of the plan
   * @param {State} newState
   * @return {Promise<void>}
   */
  async migrate (newState) {
    const dbPlugin = this.getDbPlugin()
    const sql =
      newState.migrationSql + "\n" +
      await dbPlugin.getStateStore().getStateSaveSql(newState)

    const tmpDumpFile = saveTempSqlFile(sql)
    let result = {}
    try {
      result = await dbPlugin.getSqlExec().executeSql(tmpDumpFile, { isFile: true })
      console.log(result.stderr ? result.stderr : result.stdout)
      if (result.exitCode === 0) {
        console.log('Done')
      } else {
        console.log('Migration failed')
      }
    } finally {
      fs.unlinkSync(tmpDumpFile)
      if (result.exitCode !== 0) {
        process.exit(result.exitCode)
      }
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

function getMigrationSql (changes, prevTree, curTree) {
  let sqlDump = getChangesSql(prevTree, curTree, changes)
  if (changes.hasChanges()) {
    if (sqlDump.trim().length === 0) {
      throw new Error('Changes in state detected, but SQL dump is empty.')
    }
  }
  return sqlDump
}

function disposeTrees (prevTree, curTree) {
  if (curTree) {
    curTree.dispose()
  }
  if (prevTree) {
    prevTree.dispose()
  }
}

export function saveTempSqlFile(sql) {
  const tmpDumpFile = path.join(os.tmpdir(), `dbascode${process.pid}.sql`)
  fs.writeFileSync(
    tmpDumpFile,
    sql,
  )
  return tmpDumpFile
}
