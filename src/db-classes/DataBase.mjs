/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 11.10.2019
 * Time: 16:24
 */

import { dispose, } from '../utils'
import AbstractDbObject from './AbstractDbObject'
import Role from './Role'
import Schema from './Schema'
import ChildDef from './ChildDef'
import ChildDefCollection from './ChildDefCollection'

/**
 * Database object
 */
export default class DataBase extends AbstractDbObject {
  /**
   * Default locale of this Database.
   * @type {string}
   */
  defaultLocale = ''
  /**
   * List of installed Postgres database extensions.
   * @type {*[]}
   */
  extensions = []
  /**
   * @type {string}
   * @private
   */
  _rootUserName = ''
  /**
   * @type {string}
   * @private
   */
  _rootPassword = ''
  /**
   * Database plugins
   * @type {Object.<string, AbstractPlugin>}
   * @private
   */
  _plugins = {}
  /**
   * PgAsCode version number this object was generated with
   * @type {number}
   * @private
   */
  _version = 0
  /**
   * @property {Role[]} roles
   * @property {Schema[]} schemas
   */
  /**
   * @type {ChildDefCollection}
   */
  static childrenDefs = new ChildDefCollection([
    new ChildDef(Role),
    new ChildDef(Schema),
  ])

  /**
   * Instantiate new object from config data
   * @param {Object|null} cfg
   * @param {Object|null} [overrides]
   * @param {AbstractPlugin[]} plugins
   * @param {number} version
   * @return {DataBase|null}
   */
  static createFromState(
    cfg,
    overrides,
    plugins = [],
    version,
  ) {
    const result = new DataBase({
      name: overrides.dbName ? overrides.dbName : '',
      rawConfig: cfg,
    })
    result._version = version
    result.defaultLocale = overrides.defaultLocale ? overrides.defaultLocale : cfg.default_locale
    result._rootUserName = overrides.rootUserName ? overrides.rootUserName : cfg.root_user_name
    result._rootPassword = overrides.rootPassword ? overrides.rootPassword : cfg.root_user_password
    result.extensions = cfg.extensions
    for (const plugin of plugins) {
      result.addPlugin(plugin)
    }
    result.applyConfig(cfg)
    result.postprocessTree()
    result.setupDependencies()
    result.pluginOnTreeInitialized()
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
   * @param {Object} config
   */
  pluginOnTreeInitialized(config = {}) {
    for (const plugin of Object.values(this._plugins)) {
      plugin.onTreeInitialized(this)
    }
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
