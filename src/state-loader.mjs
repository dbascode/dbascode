/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 13.10.2019
 * Time: 11:00
 */
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import isObject from 'lodash-es/isObject'
import isArray from 'lodash-es/isArray'
import isString from 'lodash-es/isString'
import { objectIntersectionKeys } from './dbascode/utils'

/**
 * Load the whole DB config with postprocessing. Config files are merged and loaded as the single config.
 * @param {string[]} configFiles
 * @returns {*}
 */
export function loadConfig(configFiles) {
  const cfg = doLoadConfig(configFiles)
  return filterConfig(cfg)
}

/**
 * Load the whole DB config with postprocessing. Config files are merged and loaded as the single config.
 * @param {string[]} configFiles
 * @returns {*}
 */
function doLoadConfig(configFiles) {
  let cfg = {}
  for (const configFile of configFiles) {
    const fileCfg =
      recurseApplyFsContext(
        yaml.safeLoad(fs.readFileSync(configFile, 'utf8')),
        path.dirname(configFile)
      )
    cfg = mergeConfigs(cfg, fileCfg)
  }
  return recursePostProcess(cfg)
}

function mergeConfigs (c1, c2) {
  const result = {...c1, ...c2}
  for (const name of objectIntersectionKeys(c1, c2)) {
    const v1 = c1[name], v2 = c2[name]
    if (isObject(v1) && isObject(v2)) {
      result[name] = mergeConfigs(v1, v2)
    } else if (isArray(v1) && isArray(v2)) {
      result[name] = [...v1, ...v2]
    }
  }
  return result
}

function recurseApplyFsContext(cfg, dirName) {
  if (isObject(cfg)) {
    cfg.__dirName = dirName
    for (const name of Object.keys(cfg)) {
      cfg[name] = recurseApplyFsContext(cfg[name], dirName)
    }
  } else if (isArray(cfg)) {
    for (let i = 0; i < cfg.length; i++) {
      cfg[i] = recurseApplyFsContext(cfg[i], dirName)
    }
  }
  return cfg
}

/**
 * Postprocessing
 * @param {*} cfg
 * @param {string} [dir] - Last directory context
 * @returns {*}
 */
function recursePostProcess(cfg, dir) {
  if (isObject(cfg)) {
    for (const k of Object.keys(cfg)) {
      cfg[k] = recursePostProcess(cfg[k], cfg.__dirName)
    }
  } else if (isArray(cfg)) {
    for (const k of cfg) {
      cfg[k] = recursePostProcess(cfg[k], dir)
    }
  } else if (isString(cfg)) {
    if (cfg.substr(0, 9) === '$include ') {
      return loadConfig([path.join(dir, cfg.substr(9))])
    } else if (cfg.substr(0, 6) === '$file ') {
      return fs.readFileSync(path.join(dir, cfg.substr(6))).toString()
    }
  }
  return cfg
}

/**
 * Returns config without directory context
 * @param cfg
 * @returns {*}
 */
function filterConfig(cfg) {
  if (isArray(cfg)) {
    const result = [...cfg]
    for (let i = 0; i < result.length; i++) {
      result[i] = filterConfig(result[i])
    }
    return result
  } else if (isObject(cfg)) {
    const result = {...cfg}
    delete result.__dirName
    for (const name of Object.keys(result)) {
      result[name] = filterConfig(result[name])
    }
    return result
  }
  return cfg
}
