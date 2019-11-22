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

/**
 * Table object
 */
export default class Table extends AbstractSchemaObject {
  /**
   * @property {ForeignKey} foreignKeys
   * @property {Column[]} columns
   * @property {Index[]} indexes
   * @property {Trigger[]} triggers
   * @property {UniqueKey[]} uniqueKeys
   * @property {PrimaryKey} primaryKey
   */
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
   * @inheritDoc
   * @param config
   */
  applyConfigProperties (config) {
    if (this.getDb().getVersion() < 2) {
      this.extends = config.inherit
    }
  }

  /**
   * Fills the dependencies list of this object
   */
  setupDependencies() {
    super.setupDependencies()
    const tableDeps = {}
    for (const child of this.getChildrenByType(ForeignKey)) {
      tableDeps[child.refTableName] = 1
    }
    if (this.extends) {
      tableDeps[this.extends] = 1
    }
    if (this.defaultAcl) {
      tableDeps['default_acl'] = 1
    }
    const schema = this.getSchema()
    for (const tableName of Object.keys(tableDeps)) {
      this._dependencies.push(schema.getTable(tableName).getPath())
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
