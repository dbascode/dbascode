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
   * Constructor
   * @param {string} name
   * @param {string[]} [memberOf]
   * @param {DataBase} [parent]
   * @param {boolean} isClient
   * @param {string} [comment]
   */
  constructor (
    {
      name,
      memberOf = [],
      parent= undefined,
      isClient = false,
      comment = '',
    }
  ) {
    super({
      name,
      parent,
      comment,
    })
    this.memberOf = memberOf
    this.isClient = isClient
  }

  /**
   * Instantiate new object from config data
   * @param {string} name
   * @param {Object|null} cfg
   * @param {DataBase} [parent]
   * @return {Role}
   */
  static createFromCfg(name, cfg, parent) {
    const memberOf = cfg ? cfg.member_of : []
    const result = new Role({
      name,
      memberOf: isArray(memberOf) ? memberOf : (memberOf ? [memberOf] : []),
      parent,
    })
    return result.getDb().pluginOnObjectConfigured(result, cfg)
  }

  /**
   * @inheritDoc
   */
  getDefinition (operation, addSql) {
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
