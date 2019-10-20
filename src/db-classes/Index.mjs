/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 12.10.2019
 * Time: 21:17
 */

import AbstractSchemaObject from './AbstractSchemaObject'
import isArray from 'lodash-es/isArray'

class Index extends AbstractSchemaObject {
  colNames = []
  isInherited = false

  /**
   * Constructor
   * @param {string[]} colNames
   * @param {Table} [parent]
   * @param {boolean} isInherited
   */
  constructor (
    {
      colNames,
      parent,
      isInherited = false,
    }
  ) {
    super('', parent)
    this.apply({...arguments[0], _parent: parent})
    delete this.parent
    this.isInherited = isInherited
    this.colNames = colNames
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
      {
        colNames: isArray(colNames) ? colNames : [colNames],
        parent,
      }
    )
    return result.getDb().pluginOnObjectConfigured(result, colNames)
  }

  getCreateSql () {
    return `CREATE INDEX "${this._parent.name}_${this.colNames.join('_')}_idx" ON ${this._parent.getParentedName(true)}("${this.colNames.join('","')}");\n`
  }
}

export default Index
