/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */
import Column from './Column'
import Trigger from './Trigger'
import Index from './Index'
import PrimaryKey from './PrimaryKey'
import AbstractSchemaObject from './AbstractSchemaObject'
import UniqueKey from './UniqueKey'
import ChildDef from '../../dbascode/ChildDef'
import ForeignKey from './ForeignKey'
import ChildDefCollection from '../../dbascode/ChildDefCollection'
import { parseTypedef } from './utils'

/**
 * Table object
 * @property {ForeignKey[]} foreignKeys
 * @property {Object.<string, Column>} columns
 * @property {Index[]} indexes
 * @property {Object.<string, Trigger>} triggers
 * @property {UniqueKey[]} uniqueKeys
 * @property {PrimaryKey} primaryKey
 */
export default class Table extends AbstractSchemaObject {
  /**
   * @type {ChildDefCollection}
   */
  static childrenDefs = new ChildDefCollection([
    new ChildDef(Column),
    new ChildDef(Index, ChildDef.array),
    new ChildDef(Trigger),
    new ChildDef(UniqueKey, ChildDef.array),
    new ChildDef(ForeignKey, ChildDef.array),
    new ChildDef(PrimaryKey, ChildDef.single),
  ])

  /**
   * @inheritDoc
   */
  postprocessTree (isNew) {
    if (this.extends) {
      // Copy inherited objects to this object
      const ancestor = this.getSchema().getTable(this.extends)
      if (!ancestor) {
        throw new Error(`Ancestor table ${this.extends} for table ${this.name} not exists`)
      }
      const inheritedObjects = [
        Column,
        Trigger,
        Index,
        PrimaryKey,
      ]
      const extendedConfig = {}
      ancestor.getChildrenDefCollection().initConfig(extendedConfig)
      for (const class_ of inheritedObjects) {
        const def = this.getChildrenDefCollection().getDefByClass(class_)
        // Add objects from ancestor checking do we already have overrides
        for (const child of ancestor.getChildrenByDef(def)) {
          switch (def.propType) {
            case ChildDef.single:
              if (!this[def.propName]) {
                extendedConfig[def.configPropName] = child._rawConfig
              }
              break
            case ChildDef.map:
              if (!this[def.propName][child.name]) {
                extendedConfig[def.configPropName][child.name] = child._rawConfig
              }
              break
            case ChildDef.array:
              if (this[def.propName].filter(item => item.name === child.name).length === 0) {
                extendedConfig[def.configPropName].push(child._rawConfig)
              }
          }
        }
      }
      this.createChildrenFromConfig(extendedConfig, true)
    }
    super.postprocessTree(isNew)
  }

  /**
   * @inheritDoc
   */
  setupDependencies() {
    super.setupDependencies()
    if (this.extends) {
      this.addDependencyBySqlTypeDef(parseTypedef(this.extends))
    }
  }

  /**
   * @inheritDoc
   */
  getSqlDefinition (operation, addSql) {
    let result = `(\n${super.getSqlDefinition(operation, addSql)}\n)`
    if (this.extends) {
      const ancestor = this.getSchema().getTable(this.extends)
      result = `${result} INHERITS (${ancestor.getObjectIdentifier('')})`
    }
    return result
  }
}
