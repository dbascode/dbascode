/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 12.10.2019
 * Time: 21:11
 */
import AbstractSchemaObject from './AbstractSchemaObject'
import { prepareArgs } from './utils'

class ForeignKey extends AbstractSchemaObject {
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
    super('', parent)
    this.colName = colName
    this.refTableName = refTableName
    this.refColName = refColName
    this.onUpdate = onUpdate
    this.onDelete = onDelete
    if (parent) {
      parent.foreignKey = this
    }
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

  getCreateSql () {
  }

  getInlineSql () {
    return `CONSTRAINT "${this.colName}_fkey" FOREIGN KEY ("${this.colName}")
      REFERENCES ${this.getSchema().getQuotedName()}."${this.refTableName}" ("${this.refColName}") MATCH SIMPLE ON UPDATE RESTRICT ON DELETE RESTRICT`
  }
}

export default ForeignKey
