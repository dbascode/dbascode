/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 21.11.2019
 * Time: 10:25
 */
import ChildDefCollection from '../../dbascode/ChildDefCollection'
import ChildDef from '../../dbascode/ChildDef'
import Rows from './Rows'
import PluginDescriptor from '../../dbascode/PluginDescriptor'
import { TREE_INITIALIZED } from '../../dbascode/PluginEvent'

export default new DefaultRowsPlugin({
  name: 'default-rows',
  version: 1,
})

/**
 * Plugin to add rows to a table when it is created
 */
class DefaultRowsPlugin extends PluginDescriptor {
  /**
   * @inheritDoc
   */
  event (eventName, args = []) {
    if (eventName === TREE_INITIALIZED) {
      this.onTreeInitialized(args[0])
    }
  }

  /**
   * Executed on a DB tree initialization completion
   * @param {DataBase} db
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
