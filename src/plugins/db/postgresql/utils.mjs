/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 16.10.2019
 * Time: 12:54
 */

import { replaceAll } from '../../../dbascode/utils'

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
