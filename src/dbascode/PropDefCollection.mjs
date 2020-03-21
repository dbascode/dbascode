/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */

import PropDef from './PropDef'

/**
 * Collection of object property definitions.
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

  /**
   * Returns property definition by its name
   * @param name
   * @return {PropDef}
   */
  findPropByName (name) {
    return this.defs.find(def => def.name === name)
  }

  addProp (propDef) {
    this.defs.push(propDef)
  }
}
