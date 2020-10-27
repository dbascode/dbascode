/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */
import AbstractPostgresDbObject from './AbstractPostgresDbObject'
import SqlRules from './SqlRules'

/**
 * Abstract class for objects belonging to a schema
 */
export default class AbstractSchemaObject extends AbstractPostgresDbObject {
  /**
   * @type {typeof SqlRules}
   */
  static sqlRules = SqlRules

  /**
   * Returns Schema  object that the current object belongs to
   * @returns {Schema}
   */
  getSchema () {
    let parent = this
    do {
      parent = parent._parent
    } while (parent && parent.getClassName() !== 'Schema')
    return parent
  }

  /**
   * @inheritDoc
   */
  getObjectIdentifier (operation, isParentContext = false) {
    if (!isParentContext) {
      const relType = this.getParentRelation(operation)
      if (!relType || relType === '-') {
        return this.sql.getFullyQualifiedEscapedName()
      }
    }
    return super.getObjectIdentifier(operation, isParentContext)
  }

  /**
   * Add dependency by typedef.
   * @param {ArgumentTypeDef} typeDef
   */
  addDependencyBySqlTypeDef (typeDef) {
    if (this.sql.isBuiltinType(typeDef)) {
      return
    }
    const def = {...typeDef}
    if (!def.schema) {
      def.schema = this.getSchema().name
    }
    const obj = this.getDb().findChildBySqlTypeDef(def)
    if (!obj) {
      throw new Error(`Type ${def.schema}.${def.type} not found`)
    }
    this.addDependency(obj)
  }

  /**
   * Add dependency by DB object
   * @param {AbstractDbObject} obj
   */
  addDependency (obj) {
    this._dependencies.push(obj.getPath())
  }

  /**
   * Add dependency by path
   * @param {string} path
   */
  addDependencyByPath (path) {
    this._dependencies.push(path)
  }
}
