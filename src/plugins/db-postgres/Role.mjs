/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */

import AbstractDbObject from '../../dbascode/AbstractDbObject'
import PropDefCollection from '../../dbascode/PropDefCollection'
import PropDef from '../../dbascode/PropDef'

/**
 * Role in a database
 * @property {string[]} memberOf
 * @property {boolean} isClient
 */
export default class Role extends AbstractDbObject {

  static propDefs = new PropDefCollection([
    new PropDef('memberOf', { type: PropDef.array }),
    new PropDef('isClient', { type: PropDef.bool }),
    ...this.propDefs.defs,
  ])

  /**
   * @inheritDoc
   */
  getSqlDefinition (operation, addSql) {
    if (this.memberOf.length > 0) {
      for (const memberOf of this.memberOf) {
        addSql.push(`GRANT "${memberOf}" TO ${this.getQuotedName()};`)
      }
    }
    if (this.isClient) {
      addSql.push(`GRANT ${this.getQuotedName()} TO current_user;`)
    }
    return `WITH NOLOGIN NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION`
  }
}
