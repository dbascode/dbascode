/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 16.10.2019
 * Time: 12:54
 */

import isString from 'lodash-es/isString'
import isObject from 'lodash-es/isObject'
import isArray from 'lodash-es/isArray'
import { replaceAll } from '../utils'

/**
 * Process calculations in string config values
 * @param {AbstractDbObject} obj
 * @param {Object.<string, *>} args
 * @returns {*}
 */
function prepareArgs (obj, args) {
  if (!obj) {
    return args
  }
  for (const prop of Object.keys(args)) {
    if (prop === 'name') {
      continue
    }
    args[prop] = recurseProcessCalculations(obj, args[prop])
  }
  return args
}

function recurseProcessCalculations (obj, value) {
  if (isString(value)) {
    return obj.processCalculations(value)
  } else if (isObject(value) && value.constructor.name === 'Object') {
    for (const prop of Object.keys(value)) {
      value[prop] = recurseProcessCalculations(obj, value[prop])
    }
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      value[i] = recurseProcessCalculations(obj, value[i])
    }
  } else {
    return value
  }
  return value
}

function escapeComment (text) {
  return text ? text.split("'").join("''") : ''
}

/**
 * Escape string to insert to DB
 * @param {string} s
 */
function escapeString(s) {
  s = replaceAll(s, "'", "''")
  s = replaceAll(s, "\r", '')
  // s = replaceAll(s, "\n", "' ||\n'")
  return `'${s}'`
}

/**
 * Returns SQL query to store the state in the system state table
 * @param {number} id
 * @param {Object} state
 * @returns {string}
 */
function getStateSaveSql (id, state) {
  return `\nINSERT INTO "pgascode"."state" ("id", "state") VALUES (${id}, ${escapeString(JSON.stringify(state, null, 2))});\n`
}

/**
 * Returns SQL to get the last state of the DB
 * @returns {string}
 */
function getLoadLastStateSql () {
  return `SELECT * FROM "pgascode"."state" ORDER BY id DESC LIMIT 1`
}

export {
  prepareArgs,
  escapeComment,
  escapeString,
  getStateSaveSql,
  getLoadLastStateSql,
}
