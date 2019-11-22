/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 16.11.2019
 * Time: 12:26
 */

import AbstractSchemaObject from './AbstractSchemaObject'
import isString from 'lodash-es/isString'

/**
 * Table primary key object
 */
export default class PrimaryKey extends AbstractSchemaObject {
  colNames = []

  static createdByParent = true
  static droppedByParent = true
  static alterWithParent = true

  /**
   * @inheritDoc
   */
  applyConfigProperties (config) {
    if (isString(config)) {
      config = {columns: config}
    }
    this.colNames = isString(config.columns) ? [config.columns] : (config.columns || [])
    this.name = `${this.getParent().name}_pkey`
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

  /**
   * @inheritDoc
   */
  getSqlDefinition (operation, addSql) {
    return `PRIMARY KEY ("${this.colNames.join('", "')}")`
  }
}
