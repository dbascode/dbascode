/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 13.10.2019
 * Time: 21:10
 */

import isFunction from 'lodash-es/isFunction'
import reverse from 'lodash-es/reverse'
import {
  escapeComment,
  joinSql,
  parseArrayProp, processCalculations,
} from './db-utils'
import difference from 'lodash-es/difference'
import {
  objectDifferenceKeys,
  objectIntersectionKeys,
  replaceAll,
} from '../utils'
import ChildDef from './ChildDef'
import cloneDeep from 'lodash-es/cloneDeep'

/**
 * Base class for all DB objects
 */
export default class AbstractDbObject {
  /**
   * @type {string}
   */
  name
  /**
   * Grant permissions config
   * @type {object}
   * @protected
   */
  grant = {}
  /**
   * Revoke permissions config
   * @type {object}
   */
  revoke = {}
  /**
   * Comment on the object
   * @type {string}
   */
  comment = ''
  /**
   * Object _parent
   * @type {AbstractDbObject}
   * @private
   */
  _parent = undefined
  /**
   * Calculators cache
   * @private
   * @type {Object.<string, *>}
   * @private
   */
  _calcCache = undefined
  /**
   * List of object dependencies. Stores an array of paths to objects
   * @type {string[]}
   * @protected
   */
  _dependencies = []
  /**
   * Raw object configuration from state. For use by plugins.
   * @type {*}
   */
  _rawConfig
  /**
   * Is this object inherited. Inherited objects should not be exported to SQL.
   * @type {boolean}
   */
  _isInherited = false
  /**
   * Object that this object extends, inheriting its children and some properties.
   * Inherited children must have the _isInherited property set to true.
   * @type {string}
   */
  extends = ''
  /**
   * List of children definitions
   * @type {ChildDefCollection}
   */
  static childrenDefs = null
  /**
   * Name of a state key where object configuration is found
   * @type {string}
   */
  static configName = ''
  /**
   * Whether the object is automatically created by its parent while parent constructing.
   * This object still can be created separately by altering its prent object.
   * @type {boolean}
   */
  static createdByParent = false
  /**
   * Whether the object is automatically dropped by its parent without additional queries.
   * This object still can be dropped separately by altering its prent object.
   * @type {boolean}
   */
  static droppedByParent = false
  /**
   * Whether parent object must be altered on altering its parent object.
   * @type {boolean}
   */
  static alterWithParent = false
  /**
   * Use the whole object definition on ALTER instead of prop-by-prop alteration
   * @type {boolean}
   */
  static fullAlter = false


  /**
   * Constructor
   * @param {String} [name]
   * @param {AbstractDbObject} [parent]
   * @param {object} [grant]
   * @param {object} [revoke]
   * @param {string} [comment]
   * @param {*} [rawConfig]
   * @param {boolean} [isInherited]
   * @param {string} [extends]
   */
  constructor (
    {
      name = '',
      parent,
      grant = {},
      revoke = {},
      comment = '',
      rawConfig,
      isInherited = false,
      extends: extends_,
    }
  ) {
    this.name = name
    this._parent = parent
    this.grant = grant
    this.revoke = revoke
    this.comment = comment
    this._rawConfig = rawConfig
    this._isInherited = isInherited
    this.extends = extends_
    const defs = this.getChildrenDefCollection()
    if (defs) {
      defs.initProps(this)
    }
  }

  /**
   * Returns class name of this object
   * @return {string}
   */
  getClassName() {
    return this.constructor.name
  }

  /**
   * @return {boolean}
   */
  getCreatedByParent () {
    return this.constructor.createdByParent
  }

  /**
   * @return {boolean}
   */
  getDroppedByParent () {
    return this.constructor.droppedByParent
  }

  /**
   * @return {boolean}
   */
  getAlterWithParent () {
    return this.constructor.alterWithParent
  }

  /**
   * @return {boolean}
   */
  getFullAlter () {
    return this.constructor.fullAlter
  }

  /**
   * @return {ChildDefCollection}
   */
  getChildrenDefCollection () {
    return this.constructor.childrenDefs
  }

