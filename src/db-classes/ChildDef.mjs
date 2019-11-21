/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 19.11.2019
 * Time: 9:23
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
      prop = this.class_.name
      const matches = [...prop.matchAll(/[A-Z]/g)]
      if (matches.length > 0) {
        const letters = []
        const parts = []
        for (const match of matches) {
          letters.push(match.index)
        }
        for (let i = 0; i < letters.length; i++) {
          const pos = letters[i]
          const nextPos = letters[i + 1]
          if (nextPos) {
            parts.push(prop.substr(pos, nextPos - pos).toLowerCase())
          } else {
            parts.push(prop.substr(pos).toLowerCase())
          }
        }
        prop = parts.join('_')
      }
    }
    if (this.propType !== ChildDef.single) {
      const lastChar = prop[prop.length - 1]
      prop += (['s', 'x'].indexOf(lastChar) >= 0) ? 'es' : 's'
    }
    return prop
  }
}
