/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 17.10.2019
 * Time: 20:07
 */
import isBoolean from 'lodash-es/isBoolean'
import isArray from 'lodash-es/isArray'
import isString from 'lodash-es/isString'
import PluginDescriptor from '../../dbascode/PluginDescriptor'
import { TREE_INITIALIZED } from '../../dbascode/PluginEvent'

export default new PluginDescriptor({
  name: 'postgraphile',
  version: 1,
})

/**
 * Some Postgraphile-specific add-ons
 */
class PostgraphilePlugin extends PluginDescriptor {
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
      if (schemaName === 'dbascode') {
        continue
      }
      const schema = db.schemas[schemaName]
      for (const tableName of Object.keys(schema.tables)) {
        const table = schema.tables[tableName]
        this.applyOmitMixin(table)
        for (const columnName of Object.keys(table.columns)) {
          this.applyOmitMixin(table.columns[columnName])
        }
        if (table.primaryKey) {
          this.applyOmitMixin(table.primaryKey)
        }
      }
    }
  }

  /**
   * Applies Table class mixin
   * @param {Table|Column|PrimaryKey} inst
   */
  applyOmitMixin(inst) {
    const cfg = inst._rawConfig
    const type = inst.getClassName()
    const omit = cfg ? cfg.omit : false
    inst.applyMixin({
      omit: isBoolean(omit)
        ? omit
        : (
          isArray(omit)
            ? omit
            : (
              isString(omit)
                ? [omit]
                : undefined
            )
        ),

      getOmitComment: () => {
        if (inst.omit) {
          let addition = '@omit'
          if (isArray(inst.omit)) {
            addition += ' ' + inst.omit.join(',')
          }
          return addition
        }
      },

      getComment: (origMethod) => {
        const omitComment = inst.getOmitComment()
        if (omitComment !== null && omitComment !== undefined) {
          return `${origMethod()}\n${omitComment}`.trim()
        } else {
          return origMethod()
        }
      },
    })
    if (type === 'Table' && inst.primaryKey) {
      inst.primaryKey.omit = inst.omit
    }
  }
}
