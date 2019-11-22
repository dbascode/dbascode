/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 12.10.2019
 * Time: 21:17
 */

import AbstractSchemaObject from './AbstractSchemaObject'
import PropDefCollection from './PropDefCollection'
import PropDef from './PropDef'

/**
 * Index in a table
 * @property {string[]} columns
 */
export default class Index extends AbstractSchemaObject {

  static propDefs = new PropDefCollection([
    new PropDef('columns', { type: PropDef.array, isDefault: true }),
    ...this.propDefs.defs,
  ])

  /**
   * @inheritDoc
   */
  applyConfigProperties (config) {
    super.applyConfigProperties(config)
    this.name = `${this.getParent().name}_${this.columns.join('_')}_idx`
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
    return `("${this.columns.join('","')}")`
  }
}
