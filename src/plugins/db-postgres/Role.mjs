/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */

import AbstractPostgresDbObject from './AbstractPostgresDbObject'
import PropDefCollection from '../../dbascode/PropDefCollection'
import PropDef from '../../dbascode/PropDef'
import SqlRules from './SqlRules'
import { joinSql } from '../../dbascode/utils'

/**
 * Role in a database
 * @property {string[]} memberOf
 * @property {boolean} isClient
 */
export default class Role extends AbstractPostgresDbObject {

  static propDefs = new PropDefCollection([
    new PropDef('memberOf', { type: PropDef.array }),
    new PropDef('isClient', { type: PropDef.bool }),
    ...this.propDefs.defs,
  ])
  /**
   * @type {typeof SqlRules}
   */
  static sqlRules = SqlRules

  /**
   * @inheritDoc
   */
  getSqlDefinition (operation) {
    return `WITH NOLOGIN NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION`
  }

  /**
   * @inheritDoc
   */
  getSqlDefinitionAfter (operation) {
    const sql = [super.getSqlDefinitionAfter(operation)]
    if (this.memberOf.length > 0) {
      for (const memberOf of this.memberOf) {
        sql.push(`GRANT "${memberOf}" TO ${this.sql.getEscapedName()};`)
      }
    }
    if (this.isClient) {
      sql.push(`GRANT ${this.sql.getEscapedName()} TO current_user;`)
    }
    return joinSql(sql)
  }

}
