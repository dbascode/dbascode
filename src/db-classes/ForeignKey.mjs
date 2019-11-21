/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 12.10.2019
 * Time: 21:11
 */
import { processCalculations } from './db-utils'
import AbstractSchemaObject from './AbstractSchemaObject'
import isString from 'lodash-es/isString'

/**
 * Foreign key in a column
 */
export default class ForeignKey extends AbstractSchemaObject {
  colName
  refTableName
  refColName
  onUpdate = 'restrict'
  onDelete = 'restrict'

  static droppedByParent = true
  static createdByParent = true
  static alterWithParent = true
  static fullAlter = true

  /**
   * @inheritDoc
   */
  applyConfigProperties (config) {
    const [refTableName, refColName] = config.ref.split('.')
    this.colName = config.column
    this.refTableName = refTableName
    this.refColName = refColName
    this.name = `${config.column}_fkey`
    if (config.on_update) {
      this.onUpdate = config.on_update
    }
    if (config.on_delete) {
      this.onDelete = config.on_delete
    }
  }

  /**
   * Returns table
   * @return {Table}
   */
  getTable () {
    return this.getParent()
  }

  /**
   * Returns ON UPDATE SQL
   * @return {string}
   */
  getOnUpdate () {
    return this.onUpdate.toUpperCase()
  }

  /**
   * Returns ON DELETE SQL
   */
  getOnDelete () {
    return this.onDelete.toUpperCase()
  }

  /**
   * @inheritDoc
   */
  getSqlDefinition () {
    return `FOREIGN KEY ("${this.colName}")
      REFERENCES ${this.getSchema().getQuotedName()}."${this.refTableName}" ("${this.refColName}") 
      MATCH SIMPLE ON UPDATE ${this.getOnUpdate()} ON DELETE ${this.getOnDelete()}`;
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
  getParentRelation (operation) {
    return 'ON'
  }
}
