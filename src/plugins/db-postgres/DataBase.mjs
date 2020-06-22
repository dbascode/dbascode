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
import DataBaseMixin from '../../dbascode/DataBaseMixin'
import AbstractPostgresDbObject from './AbstractPostgresDbObject'
import { joinSql, parseArrayProp } from '../../dbascode/utils'
import SqlRules from './SqlRules'

/**
 * PostgreSQL database object
 * @property {string} defaultLocale
 * @property {string[]} extensions
 * @property {Object.<string, Role>} roles
 * @property {Object.<string, Schema>} schemas
 * @extends AbstractPostgresDbObject
 * @extends DataBaseMixin
 */
export default class DataBase extends DataBaseMixin(AbstractPostgresDbObject) {
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
   * @type {typeof SqlRules}
   */
  static sqlRules = SqlRules

  /**
   * Returns SQL for object creation
   * @returns {string}
   */
  getCreateSql() {
    let sql = []
    if (this.extensions.length > 0) {
      for (const ext of this.extensions) {
        sql.push(`CREATE EXTENSION IF NOT EXISTS ${SqlRules.escapeStringExpr(ext)};`)
      }
    }
    return joinSql(sql)
  }

  /**
   * @inheritDoc
   */
  getCalculators () {
    return {
      rootUserName: this._rootUserName,
      params: this.params,
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
    for (const extName of this.extensions) {
      const invalidChars = []
      if (!this.sql.validateSqlId(extName, invalidChars)) {
        context.addError(this, `Invalid chars (${invalidChars.join(', ')}) in extension name ${extName}.`)
      }
    }
    super.validate(previous, context)
  }

  /**
   * @inheritDoc
   */
  getAlterPropSql (compared, propName, oldValue, curValue, context) {
    if (propName === 'dbmsVersion') {
      return undefined;
    } else {
      return super.getAlterPropSql(compared, propName, oldValue, curValue, context)
    }
  }

  /**
   * @inheritDoc
   */
  getChangesAlterSql (compared, changes) {
    const newChanges = [...changes]
    const result = []
    for (const i in changes) {
      const change = changes[i]
      const parsedPropName = parseArrayProp(change.path)
      if (parsedPropName.name === 'extensions') {
        delete newChanges[i]
        const replace = change.cur && change.old
        if (!change.cur || replace) {
          result.push(`DROP EXTENSION "${SqlRules.escapeStringExpr(change.old)}";`)
        }
        if (!change.old || replace) {
          result.push(`CREATE EXTENSION IF NOT EXISTS ${SqlRules.escapeStringExpr(change.cur)};`)
        }
      }
    }
    result.push(super.getChangesAlterSql(compared, newChanges.filter(i => i)))
    return joinSql(result)
  }

  /**
   * Find child by SQL type definition
   * @param {ArgumentTypeDef} def
   * @return {AbstractDbObject|null}
   */
  findChildBySqlTypeDef (def) {
    const schema = this.getSchema(def.schema)
    if (!schema) {
      throw new Error(`Schema ${def.schema} not found in type definition ${def.schema}.${def.type}`)
    }
    return schema.findChildByUniqueGroupAndName('default', def.type)
  }
}
