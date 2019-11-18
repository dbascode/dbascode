/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 07.10.2019
 * Time: 15:53
 */

import AbstractSchemaObject from './AbstractSchemaObject'
import isString from 'lodash-es/isString'
import ForeignKey from './ForeignKey'
import { escapeString, prepareArgs } from './utils'
import isObject from 'lodash-es/isObject'

/**
 *
 */
class Column extends AbstractSchemaObject {
  type
  foreignKey = undefined
  allowNull = false
  /**
   * Raw default value
   * @type {*}
   */
  defaultValue = undefined
  isAutoIncrement = false
  isInherited = false
  isIntl = false
  _childrenProps = ['foreignKey']

  /**
   * Constructor
   * @param {string} name
   * @param {Table|Type|null} parent
   * @param {string} type
   * @param {boolean} [allowNull]
   * @param {string} [defaultValue]
   * @param {boolean} [isAutoIncrement]
   * @param {boolean} [isInherited]
   * @param {ForeignKey} [foreignKey]
   * @param {boolean} [isIntl]
   * @param {string} [comment]
   */
  constructor (
    {
      name,
      parent,
      type,
      allowNull = false,
      defaultValue = undefined,
      isAutoIncrement = false,
      isInherited = false,
      foreignKey = undefined,
      isIntl = false,
      comment = '',
    }
  ) {
    super({
      name,
      parent,
      comment,
      droppedByParent: true,
      createdByParent: true,
      alterWithParent: true,
    })
    this.foreignKey = foreignKey
    this.type = type
    this.allowNull = allowNull
    this.defaultValue = defaultValue
    this.isAutoIncrement = isAutoIncrement
    this.isInherited = isInherited
    this.isIntl = isIntl
  }

  /**
   * Instantiate new object from config data
   * @param {string} name
   * @param {string|Object|null} cfg
   * @param {Table|Type} [parent]
   * @return {AbstractDbObject}
   */
  static createFromCfg (name, cfg, parent) {
    if (!cfg) {
      return null
    }
    const config = isString(cfg) ? { type: cfg } : cfg
    let defaultValue
    if (config.default) {
      const def = isObject(config.default) ? config.default : {value: config.default, raw: false}
      if (def.raw) {
        defaultValue = def.value
      } else {
        if (isTextual(config.type)) {
          defaultValue = escapeString(def.value)
        } else {
          defaultValue = def.value
        }
      }
    }
    const result = new Column(prepareArgs(parent, {
      name,
      parent,
      type: config.type,
      allowNull: !!config.allow_null,
      isIntl: !!config.intl,
      isAutoIncrement: !!config.autoincrement,
      defaultValue,
      comment: cfg.comment,
    }))
    if (config.foreign_key) {
      ForeignKey.createFromCfg(name, config.foreign_key, result)
    }
    return result.getDb().pluginOnObjectConfigured(result, config)
  }

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
  getParentRelation () {
    return '.'
  }

  /**
   * @inheritDoc
   */
  getDefinition (operation, addSql) {
    const defaultValue = this.isAutoIncrement ?
      (`DEFAULT nextval('${this.getAutoIncSeqName()}'::regclass)`) :
      (this.defaultValue !== undefined ? `DEFAULT ${this.getDefaultValueSql()}` : '')
    const allowNull = this.getAllowNull() ? '' : 'NOT NULL'
    return `${this.getType()} ${allowNull} ${defaultValue}`.trim()
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

export default Column
