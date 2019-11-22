/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 21.11.2019
 * Time: 16:54
 */

import PropDef from './PropDef'

/**
 * Collection of object property definitions
 */
export default class PropDefCollection {
  /**
   * @type {PropDef[]}
   */
  defs

  /**
   * Constructor
   * @param {PropDef[]} defs
   */
  constructor (defs = []) {
    this.defs = defs
  }

  /**
   * Returns default property
   * @return {PropDef}
   */
  getDefaultProp () {
    for (const def of this.defs) {
      if (def.isDefault) {
        return def
      }
    }
  }

  /**
   * Initialize object props after creation
   * @param object
   */
  initProps (object) {
    for (const def of this.defs) {
      object[def.name] = def.defaultValue
    }
  }
}
