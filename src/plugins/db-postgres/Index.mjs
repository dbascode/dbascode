/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */

import AbstractSchemaObject from './AbstractSchemaObject'
import PropDefCollection from '../../dbascode/PropDefCollection'
import PropDef from '../../dbascode/PropDef'

/**
 * Index in a table
 * @property {string[]} columns
 */
export default class Index extends AbstractSchemaObject {

  static droppedByParent = true

  static propDefs = new PropDefCollection([
    new PropDef('columns', { type: PropDef.array, isDefault: true }),
    ...this.propDefs.defs,
  ])

  /**
   * @inheritDoc
   */
  applyConfigProperties (config) {
    super.applyConfigProperties(config)
    this.name = `${this.getParent().name}_${this.columns.join('_')}_idx`
  }

  /**
   * @inheritDoc
   */
  getParentRelation (operation) {
    return operation === 'comment' ? '.' : 'ON'
  }

  /**
   * @inheritDoc
   */
  getObjectIdentifier (operation, isParentContext = false) {
    if (operation === 'drop') {
      return `${this.getSchema().sql.getEscapedName()}.${this.getSqlQuotedName()}`
    } else {
      return super.getObjectIdentifier(operation, isParentContext)
    }
  }

  /**
   * @inheritDoc
   */
  getSqlDefinition (operation) {
    return `("${this.columns.join('","')}")`
  }
}
