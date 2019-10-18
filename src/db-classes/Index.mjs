/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 12.10.2019
 * Time: 21:17
 */

import AbstractSchemaObject from './AbstractSchemaObject'
import isArray from 'lodash-es/isArray'

class Index extends AbstractSchemaObject {
  colNames

  /**
   * Constructor
   * @param {string[]} colNames
   * @param {Table} [parent]
   */
  constructor (
    colNames,
    parent
  ) {
    super('', parent)
    this.colNames = colNames
    this.parent = parent
  }

  /**
   * Instantiate new object from config data
   * @param {string|string[]} colNames
   * @param {Table} [parent]
   * @return {Index}
   */
  static createFromCfg(colNames, parent) {
    if (!colNames) {
      return null
    }
    const result = new Index(
      isArray(colNames) ? colNames : [colNames],
      parent,
    )
    return result.getDb().pluginOnObjectConfigured(result, colNames)
  }

  getCreateSql () {
    return `CREATE INDEX "${this.parent.name}_${this.colNames.join('_')}_idx" ON ${this.parent.getParentedName()}("${this.colNames.join('","')}");\n`
  }
}

export default Index
