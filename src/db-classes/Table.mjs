/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 07.10.2019
 * Time: 15:23
 */
import Column from './Column'
import Trigger from './Trigger'
import Index from './Index'
import PrimaryKey from './PrimaryKey'
import AbstractSchemaObject from './AbstractSchemaObject'
import UniqueKey from './UniqueKey'
import ChildDef from './ChildDef'
import ForeignKey from './ForeignKey'
import ChildDefCollection from './ChildDefCollection'
import AbstractDbObject from './AbstractDbObject'

/**
 * Table object
 * @property {ForeignKey} foreignKeys
 * @property {Column[]} columns
 * @property {Index[]} indexes
 * @property {Trigger[]} triggers
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

  // skipTriggers = false
  // skipIndexes = false
  // skipRLS = false

  /**
   * @inheritDoc
   */
  postprocessTree () {
    super.postprocessTree()
    if (this.extends) {
      // Add inherited objects
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
  }

  /**
   * Fills the dependencies list of this object
   */
  setupDependencies() {
    super.setupDependencies()
    const tableDeps = {}
    const schema = this.getSchema()
    for (const child of this.getChildrenByType(ForeignKey)) {
      const refTable = schema.getTable(child.ref.table)
      if (!refTable) {
        throw new Error(`Foreign key ${this.name}.${child.name} reference table ${child.ref.table} not found`)
      }
      tableDeps[child.ref.table] = refTable
    }
    if (this.extends) {
      tableDeps[this.extends] = 1
    }
    for (const tableName of Object.keys(tableDeps)) {
      const table = tableDeps[tableName]
      this._dependencies.push((table instanceof AbstractDbObject ? table : schema.getTable(tableName)).getPath())
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
