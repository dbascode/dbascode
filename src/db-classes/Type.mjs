/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 11.10.2019
 * Time: 16:25
 */
import AbstractSchemaObject from './AbstractSchemaObject'
import Attribute from './Attribute'
import ChildDefCollection from './ChildDefCollection'
import ChildDef from './ChildDef'
import PropDefCollection from './PropDefCollection'
import PropDef from './PropDef'

/**
 * DB Type object
 * @property {Object.<string, Attribute>} attributes
 * @property {boolean} isEnum
 * @property {string[]} values
 */
export default class Type extends AbstractSchemaObject {

  static propDefs = new PropDefCollection([
    new PropDef('isEnum', { type: PropDef.bool }),
    new PropDef('values', { type: PropDef.array }),
    ...this.propDefs.defs,
  ])

  static childrenDefs = new ChildDefCollection([
    new ChildDef(Attribute),
  ])

  /**
   * @inheritDoc
   */
  applyConfigProperties (config) {
    const attributesField = this.getDb().getVersion() < 1 ? 'fields' : 'attributes'
    if (config[attributesField] && config.enum) {
      throw new Error('Either attributes or enum values must be specified')
    }
    if (!config[attributesField] && !config.enum) {
      throw new Error('Either attributes or enum values must be specified')
    }

    if (config[attributesField]) {
      this.isEnum = false
    } else if (config.enum) {
      this.isEnum = true
      this.values = config.enum
    }
  }

  /**
   * @inheritDoc
   */
  getConfigForApply (config) {
    // Don't filter config here to check for attributes in applyConfigProperties
    return config
  }

  /**
   * @inheritDoc
   */
  getConfigPropNameForChild (def) {
    return this.getDb().getVersion() < 1 ? 'fields' : 'attributes'
  }

  /**
   * @inheritDoc
   */
  getSqlDefinition (operation, addSql) {
    if (this.isEnum) {
      return `AS ENUM ('${this.values.join("', '")}')`
    } else {
      const fields = []
      for (const field of Object.values(this.attributes)) {
        fields.push(`${field.getObjectIdentifier('', true)} ${field.getSqlDefinition()}`)
      }
      return `AS (\n${fields.join(",\n")}\n)`
    }
  }
}
