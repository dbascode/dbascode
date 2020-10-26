/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */
import AbstractSchemaObject from './AbstractSchemaObject'
import PropDefCollection from '../../dbascode/PropDefCollection'
import PropDef from '../../dbascode/PropDef'

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

  static droppedByParent = true

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
  getSqlDefinition (operation) {
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
    const when = this.when === 'instead_of' ? 'instead of' : this.when
    return (`${when} ${this.operation}`).toUpperCase()
  }

  /**
   * @inheritDoc
   */
  validate (previous, context) {
    const operations = ['insert', 'update', 'select']
    if (operations.indexOf(this.operation.toLowerCase()) < 0) {
      context.addError(this, "Trigger operation must be one of the following: `insert`, `update`, `select`")
    }
    const when = ['before', 'after', 'instead_of']
    if (when.indexOf(this.when.toLowerCase()) < 0) {
      context.addError(this, "Trigger event type must be one of the following: `before`, `after`, or `instead_of`")
    }
    super.validate(previous, context)
  }
}
