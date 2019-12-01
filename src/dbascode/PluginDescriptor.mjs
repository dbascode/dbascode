/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 30.11.2019
 * Time: 11:13
 */

/**
 * Class describing a plugin and its capabilities.
 */
export default class PluginDescriptor {
  name
  version
  dbClass
  stateStoreClass
  sqlExecClass
  dbAsCodeConfig
  initialized = false
  eventHandler
  _stateStore
  _sqlExec

  /**
   * Constructor
   * @param {string} name
   * @param {number} version
   * @param {typeof AbstractDataBase|null} [dbClass]
   * @param {typeof AbstractStateStore|null} [stateStoreClass]
   * @param {typeof AbstractSqlExec|null} [sqlExecClass]
   * @param {function|null} [eventHandler]
   */
  constructor (
    {
      name,
      version,
      dbClass,
      stateStoreClass,
      sqlExecClass,
      eventHandler,
    }
  ) {
    this.name = name
    this.version = version
    this.dbClass = dbClass
    this.stateStoreClass = stateStoreClass
    this.sqlExecClass = sqlExecClass
    this.eventHandler = eventHandler
  }

  /**
   * Initialize plugin descriptor with the DbAsCode configuration
   * @param dbAsCodeConfig
   */
  init (dbAsCodeConfig) {
    this.dbAsCodeConfig = dbAsCodeConfig
    this.initialized = true
  }

  /**
   * Returns state storage instance
   * @return {*}
   */
  getStateStore () {
    if (!this._stateStore) {
      this._stateStore = new this.stateStoreClass(this.dbAsCodeConfig, this)
    }
    return this._stateStore
  }

  /**
   * Returns SQL exec provider
   * @return {AbstractSqlExec}
   */
  getSqlExec () {
    if (!this._sqlExec) {
      this._sqlExec = new this.sqlExecClass(this.dbAsCodeConfig, this)
    }
    return this._sqlExec
  }

  /**
   * Execute plugin event
   * @param {string} eventName
   * @param {*[]} args
   */
  event (eventName, args = []) {
    if (this.eventHandler) {
      this.eventHandler(eventName, args)
    }
  }
}
