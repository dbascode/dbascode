import AbstractSchemaObject from './AbstractSchemaObject'
import PropDefCollection from '../../dbascode/PropDefCollection'
import PropDef from '../../dbascode/PropDef'
import { parseTypedef, stringifyTypeDef } from './utils'

/**
 * Attribute in a type
 * @property {string} type
 * @property {string} schema
 * @property {boolean} isArray
 */
export default class Attribute extends AbstractSchemaObject{
  /**
   * @type {PropDefCollection}
   */
  static propDefs = new PropDefCollection([
    new PropDef('schema'),
    new PropDef('type', { isDefault: true }),
    new PropDef('size', { type: PropDef.number }),
    new PropDef('isArray', { type: PropDef.bool }),
    ...this.propDefs.defs,
  ])

  static createdByParent = true
  static droppedByParent = true
  static alterWithParent = true

  /**
   * @inheritDoc
   */
  getConfigForApply (config) {
    return parseTypedef(super.getConfigForApply(config))
  }

  /**
   * @inheritDoc
   */
  getSqlDefinition (operation) {
    return stringifyTypeDef(this)
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
      case 'type': return `SET DATA TYPE ${stringifyTypeDef(this)}`
    }
  }
}
