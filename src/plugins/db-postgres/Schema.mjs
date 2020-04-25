/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */
import AbstractDbObject from '../../dbascode/AbstractDbObject'
import Type from './Type'
import Function from './Function'
import Table from './Table'
import Sequence from './Sequence'
import ChildDef from '../../dbascode/ChildDef'
import ChildDefCollection from '../../dbascode/ChildDefCollection'
import SqlRules from './SqlRules'

/**
 * Database schema object.
 * @property {Object.<string, Table>} tables
 * @property {Object.<string, Type>} types
 * @property {Object.<string, Function>} functions
 * @property {Object.<string, Sequence>} sequences
 */
export default class Schema extends AbstractDbObject {
  /**
   * @type {typeof SqlRules}
   */
  static sqlRules = SqlRules
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
