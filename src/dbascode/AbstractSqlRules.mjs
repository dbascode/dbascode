/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */

/**
 * Abstract class for basic routines with SQL identifiers and strings escaping and validation.
 */
export default class AbstractSqlRules {
  /**
   * @type {AbstractDbObject}
   */
  instance

  /**
   * @param {AbstractDbObject} instance
   */
  constructor (instance) {
    this.instance = instance
  }

  /**
   * Returns unescaped name of the object in DB for use in SQL
   * @return {string}
   */
  getName () {
    return this.instance.name
  }

  /**
   * Returns escaped name of the object in DB for use in SQL
   * @returns {string}
   */
  getEscapedName () {
    return this.escapeSqlId(this.getName())
  }

  /**
   * Returns fully qualified name of this in DB
   * @returns {string}
   */
  getFullyQualifiedName () {
    let item = this.instance
    const result = []
    while (item) {
      result.unshift(item.sql.getName())
      item = item.getParent()
    }
    return result.join('.')
  }

  /**
   * Returns escaped fully qualified name of this in DB
   * @returns {string}
   */
  getFullyQualifiedEscapedName () {
    let item = this.instance
    const result = []
    while (item) {
      result.unshift(item.sql.getEscapedName())
      item = item.getParent()
    }
    return result.join('.')
  }

  /**
   * Escape identifier to use in SQL queries as a DB object name.
   * @param {string} id
   * @return {string}
   */
  escapeSqlId (id) {
    return this.constructor.escapeSqlId(id)
  }

  /**
   * Escape identifier to use in SQL queries as a DB object name.
   * @param {string} id
   * @return {string}
   */
  static escapeSqlId (id) {
    return id
  }

  /**
   * Check validity of the identifier to use it in SQL queries as a DB object.
   * @param {string} id
   * @param {string[]} [invalidChars]
   * @return {boolean}
   */
  static validateSqlId (id, invalidChars = []) {
    return true
  }

  /**
   * Check validity of the identifier to use it in SQL queries as a DB object.
   * @param {string} id
   * @param {string[]} [invalidChars]
   * @return {boolean}
   */
  validateSqlId (id, invalidChars = []) {
    return this.constructor.validateSqlId(id, invalidChars)
  }

  /**
   * Check validity of the identifier to use it in SQL queries as a DB object. Throws exception if invalid.
   * @param {string} id
   * @return {boolean}
   */
  validateSqlIdAndThrow (id) {
    const invalidChars = []
    if (!this.validateSqlId(id, invalidChars)) {
      throw new Error(`Invalid characters (${invalidChars.join(', ')}) found in the identifier ${id}`)
    }
  }

  /**
   * Escape a string to use in SQL queries (not adding quotes).
   * @param {string} s
   * @return {string}
   */
  static escapeString (s) {
    return s
  }

  /**
   * Escape a string to use in SQL queries (not adding quotes).
   * @param {string} s
   * @return {string}
   */
  escapeString (s) {
    return this.constructor.escapeString(s)
  }

  /**
   * Escape a string to use in SQL queries (adding quotes).
   * @param {string} s
   * @return {string}
   */
  static escapeStringExpr (s) {
    return s
  }

  /**
   * Escape a string to use in SQL queries (adding quotes).
   * @param {string} s
   * @return {string}
   */
  escapeStringExpr (s) {
    return this.constructor.escapeStringExpr(s)
  }
}
