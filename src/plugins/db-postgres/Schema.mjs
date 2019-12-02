/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 11.10.2019
 * Time: 16:25
 */
import AbstractDbObject from '../../dbascode/AbstractDbObject'
import Type from './Type'
import Function from './Function'
import Table from './Table'
import Sequence from './Sequence'
import ChildDef from '../../dbascode/ChildDef'
import ChildDefCollection from '../../dbascode/ChildDefCollection'

/**
 * Database schema object.
 * @property {Object.<string, Table>} tables
 * @property {Object.<string, Type>} types
 * @property {Object.<string, Function>} functions
 * @property {Object.<string, Sequence>} sequences
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
