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
import { prepareArgs } from './utils'

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
  omit = []
  autoIncSeqRequired = false
  primaryKey = []
  rowLevelSecurity = {}
  inherits = undefined

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
   * @param {String[]} [omit]
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
      omit = false,
      primaryKey = [],
      rowLevelSecurity = {},
    }) {
    super(name, parent)
    this.arrayCollectionProps = ['indexes']
    this.objectCollectionProps = ['columns', 'triggers']
    this.columns = columns
    this.comment = comment
    this.uniqueKeys = uniqueKeys
    this.indexes = indexes
    this.triggers = triggers
    this.isRLS = isRLS
    this.defaultAcl = defaultAcl
    this.rows = rows
    this.omit = omit
    this.primaryKey = primaryKey
    this.rowLevelSecurity = rowLevelSecurity
    this.inherits = inherits
    if (parent) {
      parent.tables[name] = this
    }
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
      omit: isBoolean(cfg.omit) ? (cfg.omit ? ['select', 'update', 'insert'] : []) : cfg.omit,
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

    return result
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

  getCreateSql () {
    let result = `CREATE TABLE ${this.getParentedName(true)} (\n`
    const tableDef = []
    const foreignKeys = []
    const colComments = []
    for (const columnName of Object.keys(this.columns)) {
      const column = this.columns[columnName]
      tableDef.push(column.getCreateSql())
      if (column.isAutoIncrement) {
        this.autoIncSeqRequired = columnName
        this.primaryKey = [columnName]
      }
      if (column.foreignKey) {
        foreignKeys.push(column.foreignKey)
      }
      if (column.comment || column.omit.length > 0) {
        const text = []
        if (column.comment) {
          text.push(column.comment)
        }
        if (column.omit.length > 0) {
          text.push(`@omit ${column.omit.join(',')}`)
        }
        colComments.push(`COMMENT ON COLUMN ${this.getParentedName(true)}.${column.getQuotedName()} IS '${this.escapeComment(text.join("\n"))}';`)
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
        tableDef.push(key.getColumnDefinition())
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

    if (this.comment || this.omit.length > 0) {
      const text = []
      if (this.comment) {
        text.push(this.comment)
      }
      if (this.omit.length > 0) {
        text.push(`@omit ${this.omit.join(',')}`)
      }
      result += `COMMENT ON TABLE ${this.getParentedName()} IS '${this.escapeComment(text.join("\n"))}';\n`
    }
    if (colComments.length > 0) {
      result += colComments.join("\n") + "\n"
    }

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
      result += `INSERT INTO ${this.parent.getQuotedName()}."default_acl" ("table", "acl") VALUES ('${this.name}', '${JSON.stringify(this.defaultAcl)}'::json);\n`
    }
    return result + "\n\n"
  }

  escapeComment (text) {
    return text.split("'").join("''")
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
    for (const column in Object.values(this.columns)) {
      const compColumn = compared.columns
      if (compColumn) {

      }
    }
    return result.join("\n") + "\n"
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
