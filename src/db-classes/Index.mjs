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
    super({
      name: `${colNames.join('_')}_idx`,
      parent,
      droppedByParent: true,
      fullAlter: true,
    })
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

  /**
   * @inheritDoc
   */
  getParentRelation () {
    return 'ON'
  }

  /**
   * @inheritDoc
   */
  getDefinition (operation, addSql) {
    return `("${this.colNames.join('","')}")`
  }
}

export default Index
