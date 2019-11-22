/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 21.11.2019
 * Time: 16:51
 */
import isArray from 'lodash-es/isArray'
import isObject from 'lodash-es/isObject'

export default class PropDef {
  static string = 'string'
  static number = 'number'
  static bool = 'bool'
  static map = 'map'
  static array = 'array'

  name
  type
  defaultValue
  configName
  isDefault
  normalize
  validate

  /**
   * Constructor
   * @param {string} name
   * @param {string} [type]
   * @param {*} [defaultValue]
   * @param {string} [configName]
   * @param {boolean} [isDefault]
   * @param {function} [normalize]
   * @param {function} [validate]
   */
  constructor (
    {
      name,
      type = PropDef.string,
      defaultValue = '',
      configName,
      isDefault = false,
      normalize,
      validate,
    },
  ) {
    if (!configName) {
      configName = name
    }
    if (type === PropDef.string) {
      defaultValue = String(defaultValue || '')
    } else if (type === PropDef.number) {
      defaultValue = Number.isNaN(Number(defaultValue)) ? 0 : Number(defaultValue)
    } else if (type === PropDef.bool) {
      defaultValue = !!defaultValue
    } else if (type === PropDef.map) {
      defaultValue = defaultValue || {}
    } else if (type === PropDef.array) {
      defaultValue = defaultValue || []
    } else {
      throw new Error(`Unknown property type ${type}`)
    }
    this.defaultValue = defaultValue
    this.name = name
    this.type = type
    this.configName = configName
    this.isDefault = isDefault
    this.normalize = normalize
    this.validate = validate
  }

  /**
   * Applies config value to the object
   * @param {AbstractDbObject} obj
   * @param {*} config
   * @param {string} [defaultPropName]
   */
  apply (obj, config, defaultPropName) {
    const value = config[this.configName] !== undefined ? config[this.configName] : this.defaultValue
    const p = this.name
    switch (this.type) {
      case PropDef.string:
        obj[p] = String(value)
        break
      case PropDef.number:
        obj[p] = Number(value)
        break
      case PropDef.bool:
        obj[p] = !!value
        break
      case PropDef.array:
        obj[p] = isArray(value) ? value : [value]
        break
      case PropDef.map:
        obj[p] = isObject(value) ? value : {[defaultPropName]: value}
        break
      default:
        throw new Error(`Unknown property type ${this.type}`)
    }
  }
}
