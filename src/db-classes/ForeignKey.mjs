/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 12.10.2019
 * Time: 21:11
 */
import AbstractSchemaObject from './AbstractSchemaObject'
import isString from 'lodash-es/isString'
import PropDefCollection from './PropDefCollection'
import PropDef from './PropDef'

/**
 * @typedef {Object} FKeyRef
 * @property {string} table
 * @property {string} column
 */

/**
 * Foreign key in a column
 * @property {string} column
 * @property {string} onUpdate
 * @property {string} onDelete
 * @property {FKeyRef} ref
 */
export default class ForeignKey extends AbstractSchemaObject {
  static droppedByParent = true
  static createdByParent = true
  static alterWithParent = true
  static fullAlter = true

  static propDefs = new PropDefCollection([
    new PropDef('column'),
    new PropDef('onUpdate', { defaultValue: 'restrict' }),
    new PropDef('onDelete', { defaultValue: 'restrict' }),
    new PropDef('ref', {
      type: PropDef.map,
      normalize: (obj, value) => {
        if (isString(value)) {
          const [table, column] = value.split('.')
          value = { table, column }
        }
        return value
      }
    }),
    ...this.propDefs.defs,
  ])

  /**
   * @inheritDoc
   */
  applyConfigProperties (config) {
    super.applyConfigProperties(config)
    this.name = `${this.column}_fkey`
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
  getSqlDefinition (operation, addSql) {
    return `FOREIGN KEY ("${this.column}")
      REFERENCES ${this.getSchema().getQuotedName()}."${this.ref.table}" ("${this.ref.column}") 
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
