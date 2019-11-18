/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 11.10.2019
 * Time: 16:25
 */
import AbstractSchemaObject from './AbstractSchemaObject'
import Attribute from './Attribute'

/**
 * DB Type object
 */
export default class Type extends AbstractSchemaObject {
  isEnum
  attributes = []
  values = []
  _childrenProps = ['attributes']

  /**
   *
   * @param {string} name
   * @param {boolean} [isEnum]
   * @param {Object.<string, Column>} [fields]
   * @param {string[]} [values]
   * @param {Schema} [parent]
   */
  constructor (
    {
      name,
      isEnum,
      fields = {},
      values = [],
      parent = undefined
    }
  ) {
    super({
      name,
      parent,
    })
    this.isEnum = isEnum
    this.attributes = fields
    this.values = values
  }

  /**
   * Instantiate new object from config data
   * @param {string} name
   * @param {Object|null} cfg
   * @param {Schema} [parent]
   * @return {Type|null}
   */
  static createFromCfg(name, cfg, parent) {
    if (!cfg) {
      return null
    }
    const result = new Type({
      name,
      parent,
    })
    const attributesField = parent.getDb().getVersion() < 1 ? 'fields' : 'attributes'
    if (cfg[attributesField]) {
      result.isEnum = false
      for (const name of Object.keys(cfg[attributesField])) {
        Attribute.createFromCfg(name, cfg[attributesField][name], result)
      }
    } else if (cfg.enum) {
      result.isEnum = true
      result.values = result.values.concat(cfg.enum)
    } else {
      throw new Error('Either attributes or enum values must be specified')
    }
    return result.getDb().pluginOnObjectConfigured(result, cfg)
  }

  /**
   * @inheritDoc
   */
  getDefinition (operation, addSql) {
    if (this.isEnum) {
      return `AS ENUM ('${this.values.join("', '")}');`
    } else {
      const fields = []
      for (const field of Object.values(this.attributes)) {
        fields.push(`${field.getObjectIdentifier('', true)} ${field.getDefinition()}`)
      }
      return `AS (\n${fields.join(",\n")}\n)`
    }
  }
}
