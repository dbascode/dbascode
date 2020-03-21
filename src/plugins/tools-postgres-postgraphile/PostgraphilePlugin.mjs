/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */
import isBoolean from 'lodash-es/isBoolean'
import isArray from 'lodash-es/isArray'
import isString from 'lodash-es/isString'
import PluginDescriptor from '../../dbascode/PluginDescriptor'
import { TREE_INITIALIZED } from '../../dbascode/PluginEvent'
import PropDef from '../../dbascode/PropDef'
import clone from 'lodash-es/clone'
import { joinSql } from '../../dbascode/utils'

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
      for (const functionName of Object.keys(schema.functions)) {
        const func = schema.functions[functionName]
        this.applyOmitMixin(func)
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

      getQuotedComment: (origMethod) => {
        const omitComment = inst.getOmitComment()
        if (omitComment !== null && omitComment !== undefined) {
          return `${omitComment}\n${origMethod()}`.trim()
        } else {
          return origMethod()
        }
      },

      getPropDefCollection (origMethod) {
        const result = origMethod()
        result.addProp(new PropDef('omit', { type: PropDef.bool }))
        return result
      },

      getAlterSql (origMethod, compared, changes) {
        let newChanges, omitSql
        if (changes.omit) {
          newChanges = clone(changes)
          delete newChanges.omit
          omitSql = inst.getCommentChangesSql(compared)
        } else {
          newChanges = changes
        }
        const result = origMethod(compared, newChanges)
        return omitSql ? joinSql([result, omitSql]) : result
      },
    })
    if (type === 'Table' && inst.primaryKey) {
      inst.primaryKey.omit = inst.omit
    }
  }
}

export default new PostgraphilePlugin({
  name: 'postgraphile',
  version: 1,
})
