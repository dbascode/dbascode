/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */

import isString from 'lodash-es/isString'
import supportsColor from 'supports-color'
import isObject from 'lodash-es/isObject'
import isArray from 'lodash-es/isArray'
import { circularSafeStringify } from './utils'

/**
 * @typedef ChangeItem
 * @property {string} path
 * @property {*} old
 * @property {*} cur
 // * @property {*} oldDbObj
 // * @property {*} curDbObj
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
    this.changes.push({path, old, cur})
  }

  /**
   * Add change from a plugin
   * @param {string} path
   * @param {*} old
   * @param {*} cur
   */
  addChangeWithPath (path, old, cur) {
    path[0] === '.' ? path.substr(1) : path
    this.changes.push({path, old, cur})
  }

  /**
   * Print changes to console
   * @param {boolean} colored
   * @return {string}
   */
  prettyPrint (colored) {
    const useColors = colored && supportsColor.stdout
    const delColor = color.FgRed
    const addColor = color.FgGreen
    const editColor = color.FgYellow
    const coloredText = (text, clr) => {
      return `${useColors ? clr : ''}${text}${useColors ? color.Reset : ''}`
    }
    const printVal = v => (isObject(v) || isArray(v) ? "\n" : '') + circularSafeStringify(v, true)

    const result = []
    for (const {path, old, cur} of this.changes) {
      if (old && cur) {
        result.push(
          `${coloredText(`~ ${path}`, editColor)}: ${coloredText(printVal(old), editColor)} => ${coloredText(printVal(cur), editColor)}\n`
        )
      } else if (!old && cur) {
        result.push(
          `${coloredText(`+ ${path}`, addColor)}: ${printVal(cur)}\n`
        )
      } else if (old && !cur) {
        result.push(
          `${coloredText(`- ${path}`, delColor)}\n`
        )
      }
    }
    return result.join('')
  }
}

const color = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  Underscore: "\x1b[4m",
  Blink: "\x1b[5m",
  Reverse: "\x1b[7m",
  Hidden: "\x1b[8m",

  FgBlack: "\x1b[30m",
  FgRed: "\x1b[31m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgBlue: "\x1b[34m",
  FgMagenta: "\x1b[35m",
  FgCyan: "\x1b[36m",
  FgWhite: "\x1b[37m",

  BgBlack: "\x1b[40m",
  BgRed: "\x1b[41m",
  BgGreen: "\x1b[42m",
  BgYellow: "\x1b[43m",
  BgBlue: "\x1b[44m",
  BgMagenta: "\x1b[45m",
  BgCyan: "\x1b[46m",
  BgWhite: "\x1b[47m",
}
