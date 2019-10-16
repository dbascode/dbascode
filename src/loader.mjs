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

/**
 * Load the whole DB config with postprocessing
 * @param {string} configFile
 * @returns {*}
 */
function loadConfig(configFile) {
  const cfg = yaml.safeLoad(fs.readFileSync(configFile, 'utf8'))
  return recursePostProcess(cfg, path.dirname(configFile))
}

/**
 * Postprocessing
 * @param {*} cfg
 * @param {string} dir - Current dir of the file from which this config was loaded
 * @returns {*}
 */
function recursePostProcess(cfg, dir) {
  if (isObject(cfg)) {
    for (const k of Object.keys(cfg)) {
      cfg[k] = recursePostProcess(cfg[k], dir)
    }
  } else if (isArray(cfg)) {
    for (const k of cfg) {
      cfg[k] = recursePostProcess(cfg[k], dir)
    }
  } else if (isString(cfg)) {
    if (cfg.substr(0, 9) === '$include ') {
      return loadConfig(path.join(dir, cfg.substr(9)))
    } else if (cfg.substr(0, 6) === '$file ') {
      return fs.readFileSync(path.join(dir, cfg.substr(6))).toString()
    }
  }
  return cfg
}

export { loadConfig }
