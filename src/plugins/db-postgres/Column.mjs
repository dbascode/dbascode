/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */

import AbstractSchemaObject from './AbstractSchemaObject'
import isObject from 'lodash-es/isObject'
import Sequence from './Sequence'
import PrimaryKey from './PrimaryKey'
import ForeignKey from './ForeignKey'
import PropDefCollection from '../../dbascode/PropDefCollection'
import PropDef from '../../dbascode/PropDef'
import {
  builtinIntegerTypes,
  builtinNumericTypes,
  builtinOtherTypes,
  builtinTextTypes,
  isType,
  parseTypedef,
  stringifyTypeDef
} from './utils'

/**
 * Column in a table
 * @property {ArgumentTypeDef} type
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
    new PropDef('type', {
      type: PropDef.map,
      isDefault: true,
      normalize: (obj, value) => {
        return parseTypedef(value)
      },
    }),
    new PropDef('foreignKey'),
    new PropDef('allowNull', { type: PropDef.bool }),
    new PropDef('defaultValue', {
      type: PropDef.map,
      allowNull: true,
      configName: 'default',
      defaultValue: null,
      normalize: (obj, value) => {
        if (value === 'undefined') {
          value = undefined
        }
        const def = isObject(value) ? value : { value, raw: false }
        if (def.raw) {
          return def.value === 'undefined' ? undefined : def.value
        } else {
          if (obj.isTextual()) {
            return obj.sql.escapeString(def.value)
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
  postprocessTree (isNew) {
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
          grant: table.grant,
          revoke: table.revoke,
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
    return `${this.getSqlType()} ${allowNull} ${defaultValue}`.trim()
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
    return `${this.getSchema().sql.getEscapedName()}."${this.getParent().name}_${this.name}_seq"`
  }

  /**
   * Returns field type
   * @returns {string}
   */
  getSqlType () {
    return stringifyTypeDef(this.type)
  }

  /**
   * Calculates whether NULL is allowed as the field value
   * @returns {boolean}
   */
  getAllowNull () {
    return this.isAutoIncrement ? false : (this.allowNull || this.defaultValue === null)
  }

  /**
   * @inheritDoc
   */
  getAlterPropSql (compared, propName, oldValue, curValue, context) {
    if (!this._isInherited) {
      switch (propName) {
        case 'allowNull':
          return this.allowNull ? 'DROP NOT NULL' : 'SET NOT NULL'
        case 'defaultValue':
        case 'isAutoIncrement':
          const dv = this.getDefaultValueSql()
          return dv ? `SET DEFAULT ${dv}` : 'DROP DEFAULT'
        case 'type':
          return `TYPE ${this.getSqlType()}`
      }
    }
    return super.getAlterPropSql(compared, propName, oldValue, curValue, context)
  }

  /**
   * Is this field a text one
   * @returns {boolean}
   */
  isTextual () {
    return isType(builtinTextTypes, this.type)
  }

  /**
   * Is this field a numeric one
   * @returns {boolean}
   */
  isNumeric () {
    return isType(builtinNumericTypes, this.type)
  }

  /**
   * @inheritDoc
   */
  setupDependencies () {
    super.setupDependencies()
    if (this.type.schema) {
      this._dependencies.push(this.getDb().findChildBySqlTypeDef(this.type).getPath())
    }
  }

  /**
   * @inheritDoc
   * @param {Column} previous
   */
  validate (previous, context) {
    if (this.isAutoIncrement && (this.type.schema || !isType(builtinIntegerTypes, this.type.type))) {
      context.addError(this, `Autoincrement values are only allowed on integer fields, ${stringifyTypeDef(this.type)} specified`)
    }
    if (this.type.schema) {
      const schema = this.getDb().getSchema(this.type.schema)
      if (schema) {
        const type = schema.types[this.type.type]
        if (!type) {
          context.addError(this, `Unknown column type: ${stringifyTypeDef(this.type)} - type ${this.type.type} not found in schema ${this.type.schema}`)
        }
      } else {
        context.addError(this, `Unknown column type: ${stringifyTypeDef(this.type)} - schema ${this.type.schema} not found`)
      }
    } else {
      if (!this.isNumeric() && !this.isTextual() && !isType(builtinOtherTypes, this.type)) {
        context.addError(this, `Unknown column type: ${this.type}`)
      }
      if (previous) {
        // Check column alteration
        if (!this.allowNull && this.defaultValue === null && this.allowNull !== previous.allowNull || this.defaultValue !== previous.defaultValue) {
          context.addError(this, `Default value other than NULL must be defined for non-null column`)
        }
      } else {
        // Check new column
        const isNewTable = (!context.prevTree || !context.prevTree.getChildByPath(this.getParent().getPath()))
        if (!isNewTable && (this.allowNull === false && this.defaultValue === undefined)) {
          context.addError(this, `Can not add non-null column without default default value to an existing table`)
        }
      }
    }
    super.validate(previous, context)
  }
}
