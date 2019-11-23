/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 11.10.2019
 * Time: 16:26
 */
import { processCalculations } from './db-utils'
import AbstractSchemaObject from './AbstractSchemaObject'
import PropDefCollection from './PropDefCollection'
import PropDef from './PropDef'

/**
 * Trigger on a table
 * @property {string} operation
 * @property {string} when
 * @property {string} what
 */
export default class Trigger extends AbstractSchemaObject {

  static propDefs = new PropDefCollection([
    new PropDef('operation'),
    new PropDef('when'),
    new PropDef('what'),
    ...this.propDefs.defs,
  ])

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
    return `"${table.name}_${this.name}" ${operation === 'create' ? this.getSqlTriggerType() : ''} ON ${table.getObjectIdentifier('')}`
  }

  /**
   * Returns SQL trigger type
   * @return {string}
   */
  getSqlTriggerType() {
    return (`${this.when} ${this.operation}`).toUpperCase()
  }
}
