/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import isObject from 'lodash-es/isObject'
import isArray from 'lodash-es/isArray'
import isString from 'lodash-es/isString'
import { objectIntersectionKeys } from './utils'

/**
 * Load the whole DB state with postprocessing. State config files are merged and loaded as the
 * single config.
 * @param {string[]} configFiles
 * @returns {*}
 */
export function loadStateYaml(configFiles) {
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
  for (const configFile of configFiles.filter(Boolean)) {
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
 * @param {string} [keyName] name of the key of this value
 * @returns {*}
 */
function recursePostProcess(cfg, dir, keyName) {
  if (isObject(cfg)) {
    for (const k of Object.keys(cfg)) {
      cfg[k] = recursePostProcess(cfg[k], cfg.__dirName, k)
    }
  } else if (isArray(cfg)) {
    for (const k of cfg) {
      cfg[k] = recursePostProcess(cfg[k], dir, k)
    }
  } else if (isString(cfg)) {
    if (cfg.substr(0, 9) === '$include ') {
      return loadStateYaml([path.join(dir, cfg.substr(9))])
    } else if (cfg === '$include-it') {
      let fn = path.join(dir, `${keyName}.yml`);
      if (!fs.existsSync(fn)) {
        fn = fn.join(dir, `${keyName}.yaml`);
      }
      return loadStateYaml([fn])
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
      if (name[0] === '.') {
        delete result[name]
      } else {
        result[name] = filterConfig(result[name])
      }
    }
    return result
  }
  return cfg
}
