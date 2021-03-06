/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */
/**
 * Abstract ancestor class for all sql execution implementations in plugins.
 */
export default class AbstractSqlExec {
  /**
   * @type {DbAsCodeConfig}
   */
  dbAsCodeConfig
  /**
   * @type {PluginDescriptor}
   */
  _plugin

  /**
   * Constructor
   * @param {DbAsCodeConfig} dbAsCodeConfig
   * @param {PluginDescriptor} plugin
   */
  constructor (dbAsCodeConfig, plugin) {
    this.dbAsCodeConfig = dbAsCodeConfig
    this._plugin = plugin
  }

  /**
   * Execute SQL script on the DB server. The whole script must be run in a single transaction. None
   * of the queries should affect DB state if any of the queries has failed.
   * @param {string} sql
   * @param {object} cfg
   * @return {Promise<SqlExecResult>}
   */
  async executeSql (sql, cfg) {
    throw new Error('Not implemented')
  }

}
