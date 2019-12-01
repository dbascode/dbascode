/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 16.10.2019
 * Time: 12:54
 */

import { replaceAll } from '../../../dbascode/utils'
import isObject from 'lodash-es/isObject'

/**
 * Escape text to insert to DB (not adds single quotes)
 * @param {string} s
 */
export function escapeRawText(s) {
  s = replaceAll(s, "'", "''")
  s = replaceAll(s, "\r", '')
  return s
}

/**
 * Escape string to insert to DB (adds single quotes)
 * @param {string} s
 */
export function escapeString(s) {
  s = replaceAll(s, "'", "''")
  s = replaceAll(s, "\r", '')
  return `'${s}'`
}

/**
 * Parse DbAsCode config and fill the vars object with the corresponding values
 * @param {object} vars
 * @param {DbAsCodeConfig} dbAsCodeConfig
 */
export function parsePgConfig (vars, dbAsCodeConfig) {
  const names = Object.keys(vars)
  for (const dbVar of dbAsCodeConfig.dbVars) {
    const [name, value] = dbVar.split('=')
    if (names.indexOf(name) >= 0) {
      vars[name] = value
    }
  }
}

/**
 * @typedef {object} ArgumentTypeDef
 * @property {string|undefined} schema
 * @property {string} type
 * @property {boolean} isArray
 */
/**
 * Parse type definition of a type argument or function argument
 * @param {string|ArgumentTypeDef} def
 * @returns {ArgumentTypeDef}
 */
export function parseTypedef (def) {
  let schema, type, isArray = false
  if (isObject(def)) {
    schema = def.schema
    type = def.type
    isArray = def.isArray || def.is_array
  } else {
    const _type = replaceAll(def, '"', '')
    const [id1, id2] = _type.split('.')
    if (id1 && id2) {
      schema = id1
      type = id2
    } else if (id1 && !id2) {
      type = id1
    } else {
      throw new Error('Invalid type definition')
    }
  }
  if (type.substr(-2, 2) === '[]') {
    type = type.substring(0, type.length - 2)
    isArray = true
  }
  return {
    schema,
    type,
    isArray,
  }
}
