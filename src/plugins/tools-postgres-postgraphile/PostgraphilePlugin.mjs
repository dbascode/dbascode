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
import { joinSql, parseArrayProp } from '../../dbascode/utils'
import PropDefCollection from '../../dbascode/PropDefCollection'

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

      getComment: (origMethod) => {
        const omitComment = inst.getOmitComment()
        if (omitComment !== null && omitComment !== undefined) {
          return `${omitComment}\n${origMethod()}`.trim()
        } else {
          return origMethod()
        }
      },

      getPropDefCollection (origMethod) {
        const result = new PropDefCollection([...origMethod().defs])
        result.addProp(new PropDef('omit', { type: PropDef.bool }))
        return result
      },

      getChangesAlterSql (origMethod, compared, changes) {
        // Replace any number of the omit array changes by a single change that will cover all possible changes
        // by a single SQL request.
        let newChanges = [...changes], omitChangeFound = false
        for (const i in changes) {
          const change = changes[i]
          const parsedProp = parseArrayProp(change.path)
          if (parsedProp.path[parsedProp.path.length - 1] === 'omit') {
            if (omitChangeFound) {
              delete newChanges[i]
            }
            omitChangeFound = true;
          }
        }
        // Pass to the original method removing undefined (deleted) array items
        return origMethod(compared, newChanges.filter(i => i))
      },

      getAlterPropSql (origMethod, compared, propName, oldValue, curValue, context) {
        const parsedProp = parseArrayProp(propName)
        switch (parsedProp.name) {
          case 'omit':
            context.separateSql = true
            return this.getCommentChangesSql(compared)
          default: return origMethod(compared, propName, oldValue, curValue, context)
        }
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