  /**
   * Returns all children by array of ChildDefs
   * @param {ChildDef[]} defs
   * @return {AbstractDbObject[]}
   */
  getChildrenByDefs (defs) {
    const result = []
    for (const def of defs) {
      for (const child of this.getChildrenByDef(def)) {
        result.push(child)
      }
    }
    return result
  }

  /**
   * Returns all children of all DB types
   * @return {AbstractDbObject[]}
   */
  getAllChildren () {
    const defs = this.getChildrenDefCollection()
    return defs ? this.getChildrenByDefs(defs.defs) : []
  }

  /**
   * Returns all children by the specified ChildDef
   * @param {ChildDef} def
   * @return {AbstractDbObject[]}
   */
  getChildrenByDef (def) {
    if (def.propType === ChildDef.single) {
      return this[def.propName] ? [this[def.propName]] : []
    } else if (def.propName === ChildDef.array) {
      return this[def.propName]
    } else {
      return Object.values(this[def.propName])
    }
  }

  /**
   * Returns all children of the specified type
   * @param {typeof AbstractDbObject} class_
   * @return {AbstractDbObject[]}
   */
  getChildrenByType (class_) {
    return this.getChildrenByDef(this.getChildrenDefCollection().getDefByClass(class_))
  }

  /**
   * Search for children of the specified definition and name
   * @param {ChildDef} def
   * @param {string} name
   * @return {AbstractDbObject}
   */
  findChildByDefAndName (def, name) {
    return this.getChildrenByDef(def).filter(item => item.name === name).shift()
  }

  /**
   * Search for children of the specified class and name
   * @param {typeof AbstractDbObject} class_
   * @param {string} name
   * @return {AbstractDbObject}
   */
  findChildByClassAndName (class_, name) {
    return this.findChildByDefAndName(
      this.getChildrenDefCollection().getDefByClass(class_),
      name
    )
  }

  /**
   * Returns SQL for comments update
   * @returns {string}
   */
  getCommentChangesSql () {
    return `COMMENT ON ${this.getObjectClass('comment')} ${this.getObjectIdentifier('comment', false)} IS '${this.getComment()}';`
  }

  /**
   * Returns table comment
   * @returns {string}
   */
  getComment() {
    return escapeComment(this.comment)
  }

  /**
   * Returns SQL for permissions update
   * @param previous
   * @returns {string}
   */
  getPermissionsChangesSql (previous) {
    const old = previous, cur = this
    const result = []
    const curGrant = cur ? cur.grant : {}, curRevoke = cur ? cur.revoke : {}
    const oldGrant = old ? old.grant : {}, oldRevoke = old ? old.revoke : {}
    const addGrantOps = objectDifferenceKeys(curGrant, oldGrant)
    const removeGrantOps = objectDifferenceKeys(oldGrant, curGrant)
    const addRevokeOps = objectDifferenceKeys(curRevoke, oldRevoke)
    const removeRevokeOps = objectDifferenceKeys(oldRevoke, curRevoke)
    const sameGrantOps = objectIntersectionKeys(curGrant, oldGrant)
    const sameRevokeOps = objectIntersectionKeys(curRevoke, oldRevoke)

    for (const op of addGrantOps) {
      for (const role of curGrant[op]) {
        result.push(cur.getPermissionSql('GRANT', op, role))
      }
    }
    for (const op of removeGrantOps) {
      for (const role of oldGrant[op]) {
        result.push(old.getPermissionSql('REVOKE', op, role))
      }
    }
    for (const op of addRevokeOps) {
      for (const role of curRevoke[op]) {
        result.push(cur.getPermissionSql('REVOKE', op, role))
      }
    }
    for (const op of sameGrantOps) {
      const addGrantRoles = difference(curGrant[op], oldGrant[op])
      const removeGrantRoles = difference(oldGrant[op], curGrant[op])
      for (const role of addGrantRoles) {
        result.push(cur.getPermissionSql('GRANT', op, role))
      }
      for (const role of removeGrantRoles) {
        result.push(cur.getPermissionSql('REVOKE', op, role))
      }
    }
    for (const op of sameRevokeOps) {
      const addRevokeRoles = difference(curRevoke[op], oldRevoke[op])
      const removeRevokeRoles = difference(oldRevoke[op], curRevoke[op])
      for (const role of addRevokeRoles) {
        result.push(cur.getPermissionSql('REVOKE', op, role))
      }
    }
    return joinSql(result)
  }

