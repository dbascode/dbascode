/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 11.10.2019
 * Time: 16:29
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
