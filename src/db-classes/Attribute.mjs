/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 15.10.2019
 * Time: 19:37
 */
import AbstractSchemaObject from './AbstractSchemaObject'
import { prepareArgs } from './utils'

/**
 * Attribute in a type
 */
export default class Attribute extends AbstractSchemaObject{
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
    super({
      name,
      parent,
      createdByParent: true,
      droppedByParent: true,
      alterWithParent: true,
    })
    this.type = type
  }
  /**
   * Instantiate new object from config data
   * @param {string} name
   * @param {string} [cfg]
   * @param {Type} [parent]
   * @return {Attribute}
   */
  static createFromCfg(name, cfg, parent) {
    if (!cfg) {
      return null
    }
    const result = new Attribute(prepareArgs(parent, {
      name,
      type: cfg,
      parent,
    }))
    return result.getDb().pluginOnObjectConfigured(result, cfg)
  }

  /**
   * @inheritDoc
   */
  getDefinition (operation, addSql) {
    return `${this.getQuotedName()} ${this.type}`
  }

  /**
   * @inheritDoc
   */
  getParentRelation () {
    return ''
  }

  /**
   * @inheritDoc
   */
  getAlterPropSql (compared, propName, oldValue, curValue) {
    switch (propName) {
      case 'type': return `SET DATA TYPE ${this.type}`
    }
  }
}
