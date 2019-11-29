import AbstractSchemaObject from './AbstractSchemaObject'
import PropDefCollection from '../../../dbascode/PropDefCollection'
import PropDef from '../../../dbascode/PropDef'

/**
 * Attribute in a type
 * @property {string} type
 */
export default class Attribute extends AbstractSchemaObject{
  /**
   * @type {PropDefCollection}
   */
  static propDefs = new PropDefCollection([
    new PropDef('type', { isDefault: true }),
    ...this.propDefs.defs,
  ])

  static createdByParent = true
  static droppedByParent = true
  static alterWithParent = true

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