  /**
   * Returns CREATE SQL statement for the object and all its children
   * @returns {string}
   */
  getCreateSqlWithChildren() {
    const result = []
    // If we are here on the object that should be created by its parent then we are altering parent
    // and need to get special SQL. This method will not be called when creating such children with
    // parent.
    if (this.getCreatedByParent()) {
      result.push(this.getSeparateCreateSql())
    } else {
      result.push(this.getCreateSql())
      for (const child of this.getAllChildren()) {
        // Children created by the current object are processed in the getCreateSql-getSqlDefinition
        // calls, so skip them here.
        if (!child.getCreatedByParent()) {
          result.push(child.getCreateSqlWithChildren());
        }
      }
    }
    return joinSql(result)
  }

  /**
   * Returns DROP SQL statement for the object
   * @returns {string}
   */
  getDropSqlWithChildren() {
    const result = []
    if (this.getDroppedByParent()) {
      result.push(this.getSeparateDropSql())
    } else {
      for (const child of reverse(this.getAllChildren())) {
        // Children dropping by the current object will be dropped automatically with this object,
        // so skip dropping of them here.
        if (!child.getDroppedByParent()) {
          result.push(child.getDropSqlWithChildren());
        }
      }
      result.push(this.getDropSql())
    }
    return joinSql(result)
  }

  /**
   * Returns SQL for object creation
   * @returns {string}
   * @protected
   */
  getCreateSql () {
    const sql = []
    const result = `${this.getCreateOperator()} ${this.getObjectClass('create')} ${this.getObjectIdentifier('create', false)} ${this.getSqlDefinition('create', sql)};`
    sql.unshift(result)
    return joinSql(sql)
  }

  /**
   * Returns operator for the CREATE operation
   * @return {string}
   * @protected
   */
  getCreateOperator () {
    return 'CREATE'
  }

  /**
   * Returns SQL for object creation for objects created by its parents
   * @protected
   * @returns {string}
   */
  getSeparateCreateSql () {
    const parent = this.getParent()
    const sql = []
    const result = `ALTER ${parent.getObjectClass()} ${parent.getObjectIdentifier('parent', false)} ADD ${this.getObjectClass()} ${this.getObjectIdentifier('alter-add', true)} ${this.getSqlDefinition('alter-add', sql)};`
    sql.unshift(result)
    return joinSql(sql)
  }

  /**
   * Returns SQL text of the definition body of the object (without object type and name).
   * @param {string} operation
   * @param {array} addSql - Array to add additional SQL queries after the current definition will be executed.
   * @returns {string}
   */
  getSqlDefinition (operation, addSql) {
    const result = []
    for (const child of this.getAllChildren()) {
      if (child.getCreatedByParent()) {
        result.push(`${child.getObjectClass(operation)} ${child.getObjectIdentifier('create', true)} ${child.getSqlDefinition('create', addSql)}`)
      }
    }
    return result.join(",\n")
  }

  /**
   * Returns SQL for object deletion
   * @protected
   * @returns {string}
   */
  getDropSql () {
    return `DROP ${this.getObjectClass('drop')} ${this.getObjectIdentifier('drop', false)};`
  }

  /**
   * Returns SQL for object deletion separately from its parent
   * @protected
   * @returns {string}
   */
  getSeparateDropSql () {
    const parent = this.getParent()
    return `ALTER ${parent.getObjectClass('alter-drop')} ${parent.getObjectIdentifier('parent', false)} DROP ${this.getObjectClass()} ${this.getObjectIdentifier('alter-drop', true)};`
  }

