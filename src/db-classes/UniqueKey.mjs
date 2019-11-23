/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 19.11.2019
 * Time: 9:19
 */
import AbstractDbObject from './AbstractDbObject'
import PropDefCollection from './PropDefCollection'
import PropDef from './PropDef'

/**
 * Unique key of a table
 * @property {string[]} columns
 */
export default class UniqueKey extends AbstractDbObject {

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
