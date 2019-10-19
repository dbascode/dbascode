/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 15.10.2019
 * Time: 19:37
 */
import AbstractSchemaObject from './AbstractSchemaObject'
import { prepareArgs } from './utils'

class Field extends AbstractSchemaObject{
  type

  /**
   * Constructor
   * @param {string} name
   * @param {string} type
   * @param {Type} [parent]
   */
  constructor (
    {
      name,
      type,
      parent = undefined
    }
  ) {
    super(name, parent)
    this.type = type
  }
  /**
   * Instantiate new object from config data
   * @param {string} name
   * @param {string} [cfg]
   * @param {Type} [parent]
   * @return {Field}
   */
  static createFromCfg(name, cfg, parent) {
    if (!cfg) {
      return null
    }
    const result = new Field(prepareArgs(parent, {
      name,
      type: cfg,
      parent,
    }))
    return result.getDb().pluginOnObjectConfigured(result, cfg)
  }

  getCreateSql (withParent) {
    if (withParent) {
      return ''
    } else {
      return this.getFieldDefinition()
    }
  }

  getFieldDefinition () {
    return `${this.getQuotedName()} ${this.type}`
  }
}

export default Field
