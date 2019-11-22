/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 19.11.2019
 * Time: 9:19
 */
import AbstractDbObject from './AbstractDbObject'
import isArray from 'lodash-es/isArray'

/**
 * Unique key of a table
 */
export default class UniqueKey extends AbstractDbObject {
  colNames = []

  static droppedByParent = true
  static fullAlter = true

  /**
   * @inheritDoc
   */
  applyConfigProperties (config) {
    this.colNames = isArray(config) ? config : [config]
    const table = this.getParent()
    this.name = this.getDb().getVersion() < 2
      ? `${table.name}_${this.colNames.join('_')}`
      : `${table.name}_${this.colNames.join('_')}_idx`
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
    return `UNIQUE ("${this.colNames.join('","')}")`
  }
}
