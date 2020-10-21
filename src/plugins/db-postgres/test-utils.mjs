const path = require('path');

/**
 * Returns module test data file path
 * @param {string} modulePath
 * @param {string|int} pathIdx
 * @returns {string} string
 */
export function getModuleDataPath(modulePath, pathIdx = '') {
  const fn = modulePath
  const slashPos = fn.lastIndexOf(path.sep)
  const extPos = fn.lastIndexOf('.')
  return `${fn.substr(0, slashPos)}/data/${fn.substr(slashPos + 1, extPos - slashPos)}data${pathIdx}.yml`
}
