import AbstractSchemaObject from './AbstractSchemaObject'
import PropDefCollection from '../../dbascode/PropDefCollection'
import PropDef from '../../dbascode/PropDef'

/**
 * Autoincrement sequence class
 * @property {string} table
 * @property {string} column
 */
export default class Sequence extends AbstractSchemaObject{

  static propDefs = new PropDefCollection([
    new PropDef('table'),
    new PropDef('column'),
    ...this.propDefs.defs,
  ])

  static fullAlter = true

  /**
   * @inheritDoc
   */
  applyConfigProperties (config) {
    super.applyConfigProperties(config)
    this.name = `${this.table}_${this.column}_seq`
  }

  /**
   * @inheritDoc
   */
  getSqlDefinition (operation) {
    return `START WITH 1 INCREMENT BY 1 NO MINVALUE NO MAXVALUE CACHE 1`
  }
}
