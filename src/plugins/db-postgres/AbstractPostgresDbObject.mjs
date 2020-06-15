/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */

import AbstractDbObject from '../../dbascode/AbstractDbObject'
import {
  joinSql,
  objectDifferenceKeys,
  objectIntersectionKeys
} from '../../dbascode/utils'
import difference from 'lodash-es/difference'

/**
 * Abstract class for all db objects in PostgreSQL
 */
export default class AbstractPostgresDbObject extends AbstractDbObject {
  /**
   * Returns SQL for alteration of a particular property
   * @param {AbstractDbObject} compared
   * @param {string} propName
   * @param {*} oldValue
   * @param {*} curValue
   * @param {object} context
   * @return {string|string[]|undefined}
   */
  getAlterPropSql (compared, propName, oldValue, curValue, context) {
    switch (propName) {
      case 'comment':
        context.separateSql = true
        return this.getCommentChangesSql(compared)
      case 'grant':
        context.separateSql = true
        return this.getPermissionsChangesSql(compared)
      default: return ''
    }
  }

  /**
   * Returns SQL for comments update
   * @param {AbstractDbObject} previous
   * @returns {string}
   */
  getCommentChangesSql (previous) {
    const comment = this.getComment();
    const prevComment = previous ? previous.getComment() : ''
    if (prevComment !== comment) {
      return `COMMENT ON ${this.getObjectClass('comment')} ${this.getObjectIdentifier('comment', false)} IS ${this.sql.escapeStringExpr(comment)};`
    }
  }

  /**
   * Returns SQL for permissions update
   * @param previous
   * @returns {string}
   */
  getPermissionsChangesSql (previous) {
    const old = previous, cur = this
    const result = []
    const curGrant = cur ? cur.grant : {}, curRevoke = cur ? cur.revoke : {}
    const oldGrant = old ? old.grant : {}, oldRevoke = old ? old.revoke : {}
    const addGrantOps = objectDifferenceKeys(curGrant, oldGrant)
    const removeGrantOps = objectDifferenceKeys(oldGrant, curGrant)
    const addRevokeOps = objectDifferenceKeys(curRevoke, oldRevoke)
    // const removeRevokeOps = objectDifferenceKeys(oldRevoke, curRevoke)
    const sameGrantOps = objectIntersectionKeys(curGrant, oldGrant)
    const sameRevokeOps = objectIntersectionKeys(curRevoke, oldRevoke)

    for (const op of addGrantOps) {
      for (const role of curGrant[op]) {
        result.push(cur.getPermissionSql('GRANT', op, role))
      }
    }
    for (const op of removeGrantOps) {
      for (const role of oldGrant[op]) {
        result.push(old.getPermissionSql('REVOKE', op, role))
      }
    }
    for (const op of addRevokeOps) {
      for (const role of curRevoke[op]) {
        result.push(cur.getPermissionSql('REVOKE', op, role))
      }
    }
    for (const op of sameGrantOps) {
      const addGrantRoles = difference(curGrant[op], oldGrant[op])
      const removeGrantRoles = difference(oldGrant[op], curGrant[op])
      for (const role of addGrantRoles) {
        result.push(cur.getPermissionSql('GRANT', op, role))
      }
      for (const role of removeGrantRoles) {
        result.push(cur.getPermissionSql('REVOKE', op, role))
      }
    }
    for (const op of sameRevokeOps) {
      const addRevokeRoles = difference(curRevoke[op], oldRevoke[op])
      // const removeRevokeRoles = difference(oldRevoke[op], curRevoke[op])
      for (const role of addRevokeRoles) {
        result.push(cur.getPermissionSql('REVOKE', op, role))
      }
    }
    return joinSql(result)
  }
}
