/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 12.10.2019
 * Time: 21:17
 */

import AbstractSchemaObject from './AbstractSchemaObject'
import isArray from 'lodash-es/isArray'

/**
 * Index in a table
 */
export default class Index extends AbstractSchemaObject {
  colNames = []

  /**
   * @inheritDoc
   */
  applyConfigProperties (config) {
    this.colNames = isArray(config) ? config : [config]
    this.name = `${this.colNames.join('_')}_idx`
  }

  /**
   * @inheritDoc
   */
  getParentRelation (operation) {
    return 'ON'
  }

  /**
   * @inheritDoc
   */
  getSqlDefinition (operation, addSql) {
    return `("${this.colNames.join('","')}")`
  }
}
