/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */
import { camelCaseToUnderscore } from './utils'

/**
 * Children prop with DB class object(s) definition.
 */
export default class ChildDef {
  static single = 'single'
  static map = 'map'
  static array = 'array'
  /**
   * @type {typeof AbstractDbObject}
   */
  class_ = null
  /**
   * @type {string}
   */
  propType = ''
  /**
   * Property name where this class objects should be stored at parent
   * @type {string}
   */
  propName = ''
  /**
   * Config property name where this class objects configuration is stored in state
   * @type {string}
   */
  configPropName = ''

  /**
   * Constructor
   * @param {typeof AbstractDbObject} class_
   * @param {string} propType - property type (single, map, or array)
   */
  constructor (class_, propType = ChildDef.map) {
    this.class_ = class_
    this.propType = propType
    this.propName = this.getPropertyName()
    this.configPropName = this.getConfigName()
  }

  /**
   * Returns property name where this class objects should be stored
   * @return {string}
   */
  getPropertyName () {
    let prop = this.class_.name
    prop = prop[0].toLowerCase() + prop.substr(1)
    if (this.propType !== ChildDef.single) {
      const lastChar = prop[prop.length - 1]
      prop += (['s', 'x'].indexOf(lastChar) >= 0) ? 'es' : 's'
    }
    return prop
  }

  /**
   * Returns config property name where this class objects configuration is stored in state
   * @return {string}
   */
  getConfigName () {
    let prop = this.class_.configName
    if (!prop) {
      prop = camelCaseToUnderscore(this.class_.name)
    }
    if (this.propType !== ChildDef.single) {
      const lastChar = prop[prop.length - 1]
      prop += (['s', 'x'].indexOf(lastChar) >= 0) ? 'es' : 's'
    }
    return prop
  }
}
