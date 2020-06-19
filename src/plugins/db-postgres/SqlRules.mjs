/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */

import AbstractSqlRules from '../../dbascode/AbstractSqlRules'
import { replaceAll } from '../../dbascode/utils'
import isFunction from 'lodash-es/isFunction'
import { builtinIntegerTypes, builtinNumericTypes, builtinOtherTypes, builtinTextTypes, isType } from './utils'

/**
 * Basic routines with SQL identifiers and strings escaping and validation for PostgreSQL.
 */
export default class SqlRules extends AbstractSqlRules {
  /**
   * Escape identifier to use in SQL queries as a DB object name.
   * @param {string} id
   * @return {string}
   */
  static escapeSqlId (id) {
    return `"${id}"`
  }

  /**
   * Check validity of the identifier to use it in SQL queries as a DB object.
   * @param {string} id
   * @param {string[]} [invalidChars]
   * @return {boolean}
   */
  static validateSqlId (id, invalidChars = []) {
    const _invalidChars = ['"', "'", c => c.charCodeAt(0) < 33]
    for (const char of _invalidChars) {
      let invalidChar = null
      if (isFunction(char)) {
        for (let i = 0; i < id.length; i++) {
          if (char(id[i])) {
            invalidChar = id[i]
            break
          }
        }
      } else {
        if (id.indexOf(char) >= 0) {
          invalidChar = char
        }
      }
      if (invalidChar !== null) {
        invalidChars.push(invalidChar)
      }
    }
    return Object.keys(invalidChars).length === 0
  }

  /**
   * Escape a string to use in SQL queries (not adding quotes).
   * @param {string} s
   * @return {string}
   */
  static escapeString (s) {
    s = replaceAll(s, "'", "''")
    s = replaceAll(s, "\r", '')
    return s
  }

  /**
   * Escape a string to use in SQL queries (adding quotes).
   * @param {string} s
   * @return {string}
   */
  static escapeStringExpr (s) {
    return `'${this.escapeString(s)}'`
  }

  /**
   * Is string an SQL type.
   * @param {string|ArgumentTypeDef} type
   * @param {string[]} typeList
   * @return {boolean}
   */
  static isType (type, typeList) {
    return isType(typeList, type)
  }

  /**
   * Is string a builtin SQL type.
   * @param {string} type
   * @return {boolean}
   */
  static isBuiltinType (type) {
    return this.isType(type, [...builtinNumericTypes, ...builtinTextTypes, ...builtinOtherTypes])
  }
}
