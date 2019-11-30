/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 16.10.2019
 * Time: 12:54
 */

import { replaceAll } from '../../../dbascode/utils'

/**
 * Escape string to insert to DB
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
  for (const dbVar of dbAsCodeConfig.dbVars) {
    const [name, value] = dbVar.split('=')
    if (vars[name]) {
      vars[name] = value
    }
  }
}
