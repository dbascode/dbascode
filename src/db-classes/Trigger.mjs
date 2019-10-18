/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 11.10.2019
 * Time: 16:26
 */
import AbstractSchemaObject from './AbstractSchemaObject'
import { prepareArgs } from './utils'

class Trigger extends AbstractSchemaObject {
  operation
  when
  what

  /**
   * Constructor
   * @param {string} operation
   * @param {string} when
   * @param {string} what
   * @param {Table} [parent]
   */
  constructor (
    {
      operation,
      when,
      what,
      parent = undefined
    }) {
    super('', parent)
    this.operation = operation
    this.when = when
    this.what = what
    if (parent) {
      parent.triggers[`${when}_${operation}`] = this
    }
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

  getCreateSql () {
    return `CREATE TRIGGER ${this.parent.name}_${this.event} ${this.getSqlTriggerType()} ON ${this.parent.getParentedName()} FOR EACH ROW EXECUTE PROCEDURE ${this.what};\n`
  }

  getSqlTriggerType() {
    return (`${this.when} ${this.operation}`).toUpperCase()
  }
}

export default Trigger
