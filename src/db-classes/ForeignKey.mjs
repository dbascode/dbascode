/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 12.10.2019
 * Time: 21:11
 */
import { prepareArgs } from './db-utils'
import AbstractSchemaObject from './AbstractSchemaObject'

/**
 * Foreign key in a column
 */
export default class ForeignKey extends AbstractSchemaObject {
  colName
  refTableName
  refColName
  onUpdate = 'restrict'
  onDelete = 'restrict'

  /**
   * Constructor
   * @param {string} colName
   * @param {string} refTableName
   * @param {string} refColName
   * @param {string} onUpdate
   * @param {string} onDelete
   * @param {Column} [parent]
   */
  constructor (
    {
      colName,
      refTableName,
      refColName,
      onUpdate = 'restrict',
      onDelete = 'restrict',
      parent = undefined,
    }) {
    super({
      name: `${colName}_fkey`,
      parent,
      isSimpleChild: true,
      droppedByParent: true,
      createdByParent: true,
      alterWithParent: true,
      fullAlter: true,
    })
    this.colName = colName
    this.refTableName = refTableName
    this.refColName = refColName
    this.onUpdate = onUpdate
    this.onDelete = onDelete
  }

  /**
   * Instantiate new object from config data
   * @param {string} colName
   * @param {string} definition
   * @param {Column} [parent]
   * @return {ForeignKey|null}
   */
  static createFromCfg(colName, definition, parent) {
    if (!definition) {
      return null
    }
    const [refTableName, refColName] = definition.split('.')
    const result = new ForeignKey(prepareArgs(parent, {
      colName,
      refTableName,
      refColName,
      parent,
    }))
    return result.getDb().pluginOnObjectConfigured(result, definition)
  }

  /**
   * Returns table
   * @return {Table}
   */
  getTable () {
    return this.getParent().getParent()
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
  getDefinition () {
    return `FOREIGN KEY ("${this.colName}")
      REFERENCES ${this.getSchema().getQuotedName()}."${this.refTableName}" ("${this.refColName}") 
      MATCH SIMPLE ON UPDATE ${this.getOnUpdate()} ON DELETE ${this.getOnDelete()}`;
  }

  /**
   * @inheritDoc
   */
  getObjectClass () {
    return 'CONSTRAINT'
  }

  /**
   * @inheritDoc
   */
  getParentRelation () {
    return 'ON'
  }
}
