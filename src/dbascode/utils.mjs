/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 06.10.2019
 * Time: 14:03
 */
import _fs from 'fs'
import os from 'os'
import path from 'path'
import yaml from 'js-yaml'
import isObject from 'lodash-es/isObject'
import difference from 'lodash-es/difference'
import intersection from 'lodash-es/intersection'
import isArray from 'lodash-es/isArray'

const fs = _fs.promises

export function replaceAll(string, search, replacement) {
  return string.split(search).join(replacement)
}

export async function loadYaml(file) {
  return yaml.safeLoad(await fs.readFile(file, 'utf8'))
}

// "lookup" algorithm http://tools.ietf.org/html/rfc4647#section-3.4
// assumes normalized language tags, and matches in a case sensitive manner
// source: https://github.com/format-message/format-message/blob/master/packages/lookup-closest-locale/index.js
export function lookupClosestLocale (locale/*: string | string[] | void */, available/*: { [string]: any } */)/*: ?string */ {
  if (typeof locale === 'string' && available[locale]) return locale
  const locales = [].concat(locale || [])
  let l = 0, ll = locales.length
  for (; l < ll; ++l) {
    const current = locales[l].split('-')
    while (current.length) {
      const candidate = current.join('-')
      if (available[candidate]) return candidate
      current.pop()
    }
  }
}

export function dispose(obj) {
  if (isObject(obj)) {
    for (const key of Object.keys(obj)) {
      obj[key] = null
      dispose(obj[key])
    }
  } else if (isArray(obj)) {
    obj.forEach((item, idx) => {
      obj[idx] = null
      dispose(item)
    })
  }
}

/**
 * Is array2 entirely present in array1
 * @param {Array} ary1
 * @param {Array} ary2
 * @returns {boolean}
 */
export function arrayContainsEntirely(ary1, ary2) {
  return ary1.filter(dt => ary2.indexOf(dt) >= 0).length === ary2.length
}

/**
 * Returns object with keys from object1 that do not exists in object2
 * @param {Object} o1
 * @param {Object} o2
 * @return {Object}
 */
export function objectDifference(o1, o2) {
  const result = {}
  for (const key of difference(Object.keys(o1), Object.keys(o2 || {}))) {
    result[key] = o1[key]
  }
  return result
}

/**
 * Returns object with keys from object1 that do not exists in object2
 * @param {Object} o1
 * @param {Object} o2
 * @return {Array}
 */
export function objectDifferenceKeys(o1, o2) {
  const result = []
  for (const key of difference(Object.keys(o1 || {}), Object.keys(o2 || {}))) {
    result.push(key)
  }
  return result
}

/**
 * Returns object with keys exists in both objects
 * @param {Object} o1
 * @param {Object} o2
 * @return {Object}
 */
export function objectIntersection (o1, o2) {
  const result = {}
  for (const key of intersection(Object.keys(o1 || {}), Object.keys(o2 || {}))) {
    result[key] = o1[key]
  }
  return result
}

/**
 * Returns object with keys exists in both objects
 * @param {Object} o1
 * @param {Object} o2
 * @return {Array}
 */
export function objectIntersectionKeys (o1, o2) {
  const result = []
  for (const key of intersection(Object.keys(o1 || {}), Object.keys(o2 || {}))) {
    result.push(key)
  }
  return result
}

export function circularSafeStringify (o, forPrint) {
  const cache = []
  return JSON.stringify(o, function (key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
        // Duplicate reference found, discard key
        return forPrint ? '<circular reference>' : undefined
      }
      // Store value in our collection
      cache.push(value)
    }
    return value
  }, forPrint ? 2 : undefined)
}

export function convertPathToWsl (path) {
  const p = path.split('\\')
  if (p[0][1] === ':') {
    p[0] = p[0].substr(0, 1).toLowerCase()
    p.unshift('mnt')
    p.unshift('')
  }
  return p.join('/')
}

export function escapeShellArg (arg) {
  // arg = `'${arg.replace(/'/g, `'\\''`)}'`;
  arg = replaceAll(arg, '"', '\"')
  return `"${arg}"`
}

/**
 * Converts camelCase notation to the underscore-separated
 * @param {string} s
 * @return {string}
 */
export function camelCaseToUnderscore (s) {
  return s.replace(/([A-Z]+)/g, function (x,y){return "_" + y.toLowerCase()}).replace(/^_/, "")
}

/**
 * Returns object property value by property path
 * @param {object} obj
 * @param {string} prop
 */
export function getPropValue (obj, prop) {
  let result
  let o = obj
  for (const p of prop.split('.')) {
    result = o[p]
    o = result
  }
  return result
}

/**
 * Parses property name into name itself and array index if any
 * @param name
 */
export function parseArrayProp (name) {
  const matches = name.match(/([\w-]+)(\[(\d+)\]|)/)
  if (matches && matches[3] !== undefined) {
    const [,propName,, index] = matches
    return {
      name: propName,
      index: Number(index),
    }
  } else {
    return {
      name,
      index: null,
    }
  }
}

/**
 * Joins array of SQL queries filtering empty ones
 * @param {string[]} sql
 */
export function joinSql(sql) {
  return sql.filter(Boolean).join("\n")
}

/**
 * Removes duplicates from an array. Returns new copy of the source array.
 * @param {array} ary
 * @returns {array}
 */
export function arrayUnique(ary) {
  return ary.filter((item, index) => ary.indexOf(item) === index)
}

/**
 *
 * @param sql
 * @returns {*}
 */
export async function saveTempSqlFile(sql) {
  const tmpDumpFile = path.join(os.tmpdir(), `dbascode${process.pid}.sql`)
  await fs.writeFile(
    tmpDumpFile,
    sql,
  )
  return tmpDumpFile
}
