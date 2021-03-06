/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */
import AbstractSchemaObject from './AbstractSchemaObject'
import isString from 'lodash-es/isString'
import PropDefCollection from '../../dbascode/PropDefCollection'
import PropDef from '../../dbascode/PropDef'
import reverse from 'lodash-es/reverse'

/**
 * @typedef {Object} FKeyRef
 * @property {string} schema
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
    new PropDef('column', {
      recreateOnChange: true,
    }),
    new PropDef('onUpdate', {
      defaultValue: 'restrict',
      recreateOnChange: true,
    }),
    new PropDef('onDelete', {
      defaultValue: 'restrict',
      recreateOnChange: true,
    }),
    new PropDef('ref', {
      isDefault: true,
      type: PropDef.map,
      recreateOnChange: true,
      normalize: (obj, value) => {
        if (isString(value)) {
          const [column, table, schema] = reverse(value.split('.'))
          value = { schema, table, column }
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
  getSqlDefinition (operation) {
    const ref = this.ref
    const refSchema = ref.schema ? this.getDb().getSchema(ref.schema) : this.getSchema()
    return `FOREIGN KEY (${this.sql.escapeSqlId(this.column)})
      REFERENCES ${refSchema.sql.getEscapedName()}.${this.sql.escapeSqlId(ref.table)} (${this.sql.escapeSqlId(ref.column)}) 
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

  /**
   * @inheritDoc
   */
  // getAlterPropSql (compared, propName, oldValue, curValue, context) {
  //   if (!this.isInherited()) {
  //     switch (propName) {
  //       case 'onDelete':
  //       case 'onUpdate':
  //         return `ALTER KEY ${this.sql.}`
  //     }
  //   }
  //   return super.getAlterPropSql(compared, propName, oldValue, curValue, context)
  // }

  /**
   * Fills the dependencies list of this object
   */
  setupDependencies() {
    super.setupDependencies()
    const ref = this.ref
    const refSchema = ref.schema ? this.getDb().getSchema(ref.schema) : this.getSchema()
    const refTable = refSchema.getTable(ref.table)
    if (!refTable) {
      throw new Error(`Foreign key ${this.getParent().name}.${this.name} reference table ${ref.table} not found`)
    }
    this._dependencies.push(refTable.getPath())
  }

  /**
   * @inheritDoc
   */
  validate (previous, context) {
    const onValues = ['restrict', 'cascade']
    if (onValues.indexOf(this.onDelete.toLowerCase()) < 0) {
      context.addError(this, "on_delete must be `restrict` or `cascade`")
    }
    if (onValues.indexOf(this.onUpdate.toLowerCase()) < 0) {
      context.addError(this, "on_update must be `restrict` or `cascade`")
    }
    super.validate(previous, context)
  }
}
