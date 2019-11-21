import AbstractSchemaObject from './AbstractSchemaObject'

/**
 * Autoincrement sequence class
 */
export default class Sequence extends AbstractSchemaObject{
  tableName = ''
  columnName = ''

  static fullAlter = true

  /**
   * @inheritDoc
   */
  applyConfigProperties (config) {
    this.tableName = config.table
    this.columnName = config.column
    this.name = `${this.tableName}_${this.columnName}_seq`
  }

  /**
   * @inheritDoc
   */
  getSqlDefinition (operation, addSql) {
    return `START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1`
  }
}
