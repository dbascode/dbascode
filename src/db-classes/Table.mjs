/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 07.10.2019
 * Time: 15:23
 */

import isArray from 'lodash-es/isArray'
import { indent } from '../utils'
import Column from './Column'
import Rows from './Rows'
import Trigger from './Trigger'
import Index from './Index'
import AbstractSchemaObject from './AbstractSchemaObject'
import isString from 'lodash-es/isString'
import {
  escapeComment,
  parseArrayProp,
  prepareArgs,
} from './utils'

/**
 * Table object
 */
class Table extends AbstractSchemaObject {
  columns = []
  comment
  uniqueKeys = []
  indexes = []
  triggers = []
  defaultAcl = []
  rows = undefined
  autoIncSeqRequired = false
  primaryKey = []
  rowLevelSecurity = {}
  inherits = undefined
  _childrenProps = ['columns', 'indexes', 'triggers', 'rows']
  skipTriggers = false
  skipIndexes = false
  skipRLS = false

  /**
   * Constructor
   * @param {string} name
   * @param {Object.<string, Column>} columns
   * @param {string} comment
   * @param {string[][]} uniqueKeys
   * @param {Index[]} indexes
   * @param {Object.<string, Trigger>} triggers
   * @param {array} defaultAcl
   * @param {Rows} [rows]
   * @param {Table} [inherits]
   * @param {Schema} [parent]
   * @param {string[]} [primaryKey]
   * @param {ForeignKey[]} [foreignKeys]
   * @param {Object.<string, string>} [rowLevelSecurity]
   * @param {boolean} skipIndexes
   * @param {boolean} skipTriggers
   * @param {boolean} skipRLS
   * @param {object} [grant]
   * @param {object} [revoke]
   */
  constructor (
    {
      name,
      columns = {},
      comment,
      uniqueKeys = [],
      indexes = [],
      triggers = {},
      defaultAcl = [],
      rows = undefined,
      inherits = undefined,
      parent = undefined,
      primaryKey = [],
      rowLevelSecurity = {},
      skipTriggers = false,
      skipIndexes = false,
      skipRLS = false,
      grant = {},
      revoke = {},
    }) {
    super(name, parent, false, grant, revoke)
    this.columns = columns
    this.comment = comment
    this.uniqueKeys = uniqueKeys
    this.indexes = indexes
    this.triggers = triggers
    this.defaultAcl = defaultAcl
    this.rows = rows
    this.primaryKey = primaryKey
    this.rowLevelSecurity = rowLevelSecurity
    this.inherits = inherits
    this.skipTriggers = skipTriggers
    this.skipIndexes = skipIndexes
    this.skipRLS = skipRLS
  }

  /**
   * Instantiate new object from config data
   * @param {string} name
   * @param {Object|null} cfg
   * @param {Schema} [parent]
   * @return {Table|null}
   */
  static createFromCfg(name, cfg, parent) {
    if (!cfg) {
      return null
    }
    const inherits = cfg.inherit ? parent.getTable(cfg.inherit) : undefined
    const uniqueKeys = []
    const rowLevelSecurity = {}
    for (const indexDef of cfg.unique_keys || []) {
      uniqueKeys.push(isArray(indexDef) ? indexDef : [indexDef])
    }
    for (const op of Object.keys(cfg.row_level_security || {})) {
      rowLevelSecurity[op] = cfg.row_level_security[op]
    }

    const result = new Table(prepareArgs(parent, {
      name,
      parent,
      inherits: inherits,
      comment: cfg.comment,
      primaryKey: isString(cfg.primary_key) ? [cfg.primary_key] : (cfg.primary_key || []),
      defaultAcl: cfg.default_acl,
      skipIndexes: !!cfg.skip_indexes,
      skipTriggers: !!cfg.skip_triggers,
      skipRLS: !!cfg.skip_rls,
      rowLevelSecurity,
      uniqueKeys,
      grant: cfg.grant,
      revoke: cfg.revoke,
    }))
    for (const name of Object.keys(cfg.columns || {})) {
      const column = Column.createFromCfg(name, cfg.columns[name], result)
      if (column.isAutoIncrement) {
        result.autoIncSeqRequired = true
        result.primaryKey = [column.name]
      }
    }
    if (inherits) {
      for (const parentColumn of Object.values(inherits.columns)) {
        new Column({
          ...parentColumn,
          parent: result,
          isInherited: true,
        })
      }
    }
    for (const name of Object.keys(cfg.triggers || {})) {
      Trigger.createFromCfg(name, cfg.triggers[name], result)
    }
    if (inherits) {
      for (const parentTrigger of Object.values(inherits.triggers)) {
        new Trigger({
          ...parentTrigger,
          parent: result,
          isInherited: true,
        })
      }
    }
    for (const indexDef of cfg.indexes || []) {
      Index.createFromCfg(indexDef, result)
    }
    if (inherits) {
      for (const parentIndex of inherits.indexes) {
        new Index({
          colNames: {
            ...parentIndex,
            parent: result,
            isInherited: true,
          }
        })
      }
    }
    Rows.createFromCfg(cfg.rows, result)

    return result.getDb().pluginOnObjectConfigured(result, cfg)
  }

