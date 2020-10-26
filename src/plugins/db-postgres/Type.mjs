/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */
import AbstractSchemaObject from './AbstractSchemaObject'
import Attribute from './Attribute'
import ChildDefCollection from '../../dbascode/ChildDefCollection'
import ChildDef from '../../dbascode/ChildDef'
import PropDefCollection from '../../dbascode/PropDefCollection'
import PropDef from '../../dbascode/PropDef'
import { arrayUnique, replaceAll } from '../../dbascode/utils'

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
    if (config['attributes'] && config.enum) {
      throw new Error('Either attributes or enum values must be specified')
    }
    if (!config['attributes'] && !config.enum) {
      throw new Error('Either attributes or enum values must be specified')
    }

    if (config['attributes']) {
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
  getSqlDefinition (operation) {
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

  /**
   * @inheritDoc
   */
  setupDependencies () {
    super.setupDependencies()
    if (!this.isEnum) {
      const db = this.getDb()
      for (const name of Object.keys(this.attributes)) {
        /**
         * @type {Attribute}
         */
        const attr = this.attributes[name]
        if (attr.schema && attr.type) {
          const schemaObj = db.getSchema(attr.schema)
          const object = schemaObj.types[attr.type] || schemaObj.tables[attr.type]
          if (object) {
            this._dependencies.push(object.getPath())
          }
        }
      }
      this._dependencies = arrayUnique(this._dependencies)
    }
  }
}
