/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 21.11.2019
 * Time: 10:25
 */
import AbstractPlugin from './AbstractPlugin'
import ChildDefCollection from '../db-classes/ChildDefCollection'
import ChildDef from '../db-classes/ChildDef'
import Rows from './Rows'

/**
 * Plugin to add rows to a table when it is created
 */
export default class DefaultRowsPlugin extends AbstractPlugin {
  /**
   * @inheritDoc
   */
  onTreeInitialized(db) {
    for (const schemaName of Object.keys(db.schemas)) {
      if (schemaName === 'pgascode') {
        continue
      }
      const schema = db.schemas[schemaName]
      for (const tableName of Object.keys(schema.tables)) {
        const table = schema.tables[tableName]
        this.applyOmitMixin(table)
      }
    }
  }

  /**
   * Applies Table class mixin
   * @param {Table} inst
   */
  applyOmitMixin(inst) {
    const config = inst._rawConfig
    inst.applyMixin({
      getChildrenDefs: (origMethod) => {
        const col = origMethod()
        const newCol = new ChildDefCollection([
          ...col.defs,
          new ChildDef(
            Rows,
            ChildDef.single,
          )
        ])
        return newCol
      },
    })
  }
}
