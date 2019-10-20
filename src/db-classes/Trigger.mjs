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
    super(`${when}_${operation}`, parent)
    this.apply({...arguments[0], _parent: parent})
    delete this.parent
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

  getCreateSql () {
    return `CREATE TRIGGER "${this._parent.name}_${this.operation}" ${this.getSqlTriggerType()} ON ${this._parent.getParentedName(true)} FOR EACH ROW EXECUTE PROCEDURE ${this.what};\n`
  }

  getSqlTriggerType() {
    return (`${this.when} ${this.operation}`).toUpperCase()
  }
}

export default Trigger
