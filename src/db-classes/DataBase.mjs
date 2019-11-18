/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 11.10.2019
 * Time: 16:24
 */

import AbstractDbObject from './AbstractDbObject'
import Role from './Role'
import Schema from './Schema'
import {
  dispose,
} from '../utils'

/**
 * Database object
 */
class DataBase extends AbstractDbObject {
  schemas = {}
  roles = {}
  _rootUserName = ''
  _rootPassword = ''
  defaultLocale = ''
  extensions = []
  /**
   * @type {Object.<string, AbstractPlugin>}
   * @private
   */
  _plugins = {}
  _childrenProps = ['roles', 'schemas']
  _version = 0

  /**
   * Constructor
   * @param {string} [name]
   * @param {Object.<string, Schema>} [schemas]
   * @param {Object.<string, Role>} [roles]
   * @param {string} rootUserName
   * @param {string} [rootPassword]
   * @param {string} [defaultLocale]
   * @param {string[]} [extensions]
   * @param {number} version
   */
  constructor (
    {
      name= '',
      schemas = {},
      roles = {},
      rootUserName,
      rootPassword = '',
      defaultLocale = '',
      extensions = [],
      version = 0,
    }) {
    super({ name: name })
    this._rootUserName = rootUserName
    this._rootPassword = rootPassword
    this.defaultLocale = defaultLocale
    this.schemas = schemas
    this.roles = roles
    this.extensions = extensions
    this._version = version
  }

  /**
   * Instantiate new object from config data
   * @param {Object|null} cfg
   * @param {Object|null} [overrides]
   * @param {AbstractPlugin[]} plugins
   * @param {number} version
   * @return {DataBase|null}
   */
  static createFromCfg(
    cfg,
    overrides,
    plugins = [],
    version,
  ) {
    if (!cfg) {
      return undefined
    }
    const result = new DataBase({
      defaultLocale: overrides.defaultLocale ? overrides.defaultLocale : cfg.default_locale,
      rootUserName: overrides.rootUserName ? overrides.rootUserName : cfg.root_user_name,
      rootPassword: overrides.rootPassword ? overrides.rootPassword : cfg.root_user_password,
      name: overrides.dbName ? overrides.dbName : '',
      extensions: cfg.extensions,
    })
    for (const plugin of plugins) {
      result.addPlugin(plugin)
    }
    for (const name of Object.keys(cfg.roles || {})) {
      Role.createFromCfg(name, cfg.roles[name], result)
    }
    for (const name of Object.keys(cfg.schemas || {})) {
      Schema.createFromCfg(name, cfg.schemas[name], result)
    }
    return result
  }

  /**
   * Returns SQL for object creation
   * @returns {string}
   */
  getCreateSql() {
    let result = ''
    if (this.extensions.length > 0) {
      for (const ext of this.extensions) {
        result += `CREATE EXTENSION IF NOT EXISTS "${ext}";\n`
      }
    }
    return result
  }

  /**
   * Destroys all links in the tree to allow garbage collector
   */
  dispose () {
    dispose(this)
  }

  /**
   * @inheritDoc
   */
  getCalculators () {
    return {
      rootUserName: this._rootUserName,
    }
  }

  /**
   *
   * @param {AbstractPlugin} plugin
   */
  addPlugin(plugin) {
    this._plugins[plugin.getName()] = plugin
  }

  /**
   * Executes plugins when an object is created and configured
   * @param {AbstractDbObject} instance
   * @param {Object} config
   * @returns {AbstractDbObject}
   */
  pluginOnObjectConfigured(instance, config = {}) {
    let result = instance
    for (const plugin of Object.values(this._plugins)) {
      plugin.onObjectCreated(result, config)
    }
    return result
  }

  /**
   * Executes plugins to provide custom object comparison when calculating changes
   * @param {AbstractDbObject} old
   * @param {AbstractDbObject} cur
   * @param {ChangesContext} context
   */
  pluginOnCompareObjects (old, cur, context) {
    for (const plugin of Object.values(this._plugins)) {
      plugin.onCompareObjects(old, cur, context)
    }
  }

  /**
   * Returns version used to save this DB object. Automatically set up by pgascode on state save.
   * Useful for adding custom migrations on the tool version change.
   * @return {number}
   */
  getVersion () {
    return this._version
  }
}

export default DataBase
