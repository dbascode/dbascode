/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 11.10.2019
 * Time: 16:29
 */

import AbstractDbObject from './AbstractDbObject'
import isArray from 'lodash-es/isArray'
import isEqual from 'lodash-es/isEqual'

/**
 * Role in a database
 */
export default class Role extends AbstractDbObject {
  memberOf = []
  isClient = false

  /**
   * @inheritDoc
   */
  applyConfigProperties (config) {
    config = config || {}
    const memberOf = config.member_of || []
    this.memberOf = isArray(memberOf) ? memberOf : (memberOf ? [memberOf] : [])
    this.isClient = !!config.is_client
  }

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
