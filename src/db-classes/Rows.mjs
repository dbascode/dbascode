/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 07.10.2019
 * Time: 16:30
 */

import isUndefined from 'lodash-es/isUndefined'
import isObject from 'lodash-es/isObject'
import { lookupClosestLocale } from '../utils'
import AbstractSchemaObject from './AbstractSchemaObject'

/**
 * Initial rows in a table
 */
class Rows extends AbstractSchemaObject {
  rows
  _isMultiple = true

  /**
   * Constructor
   * @param {Object[]} rows
   * @param {Table} [parent]
   */
  constructor (
    rows,
    parent = undefined
  ) {
    super('', parent)
    this.rows = rows
  }

  /**
   * Instantiate new object from config data
   * @param {Array|null} rows
   * @param {Table} [parent]
   * @return {Rows|null}
   */
  static createFromCfg(rows, parent) {
    if (!rows) {
      return null
    }
    const result = new Rows(
      rows,
      parent,
    )
    return result.getDb().pluginOnObjectConfigured(result, rows)
  }

  getCreateSql () {
    const sqlValues = []
    const columns = this._parent.getAllColumns()
    const colNames = Object.keys(columns)
    for (const row of this.rows) {
      const values = []
      for (const column of Object.values(columns)) {
        const value = row[column.name]
        if (isUndefined(value)) {
          if (column.allowNull) {
            values.push('NULL')
          } else {
            if (this.isFieldText(column.type)) {
              values.push("''")
            } else if (this.isFieldNumeric(column.type)) {
              values.push('0')
            } else {
              throw new Error(`Can not set default value for field ${this._parent.getParentedName()}.${column.name}`)
            }
          }
        } else {
          if (this.isFieldText(column.type)) {
            if (isObject(value)) {
              // Intl string
              const closestLocale = lookupClosestLocale(this.getDb().defaultLocale, value)
              values.push(`'${value[closestLocale ? closestLocale : 'default']}'`)
            } else {
              values.push(`'${value}'`)
            }
          } else if (this.isFieldNumeric(column.type)) {
            values.push(value)
          } else {
            throw new Error(`Don't know how to format value for field ${this._parent.getParentedName()}.${column.name}`)
          }
        }
      }
      sqlValues.push(`(${values.join(', ')})`)
    }
    return `INSERT INTO ${this._parent.getParentedName(true)} ("${colNames.join('", "')}") VALUES\n${sqlValues.join(",\n")};\n`
  }

  isFieldText (type) {
    return type.toLowerCase().indexOf('text') >= 0
  }

  isFieldNumeric (type) {
    return (type.toLowerCase().indexOf('int') >= 0) ||
      (type.toLowerCase().indexOf('numeric') >= 0)
  }

}

export default Rows
