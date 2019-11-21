/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 07.10.2019
 * Time: 15:53
 */

import { escapeString } from './db-utils'
import AbstractSchemaObject from './AbstractSchemaObject'
import isString from 'lodash-es/isString'
import isObject from 'lodash-es/isObject'
import Sequence from './Sequence'
import PrimaryKey from './PrimaryKey'
import ForeignKey from './ForeignKey'

/**
 * Column in a table
 */
export default class Column extends AbstractSchemaObject {
  type
  foreignKey
  allowNull = false
  defaultValue
  isAutoIncrement = false

  /**
   * @typedef ColumnConfig
   * @property {boolean} allow_null
   * @property {*} default
   * @property {boolean} autoincrement
   * /
  /**
   *
   * @type {ColumnConfig}
   */
  applyConfigProperties (config) {
    const cfg = isString(config) ? { type: config } : config
    let defaultValue
    if (cfg.default) {
      const def = isObject(cfg.default) ? cfg.default : {value: cfg.default, raw: false}
      if (def.raw) {
        defaultValue = def.value
      } else {
        if (isTextual(cfg.type)) {
          defaultValue = escapeString(def.value)
        } else {
          defaultValue = def.value
        }
      }
    }
    this.type = cfg.type
    this.allowNull = !!cfg.allow_null
    this.isAutoIncrement = !!cfg.autoincrement
    this.defaultValue = defaultValue
    this.foreignKey = cfg.foreign_key
  }

  /**
   * @inheritDoc
   */
  postprocessTree () {
    if (this.isAutoIncrement) {
      // Implicitly create autoincrement sequence for the parent table and make this
      // column primary key.
      const table = this.getParent()
      const tableName = table.name
      const seqName = `${tableName}_${this.name}_seq`
      const schema = this.getSchema()
      const seqDef = schema.getChildrenDefCollection().getDefByClass(Sequence)
      if (!schema.findChildByDefAndName(seqDef, seqName)) {
        const tableConfig = {}
        const schemaConfig = {}
        const pkDef = table.getChildrenDefCollection().getDefByClass(PrimaryKey)
        table.getChildrenDefCollection().initConfig(tableConfig)
        schema.getChildrenDefCollection().initConfig(schemaConfig)
        schemaConfig[seqDef.configPropName][seqName] = {
          table: tableName,
          column: this.name,
        }
        tableConfig[pkDef.configPropName] = {
          columns: this.name,
        }
        schema.createChildrenFromConfig(schemaConfig, false)
        table.createChildrenFromConfig(tableConfig, false)
      }
    } else if (this.foreignKey) {
      // Implicitly add foreign keys to the table if this column has the foreign_key config value.
      const table = this.getParent()
      const config = {}
      const fkDef = table.getChildrenDefCollection().getDefByClass(ForeignKey)
      table.getChildrenDefCollection().initConfig(config)
      config[fkDef.configPropName].push({
        column: this.name,
        ref: this.foreignKey,
      })
      table.createChildrenFromConfig(config, false)
    }
  }

  /**
   * Returns SQL for default value definition
   * @return {string}
   */
  getDefaultValueSql () {
    if (this.defaultValue === null) {
      return 'NULL'
    } else {
      return this.defaultValue
    }
  }

  /**
   * @inheritDoc
   */
  getParentRelation (operation) {
    return '.'
  }

  /**
   * @inheritDoc
   */
  getSqlDefinition (operation, addSql) {
    const defaultValue = this.isAutoIncrement ?
      (`DEFAULT nextval('${this.getAutoIncSeqName()}'::regclass)`) :
      (this.defaultValue !== undefined ? `DEFAULT ${this.getDefaultValueSql()}` : '')
    const allowNull = this.getAllowNull() ? '' : 'NOT NULL'
    return `${this.getType()} ${allowNull} ${defaultValue}`.trim()
  }

  /**
   * @inheritDoc
   */
  getObjectClass (operation) {
    return operation === 'create' ? '' : super.getObjectClass(operation)
  }

  /**
   * Returns full name of autoincrement sequence for this column
   * @returns {string}
   */
  getAutoIncSeqName () {
    return `${this.getSchema().getQuotedName()}."${this.getParent().name}_${this.name}_seq"`
  }

  getType () {
    return this.type
  }

  getAllowNull () {
    return this.isAutoIncrement ? false : this.allowNull || this.defaultValue === null
  }

  /**
   * @inheritDoc
   */
  getAlterPropSql (compared, propName, oldValue, curValue) {
    if (!this.isInherited) {
      switch (propName) {
        case 'allowNull':
          return this.allowNull ? 'DROP NOT NULL' : 'SET NOT NULL'
        case 'defaultValue':
        case 'isAutoIncrement':
          const dv = this.getDefaultValueSql()
          return dv ? `SET DEFAULT ${dv}` : 'DROP DEFAULT'
        case 'type':
          return `TYPE ${this.getType()}`
      }
    }
    return undefined
  }

  isTextual () {
    return isTextual(this.type)
  }

  isNumeric () {
    return (this.type.toLowerCase().indexOf('int') >= 0) ||
      (this.type.toLowerCase().indexOf('numeric') >= 0)
  }
}

function isTextual (type) {
  return type.toLowerCase().indexOf('text') >= 0
}
