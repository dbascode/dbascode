/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 16.10.2019
 * Time: 12:54
 */

import isString from 'lodash-es/isString'
import isObject from 'lodash-es/isObject'
import isArray from 'lodash-es/isArray'

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


export {
  prepareArgs,
  escapeComment,
}
