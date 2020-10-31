/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */

import { replaceAll } from '../../dbascode/utils'
import isObject from 'lodash-es/isObject'
import SqlRules from './SqlRules'

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
 * @property {int|null} size
 * @property {boolean} isArray
 */
/**
 * Parse type definition of a type argument or function argument
 * @param {string|ArgumentTypeDef} def
 * @returns {ArgumentTypeDef}
 */
export function parseTypedef (def) {
  let schema, type, isArray = false, size = null
  if (isObject(def)) {
    schema = def.schema
    type = def.type
    isArray = def.isArray || def.is_array
  } else {
    const _type = replaceAll(def, '"', '')
    const [m1, m2] = _type.matchAll(/(\${[^}]+}|[^.]+)/g)
    const id1 = m1 ? m1[0] : undefined
    const id2 = m2 ? m2[0] : undefined
    if (id1 && id2) {
      schema = id1
      type = id2
    } else if (id1 && !id2) {
      type = id1
    } else {
      throw new Error('Invalid type definition')
    }
  }
  let p = type.indexOf('[')
  if (p < 0) {
    p = type.indexOf(' array')
  }
  if (p >= 0) {
    type = type.substr(0, p)
    isArray = true
  }
  p = type.indexOf('(')
  if (p >= 0) {
    const p2 = type.indexOf(')')
    size = parseInt(type.substr(p + 1, p2 - p))
    type = type.substr(0, p) + ' ' + type.substr(p2 + 1, type.length)
    type = replaceAll(type, '  ', ' ')
    type = type.toLowerCase()
  }
  type = type.trimEnd()

  return {
    schema,
    type,
    size,
    isArray,
  }
}

/**
 * Convert type definition to string
 * @param {ArgumentTypeDef} def
 */
export function stringifyTypeDef (def) {
  const sql = SqlRules
  return `${def.schema ? sql.escapeSqlId(def.schema) + '.' : ''}${def.type}${def.size ? `(${def.size})` : ''}${def.isArray ? '[]' : ''}`
}

/**
 * Builtin numeric types
 * @type {string[]}
 */
export const builtinNumericTypes = [
  'int',
  'smallint',
  'integer',
  'bigint',
  'decimal',
  'numeric',
  'real',
  'double',
  'smallserial',
  'serial',
  'bigserial',
]

/**
 * Builtin integer types
 * @type {string[]}
 */
export const builtinIntegerTypes = [
  'int',
  'smallint',
  'integer',
  'bigint',
  'smallserial',
  'serial',
  'bigserial',
]

/**
 * Builtin text types
 * @type {string[]}
 */
export const builtinTextTypes = [
  'text',
  'varchar',
  'character varying',
  'character',
  'char',
]

/**
 * Builtin other types (not numeric and not textual)
 * @type {string[]}
 */
export const builtinOtherTypes = [
  'money',
  'bytea',
  'timestamp',
  'timestamp with time zone',
  'timestamp without time zone',
  'date',
  'date with time zone',
  'date without time zone',
  'boolean',
  'point',
  'line',
  'lseg',
  'box',
  'path',
  'polygon',
  'circle',
  'cidr',
  'inet',
  'macaddr',
  'macaddr8',
  'bit',
  'bit varying',
  'uuid',
  'xml',
  'json',
  'jsonb',
  'jsonb',
]

/**
 *
 * @param {string[]} typeList List of types to compare. Usually - builtin ones.
 * @param {string|ArgumentTypeDef} type
 * @return {boolean}
 */
export function isType(typeList, type) {
  const t = parseTypedef(type)
  return !t.schema && typeList.indexOf(t.type) >= 0
}
