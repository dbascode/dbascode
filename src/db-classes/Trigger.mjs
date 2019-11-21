/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 11.10.2019
 * Time: 16:26
 */
import { processCalculations } from './db-utils'
import AbstractSchemaObject from './AbstractSchemaObject'

/**
 * Trigger on a table
 */
export default class Trigger extends AbstractSchemaObject {
  operation
  when
  what

  /**
   * @inheritDoc
   */
  applyConfigProperties (config) {
    const op = this.name
    const [when, operation] = op.split('_')
    this.when = when
    this.operation = operation
    this.what = config
    this.name = `${when}_${operation}`
  }

  /**
   * @inheritDoc
   */
  getSqlDefinition (operation, addSql) {
    return `FOR EACH ROW EXECUTE PROCEDURE ${this.what}`
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
  getObjectIdentifier (operation, isParentContext) {
    const table = this.getParent()
    return `"${table.name}_${this.name}" ${this.getSqlTriggerType()} ON ${table.getObjectIdentifier('')}`
  }

  /**
   * Returns SQL trigger type
   * @return {string}
   */
  getSqlTriggerType() {
    return (`${this.when} ${this.operation}`).toUpperCase()
  }
}
