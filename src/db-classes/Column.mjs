/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 07.10.2019
 * Time: 15:53
 */

import isBoolean from 'lodash-es/isBoolean'
import AbstractSchemaObject from './AbstractSchemaObject'
import isString from 'lodash-es/isString'
import ForeignKey from './ForeignKey'
import { escapeComment, prepareArgs } from './utils'

/**
 *
 */
class Column extends AbstractSchemaObject {
  type
  foreignKey = undefined
  allowNull = false
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
   * @param {boolean} isIntl
   */
  constructor (
    {
      name,
      parent,
      type,
      allowNull = false,
      defaultValue= undefined,
      isAutoIncrement = false,
      isInherited = false,
      foreignKey = undefined,
      isIntl = false,
    }
  ) {
    super(name, parent)
    this.apply({...arguments[0], _parent: parent})
    delete this.parent
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
  static createFromCfg(name, cfg, parent) {
    if (!cfg) {
      return null
    }
    const config = isString(cfg) ? {type: cfg} : cfg
    const result = new Column(prepareArgs(parent, {
      name,
      parent,
      type: config.type,
      allowNull: !!config.allow_null,
      isIntl: !!config.intl,
      isAutoIncrement: !!config.autoincrement,
      defaultValue: config.default,
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

  getCreateSql (withParent) {
    const result = []
    if (!withParent && !this.isInherited) {
      if (!this.getAllowNull() && !this.isAutoIncrement && this.defaultValue === undefined) {
        throw new Error(`Can not add not null value without default value`)
      }
      result.push(`ALTER TABLE ${this._parent.getParentedName(true)} ADD COLUMN ${this.getColumnDefinition()};\n`)
    }
    if (this.getComment()) {
      result.push(`COMMENT ON COLUMN ${this._parent.getParentedName(true)}.${this.getQuotedName()} IS '${this.getComment()}';\n`)
    }
    return result.join('')
  }

  /**
   * Returns full SQL column definition
   * @returns {string}
   */
  getColumnDefinition() {
    const defaultValue = this.isAutoIncrement ?
        (`DEFAULT nextval('${this._parent.getParentedNameFlat()}_${this.name}_seq'::regclass)`) :
        (this.defaultValue !== undefined ? `DEFAULT ${this.getDefaultValueSql()}` : '')
    const allowNull = this.getAllowNull() ? '' : 'NOT NULL'
    return `${this.getQuotedName()} ${this.getType()} ${allowNull} ${defaultValue}`
  }

  getComment() {
    return escapeComment(this.comment)
  }

  getType() {
    return this.type
  }

  getAllowNull() {
    return this.isAutoIncrement ? false : this.allowNull || this.defaultValue === null
  }

  /**
   *
   * @param {Column} compared
   * @returns {string}
   */
  getAlterSql (compared) {
    const result = []
    if (!this.isInherited && this.type !== compared.type) {
      result.push(
        `ALTER TABLE ${this._parent.getParentedName(true)} ALTER COLUMN ${this.getQuotedName()} TYPE ${this.getType()};\n`
      )
    }
    if (!this.isInherited && this.allowNull !== compared.allowNull) {
      result.push(
        `ALTER TABLE ${this._parent.getParentedName(true)} ALTER COLUMN ${this.getQuotedName()} ${this.getAllowNull() ? 'DROP NOT NULL' : 'SET NOT NULL'};\n`
      )
    }
    if (!this.isInherited && this.isAutoIncrement !== compared.isAutoIncrement) {
      const dv = this.getDefaultValueSql()
      result.push(
        `ALTER TABLE ${this._parent.getParentedName(true)} ALTER COLUMN ${this.getQuotedName()} ${dv ? `SET DEFAULT ${dv}` : 'DROP DEFAULT'};\n`
      )
    }
    if (!this.isInherited && this.defaultValue !== compared.defaultValue) {
      const dv = this.getDefaultValueSql()
      result.push(
        `ALTER TABLE ${this._parent.getParentedName(true)} ALTER COLUMN ${this.getQuotedName()} ${dv ? `SET DEFAULT ${dv}` : 'DROP DEFAULT'};\n`
      )
    }
    if (this.getComment() !== compared.getComment()) {
      result.push(`COMMENT ON COLUMN ${this._parent.getParentedName(true)}.${this.getQuotedName()} IS '${this.getComment()}';\n`)
    }
    return result.join()
  }

  getDropSql (withParent) {
    if (!this.isInherited) {
      return `ALTER TABLE ${this._parent.getParentedName(true)} DROP COLUMN ${this.getQuotedName()};\n`
    } else {
      return ''
    }
  }
}

export default Column
