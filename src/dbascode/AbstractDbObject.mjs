/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */
import isFunction from 'lodash-es/isFunction'
import reverse from 'lodash-es/reverse'
import {
  getPropValue,
  joinSql,
  parseArrayProp,
  replaceAll,
} from './utils'
import ChildDef from './ChildDef'
import cloneDeep from 'lodash-es/cloneDeep'
import PropDefCollection from './PropDefCollection'
import PropDef from './PropDef'
import isArray from 'lodash-es/isArray'
import isString from 'lodash-es/isString'
import isObject from 'lodash-es/isObject'
import AbstractSqlRules from './AbstractSqlRules'

/**
 * @typedef {object} AlterPropContext
 * @property {boolean} allowEmptySql - this change allows empty result SQL.
 * @property {boolean} separateSql - SQL returned by this call is a separate and should be added after the regular one.
 */

/**
 * Base class for all DB objects.
 * @property {string} comment
 * @property {string} extends - Object that this object extends, inheriting its children and some properties. Inherited children must have the _isInherited property set to true.
 * @property {object} grant
 * @property {object} revoke
 */
export default class AbstractDbObject {
  /**
   * @type {string}
   */
  name
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
   * Basic SQL quotation and escaping routines class
   * @type {typeof AbstractSqlRules}
   */
  static sqlRules = null
  /**
   * SQL rules instance
   * @type {AbstractSqlRules}
   */
  sql = null

  /**
   * List of children definitions
   * @type {ChildDefCollection}
   */
  static childrenDefs = null
  /**
   * List of properties definitions
   * @type {PropDefCollection}
   * @static
   */
  static propDefs = new PropDefCollection([
    new PropDef('comment'),
    new PropDef('extends', { configName: ['inherit', { version: 2, name: 'extends' }] }),
    new PropDef('grant', { type: PropDef.map }),
    new PropDef('revoke', { type: PropDef.map }),
  ])
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
   * @param {*} [rawConfig]
   * @param {boolean} [isInherited]
   */
  constructor (
    {
      name = '',
      parent,
      rawConfig,
      isInherited = false,
    }
  ) {
    this.sql = new this.constructor.sqlRules(this)
    this.sql.validateSqlIdAndThrow(name)
    this.name = name
    this._parent = parent
    this._rawConfig = rawConfig
    this._isInherited = isInherited
    const propDefs = this.getPropDefCollection()
    if (propDefs) {
      propDefs.initProps(this)
    }
    const childrenDefs = this.getChildrenDefCollection()
    if (childrenDefs) {
      childrenDefs.initProps(this)
    }
  }

  /**
   * Returns class name of this object
   * @return {string}
   */
  getClassName () {
    return this.constructor.name
  }

  /**
   * Returns class name of this object
   * @return {typeof AbstractDbObject}
   */
  getClass () {
    return this.constructor
  }

