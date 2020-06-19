/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */
import isArray from 'lodash-es/isArray'
import { camelCaseToUnderscore } from './utils'
import isFunction from 'lodash-es/isFunction'
import isString from 'lodash-es/isString'
import isPlainObject from 'lodash-es/isPlainObject'

/**
 * @typedef {object} VersionedPropName
 * @property {number} version
 * @property {string} name
 */
/**
 * Object property definition (scalar and non-DB classes).
 */
export default class PropDef {
  static string = 'string'
  static number = 'number'
  static bool = 'bool'
  static map = 'map'
  static array = 'array'

  name
  type
  defaultValue
  _configName
  isDefault
  normalize
  validate
  allowNull
  recreateOnChange

  /**
   * Constructor
   * @param {string} name
   * @param {string} [type]
   * @param {*} [defaultValue]
   * @param {string|VersionedPropName[]} [configName]
   * @param {boolean} [isDefault]
   * @param {function} [normalize]
   * @param {function} [validate]
   * @param {boolean} [allowNull]
   * @param {boolean} [recreateOnChange]
   */
  constructor (
    name,
    {
      type = PropDef.string,
      defaultValue = '',
      configName,
      isDefault = false,
      normalize,
      validate,
      allowNull = false,
      recreateOnChange = false,
    } = {},
  ) {
    this.allowNull = allowNull
    this.recreateOnChange = recreateOnChange
    if (type === PropDef.map && isDefault && !normalize) {
      throw new Error(`Map property ${name} can be default only if normalize function is provided.`)
    }
    if (!configName) {
      configName = camelCaseToUnderscore(name)
    }
    if (!allowNull || defaultValue !== null) {
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
    }
    this.defaultValue = defaultValue
    this.name = name
    this.type = type
    this._configName = configName
    this.isDefault = isDefault
    this.normalize = normalize
    this.validate = validate
  }

  /**
   * Applies config value to the object
   * @param {AbstractDbObject} obj
   * @param {*} config
   */
  apply (obj, config) {
    let configValue
    const configName = this.getConfigName(obj)
    configValue = this.isDefault && !isPlainObject(config)
      ? config
      : config
        ? config[configName]
        : undefined
    const objProp = this.name
    const setNull = configValue === null && this.allowNull
    if (configValue === undefined || (configValue === null && !this.allowNull)) {
      configValue = this.defaultValue
    } else {
      configValue = isFunction(this.normalize) ? this.normalize(obj, configValue) : configValue
    }
    const setValue = v => obj[objProp] = v

    if (this.allowNull && configValue === null) {
      setValue(null)
    } else {
      switch (this.type) {
        case PropDef.string:
          setValue(String(configValue))
          break
        case PropDef.number:
          setValue(Number(configValue))
          break
        case PropDef.bool:
          setValue(!!configValue)
          break
        case PropDef.array:
          setValue(isArray(configValue) ? configValue : [configValue])
          break
        case PropDef.map:
          setValue(configValue)
          break
        default:
          throw new Error(`Unknown property type ${this.type}`)
      }
    }
  }

  /**
   * Returns config name
   * @param {AbstractDbObject} obj
   * @return {*}
   */
  getConfigName (obj) {
    if (isArray(this._configName)) {
      const dbVersion = obj.getClassName() === 'DataBase' ? obj.getVersion() :  obj.getDb().getVersion()
      const versions = [...this._configName]
        .map(v => isString(v) ? { version: 1, name: v } : v)
        .filter(
          v => v.version <= dbVersion
        )
      versions.sort((a, b) => b.version - a.version)
      return versions[0].name
    }
    return this._configName
  }
}
