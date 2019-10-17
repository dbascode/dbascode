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
import { prepareArgs } from './utils'

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
  omit = []

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
   * @param {string[]} omit
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
      omit = [],
    }
  ) {
    super(name, parent)
    this.foreignKey = foreignKey
    this.type = type
    this.allowNull = allowNull
    this.defaultValue = defaultValue
    this.isAutoIncrement = isAutoIncrement
    this.isInherited = isInherited
    this.isIntl = isIntl
    this.omit = omit
    if (parent) {
      parent.columns[name] = this
    }
  }

  /**
   * Instantiate new object from config data
   * @param {string} name
   * @param {string|Object|null} cfg
   * @param {Table|Type} [parent]
   * @return {Column|null}
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
      omit: isBoolean(config.omit) ? (config.omit ? ['select', 'update', 'insert'] : []) : config.omit,
    }))
    if (config.foreign_key) {
      ForeignKey.createFromCfg(name, config.foreign_key, result)
    }
    return result
  }

  getDefaultValueSql () {
    if (this.defaultValue === null) {
      return 'NULL'
    } else {
      return this.defaultValue
    }
  }

  getCreateSql () {
    return `ALTER TABLE ${this.parent.getParentedName(true)} ADD COLUMN ${this.getColumnDefinition()};\n`
  }

  /**
   * Returns full SQL column definition
   * @returns {string}
   */
  getColumnDefinition() {
    const defaultValue = this.isAutoIncrement ?
        (`DEFAULT nextval('${this.parent.getParentedNameFlat()}_${this.name}_seq'::regclass)`) :
        (this.defaultValue !== undefined ? `DEFAULT ${this.getDefaultValueSql()}` : '')
    const allowNull = this.allowNull && !this.isAutoIncrement ? '' : 'NOT NULL'
    return `${this.getQuotedName()} ${this.type} ${allowNull} ${defaultValue}`
  }

  /**
   *
   * @param {Column} compared
   * @returns {string}
   */
  getAlterSql (compared) {
    return `ALTER TABLE ${this.parent.getParentedName(true)} ALTER COLUMN ${this.getColumnDefinition()};\n`
  }

  getDropSql () {
    return `ALTER TABLE ${this.parent.getParentedName(true)} DROP COLUMN ${this.getQuotedName()};\n`
  }
}

export default Column
