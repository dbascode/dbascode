/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 30.11.2019
 * Time: 11:08
 */
/**
 * Abstract ancestor class for all sql execution implementations in plugins
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
   * Execute SQL on the DB server
   * @param {string} sql
   * @param {object} cfg
   * @return {Promise<SqlExecResult>}
   */
  async executeSql (sql, cfg) {
    throw new Error('Not implemented')
  }

}
