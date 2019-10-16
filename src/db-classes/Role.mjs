/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 11.10.2019
 * Time: 16:29
 */

import AbstractDbObject from './AbstractDbObject'
import isArray from 'lodash-es/isArray'
import isEqual from 'lodash-es/isEqual'

class Role extends AbstractDbObject {
  memberOf = []
  isClient = false

  /**
   * Constructor
   * @param {string} name
   * @param {string[]} [memberOf]
   * @param {DataBase} [parent]
   * @param {boolean} isClient
   */
  constructor (
    {
      name,
      memberOf = [],
      parent= undefined,
      isClient = false,
    }
  ) {
    super(name, parent)
    this.memberOf = memberOf
    this.isClient = isClient
    if (parent) {
      parent.roles[name] = this
    }
  }

  /**
   * Instantiate new object from config data
   * @param {string} name
   * @param {Object|null} cfg
   * @param {DataBase} [parent]
   * @return {Role|null}
   */
  static createFromCfg(name, cfg, parent) {
    const memberOf = cfg ? cfg.member_of : []
    return new Role({
      name,
      memberOf: isArray(memberOf) ? memberOf : (memberOf ? [memberOf] : []),
      parent,
    })
  }

  /**
   * Returns SQL for object creation
   * @returns {string}
   */
  getCreateSql() {
    let result =
      `CREATE ROLE ${this.getQuotedName()} WITH
  NOLOGIN
  NOSUPERUSER
  INHERIT
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION;\n`
    if (this.memberOf.length > 0) {
      for (const memberOf of this.memberOf) {
        result += `GRANT "${memberOf}" TO ${this.getQuotedName()};\n`
      }
    }
    if (this.isClient) {
      result += `GRANT ${this.getQuotedName()} TO current_user;\n`
    }
    return result
  }

  /**
   * Returns SQL for object deletion
   * @returns {string}
   */
  getDropSql() {
    return `DROP ROLE ${this.getQuotedName()};`
  }
}

export default Role