  /**
   * Returns GRANT/REVOKE SQL statement
   * @param type
   * @param operation
   * @param role
   * @returns {string}
   */
  getPermissionSql (type, operation, role) {
    operation = operation.toUpperCase()
    type = type.toUpperCase()
    if (role.toLowerCase() !== 'public') {
      role = `"${role}"`
    }
    const fromTo = (type === 'GRANT') ? 'TO' : 'FROM'
    return `${type} ${operation} ON ${this.getObjectClass()} ${this.getObjectIdentifier('grant', false)} ${fromTo} ${role};`
  }

  /**
   * Returns object class name for use in SQL
   * @param {string} operation
   * @returns {string}
   */
  getObjectClass (operation) {
    return this.constructor.name.toUpperCase()
  }

  /**
   * Returns object identifier for use in SQL
   * @param {string} operation
   * @param {boolean} isParentContext - Is the requested identifier to be used inside the parent object
   * @returns {string}
   */
  getObjectIdentifier (operation, isParentContext = false) {
    if (isParentContext) {
      return this.getQuotedName()
    } else {
      const relType = this.getParentRelation(operation)
      if (relType === 'ON') {
        return `${this.getQuotedName()} ON ${this.getParent().getParentedName(true)}`
      } else if (relType === '.') {
        return `${this.getParent().getParentedName(true)}.${this.getQuotedName()}`
      } else if (relType === '-') {
        return this.getQuotedName()
      } else {
        return this.getParentedName(true)
      }
    }
  }

  /**
   * Returns parent relation type: '' or '.' or 'ON' or '-'
   * @param {string} operation - operation which ir requiring the relation
   * @return {string}
   */
  getParentRelation (operation) {
    return ''
  }

  /**
   * Returns SQL for object update
   * @param {AbstractDbObject} compared
   * @param {object} changes - dot-separated paths to the changed properties with ald and new values (empty if the whole object changed)
   * @returns {string}
   */
  getAlterSql (compared, changes) {
    if (this.getParentRelation('alter')) {
      const parent = this.getParent()
      const result = []
      for (const propName of Object.keys(changes)) {
        const change = changes[propName]
        const sql = this.getAlterPropSql(compared, propName, change.old, change.cur)
        if (sql !== undefined) {
          for (const s of [...sql]) {
            if (this.getAlterWithParent()) {
              result.push(`${parent.getAlterOperator()} ${parent.getObjectClass('alter-alter')} ${parent.getObjectIdentifier('parent', false)} ${this.getAlterWithParentOperator()} ${this.getObjectClass('alter')} ${this.getObjectIdentifier('alter-alter', true)} ${s};`)
            } else {
              result.push(`${this.getAlterOperator()} ${this.getObjectClass('alter')} ${this.getObjectIdentifier('alter', true)} ${s};`)
            }
          }
        }
      }
      return joinSql(result)
    } else {
      const sql = []
      const result = `${this.getAlterOperator()} ${this.getObjectClass('alter')} ${this.getSqlDefinition('alter', sql)};`
      sql.unshift(result)
      return joinSql(sql)
    }
  }

  /**
   * Returns SQL for alteration of a particular property
   * @param {AbstractDbObject} compared
   * @param {string} propName
   * @param {*} oldValue
   * @param {*} curValue
   * @return {string|string[]}
   */
  getAlterPropSql (compared, propName, oldValue, curValue) {
    return '';
  }

  /**
   * Returns SQL operator used on changing this object.
   * @return {string}
   */
  getAlterOperator () {
    return 'ALTER'
  }

  /**
   * Returns SQL operator used on changing this object.
   * @return {string}
   */
  getAlterWithParentOperator () {
    return 'ALTER'
  }

