/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 01.12.2019
 * Time: 16:49
 */

/**
 * @typedef {object} ValidateError
 * @property {string} path
 * @property {string} message
 */
/**
 * Tree validation context.
 */
export default class ValidationContext {
  /**
   * @type {ValidateError[]}
   */
  errors = []
  /**
   * {AbstractDbObject|undefined}
   */
  prevTree
  /**
   * {AbstractDbObject|undefined}
   */
  curTree

  /**
   * Constructor
   * @param {AbstractDbObject|undefined} prevTree
   * @param {AbstractDbObject|undefined} curTree
   */
  constructor (prevTree, curTree) {
    this.prevTree = prevTree
    this.curTree = curTree
  }

  /**
   * Does this context contains errors.
   * @returns {boolean}
   */
  hasErrors () {
    return this.errors.length > 0
  }

  /**
   * Add error to the list of errors automatically filling the object path.
   * @param {AbstractDbObject} obj
   * @param {string} message
   */
  addError (obj, message) {
    this.errors.push({
      path: obj.getPath(),
      message,
    })
  }

  /**
   * Returns string with all errors in the context for human-readable printing.
   * @returns {string}
   */
  printErrors () {
    return this.errors.map(
      item => `${item.path}:\n    ${item.message}`
    ).join("\n")
  }
}
