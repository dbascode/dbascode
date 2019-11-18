/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 13.10.2019
 * Time: 21:10
 */

import isFunction from 'lodash-es/isFunction'
import isArray from 'lodash-es/isArray'
import isObject from 'lodash-es/isObject'
import ChangesContext from './ChangesContext'
import reverse from 'lodash-es/reverse'
import {
  escapeComment,
  joinSql,
  parseArrayProp,
} from './utils'
import isEmpty from 'lodash-es/isEmpty'
import difference from 'lodash-es/difference'
import {
  objectDifferenceKeys,
  objectIntersectionKeys,
  replaceAll,
} from '../utils'

/**
 * Base class for all DB objects
 */
export default class AbstractDbObject {
  /**
   * Object _parent
   * @type {AbstractDbObject}
   */
  _parent = undefined
  /**
   * @type {string}
   */
  name
  /**
   * Calculators cache
   * @private
   * @type {Object.<string, *>}
   * @private
   */
  _calcCache = undefined
  /**
   * Names of properties of the DbObject type that store collections of child objects.
   * Children are created in the order of this array and dropped in the reverse order.
   * @type {string[]}
   */
  _childrenProps = []
  /**
   * Grant permissions config
   * @type {object}
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
   * Whether the object is automatically dropped by its parent without additional queries.
   * Parent object must implement corresponding SQL by itself. This object still can be created
   * separately altering its prent object.
   * @type {boolean}
   */
  droppedByParent = false
  /**
   * Whether the object is automatically created by its parent without additional queries.
   * Parent object must implement corresponding SQL by itself. This object still can be dropped
   * separately altering its prent object.
   * @type {boolean}
   */
  createdByParent = false
  /**
   * Whether parent object must be altered on altering this object.
   * @type {boolean}
   */
  alterWithParent = false
  /**
   * Use the whole object definition on ALTER
   * @type {boolean}
   */
  fullAlter = false


