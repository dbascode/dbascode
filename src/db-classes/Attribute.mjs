import { processCalculations } from './db-utils'
import AbstractSchemaObject from './AbstractSchemaObject'

/**
 * Attribute in a type
 */
export default class Attribute extends AbstractSchemaObject{
  type

  static createdByParent = true
  static droppedByParent = true
  static alterWithParent = true

  applyConfigProperties (config) {
    this.type = config
  }

  /**
   * @inheritDoc
   */
  getSqlDefinition (operation, addSql) {
    return `${this.type}`
  }

  /**
   * @inheritDoc
   */
  getParentRelation (operation) {
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