  /**
   * Returns ALTER SQL for  objects which are fully recreated on alteration.
   * @return {string}
   */
  getFullAlterSql () {
    const sql = []
    let result
    if (this.getAlterWithParent()) {
      const parent = this.getParent()
      result = `ALTER ${parent.getObjectClass('alter-alter')} ${parent.getObjectIdentifier('parent', false)} CHANGE ${this.getObjectClass()} ${this.getObjectIdentifier('alter-alter', true)} ${this.getSqlDefinition('alter-alter', sql)};`
    } else {
      result = `ALTER ${this.getObjectClass('alter')} ${this.getObjectIdentifier('alter', true)} ${this.getSqlDefinition('alter', sql)};`
    }
    sql.unshift(result)
    return joinSql(sql)
  }

  /**
   * Returns name of this object prepended by _parent's name for SQL use
   * @returns {string}
   */
  getParentedName (quoted = false) {
    return (
      this._parent
        ? (quoted ? this._parent.getQuotedName() : this._parent.name) + '.'
        : ''
    ) + (quoted ? this.getQuotedName() : this.name)
  }

  /**
   * Returns name of this object prepended by _parent's name separated by underscore
   * @returns {string}
   */
  getParentedNameFlat (quoted = false) {
    const result = (this._parent ? this._parent.name + '_' : '') + this.name
    return quoted ? `"${result}"` : result
  }

  /**
   * Returns name escaped for DB identifiers
   * @returns {string}
   */
  getQuotedName () {
    return `"${this.name}"`
  }

  /**
   * Returns a child by its path
   * @param path
   * @return {AbstractDbObject|*}
   */
  getChildByPath (path) {
    if (!path) {
      return this
    }
    let parent = this
    let child
    for (const i in path.split('.')) {
      const pathItem = path[i]
      const prop = parseArrayProp(pathItem)
      child = parent[prop.name]
      if (prop.index !== null) {
        child = child[prop.index]
      }
      parent = child
    }
    return child
  }

  /**
   * Returns full path of the object
   * @returns {string}
   */
  getPath () {
    const path = []
    let curObject = this
    let prevObject = null
    do {
      const parent = curObject.getParent()
      if (parent) {
        const def = parent.getChildrenDefCollection().getDefByObject(curObject)
        if (def.propType === ChildDef.single) {
          path.push(def.propName)
        } else if (def.propType === ChildDef.map) {
          path.push(curObject.name)
          path.push(def.propName)
        } else if (def.propType === ChildDef.array) {
          path.push(`${def.propName}[${parent[def.propName].indexOf(curObject)}]`)
        } else {
          throw new Error(`Unknown propType ${def.propType}`)
        }
      }
      prevObject = curObject
      curObject = parent
    } while (curObject && curObject.getClassName() !== 'DataBase')
    return reverse(path).join('.')
  }

  /**
   * Returns DB object that the current object belongs to
   * @returns {DataBase}
   */
  getDb () {
    let parent = this
    do {
      parent = parent._parent
    } while (parent && parent.getClassName() !== 'DataBase')
    return parent
  }

  /**
   * Returns a map of calculations for calculated values in config
   * @returns {Object}
   */
  getCalculators () {
    return {}
  }