  /**
   * Constructor
   * @param {String} [name]
   * @param {AbstractDbObject} [parent]
   * @param {boolean} [isSimpleChild]
   * @param {object} [grant]
   * @param {object} [revoke]
   * @param {string} [comment]
   * @param {boolean} [droppedByParent]
   * @param {boolean} [createdByParent]
   * @param {boolean} [fullAlter]
   * @param {boolean} [alterWithParent]
   */
  constructor (
    {
      name = '',
      parent,
      isSimpleChild,
      grant = {},
      revoke = {},
      comment = '',
      droppedByParent = false,
      createdByParent = false,
      fullAlter = false,
      alterWithParent = false,
    }
  ) {
    this.name = name
    this._parent = parent
    this.grant = grant
    this.revoke = revoke
    this.comment = comment
    this.droppedByParent = droppedByParent
    this.createdByParent = createdByParent
    this.fullAlter = fullAlter
    this.alterWithParent = alterWithParent
    if (parent) {
      parent.addChild(this, isSimpleChild)
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
   * Returns parent's property where this object should be stored
   * @param isSimpleChild
   * @returns {string}
   */
  getParentProp(isSimpleChild) {
    let prop = this.getClassName()
    prop = prop[0].toLowerCase() + prop.substr(1)
    const lastChar = prop[prop.length - 1]
    if (!isSimpleChild) {
      prop += (['s', 'x'].indexOf(lastChar) >= 0) ? 'es' : 's'
    }
    return prop
  }

  /**
   * Add a child to this object
   * @param {AbstractDbObject} instance
   * @param {boolean} [isSimpleChild]
   */
  addChild (instance, isSimpleChild) {
    if (!instance instanceof AbstractDbObject) {
      throw new Error(`Child object must be a DB object`)
    }
    const prop = instance.getParentProp(isSimpleChild)
    const p = this[prop]
    if (isArray(p)) {
      p.push(instance)
    } else if (p instanceof AbstractDbObject || p === undefined) {
      this[prop] = instance
    } else if (isObject(p)) {
      p[instance.name] = instance
    }
  }

  /**
   * Search for a property name where the specified child is stored
   * @param child
   * @returns {string}
   */
  findChildProp (child) {
    for (const prop of this._childrenProps) {
      const p = this[prop]
      if (p instanceof AbstractDbObject && p === child) {
        return prop
      }
      let i
      if (isArray(p) && (i = p.indexOf(child)) >= 0) {
        return `${prop}[$i]`
      }
      if (isObject(p)) {
        for (const sp in p) {
          if (p[sp] === child) {
            return `${prop}.${sp}`
          }
        }
      }
    }
  }

  /**
   * Has changes compared to the previous state object
   * @param {AbstractDbObject} compared
   * @param {boolean} [deep]
   * @returns {ChangesContext}
   */
  hasChanges (compared, deep = false) {
    const context = new ChangesContext(deep)
    hasChanges(this, compared, context)
    return context
  }

  /**
   * Returns SQL applying specified changes
   * @param {AbstractDbObject} previous
   * @param {ChangesContext} changes
   */
  getChangesSql (previous, changes) {
    const changedObjects = {}, permissionChangedObjects = {}, commentChangedObjects = {}
    const addChange = (list, objPath, oldObj, curObj) => {
      if (!list[objPath]) {
        const changeObj = {
          old: oldObj,
          cur: curObj,
          changedProps: {},
        }
        changeObj.creating = () => changeObj.create = true
        changeObj.dropping = () => changeObj.drop = true
        changeObj.changeProp = (path, old, cur) => changeObj.changedProps[path] = {old, cur}
        list[objPath] = changeObj
      }
      return list[objPath]
    }

    for (const [path, old, cur] of changes.changes) {
      let objCur = this
      let objOld = previous
      let lastDbObjCur = objCur
      let lastDbObjOld = objOld
      let objectPathAry = []
      let propertyPathAry = []
      for (const name of path ? path.split('.') : []) {
        const prop = parseArrayProp(name)
        if (prop.index !== null) {
          objCur = objCur ? objCur[prop.name][prop.index] : undefined
          objOld = objOld ? objOld[prop.name][prop.index] : undefined
        } else {
          objCur = objCur ? objCur[name] : undefined
          objOld = objOld ? objOld[name] : undefined
        }
        if (objCur instanceof AbstractDbObject || objOld instanceof AbstractDbObject) {
          lastDbObjCur = objCur
          lastDbObjOld = objOld
          objectPathAry = [...objectPathAry, ...propertyPathAry, name]
          propertyPathAry = []
        } else {
          propertyPathAry.push(name)
        }
      }
      const objectPath = objectPathAry.join('.')
      const propertyPath = propertyPathAry.join('.')

      const isPermissionChange = (propertyPathAry[0] === 'grant' || propertyPathAry[0] === 'revoke')
      const isCommentChange = (propertyPathAry[0] === 'comment')
      const curChange = (list) => addChange(list, objectPath, lastDbObjOld, lastDbObjCur)

      const curUndefined = lastDbObjCur === undefined
      const oldUndefined = lastDbObjOld === undefined

      if (!curUndefined && !oldUndefined) {
        if (isPermissionChange) {
          curChange(permissionChangedObjects).changeProp(propertyPath, old, cur)
        } else if (isCommentChange) {
          curChange(commentChangedObjects).changeProp(propertyPath, old, cur)
        } else {
          curChange(changedObjects).changeProp(propertyPath, old, cur)
        }
      } else if (!curUndefined && oldUndefined) {
        curChange(changedObjects).creating()
        curChange(permissionChangedObjects).creating()
        curChange(commentChangedObjects).creating()
      } else if (curUndefined && !oldUndefined) {
        curChange(changedObjects).dropping()
      }
    }

    let result = []
    for (const path of Object.keys(changedObjects)) {
      const changedObject = changedObjects[path]

      if (!isEmpty(changedObject.changedProps)) {
        if (changedObject.cur.fullAlter) {
          result.push(changedObject.cur.getFullAlterSql())
        } else {
          result.push(changedObject.cur.getAlterSql(changedObject.old, changedObject.changedProps))
        }
      } else if (changedObject.create) {
        result.push(changedObject.cur.getCreateOrDropSql('create'))
      } else if (changedObject.drop) {
        result.push(changedObject.old.getCreateOrDropSql('drop'))
      }
    }
    for (const path of Object.keys(commentChangedObjects)) {
      const changedObject = commentChangedObjects[path]
      result.push(changedObject.cur.getCommentChangesSql(changedObject))
    }
    for (const path of Object.keys(permissionChangedObjects)) {
      const changedObject = permissionChangedObjects[path]
      result.push(changedObject.cur.getPermissionsChangesSql(changedObject))
    }
    return joinSql(result)
  }

  /**
   * Returns SQL for comments update
   * @param {object} changedObject
   * @returns {string}
   */
  getCommentChangesSql (changedObject) {
    const {old, cur} = changedObject
    return `COMMENT ON ${this.getObjectClass()} ${this.getObjectIdentifier('comment', false)} IS '${cur.getComment()}';`
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
   * @param {object} changedObject
   * @returns {string}
   */
  getPermissionsChangesSql (changedObject) {
    const {old, cur} = changedObject
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
   * Returns CREATE or DROP SQL statement for the object
   * @param {string} what `create` or `drop` value to choose operation required
   * @param {boolean} withParent - If this object is creating at the same time as it's parent
   * @returns {string}
   */
  getCreateOrDropSql(what, withParent = false) {
    let result = []
    const creating = what === 'create'
    if (creating) {
      if (this.createdByParent) {
        if (!withParent) {
          result.push(this.getSeparateCreateSql())
        }
      } else {
        result.push(this.getCreateSql(withParent))
      }
      result.push(this.getChildrenCreateOrDropSql(what, true))
    } else {
      result.push(this.getChildrenCreateOrDropSql(what, true))
      if (this.droppedByParent) {
        if (!withParent) {
          result.push(this.getSeparateDropSql())
        }
      } else {
        result.push(this.getDropSql(withParent))
      }
    }
    return result.join('')
  }

  /**
   * Returns CREATE or DROP SQL statement for the object children
   * @param {string} what `create` or `drop` value to choose operation required
   * @param {boolean} withParent - If this object is creating at the same time as it's parent
   * @returns {string}
   */
  getChildrenCreateOrDropSql (what, withParent) {
    const result = []
    const creating = what === 'create'
    for (const prop of creating ? this._childrenProps : reverse(this._childrenProps)) {
      const collection = this.getChildrenForSql(prop, what, withParent)
      if (collection === undefined) {
        continue
      }
      const loop = isArray(collection)
        ? collection
        : (collection instanceof AbstractDbObject
          ? [collection]
          : Object.values(collection))
      for (const child of creating ? loop : reverse(loop)) {
        result.push(child.getCreateOrDropSql(what, withParent))
      }
    }
    return joinSql(result)
  }

  /**
   * Returns children for CREATE or DROP operations
   * @param {string} prop
   * @param {string} what
   * @param {boolean} withParent
   * @return {*[]}
   */
  getChildrenForSql (prop, what, withParent) {
    return this[prop]
  }

  /**
   * Returns SQL for object creation
   * @protected
   * @param {boolean} withParent - is object creating within it's parent
   * @returns {string}
   */
  getCreateSql (withParent) {
    const sql = []
    const result = `${this.getCreateOperator()} ${this.getObjectClass()} ${this.getObjectIdentifier('create', false)} ${this.getDefinition('create', sql)};`
    sql.unshift(result)
    return joinSql(sql)
  }

  /**
   * Returns operator for the CREATE operation
   * @return {string}
   */
  getCreateOperator () {
    return 'CREATE'
  }

  /**
   * Returns SQL for object creation
   * @protected
   * @returns {string}
   */
  getSeparateCreateSql () {
    const parent = this.getParent()
    const sql = []
    const result = `ALTER ${parent.getObjectClass()} ${parent.getObjectIdentifier('parent', false)} ADD ${this.getObjectClass()} ${this.getObjectIdentifier('alter-add', true)} ${this.getDefinition('alter-add', sql)};`
    sql.unshift(result)
    return joinSql(sql)
  }

  /**
   * Returns SQL definition for creation separately from parent
   * @param {string} operation
   * @param {array} addSql - Array to add additional SQL queries after the current definition will be executed.
   * @returns {string}
   */
  getDefinition (operation, addSql) {
    return ''
  }

  /**
   * Returns SQL for object deletion
   * @protected
   * @param {boolean} withParent - is object creating within it's parent
   * @returns {string}
   */
  getDropSql (withParent) {
    return `DROP ${this.getObjectClass()} ${this.getObjectIdentifier('drop', false)};`
  }

  /**
   * Returns SQL for object deletion separately from its parent
   * @protected
   * @returns {string}
   */
  getSeparateDropSql () {
    const parent = this.getParent()
    return `ALTER ${parent.getObjectClass()} ${parent.getObjectIdentifier('parent', false)} DROP ${this.getObjectClass()} ${this.getObjectIdentifier('alter-drop', true)};`
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
   * @returns {string}
   */
  getObjectClass () {
    return this.constructor.name.toUpperCase()
  }

  /**
   * Returns object identifier for use in SQL
   * @param {string} operation
   * @param {boolean} isParentContext - Is the requested identifier to be used inside the parent object
   * @returns {string}
   */
  getObjectIdentifier (operation, isParentContext) {
    if (isParentContext) {
      return this.getQuotedName()
    } else {
      const relType = this.getParentRelation()
      if (relType === 'ON') {
        return `${this.getQuotedName()} ON ${this.getParent().getParentedName(true)}`
      } else if (relType === '.') {
        return `${this.getParent().getParentedName(true)}.${this.getQuotedName()}`
      } else {
        return this.getQuotedName()
      }
    }
  }

  /**
   * Returns parent relation type: '' or '.' or 'ON'
   * @return {string}
   */
  getParentRelation () {
    return ''
  }

  /**
   * Returns SQL for object update
   * @protected
   * @param {AbstractDbObject} compared
   * @param {object} changes - dot-separated paths to the changed properties with ald and new values (empty if the whole object changed)
   * @returns {string}
   */
  getAlterSql (compared, changes) {
    if (this.getParentRelation() !== '') {
      const parent = this.getParent()
      const result = []
      for (const propName of Object.keys(changes)) {
        const change = changes[propName]
        const sql = this.getAlterPropSql(compared, propName, change.old, change.cur)
        if (sql !== undefined) {
          for (const s of [...sql]) {
            if (this.alterWithParent) {
              result.push(`${parent.getAlterOperator()} ${parent.getObjectClass()} ${parent.getObjectIdentifier('parent', false)} ${this.getAlterWithParentOperator()} ${this.getObjectClass()} ${this.getObjectIdentifier('alter-alter', true)} ${s};`)
            } else {
              result.push(`${this.getAlterOperator()} ${this.getObjectClass()} ${this.getObjectIdentifier('alter', true)} ${s};`)
            }
          }
        }
      }
      return joinSql(result)
    } else {
      const sql = []
      const result = `${this.getAlterOperator()} ${this.getObjectClass()} ${this.getDefinition('alter', sql)};`
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
    if (this.alterWithParent) {
      const parent = this.getParent()
      result = `ALTER ${parent.getObjectClass()} ${parent.getObjectIdentifier('parent', false)} CHANGE ${this.getObjectClass()} ${this.getObjectIdentifier('alter-alter', true)} ${this.getDefinition('alter-alter', sql)};`
    } else {
      result = `ALTER ${this.getObjectClass()} ${this.getObjectIdentifier('alter', true)} ${this.getDefinition('alter', sql)};`
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
        path.unshift(parent.findChildProp(curObject))
      }
      prevObject = curObject
      curObject = parent
    } while (curObject && curObject.getClassName() !== 'DataBase')
    return path.join('.')
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
          return v.apply(this, [() => origFn.apply(this, arguments), ...arguments])
        }
      } else {
        this[prop] = mixin[prop]
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
}


function isChildren (obj, name) {
  return obj._childrenProps.indexOf(name) >= 0
}

function filterProps (obj, props, context) {
  return props
    // Remove mixin methods
    .filter(prop => !isFunction(obj[prop]))
    // Don't compare private props
    .filter(prop => prop[0] !== '_')
    // remove inherits
    .filter(prop => prop !== 'inherits')
    // Don't compare DB children if not deep
    .filter(prop => context.deep ? true : !isChildren(obj, prop))
}

function arrayHasChanges (v2, v1, context) {
  for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
    context.addToPath(i)
    try {
      hasChangesInValues(v2[i], v1[i], context)
    } finally {
      context.popPath()
    }
  }
  return false
}

function getComparingProps (obj, context) {
  return obj instanceof AbstractDbObject
    ? filterProps(obj, Object.keys(obj), context)
    : Object.keys(obj)
}

function getObjectForChangeLog(obj) {
  const props = getComparingProps(obj, {deep: false})
  const result = {class: obj.getClassName()}
  for (const prop of props) {
    result[prop] = obj[prop]
  }
  for (const prop of obj._childrenProps) {
    const v = obj[prop]
    if (v instanceof AbstractDbObject) {
      result[prop] = getObjectForChangeLog(v)
    } else if (isObject(v)) {
      result[prop] = {}
      for (const sp of Object.keys(v)) {
        result[prop][sp] = getObjectForChangeLog(v[sp])
      }
    } else if (isArray(v)) {
      result[prop] = []
      for (const item of v) {
        result[prop].push(getObjectForChangeLog(item))
      }
    } else if (v !== undefined) {
      throw new Error('Unknown object type')
    }
  }
  return result
}

function mergeAndUnique (a1, a2) {
  return a1.concat(a2).filter((item, i, a) => a.indexOf(item) === i)
}

function objectHasChanges (v2, v1, context) {
  if (context.isInStack(v1) || context.isInStack(v2)) {
    return false
  }
  context.addToStack(v1)
  context.addToStack(v2)

  try {
    const v1Props = getComparingProps(v1, context)
    const v2Props = getComparingProps(v2, context)

    for (const prop of mergeAndUnique(v1Props, v2Props)) {
      context.addToPath(prop)
      try {
        const v1Value = v1[prop]
        const v2Value = v2[prop]
        hasChangesInValues(v2Value, v1Value, context)
      } finally {
        context.popPath()
      }
    }

  } finally {
    context.popStack()
    context.popStack()
  }
}

function hasChangesInValues (v2, v1, context) {
  if (v1 instanceof AbstractDbObject && v2 instanceof AbstractDbObject) {
    if (v1.isInherited && v2.isInherited) {
      return false
    }
    hasChanges(v2, v1, context)
    v1.getDb().pluginOnCompareObjects(v1, v2, context)
  } else if (isFunction(v1) && isFunction(v2)) {
    return false
  } else if (isArray(v1) && isArray(v2)) {
    return arrayHasChanges(v2, v1, context)
  } else if (isObject(v1) && isObject(v2)) {
    return objectHasChanges(v2, v1, context)
  } else {
    if (v1 !== v2) {
      context.addChange(
        v1 instanceof AbstractDbObject ? getObjectForChangeLog(v1) : v1,
        v2 instanceof AbstractDbObject ? getObjectForChangeLog(v2) : v2,
      )
      return true
    } else {
      return false
    }
  }
}

function hasChanges (current, old, context) {
  if (old === undefined || current === undefined) {
    context.addChange(
      old ? getObjectForChangeLog(old) : undefined,
      current ? getObjectForChangeLog(current) : undefined
    )
    return true
  } else {
    return objectHasChanges(current, old, context)
  }
}
