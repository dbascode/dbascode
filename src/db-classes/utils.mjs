/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 16.10.2019
 * Time: 12:54
 */

import isString from 'lodash-es/isString'

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
    const value = args[prop]
    if (isString(value)) {
      args[prop] = obj.processCalculations(value)
    }
  }
  return args
}

function escapeComment (text) {
  return text ? text.split("'").join("''") : ''
}


export {
  prepareArgs,
  escapeComment,
}