  /**
   * Whether this object was inherited from the ancestor (defined in the extends property).
   * @return {boolean}
   */
  isInherited () {
    return this._isInherited
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
   * @return {PropDefCollection}
   */
  getPropDefCollection () {
    return this.constructor.propDefs
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
   * Returns all children of all DB types recursively
   * @return {AbstractDbObject[]}
   */
  getAllChildrenRecurse () {
    let children = this.getAllChildren()
    for (const child of [...children]) {
      children = [...children, ...child.getAllChildrenRecurse()]
    }
    return children
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
   * Search for a child of the specified definition and name
   * @param {ChildDef} def
   * @param {string} name
   * @return {AbstractDbObject}
   */
  findChildByDefAndName (def, name) {
    return this.getChildrenByDef(def).filter(item => item.name === name).shift()
  }

  /**
   * Search for children of the specified definition and name
   * @param {string} group
   * @param {string} name
   * @return {AbstractDbObject}
   */
  findChildByUniqueGroupAndName (group, name) {
    return this.getChildrenDefCollection().findChildInUniqueGroup(this, group, name)
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
   * Returns this object comment
   * @returns {string}
   */
  getComment() {
    return this.comment
  }

  /**
   * Returns CREATE SQL statement for the object and all its children
   * @returns {string}
   */
  getChangesCreateSql () {
    const result = []
    // If we are here on the object that should be created by its parent then we are altering parent
    // and need to get special SQL. This method will not be called when creating such children with
    // parent.
    if (this.getCreatedByParent()) {
      result.push(this.getSeparateCreateSql())
    } else {
      result.push(this.getCreateSql())
    }
    return joinSql(result)
  }

  createBackDependencies (deps) {
    const result = {}
    for (const dependentName in deps) {
      for (const dependencyName of deps[dependentName]) {
        if (!result[dependencyName]) {
          result[dependencyName] = {}
        }
        result[dependencyName][dependentName] = 1
      }
    }
    for (const dependencyName in result) {
      result[dependencyName] = Object.keys(result[dependencyName])
    }
    return result
  }

  /**
   * Returns DROP SQL statement for the object
   * @returns {string}
   */
  getChangesDropSql () {
    const result = []
    if (this.getDroppedByParent()) {
      result.push(this.getSeparateDropSql())
    } else {
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
    const result = `ALTER ${parent.getObjectClass('alter')} ${parent.getObjectIdentifier('parent', false)} ADD ${this.getObjectClass('alter-add')} ${this.getObjectIdentifier('alter-add', true)} ${this.getSqlDefinition('alter-add', sql)};`
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
      if (child.getCreatedByParent() && !child._isInherited) {
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
    return `ALTER ${parent.getObjectClass('alter-drop')} ${parent.getObjectIdentifier('parent', false)} DROP ${this.getObjectClass('alter-drop')} ${this.getObjectIdentifier('alter-drop', true)};`
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
    return `${type} ${operation} ON ${this.getObjectClass('grant')} ${this.getObjectIdentifier('grant', false)} ${fromTo} ${role};`
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
   * Returns object identifier for use in SQL.
   * @param {string} operation
   * @param {boolean} isParentContext - Is the requested identifier to be used inside the parent object
   * @returns {string}
   */
  getObjectIdentifier (operation, isParentContext = false) {
    if (isParentContext) {
      return this.sql.getEscapedName()
    } else {
      const relType = this.getParentRelation(operation)
      if (relType === 'ON') { // create index Index on table schema.table
        return `${this.sql.getEscapedName()} ON ${this.getParent().sql.getFullyQualifiedEscapedName()}`
      } else if (relType === '.') { // comment on column schema.table.column
        return this.sql.getFullyQualifiedEscapedName()
      } else {
        return this.sql.getEscapedName()
      }
    }
  }

  /**
   * Returns parent relation type: '' or '.' or 'ON' or '-'
   * '' - use regular identification, i.e.: `role` or `schema.table`
   * `.` - use dot separator in addition to the parent identifier, i.e.: `schema.table.column`
   * `ON` - use the `ON` operator on the parent, i.e.: `index ON schema.table`
   * `-` - use regular identification, but alter object using per property changes, not a whole object recreation.
   * @param {string} operation - operation which ir requiring the relation
   * @return {string}
   */
  getParentRelation (operation) {
    return ''
  }

  /**
   * Returns SQL for object update
   * @param {AbstractDbObject} oldObject - old object
   * @param {ChangeItem[]} changes - array of changes
   * @returns {string}
   */
  getChangesAlterSql (oldObject, changes) {
    const parent = this.getParent()
    let result = [], result2 = []
    let dropAndRecreate = false
    const curPathLength = this.getPath().length
    for (const change of changes) {
      const propName = change.path.substring(curPathLength + 1)
      const parsedPropName = parseArrayProp(propName)
      const propDef = this.getPropDefCollection().findPropByName(parsedPropName.path[0])
      if (propDef && propDef.recreateOnChange) {
        dropAndRecreate = true
        result = []
        break
      }
      const context = {}
      const sql = this.getAlterPropSql(oldObject, propName, change.old, change.cur, context)
      if (context.allowEmptySql) {
        change.allowEmptySql = true
      }
      if (sql) {
        if (context.separateSql) {
          result2.push(sql)
        } else {
          for (const s of [...isArray(sql) ? sql : [sql]]) {
            if (this.getAlterWithParent()) {
              result.push(`${parent.getAlterOperator()} ${parent.getObjectClass('alter-alter')} ${parent.getObjectIdentifier('parent', false)} ${this.getAlterWithParentOperator()} ${this.getObjectClass('alter')} ${this.getObjectIdentifier('alter-alter', true)} ${s};`)
            } else {
              result.push(`${this.getAlterOperator()} ${this.getObjectClass('alter')} ${this.getObjectIdentifier('alter', false)} ${s};`)
            }
          }
        }
      }
    }
    if (dropAndRecreate && oldObject) {
      result.push(oldObject.getChangesDropSql())
      result.push(this.getChangesCreateSql())
    }
    return joinSql([...result, ...result2])
  }

  /**
   * Returns SQL for alteration of a particular property
   * @param {AbstractDbObject} compared
   * @param {string} propName
   * @param {*} oldValue
   * @param {*} curValue
   * @param {AlterPropContext} context
   * @return {string|string[]|undefined}
   */
  getAlterPropSql (compared, propName, oldValue, curValue, context) {
    return ''
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
      result = `${parent.getAlterOperator()} ${parent.getObjectClass('alter-alter')} ${parent.getObjectIdentifier('parent', false)} CHANGE ${this.getObjectClass()} ${this.getObjectIdentifier('alter-alter', true)} ${this.getSqlDefinition('alter-alter', sql)};`
    } else {
      result = `${this.getAlterOperator()} ${this.getObjectClass('alter')} ${this.getObjectIdentifier('alter', true)} ${this.getSqlDefinition('alter', sql)};`
    }
    sql.unshift(result)
    return joinSql(sql)
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
    const pathAry = path.split('.')
    for (const i in pathAry) {
      const pathItem = pathAry[i]
      const prop = parseArrayProp(pathItem)
      child = parent[prop.name]
      if (child === undefined) {
        return undefined
      }
      if (prop.index !== null) {
        child = child[prop.index]
      }
      parent = child
    }
    return child
  }

  /**
   * Returns full path of the object
   * @returns {string[]}
   */
  getPathArray () {
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
    return reverse(path)
  }

  /**
   * Returns full path of the object
   * @returns {string}
   */
  getPath () {
    return this.getPathArray().join('.')
  }

  /**
   * Returns DB object that the current object belongs to
   * @returns {DataBaseMixin}
   */
  getDb () {
    let parent = this
    do {
      parent = parent._parent
    } while (parent && !parent.getClass().dbms)
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
  processCalculations (value) {
    let result = value
    const matches = [...value.matchAll(/\$\{\s*(\w+(\.\w+)*)([^}]*)\s*\}/g)]
    if (matches.length > 0) {
      let calculators = this._calcCache
      if (calculators === undefined) {
        let parent = this
        do {
          calculators = { ...parent.getCalculators(), ...calculators }
          parent = parent._parent
        } while (parent)
        this._calcCache = calculators
      }

      for (const match of matches) {
        const calcName = match[1]
        const calculator = getPropValue(calculators, calcName)
        if (calculator === undefined) {
          throw new Error(`Unknown calculator name ${calcName}`)
        }
        const calcResult = isFunction(calculator) ? calculator(calcName) : calculator
        result = replaceAll(result, match[0], calcResult)
      }
    }
    return result
  }

  /**
   * Applies a mixin to the current object
   * @param {Object} mixin
   */
  applyMixin (mixin) {
    for (const prop of Object.keys(mixin)) {
      const v = mixin[prop]
      if (isFunction(v)) {
        const origFn = this[prop]
        this[prop] = (...args) => {
          return v.apply(
            this,
            [(...newArgs) => origFn.apply(this, newArgs.length === 0 ? args : newArgs), ...args]
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
  getParent () {
    return this._parent
  }

  /**
   * Executed after all the explicit objects are created from the state. It's time to create implicit
   * objects if any.
   */
  postprocessTree (isNew) {
    for (const child of this.getAllChildren()) {
      child.postprocessTree(isNew)
    }
  }

  /**
   * Fills the dependencies list of this object and its children. Must throw an exception if
   * a dependency object is not found in the current tree.
   */
  setupDependencies () {
    for (const child of this.getAllChildren()) {
      child.setupDependencies()
      child._dependencies.push(this.getPath())
    }
  }

  getAllDependencies () {
    const result = {}
    const addResult = (dependentPath, dependencyPath) => {
      if (!result[dependentPath]) {
        result[dependentPath] = []
      }
      result[dependentPath].push(dependencyPath)
    }
    const thisPath = this.getPath()
    for (const dependencyPath of this._dependencies) {
      addResult(thisPath, dependencyPath)
    }
    for (const child of this.getAllChildren()) {
      const childResult = child.getAllDependencies()
      for (const dependentPath of Object.keys(childResult)) {
        for (const dependencyPath of childResult[dependentPath]) {
          addResult(dependentPath, dependencyPath)
        }
      }
    }
    return result
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
    if (!config) {
      return config
    }
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
        if (name && name[0] === '.') {
          // Don't process templates
          return
        }
        const child =
          new def.class_(
            processCalculations(this, {
              name,
              parent: this,
              isInherited,
              rawConfig: cfg,
            })
          )
        this.addChild(child)
        child.applyConfig(cfg)
        return child
      }
      const configPropName = this.getConfigPropNameForChild(def)
      const childConfig = config[configPropName]
      switch (def.propType) {
        case ChildDef.single:
          if (childConfig) {
            createAndAdd(def.propName, childConfig)
          }
          break

        case ChildDef.map:
          for (const name of Object.keys(childConfig || {})) {
            createAndAdd(name, childConfig[name])
          }
          break

        case ChildDef.array:
          for (const cfg of childConfig || []) {
            createAndAdd('', cfg)
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
    const defs = this.getPropDefCollection()
    if (defs) {
      for (const def of defs.defs) {
        def.apply(this, config)
      }
    }
  }

  /**
   * Correctly adds child to the object
   * @param {AbstractDbObject} child
   */
  addChild (child) {
    const def = this.getChildrenDefCollection().getDefByObject(child)
    switch (def.propType) {
      case ChildDef.single:
        this[def.propName] = child
        break
      case ChildDef.array:
        this[def.propName].push(child)
        break
      case ChildDef.map:
        if (!this.getChildrenDefCollection().isChildUnique(this, child)) {
          throw new Error(`Object with name ${child.name} already exists`)
        }
        this[def.propName][child.name] = child
        break
      default:
        throw new Error(`Unknown propType ${def.propType} for the object of ${child.getClassName()}`)
    }
  }

  /**
   * Validates this object and its children settings.
   * @param {AbstractDbObject|undefined} previous - Previous object or to compare with of `undefined`
   * if this object is newly created.
   * @param {ValidationContext} context
   * @returns void
   */
  validate (previous, context) {
    for (const child of this.getAllChildren()) {
      child.validate(
        context.prevTree ? context.prevTree.getChildByPath(child.getPath()) : undefined,
        context
      )
    }
  }
}

/**
 * Process calculations in string config values
 * @param {AbstractDbObject} obj
 * @param {Object.<string, *>} args
 * @returns {*}
 */
export function processCalculations (obj, args) {
  if (!obj || !args) {
    return args
  }
  if (isString(args)) {
    return recurseProcessCalculations(obj, args)
  }
  for (const prop of Object.keys(args)) {
    if (prop === 'name' || prop === 'rawConfig' || prop === 'parent') {
      continue
    }
    args[prop] = recurseProcessCalculations(obj, args[prop])
  }
  return args
}

function recurseProcessCalculations (obj, value) {
  if (isString(value)) {
    return obj.processCalculations(value)
  } else if (isObject(value) && value.constructor.name === 'Object') {
    for (const prop of Object.keys(value)) {
      value[prop] = recurseProcessCalculations(obj, value[prop])
    }
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      value[i] = recurseProcessCalculations(obj, value[i])
    }
  } else {
    return value
  }
  return value
}