  /**
   * Replace calculated values in strings
   * @param {string} value
   * @returns {string}
   */
  processCalculations(value) {
    let result = value
    const matches = [...value.matchAll(/\$\{\s*(\w+)([^}]*)\s*\}/)]
    if (matches.length > 0) {
      let calculators = this._calcCache
      if (calculators === undefined) {
        let parent = this
        do {
          calculators = {...parent.getCalculators(), ...calculators}
          parent = parent._parent
        } while (parent)
        this._calcCache = calculators
      }

      for (const match of matches) {
        const calcName = match[1]
        const calculator = calculators[calcName]
        if (!calculator) {
          throw new Error(`Unknown calculator name ${calcName}`)
        }
        const calcResult = isFunction(calculator) ? calculator(match[2]) : calculator
        result = replaceAll(result, match[0], calcResult)
      }
    }
    return result
  }

  /**
   * Applies a mixin to the current object
   * @param {Object} mixin
   */
  applyMixin(mixin) {
    for (const prop of Object.keys(mixin)) {
      const v = mixin[prop]
      if (isFunction(v)) {
        const origFn = this[prop]
        this[prop] = () => {
          const origArguments = arguments
          return v.apply(
            this,
            [() => origFn.apply(this, origArguments), ...origArguments]
          )
        }
      } else {
        this[prop] = v
      }
    }
  }

  apply (data) {
    Object.keys(data).forEach(name => this[name] = data[name])
  }

  /**
   * Returns parent of this object
   * @returns {AbstractDbObject}
   */
  getParent() {
    return this._parent
  }

  /**
   * Method to override by plugins and DB objects to add custom migration SQL.
   * @return {string}
   */
  getCustomChangesSql () {
    return ''
  }

  /**
   * Executed after all the explicit objects are created from the state. It's time to create implicit
   * objects if any.
   */
  postprocessTree () {
    for (const child of this.getAllChildren()) {
      child.postprocessTree()
    }
  }

  /**
   * Fills the dependencies list of this object and its children
   */
  setupDependencies() {
    for (const child of this.getAllChildren()) {
      child.setupDependencies()
    }
  }

  /**
   * Applies raw state config to the object.
   * @param {string|Object|null} config - Raw state config for this object
   * @return {object}
   */
  applyConfig (config) {
    const defs = this.getChildrenDefCollection()
    this.applyConfigProperties(processCalculations(
      this,
      this.getConfigForApply(config)
    ))
    if (config && defs) {
      this.createChildrenFromConfig(config, false)
    }
  }

  /**
   * Filters state config data removing unneeded and excessive options.
   * @param {object} config
   * @return {object}
   */
  getConfigForApply (config) {
    const rawConfig = cloneDeep(config)
    // Remove children DB objects configs
    const defs = this.getChildrenDefCollection()
    if (defs) {
      for (const def of defs.defs) {
        delete rawConfig[def.configPropName]
      }
    }
    return rawConfig
  }

  /**
   * Returns state config property name for child/children of the specified definition.
   * @param {ChildDef} def
   */
  getConfigPropNameForChild (def) {
    return def.configPropName
  }

  /**
   * Creates db children for this object from state config.
   * @param {*} config
   * @param {boolean} isInherited
   */
  createChildrenFromConfig (config, isInherited) {
    const defs = this.getChildrenDefCollection()
    if (!defs) {
      return
    }
    for (const def of defs.defs) {
      const createAndAdd = (name, cfg) => {
        if (cfg === null) {
          cfg = {}
        }
        const child =
          new def.class_(
            processCalculations(this, {
              name,
              parent: this,
              comment: cfg.comment,
              grant: cfg.grant,
              revoke: cfg.revoke,
              extends: cfg.extends,
              isInherited,
              rawConfig: cfg,
            })
          )
        this.addChild(child)
        return child
      }
      const configPropName = this.getConfigPropNameForChild(def)
      const childConfig = config[configPropName]
      switch (def.propType) {
        case ChildDef.single:
          if (childConfig) {
            createAndAdd(def.propName, childConfig).applyConfig(childConfig)
          }
          break

        case ChildDef.map:
          for (const name of Object.keys(childConfig || {})) {
            createAndAdd(name, childConfig[name]).applyConfig(childConfig[name])
          }
          break

        case ChildDef.array:
          for (const cfg of childConfig || []) {
            createAndAdd('', cfg).applyConfig(cfg)
          }
          break

        default:
          throw new Error(`Unknown propType ${def.propType} for the object of ${def.class_.name}`)
      }
    }
  }

  /**
   * Method to be overridden by specific DB classes to initialize properties from the state config
   * on object creation.
   * @param {object|string|*} config
   */
  applyConfigProperties (config) {
  }

  /**
   * Correctly adds child to the object
   * @param {AbstractDbObject} child
   */
  addChild (child) {
    const def = this.getChildrenDefCollection().getDefByObject(child)
    switch (def.propType) {
      case ChildDef.single: this[def.propName] = child; break
      case ChildDef.array: this[def.propName].push(child); break
      case ChildDef.map: this[def.propName][child.name] = child; break
      default: throw new Error(`Unknown propType ${def.propType} for the object of ${child.constructor.name}`)
    }
  }
}
