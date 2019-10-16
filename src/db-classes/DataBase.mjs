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
  rootUserName = ''
  rootPassword = ''
  defaultLocale = ''
  extensions = []

  /**
   * Constructor
   * @param {string} [name]
   * @param {Object.<string, Schema>} [schemas]
   * @param {Object.<string, Role>} [roles]
   * @param {string} rootUserName
   * @param {string} [rootPassword]
   * @param {string} [defaultLocale]
   * @param {string[]} [extensions]
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
    }) {
    super(name)
    this.objectCollectionProps = ['roles', 'schemas']
    this.rootUserName = rootUserName
    this.rootPassword = rootPassword
    this.defaultLocale = defaultLocale
    this.schemas = schemas
    this.roles = roles
    this.extensions = extensions
  }

  /**
   * Instantiate new object from config data
   * @param {Object|null} cfg
   * @param {Object|null} [overrides]
   * @return {DataBase|null}
   */
  static createFromCfg(
    cfg,
    overrides
  ) {
    if (!cfg) {
      return null
    }
    const result = new DataBase({
      defaultLocale: overrides.defaultLocale ? overrides.defaultLocale : cfg.default_locale,
      rootUserName: overrides.rootUserName ? overrides.rootUserName : cfg.root_user_name,
      rootPassword: overrides.rootUserPassword ? overrides.rootUserPassword : cfg.root_user_password,
    })
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

  getCalculators () {
    return {
      rootUserName: this.rootUserName,
    }
  }
}

export default DataBase
