/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 19.10.2019
 * Time: 12:03
 */

import isString from 'lodash-es/isString'
import { circularSafeStringify } from '../utils'
import supportsColor from 'supports-color'
import isObject from 'lodash-es/isObject'
import isArray from 'lodash-es/isArray'

/**
 * Context to store changes between two DB trees
 */
class ChangesContext {
  stack = []
  changes = []
  path = []
  deep = false

  constructor (deep = false) {
    this.deep = deep
  }

  isInStack (v) {
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
    const path = this.path.join('')
    this.changes.push([path[0] === '.' ? path.substr(1) : path, old, cur])
  }

  hasChanges () {
    return this.changes.length > 0
  }

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
    for (const [path, old, cur] of this.changes) {
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

export default ChangesContext
