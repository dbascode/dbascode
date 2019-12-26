/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */
import PropDefCollection from '../../dbascode/PropDefCollection'
import PropDef from '../../dbascode/PropDef'
import AbstractSchemaObject from './AbstractSchemaObject'

/**
 * Unique key of a table
 * @property {string[]} columns
 */
export default class UniqueKey extends AbstractSchemaObject {

  static propDefs = new PropDefCollection([
    new PropDef('columns', { type: PropDef.array, isDefault: true }),
    ...this.propDefs.defs,
  ])

  static createdByParent = true
  static droppedByParent = true
  static fullAlter = true

  /**
   * @inheritDoc
   */
  applyConfigProperties (config) {
    super.applyConfigProperties(config)
    const table = this.getParent()
    this.name = this.getDb().getVersion() < 2
      ? `${table.name}_${this.columns.join('_')}`
      : `${table.name}_${this.columns.join('_')}_idx`
  }

  /**
   * @inheritDoc
   */
  getParentRelation (operation) {
    return 'ON'
  }

  /**
   * @inheritDoc
   */
  getObjectClass (operation) {
    return 'CONSTRAINT'
  }

  getAlterWithParentOperator () {
    return super.getAlterWithParentOperator()
  }

  /**
   * @inheritDoc
   */
  getSqlDefinition (operation, addSql) {
    return `UNIQUE ("${this.columns.join('","')}")`
  }
}