  /**
   * Returns table dependencies
   * @param {Object} cfg
   * @returns {string[]}
   */
  static getDependencies(cfg) {
    const dependOnMap = {}
    for (const colName in cfg.columns) {
      if (!cfg.columns.hasOwnProperty(colName)) {
        continue
      }
      const fk = cfg.columns[colName].foreign_key
      if (fk) {
        dependOnMap[fk.split('.')[0]] = 1
      }
    }
    if (cfg.inherit) {
      dependOnMap[cfg.inherit] = 1
    }
    if (cfg.default_acl) {
      dependOnMap['default_acl'] = 1
    }
    return Object.keys(dependOnMap)
  }

  /**
   * Returns common part of the unique key SQL definition
   * @param {string[]} names - column names in the key
   * @returns {string}
   */
  getUniqueKeyDefinition (names) {
    return `CONSTRAINT "${this.getUniqueKeyName(names)}" UNIQUE ("${names.join('", "')}")`
  }

  /**
   * Returns unique key name for the given list of columns
   * @param {string[]} names
   * @returns {string}
   */
  getUniqueKeyName (names) {
    return `${this.name}_${names.join('_')}`
  }

  /**
   * Returns unique key name by its idx
   * @param {number} idx
   * @returns {string}
   */
  getUniqueKeyNameByIdx (idx) {
    return this.getUniqueKeyName(this.uniqueKeys[idx])
  }

  getRowLevelSecurity () {
    return {...this.inherits ? this.inherits.getRowLevelSecurity() : {}, ...this.rowLevelSecurity}
  }

  getChildrenForSql (prop, what, withParent) {
    if (what === 'drop' && withParent) {
      return super.getChildrenForSql(prop)
    }
    switch (prop) {
      case 'triggers': return this.skipTriggers ? {} : this.triggers
      case 'indexes': return this.skipIndexes ? [] : this.indexes
      default: return super.getChildrenForSql(prop)
    }
  }

  getComment() {
    return escapeComment(this.comment)
  }

  /**
   * @inheritDoc
   */
  getCreateSql (withParent) {
    let result = `CREATE TABLE ${this.getParentedName(true)} (\n`
    const tableDef = []
    const foreignKeys = []
    let autoIncSeqColumn
    for (const columnName of Object.keys(this.columns)) {
      const column = this.columns[columnName]
      if (column.isInherited) {
        continue
      }
      tableDef.push(column.getColumnDefinition())
      if (column.isAutoIncrement) {
        autoIncSeqColumn = column
      }
      if (column.foreignKey) {
        foreignKeys.push(column.foreignKey)
      }
    }
    if (this.primaryKey.length > 0) {
      tableDef.push(`CONSTRAINT ${this.name}_pkey PRIMARY KEY ("${this.primaryKey.join('", "')}")`)
    }
    if (this.uniqueKeys.length > 0) {
      for (const names of this.uniqueKeys) {
        tableDef.push(this.getUniqueKeyDefinition(names))
      }
    }
    if (foreignKeys.length > 0) {
      for (const key of foreignKeys) {
        tableDef.push(key.getInlineSql())
      }
    }

    const inherits = this.inherits ? `INHERITS (${this.inherits.getParentedName(true)})` : ''

    result += indent(tableDef, 1).join(",\n") + `\n) ${inherits} WITH (OIDS = FALSE);\n`

    if (this.autoIncSeqRequired) {
      result = `CREATE SEQUENCE ${autoIncSeqColumn.getAutoIncSeqName()} START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;\n${result}`
    }

    if (this.getComment()) {
      result += `COMMENT ON TABLE ${this.getParentedName(true)} IS '${this.getComment()}';\n`
    }

    const rls = this.getRowLevelSecurity()
    if (!this.skipRLS && Object.keys(rls).length > 0) {
      result += `ALTER TABLE ${this.getParentedName(true)} ENABLE ROW LEVEL SECURITY;\n`
      for (const op in rls) {
        if (!rls.hasOwnProperty(op)) {
          continue
        }
        const checkType = op === 'insert' ? 'WITH CHECK' : 'USING'
        result += `CREATE POLICY "${this.getParentedNameFlat()}_acl_check_${op}" ON ${this.getParentedName(true)} FOR ${op.toUpperCase()} ${checkType} (${rls[op]});\n`
      }
    }

    if (!this.skipRLS && this.defaultAcl.length > 0) {
      result += `INSERT INTO ${this._parent.getQuotedName()}."default_acl" ("table", "acl") VALUES ('${this.name}', '${JSON.stringify(this.defaultAcl)}'::json);\n`
    }
    return result
  }

  /**
   * Returns SQL for object update
   * @protected
   * @param {Table} compared
   * @param {object} changes - dot-separated paths to the changed properties with ald and new values (empty if the whole object changed)
   * @returns {string}
   */
  getAlterSql (compared, changes) {
    const result = []
    for (let prop of Object.keys(changes)) {
      prop = parseArrayProp(prop)
      switch (prop.name) {
        case 'uniqueKeys':
          if (changes.old) {
            result.push(`ALTER TABLE ${this.getQuotedName()} DROP CONSTRAINT "${compared.getUniqueKeyNameByIdx(prop.index)}";`)
          }
          if (changes.cur) {
            result.push(`ALTER TABLE ${this.getQuotedName()} ADD ${this.getUniqueKeyDefinition(this.uniqueKeys[prop.index])};`)
          }
      }
    }
    return result.join("\n")
  }
}

export default Table
