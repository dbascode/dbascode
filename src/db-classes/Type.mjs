/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 11.10.2019
 * Time: 16:25
 */
import AbstractSchemaObject from './AbstractSchemaObject'
import Field from './Field'

class Type extends AbstractSchemaObject {
  isEnum
  fields = []
  values = []

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
    super(name, parent)
    this.isEnum = isEnum
    this.fields = fields
    this.values = values
    if (parent) {
      parent.types[name] = this
    }
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
    if (cfg.fields) {
      result.isEnum = false
      for (const name of Object.keys(cfg.fields)) {
        Field.createFromCfg(name, cfg.fields[name], result)
      }
    } else if (cfg.enum) {
      result.isEnum = true
      result.values = result.values.concat(cfg.enum)
    } else {
      throw new Error('Either fields or enum values must be specified')
    }
    return result
  }

  getCreateSql () {
    if (this.isEnum) {
      return `CREATE TYPE ${this.getParentedName(true)} AS ENUM ('${this.values.join("', '")}');\n`
    } else {
      const fields = []
      for (const field of Object.values(this.fields)) {
        fields.push(field.getCreateSql())
      }
      return `CREATE TYPE ${this.getParentedName(true)} AS (\n${fields.join(",\n")}\n);\n`
    }
  }
}

export default Type
