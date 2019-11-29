/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 07.10.2019
 * Time: 16:30
 */

import AbstractSchemaObject from '../db/postgresql/AbstractSchemaObject'
import isUndefined from 'lodash-es/isUndefined'
import isObject from 'lodash-es/isObject'
import { lookupClosestLocale } from '../../dbascode/utils'

/**
 * Initial rows in a table
 */
export default class Rows extends AbstractSchemaObject {
  rows = []

  static configName = 'rows'
  static droppedByParent = true

  /**
   * @inheritDoc
   */
  applyConfigProperties (config) {
    this.rows = config
  }

  /**
   * @inheritDoc
   */
  getCreateSql () {
    const sqlValues = []
    const table = this.getParent()
    const columns = table.columns
    const colNames = Object.keys(columns)
    for (const row of this.rows) {
      const values = []
      for (const column of Object.values(columns)) {
        const value = row[column.name]
        if (isUndefined(value)) {
          if (column.allowNull) {
            values.push('NULL')
          } else {
            if (column.isTextual()) {
              values.push("''")
            } else if (column.isNumeric()) {
              values.push('0')
            } else {
              throw new Error(`Can not set default value for field ${column.getObjectIdentifier('comment')}`)
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
            throw new Error(`Don't know how to format value for field ${column.getObjectIdentifier('comment')}`)
          }
        }
      }
      sqlValues.push(`(${values.join(', ')})`)
    }
    return `INSERT INTO ${table.getObjectIdentifier('insert')} ("${colNames.join('", "')}") VALUES\n${sqlValues.join(",\n")};`
  }

  isFieldText (type) {
    return type.toLowerCase().indexOf('text') >= 0
  }

  isFieldNumeric (type) {
    return (type.toLowerCase().indexOf('int') >= 0) ||
      (type.toLowerCase().indexOf('numeric') >= 0)
  }

}
