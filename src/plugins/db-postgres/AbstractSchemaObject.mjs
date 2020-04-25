/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */
import AbstractDbObject from '../../dbascode/AbstractDbObject'
import SqlRules from './SqlRules'

/**
 * Abstract class for objects belonging to a schema
 */
export default class AbstractSchemaObject extends AbstractDbObject {
  /**
   * @type {typeof SqlRules}
   */
  static sqlRules = SqlRules

  /**
   * Returns Schema  object that the current object belongs to
   * @returns {Schema}
   */
  getSchema () {
    let parent = this
    do {
      parent = parent._parent
    } while (parent && parent.getClassName() !== 'Schema')
    return parent
  }

  /**
   * @inheritDoc
   */
  getObjectIdentifier (operation, isParentContext = false) {
    if (!isParentContext) {
      const relType = this.getParentRelation(operation)
      if (!relType || relType === '-') {
        return this.sql.getFullyQualifiedEscapedName()
      }
    }
    return super.getObjectIdentifier(operation, isParentContext)
  }
}
