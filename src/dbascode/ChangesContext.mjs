/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */

import isString from 'lodash-es/isString'

/**
 * @typedef ChangeItem
 * @property {string} path
 * @property {*} old
 * @property {*} cur
 * @property {boolean} allowEmptySql
 */
/**
 * Context to store changes between two DB trees.
 */
export default class ChangesContext {
  /**
   * @type {*[]}
   */
  stack = []
  /**
   * @type {ChangeItem[]}
   */
  changes = []
  /**
   * @type {string[]}
   */
  path = []
  /**
   * Whether to iterate over children
   * @type {boolean}
   */
  deep = false

  /**
   * @param {boolean} [deep]
   */
  constructor (deep = false) {
    this.deep = deep
  }

  /**
   * Check object already in stack
   * @param v
   * @return {boolean}
   */
  isInStack (v) {
    if (v === undefined) {
      return false
    }
    return this.stack.indexOf(v) >= 0
  }

  addToStack (v) {
    this.stack.push(v)
  }

  popStack () {
    this.stack.pop()
  }

  addToPath (prop) {
    this.path.push(isString(prop) ? '.' + prop : `[${prop}]`)
  }

  popPath () {
    this.path.pop()
  }

  addChange (old, cur) {
    let path = this.path.join('')
    path = path[0] === '.' ? path.substr(1) : path
    this.changes.push({path, old, cur, allowEmptySql: false})
  }

  /**
   * Add change from a plugin
   * @param {string} path
   * @param {*} old
   * @param {*} cur
   */
  addChangeWithPath (path, old, cur) {
    path[0] === '.' ? path.substr(1) : path
    this.changes.push({path, old, cur, allowEmptySql: false})
  }
}
