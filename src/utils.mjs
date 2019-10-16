/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 06.10.2019
 * Time: 14:03
 */
import fs from 'fs'
import yaml from 'js-yaml'
import glob from 'glob'
import isEqual from 'lodash-es/isEqual'
import { isObject } from 'lodash-es'
import isEmpty from 'lodash-es/isEmpty'
import isArray from 'lodash-es/isArray'
import difference from 'lodash-es/difference'
import intersection from 'lodash-es/intersection'

function checkFiles(cfg) {
  for (const configName of Object.keys(cfg)) {
    if (!fs.existsSync(cfg[configName])) {
      throw new Error(`Config file ${configName} not exists`)
    }
  }
}

function replaceAll(string, search, replacement) {
  return string.split(search).join(replacement)
}

function loadYaml(file) {
  return yaml.safeLoad(fs.readFileSync(file, 'utf8'))
}

function loadYamlSubst(file, subst) {
  let content = fs.readFileSync(file, 'utf8')
  for (const pattern of Object.keys(subst)) {
    content = replaceAll(content, pattern, subst[pattern])
  }
  return yaml.safeLoad(content)
}

function loadSqlSubst(file, subst) {
  let content = fs.readFileSync(file, 'utf8')
  for (const pattern of Object.keys(subst)) {
    content = replaceAll(content, pattern, subst[pattern])
  }
  return content
}

function indent(lines, size) {
  return lines.map(line => String('  ').repeat(size) + line)
}

// "lookup" algorithm http://tools.ietf.org/html/rfc4647#section-3.4
// assumes normalized language tags, and matches in a case sensitive manner
// source: https://github.com/format-message/format-message/blob/master/packages/lookup-closest-locale/index.js
function lookupClosestLocale (locale/*: string | string[] | void */, available/*: { [string]: any } */)/*: ?string */ {
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

function getFileList(pattern) {
  return glob.sync(pattern)
}

function getConfigDiff(oldItem, newItem) {
  const add = {}, del = {}, edit = {}
  const oldKeys = Object.keys(oldItem)
  const newKeys = Object.keys(newItem)
  const addKeys = newKeys.filter(key => oldKeys.indexOf(key) < 0)
  const delKeys = oldKeys.filter(key => newKeys.indexOf(key) < 0)
  const editKeys = oldKeys.filter(key => newKeys.indexOf(key) !== 0)
  addKeys.forEach(key => add[key] = newItem[key])
  delKeys.forEach(key => del[key] = 1)
  for (const key of editKeys) {
    const oldVal = oldItem[key]
    const newVal = newItem[key]
    if (isObject(oldVal) && isObject(newVal)) {
      edit[key] = getConfigDiff(oldVal, newVal)
    } else if (!isEqual(oldVal, newVal)) {
      edit[key] = newVal
    }
  }
  const result = {}
  if (!isEmpty(add)) {
    result.add = add
  }
  if (!isEmpty(del)) {
    result.del = del
  }
  if (!isEmpty(edit)) {
    result.edit = edit
  }
  return result
}

function dispose(obj) {
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
function arrayContainsEntirely(ary1, ary2) {
  return ary1.filter(dt => ary2.indexOf(dt) >= 0).length === ary2.length
}

/**
 * Returns object with keys from object1 that do not exists in object2
 * @param {Object} o1
 * @param {Object} o2
 * @return {Object}
 */
function objectDifference(o1, o2) {
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
function objectDifferenceKeys(o1, o2) {
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
function objectIntersection (o1, o2) {
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
function objectIntersectionKeys (o1, o2) {
  const result = []
  for (const key of intersection(Object.keys(o1 || {}), Object.keys(o2 || {}))) {
    result.push(key)
  }
  return result
}


export {
  checkFiles,
  replaceAll,
  loadYaml,
  loadYamlSubst,
  loadSqlSubst,
  indent,
  lookupClosestLocale,
  getFileList,
  getConfigDiff,
  dispose,
  arrayContainsEntirely,
  objectDifference,
  objectDifferenceKeys,
  objectIntersection,
  objectIntersectionKeys,
}
