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
import { parseArrayProp } from './utils'
import isEmpty from 'lodash-es/isEmpty'
import difference from 'lodash-es/difference'
import { objectDifferenceKeys, objectIntersectionKeys, replaceAll } from '../utils'

/**
 * Base class for all DB objects
 */
class AbstractDbObject {
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
   * Names of properties of the Object type that store collections of child objects
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
   * Constructor
   * @param {String} name
   * @param {AbstractDbObject} [parent]
   * @param {boolean} [isSimpleChild]
   * @param {object} grant
   * @param {object} revoke
   */
  constructor (
    name,
    parent,
    isSimpleChild,
    grant,
    revoke,
  ) {
    this.name = name
    this._parent = parent
    this.grant = grant
    this.revoke = revoke
    if (parent) {
      parent.addChild(this, isSimpleChild)
    }
  }

  /**
   * Returns parent's property where this object should be stored
   * @param isSimpleChild
   * @returns {string}
   */
  getParentProp(isSimpleChild) {
    let prop = this.constructor.name
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

  findChildProp (child) {
    for (const prop in this._childrenProps) {
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
    const changedObjects = {}
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

      if (!changedObjects[objectPath]) {
        changedObjects[objectPath] = {
          old: lastDbObjOld,
          cur: lastDbObjCur,
          changedProps: {},
        }
      }
      const changedValue = {
        old,
        cur,
      }

      const curUndefined = lastDbObjCur === undefined
      const oldUndefined = lastDbObjOld === undefined

      if (!curUndefined && !oldUndefined) {
        changedObjects[objectPath].changedProps[propertyPath] = changedValue
      } else if (!curUndefined && oldUndefined) {
        changedObjects[objectPath].create = true
      } else if (curUndefined && !oldUndefined) {
        changedObjects[objectPath].drop = true
      }
    }

    let result = []
    for (const path of Object.keys(changedObjects)) {
      const changedObject = changedObjects[path]

      if (!isEmpty(changedObject.changedProps)) {
        result.push(changedObject.cur.getAlterSql(changedObject.old, changedObject.changedProps))
      } else if (changedObject.create) {
        result.push(changedObject.cur.getCreateOrDropSql('create'))
      } else if (changedObject.drop) {
        result.push(changedObject.old.getCreateOrDropSql('drop'))
      }
      result.push(this.getPermissionsChangesSql(changedObject))
    }
    return result.join("\n")
  }

  /**
   * Returns SQL for permissions update
   * @param {object} changedObject
   * @returns {string}
   */
  getPermissionsChangesSql (changedObject) {
    const {old, cur} = changedObject
    let changePermissions = changedObject.create
    if (!changePermissions) {
      for (const prop of Object.keys(changedObject.changedProps)) {
        if (prop.substr(0, 5) === 'grant' || prop.substr(0, 6) === 'revoke') {
          changePermissions = true
          break
        }
      }
    }
    if (!changePermissions) {
      return ''
    }
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
    return result.join("\n")
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
      result.push(this.getCreateSql(withParent))
      result.push(this.getChildrenCreateOrDropSql(what, true))
    } else {
      result.push(this.getChildrenCreateOrDropSql(what, true))
      result.push(this.getDropSql(withParent))
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
    return result.join("\n")
  }

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
    return ''
  }

  /**
   * Returns SQL for object deletion
   * @protected
   * @param {boolean} withParent - is object creating within it's parent
   * @returns {string}
   */
  getDropSql (withParent) {
    return `DROP ${this.getObjectClass()} ${this.getObjectIdentifier()};`
  }

  /**
   * Returns GRANT/REVOKE SQL statements
   * @returns {string}
   */
  getPermissionsSql (list, type) {
    const result = []
    const fromTo = (type === 'GRANT') ? 'TO' : 'FROM'
    for (let operation of list) {
      const roles = this.grant[operation]
      operation = operation.toUpperCase()
      for (let role of roles) {
        if (role.toLowerCase() !== 'public') {
          role = `"${role}"`
        }
        result.push(
          `${type} ${operation} ON ${this.getObjectClass()} ${this.getObjectIdentifier()} ${fromTo} ${role};`
        )
      }
    }
    return result.join("\n")
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
    return `${type} ${operation} ON ${this.getObjectClass()} ${this.getObjectIdentifier()} ${fromTo} ${role};`
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
   * @returns {string}
   */
  getObjectIdentifier () {
    return this.getParentedName(true)
  }

  /**
   * Returns SQL for object update
   * @protected
   * @param {AbstractDbObject} compared
   * @param {object} changes - dot-separated paths to the changed properties with ald and new values (empty if the whole object changed)
   * @returns {string}
   */
  getAlterSql (compared, changes) {
    return ''
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
      const parent = curObject._parent
      if (parent) {
        path.unshift(parent.findChildProp(curObject))
      }
      prevObject = curObject
      curObject = parent
    } while (curObject && curObject.constructor.name !== 'DataBase')
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
    } while (parent && parent.constructor.name !== 'DataBase')
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

function arrayHasChanges (v1, v2, context) {
  for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
    context.addToPath(i)
    try {
      hasChangesInValues(v1[i], v2[i], context)
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
  const result = {class: obj.constructor.name}
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

function objectHasChanges (v1, v2, context) {
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
        hasChangesInValues(v1Value, v2Value, context)
      } finally {
        context.popPath()
      }
    }

  } finally {
    context.popStack()
    context.popStack()
  }
}

function hasChangesInValues (v1, v2, context) {
  if (v1 instanceof AbstractDbObject && v2 instanceof AbstractDbObject) {
    if (v1.isInherited && v2.isInherited) {
      return false
    }
    return hasChanges(v1, v2, context)
  } else if (isFunction(v1) && isFunction(v2)) {
    return false
  } else if (isArray(v1) && isArray(v2)) {
    return arrayHasChanges(v1, v2, context)
  } else if (isObject(v1) && isObject(v2)) {
    return objectHasChanges(v1, v2, context)
  } else {
    if (v1 !== v2) {
      context.addChange(
        v2 instanceof AbstractDbObject ? getObjectForChangeLog(v2) : v2,
        v1 instanceof AbstractDbObject ? getObjectForChangeLog(v1) : v1,
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


export default AbstractDbObject
