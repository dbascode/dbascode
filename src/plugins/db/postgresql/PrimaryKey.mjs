/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 16.11.2019
 * Time: 12:26
 */

import AbstractSchemaObject from './AbstractSchemaObject'
import PropDefCollection from '../../../dbascode/PropDefCollection'
import PropDef from '../../../dbascode/PropDef'

/**
 * Table primary key object
 * @property {string[]} columns
 */
export default class PrimaryKey extends AbstractSchemaObject {
  static propDefs = new PropDefCollection([
    new PropDef('columns', { type: PropDef.array, isDefault: true }),
    ...this.propDefs.defs,
  ])

  static createdByParent = true
  static droppedByParent = true
  static alterWithParent = true

  /**
   * @inheritDoc
   */
  applyConfigProperties (config) {
    super.applyConfigProperties(config)
    this.name = `${this.getParent().name}_pkey`
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
  getObjectClass (operation) {
    return 'CONSTRAINT'
  }

  /**
   * @inheritDoc
   */
  getSqlDefinition (operation, addSql) {
    return `PRIMARY KEY ("${this.columns.join('", "')}")`
  }
}
