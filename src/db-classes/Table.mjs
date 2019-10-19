/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 07.10.2019
 * Time: 15:23
 */

import isArray from 'lodash-es/isArray'
import { indent } from '../utils'
import isBoolean from 'lodash-es/isBoolean'
import Column from './Column'
import Rows from './Rows'
import Trigger from './Trigger'
import Index from './Index'
import AbstractSchemaObject from './AbstractSchemaObject'
import isString from 'lodash-es/isString'
import { escapeComment, prepareArgs } from './utils'

/**
 *
 */
class Table extends AbstractSchemaObject {
  columns = []
  comment
  uniqueKeys = []
  indexes = []
  triggers = []
  isRLS = false
  defaultAcl = []
  rows = undefined
  autoIncSeqRequired = false
  primaryKey = []
  rowLevelSecurity = {}
  inherits = undefined
  _childrenProps = ['columns', 'indexes', 'triggers', 'rows']

  /**
   * Constructor
   * @param {string} name
   * @param {Object.<string, Column>} columns
   * @param {string} comment
   * @param {string[][]} uniqueKeys
   * @param {Index[]} indexes
   * @param {Object.<string, Trigger>} triggers
   * @param {boolean} isRLS
   * @param {array} defaultAcl
   * @param {Rows} [rows]
   * @param {Table} [inherits]
   * @param {Schema} [parent]
   * @param {string[]} [primaryKey]
   * @param {ForeignKey[]} [foreignKeys]
   * @param {Object.<string, string>} [rowLevelSecurity]
   */
  constructor (
    {
      name,
      columns = {},
      comment,
      uniqueKeys = [],
      indexes = [],
      triggers = {},
      isRLS = false,
      defaultAcl = [],
      rows = undefined,
      inherits = undefined,
      parent = undefined,
      primaryKey = [],
      rowLevelSecurity = {},
    }) {
    super(name, parent)
    this.columns = columns
    this.comment = comment
    this.uniqueKeys = uniqueKeys
    this.indexes = indexes
    this.triggers = triggers
    this.isRLS = isRLS
    this.defaultAcl = defaultAcl
    this.rows = rows
    this.primaryKey = primaryKey
    this.rowLevelSecurity = rowLevelSecurity
    this.inherits = inherits
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
    const result = new Table(prepareArgs(parent, {
      name,
      parent,
      inherits: inherits,
      comment: cfg.comment,
      primaryKey: isString(cfg.primary_key) ? [cfg.primary_key] : (cfg.primary_key || []),
      defaultAcl: cfg.default_acl,
    }))
    for (const name of Object.keys(cfg.columns || {})) {
      const column = Column.createFromCfg(name, cfg.columns[name], result)
      if (column.isAutoIncrement) {
        result.autoIncSeqRequired = true
        result.primaryKey = [column.name]
      }
    }
    for (const name of Object.keys(cfg.triggers || {})) {
      Trigger.createFromCfg(name, cfg.triggers[name], result)
    }
    for (const indexDef of cfg.indexes || []) {
      Index.createFromCfg(indexDef, result)
    }
    for (const indexDef of cfg.unique_keys || []) {
      result.uniqueKeys.push(isArray(indexDef) ? indexDef : [indexDef])
    }
    for (const op of Object.keys(cfg.row_level_security || {})) {
      result.rowLevelSecurity[op] = cfg.row_level_security[op]
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

  getCreateSql (withParent) {
    let result = `CREATE TABLE ${this.getParentedName(true)} (\n`
    const tableDef = []
    const foreignKeys = []
    for (const columnName of Object.keys(this.columns)) {
      const column = this.columns[columnName]
      tableDef.push(column.getColumnDefinition())
      if (column.isAutoIncrement) {
        this.autoIncSeqRequired = columnName
        this.primaryKey = [columnName]
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
        tableDef.push(`CONSTRAINT "${this.name}_${names.join('_')}" UNIQUE ("${names.join('", "')}")`)
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
      result = `CREATE SEQUENCE ${this.getParentedNameFlat()}_${this.autoIncSeqRequired}_seq START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1;\n${result}`
    }

    if (this.rows) {
      result += this.rows.getCreateSql()
    }

    result += `COMMENT ON TABLE ${this.getParentedName(true)} IS '${this.getComment()}';\n`

    if (this.isRLS) {
      const rls = this.rowLevelSecurity
      result += `ALTER TABLE ${this.getParentedName(true)} ENABLE ROW LEVEL SECURITY;\n`
      for (const op in rls) {
        if (!rls.hasOwnProperty(op)) {
          continue
        }
        const checkType = op === 'insert' ? 'WITH CHECK' : 'USING'
        result += `CREATE POLICY "${this.getParentedNameFlat()}_acl_check_${op}" ON ${this.getParentedName(true)} FOR ${op.toUpperCase()} ${checkType} (${rls[op]});\n`
      }
    }

    if (this.defaultAcl.length > 0) {
      result += `INSERT INTO ${this._parent.getQuotedName()}."default_acl" ("table", "acl") VALUES ('${this.name}', '${JSON.stringify(this.defaultAcl)}'::json);\n`
    }
    return result
  }

  getComment() {
    return escapeComment(this.comment)
  }

  getDropSql () {
    return `DROP TABLE "${this.name}";\n`
  }

  /**
   *
   * @param {Table} compared
   * @returns {string}
   */
  getAlterSql (compared) {
    const result = []
    return result.join()
  }

  /**
   * Returns all columns including inherited
   * @returns {Object.<string, Column>}
   */
  getAllColumns () {
    return this.inherits ? {...this.inherits.getAllColumns(), ...this.columns} : {...this.columns}
  }
}

export default Table
