/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 11.10.2019
 * Time: 16:24
 */

import AbstractDbObject from '../../../dbascode/AbstractDbObject'
import Role from './Role'
import Schema from './Schema'
import ChildDef from '../../../dbascode/ChildDef'
import ChildDefCollection from '../../../dbascode/ChildDefCollection'
import PropDefCollection from '../../../dbascode/PropDefCollection'
import PropDef from '../../../dbascode/PropDef'
import AbstractDataBase from '../../../dbascode/AbstractDataBase'

/**
 * Database object
 * @property {object} params
 * @property {string} defaultLocale
 * @property {string[]} extensions
 * @property {Object.<string, Role>} roles
 * @property {Object.<string, Schema>} schemas
 */
export default class DataBase extends AbstractDataBase {
  /**
   * @type {string}
   * @private
   */
  _rootUserName = ''

  /**
   * @type {string}
   */
  static dbms = 'PostgreSQL'
  /**
   * @type {PropDefCollection}
   */
  static propDefs = new PropDefCollection([
    new PropDef('defaultLocale'),
    new PropDef('extensions', { type: PropDef.array }),
    ...this.propDefs.defs,
  ])
  /**
   * @type {ChildDefCollection}
   */
  static childrenDefs = new ChildDefCollection([
    new ChildDef(Role),
    new ChildDef(Schema),
  ])

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
   * @inheritDoc
   */
  getCalculators () {
    return {
      rootUserName: this._rootUserName,
      param: this.params,
    }
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
   * Returns a schema object by name
   * @param {string} name
   * @returns Schema
   */
  getSchema (name) {
    return this.schemas[name]
  }
}
