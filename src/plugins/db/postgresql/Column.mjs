/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 07.10.2019
 * Time: 15:53
 */

import { escapeString } from '../../../dbascode/db-utils'
import AbstractSchemaObject from './AbstractSchemaObject'
import isObject from 'lodash-es/isObject'
import Sequence from './Sequence'
import PrimaryKey from './PrimaryKey'
import ForeignKey from './ForeignKey'
import PropDefCollection from '../../../dbascode/PropDefCollection'
import PropDef from '../../../dbascode/PropDef'

/**
 * Column in a table
 * @property {string} type
 * @property {string} foreignKey
 * @property {boolean} allowNull
 * @property {string|null} defaultValue
 * @property {boolean} isAutoIncrement
 */
export default class Column extends AbstractSchemaObject {

  static createdByParent = true
  static droppedByParent = true
  static alterWithParent = true

  static propDefs = new PropDefCollection([
    new PropDef('type', { isDefault: true }),
    new PropDef('foreignKey'),
    new PropDef('allowNull', { type: PropDef.bool }),
    new PropDef('defaultValue', {
      allowNull: true,
      configName: 'default',
      defaultValue: null,
      normalize: (obj, value) => {
        const def = isObject(value) ? value : { value, raw: false }
        if (def.raw) {
          return def.value
        } else {
          if (isTextual(obj.type)) {
            return escapeString(def.value)
          } else {
            return def.value
          }
        }
      }
    }),
    new PropDef('isAutoIncrement', { type: PropDef.bool, configName: 'autoincrement'}),
    ...this.propDefs.defs,
  ])

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
    return operation === 'comment' ? '.' : 'ON'
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
    if (!this._isInherited) {
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
