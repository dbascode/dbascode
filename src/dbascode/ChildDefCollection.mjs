/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */

import ChildDef from './ChildDef'

/**
 * Collection of children definitions.
 */
export default class ChildDefCollection {
  /**
   * @type {ChildDef[]}
   */
  defs = []

  /**
   * Constructor
   * @param {ChildDef[]} defs
   */
  constructor (defs) {
    this.defs = defs
  }

  /**
   * Initialize object props after creation
   * @param object
   */
  initProps (object) {
    for (const def of this.defs) {
      switch (def.propType) {
        case ChildDef.single: object[def.propName] = undefined; break
        case ChildDef.array: object[def.propName] = []; break
        case ChildDef.map: object[def.propName] = {}; break
        default: throw new Error(`Unknown property type ${def.propType}`)
      }
    }
  }

  /**
   * Initialize config props
   * @param object
   */
  initConfig (object) {
    for (const def of this.defs) {
      switch (def.propType) {
        case ChildDef.single: object[def.configPropName] = undefined; break
        case ChildDef.array: object[def.configPropName] = []; break
        case ChildDef.map: object[def.configPropName] = {}; break
      }
    }
  }

  /**
   * Returns ChildDef by class reference
   * @param {typeof AbstractDbObject} class_
   * @return {ChildDef}
   */
  getDefByClass (class_) {
    for (const def of this.defs) {
      if (def.class_ === class_) {
        return def
      }
    }
    throw new Error(`Definition for class ${class_.name} not found`)
  }

  /**
   * Returns ChildDef by child object
   * @param {AbstractDbObject} object
   * @return {ChildDef}
   */
  getDefByObject (object) {
    for (const def of this.defs) {
      if (def.class_ === object.constructor) {
        return def
      }
    }
    throw new Error(`Definition for class ${object.constructor.name} not found`)
  }

  /**
   * Search for ChildDef by DB object property name
   * @param propName
   * @return {ChildDef|null}
   */
  findDefByPropName (propName) {
    for (const def of this.defs) {
      if (def.propName === propName) {
        return def
      }
    }
    return null
  }

  /**
   *
   * @param {AbstractDbObject} object
   * @param {AbstractDbObject} child
   * @return {boolean}
   */
  isChildUnique (object, child) {
    const childDef = object.getChildrenDefCollection().getDefByObject(child)
    if (childDef.uniqueGroup === null) {
      return true
    }
    const map = {}
    const objectDefs = object.getChildrenDefCollection().defs.filter(def => def.uniqueGroup !== null)
    for (const def of objectDefs) {
      if (map[def.uniqueGroup] === undefined) {
        map[def.uniqueGroup] = {}
      }
      for (const ch of object.getChildrenByDef(def)) {
        map[def.uniqueGroup][ch.name] = 1
      }
    }
    return map[childDef.uniqueGroup][child.name] === undefined
  }

  /**
   * Find child
   * @param {AbstractDbObject} object
   * @param {string} groupName
   * @param {string} childName
   * @return {AbstractDbObject|null}
   */
  findChildInUniqueGroup (object, groupName, childName) {
    for (const def of this.defs.filter(d => d.uniqueGroup === groupName)) {
      const child = object.findChildByDefAndName(def, childName)
      if (child) {
        return child
      }
    }
    return null
  }
}
