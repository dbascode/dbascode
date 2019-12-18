/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */

/**
 * @typedef {object} SqlExecResult
 * @property {int} exitCode
 * @property {string} stdout
 * @property {string} stderr
 */
/**
 * Abstract ancestor class for state storage classes
 */
export default class AbstractStateStore {
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
   * Loads the current (last) state of the database
   * @return {Promise<State>}
   */
  async getState () {
    throw new Error('Not implemented')
  }

  /**
   * Returns state storage configuration file name
   * @return {Promise<string>}
   */
  async getStorageConfigPath () {
    throw new Error('Not implemented')
  }

  /**
   * Returns SQL to save state to the DB
   * @param {State} state
   * @return {Promise<string>}
   */
  async getStateSaveSql (state) {
    throw new Error('Not implemented')
  }
}
