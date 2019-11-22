/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 11.10.2019
 * Time: 16:25
 */
import AbstractDbObject from './AbstractDbObject'
import Type from './Type'
import Function from './Function'
import Table from './Table'
import Sequence from './Sequence'
import ChildDef from './ChildDef'
import ChildDefCollection from './ChildDefCollection'

/**
 * Database schema object.
 * @property {Table[]} tables
 * @property {Type[]} types
 * @property {Function[]} functions
 * @property {Sequence[]} sequences
 */
export default class Schema extends AbstractDbObject {
  /**
   * @type {ChildDefCollection}
   */
  static childrenDefs = new ChildDefCollection([
    new ChildDef(Type),
    new ChildDef(Function),
    new ChildDef(Sequence),
    new ChildDef(Table),
  ])

  /**
   * Check table exists by name.
   * @param name
   * @returns {boolean}
   */
  tableExists(name) {
    return !!this.tables[name]
  }

  /**
   * Returns table by name
   * @param name
   * @returns {*}
   */
  getTable(name) {
    return this.tables[name]
  }

  /**
   * @inheritDoc
   */
  getCalculators () {
    return {
      schemaName: this.name,
    }
  }
}
