/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 11.10.2019
 * Time: 16:26
 */
import { prepareArgs } from './db-utils'
import AbstractSchemaObject from './AbstractSchemaObject'

/**
 * Trigger on a table
 */
export default class Trigger extends AbstractSchemaObject {
  operation
  when
  what
  isInherited = false

  /**
   * Constructor
   * @param {string} operation
   * @param {string} when
   * @param {string} what
   * @param {Table} [parent]
   * @param {boolean} [isInherited]
   */
  constructor (
    {
      operation,
      when,
      what,
      parent = undefined,
      isInherited = false,
    }) {
    super({
      name: `${parent.name}_${operation}_${when}`,
      parent,
      droppedByParent: true,
      fullAlter: true,
    })
    this.operation = operation
    this.when = when
    this.what = what
    this.isInherited = isInherited
  }

  /**
   * Instantiate new object from config data
   * @param {string} op
   * @param {string|null} cfg
   * @param {Table} [parent]
   * @return {Trigger|null}
   */
  static createFromCfg(op, cfg, parent) {
    if (!cfg) {
      return null
    }
    const [when, operation] = op.split('_')
    const result = new Trigger(prepareArgs(parent, {
      when,
      operation,
      what: cfg,
      parent,
    }))
    return result.getDb().pluginOnObjectConfigured(result, cfg)
  }

  /**
   * @inheritDoc
   */
  getDefinition (operation, addSql) {
    return `FOR EACH ROW EXECUTE PROCEDURE ${this.what}`
  }

  /**
   * @inheritDoc
   */
  getParentRelation () {
    return 'ON'
  }

  /**
   * @inheritDoc
   */
  getObjectIdentifier (operation, isParentContext) {
    return `${this.getQuotedName()} ${this.getSqlTriggerType()} ON ${this.getParent().getParentedName(true)}`
  }

  /**
   * Returns SQL trigger type
   * @return {string}
   */
  getSqlTriggerType() {
    return (`${this.when} ${this.operation}`).toUpperCase()
  }
}
