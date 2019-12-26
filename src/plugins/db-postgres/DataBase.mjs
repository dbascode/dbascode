/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */

import Role from './Role'
import Schema from './Schema'
import ChildDef from '../../dbascode/ChildDef'
import ChildDefCollection from '../../dbascode/ChildDefCollection'
import PropDefCollection from '../../dbascode/PropDefCollection'
import PropDef from '../../dbascode/PropDef'
import AbstractDataBase from '../../dbascode/AbstractDataBase'

/**
 * PostgreSQL database object
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
   * Returns a schema object by name
   * @param {string} name
   * @returns Schema
   */
  getSchema (name) {
    return this.schemas[name]
  }

  /**
   * @inheritDoc
   */
  validate (previous, context) {
    if (this.dbmsVersion == 0) {
      context.addError(this, `DBMS version is not set. Did you forget to define the dbmsVersion parameter in the state configuration?`)
      return
    } else if (this.dbmsVersion < 9.4) {
      context.addError(this, `PostgreSQL version below 9.4 is not supported. Version ${this.dbmsVersion} is defined.`)
      return
    }
    super.validate(previous, context)
  }

  /**
   * @inheritDoc
   */
  getAlterPropSql (compared, propName, oldValue, curValue) {
    if (propName === 'dbmsVersion') {
      return undefined;
    } else {
      return super.getAlterPropSql(compared, propName, oldValue, curValue)
    }
  }
}
