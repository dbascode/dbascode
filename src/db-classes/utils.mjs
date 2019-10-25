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
  if (!args.parent) {
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
  s = replaceAll(s, "\n", "' ||\n'")
  return `'${s}'`
}

/**
 * Returns SQL query to store the state in the system state table
 * @param state
 * @returns {string}
 */
function getStateSaveSql (state) {
  return `\nINSERT INTO "pgascode"."state" ("state") VALUES (${escapeString(JSON.stringify(state, null, 2))});\n`
}

/**
 * Returns config object keys without directory context
 * @param {Object} cfg
 * @returns {Object}
 */
function cfgKeys(cfg) {
  const result = {...cfg}
  delete result.__dirName
  return Object.keys(result)
}

/**
 * Returns config without directory context
 * @param cfg
 * @returns {*[]|*}
 */
function filterConfig(cfg) {
  if (isObject(cfg)) {
    const result = {...cfg}
    delete result.__dirName
    for (const name of Object.keys(result)) {
      result[name] = filterConfig(result[name])
    }
    return result
  } else if (isArray(cfg)) {
    const result = [...cfg]
    for (let i = 0; i < result.length; i++) {
      result[i] = filterConfig(result[i])
    }
    return result
  }
  return cfg
}

export {
  prepareArgs,
  escapeComment,
  getStateSaveSql,
  cfgKeys,
  filterConfig,
}
