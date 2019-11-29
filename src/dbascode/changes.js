/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 19.11.2019
 * Time: 10:14
 */

import { joinSql, parseArrayProp } from './db-utils'
import isEmpty from 'lodash-es/isEmpty'
import AbstractDbObject from './AbstractDbObject'
import ChangesContext from './ChangesContext'
import isFunction from 'lodash-es/isFunction'
import isArray from 'lodash-es/isArray'
import ChildDef from './ChildDef'
import isObject from 'lodash-es/isObject'
import equalArrays from 'lodash-es/_equalArrays'
import isEqual from 'lodash-es/isEqual'
import difference from 'lodash-es/difference'

/**
 * Returns SQL applying specified changes
 * @param {AbstractDbObject} previous
 * @param {AbstractDbObject} current
 * @param {ChangesContext} changes
 */
export function getChangesSql (previous, current, changes) {
  const changedObjects = {}, permissionChangedObjects = {}, commentChangedObjects = {}
  const addChange = (list, objPath, oldObj, curObj) => {
    if (!list[objPath]) {
      const changeObj = {
        /**
         * @type AbstractDbObject
         */
        old: oldObj,
        /**
         * @type AbstractDbObject
         */
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
    let objCur = current
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

  const alterChanges = []
  const createChanges = []
  const dropChanges = []
  for (const path of Object.keys(changedObjects)) {
    const change = changedObjects[path]
    change.path = path
    if (!isEmpty(change.changedProps)) {
      alterChanges.push(change)
    } else if (change.create) {
      createChanges.push(change)
    } else if (change.drop) {
      dropChanges.push(change)
    }
  }

  if (createChanges.length > 0) {
    for (const change of createChanges) {
      change.getPath = () => change.path
    }
    for (const change of current.getChildrenCreateOrder(createChanges)) {
      result.push(change.cur.getCreateSqlWithChildren())
    }
  }

  for (const change of alterChanges) {
    if (change.cur.getFullAlter()) {
      result.push(change.cur.getFullAlterSql())
    } else {
      result.push(change.cur.getAlterSql(change.old, change.changedProps))
    }
  }

  if (dropChanges.length > 0) {
    for (const change of dropChanges) {
      change.getPath = () => change.path
    }
    for (const change of current.getChildrenDropOrder(dropChanges)) {
      result.push(change.old.getDropSqlWithChildren())
    }
  }

  for (const path of Object.keys(commentChangedObjects)) {
    const changedObject = commentChangedObjects[path]
    result.push(changedObject.cur.getCommentChangesSql(changedObject.old))
  }
  for (const path of Object.keys(permissionChangedObjects)) {
    const changedObject = permissionChangedObjects[path]
    result.push(changedObject.cur.getPermissionsChangesSql(changedObject.old))
  }
  return joinSql(result)
}

/**
 * Has changes old to the previous state object
 * @param {AbstractDbObject} old
 * @param {AbstractDbObject} current
 * @param {boolean} [deep]
 * @returns {ChangesContext}
 */
export function collectChanges (old, current, deep = false) {
  const context = new ChangesContext(deep)
  hasChanges(current, old, context)
  return context
}

/**
 * @param {AbstractDbObject} obj
 * @param {string} name
 * @return {boolean}
 */
function isChildren (obj, name) {
  const defs = obj.getChildrenDefCollection()
  if (defs) {
    for (const def of defs.defs) {
      if (def.propName === name) {
        return true
      }
    }
  }
  return false
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
  if (obj instanceof AbstractDbObject) {
    const props = []
    if (context.deep) {
      const childrenCol = obj.getChildrenDefCollection()
      if (childrenCol) {
        childrenCol.defs.forEach(def => props.push(def.propName))
      }
    }
    const propCol = obj.getPropDefCollection()
    if (propCol) {
      propCol.defs.forEach(def => props.push(def.name))
    }
    return props
  } else {
    return Object.keys(obj)
  }
}

/**
 *
 * @param {AbstractDbObject} obj
 * @return {{class: string}}
 */
function getObjectForChangeLog(obj) {
  const props = getComparingProps(obj, {deep: false})
  const result = {class: obj.getClassName()}
  for (const prop of props) {
    result[prop] = obj[prop]
  }
  const defs = obj.getChildrenDefCollection()
  if (defs) {
    for (const def of defs.defs) {
      const prop = def.propName
      const v = obj[prop]
      if (v !== undefined && v !== null) {
        switch (def.propType) {
          case ChildDef.single:
            result[prop] = getObjectForChangeLog(v)
            break
          case ChildDef.map:
            result[prop] = {}
            for (const sp of Object.keys(v)) {
              result[prop][sp] = getObjectForChangeLog(v[sp])
            }
            break
          case ChildDef.array:
            result[prop] = []
            for (const item of v) {
              result[prop].push(getObjectForChangeLog(item))
            }
            break
          default:
            throw new Error(`Unknown object type ${def.propType}`)
        }
      }
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

/**
 *
 * @param {AbstractDbObject|*} v2
 * @param {AbstractDbObject|*} v1
 * @param {ChangesContext} context
 * @return {boolean}
 */
function hasChangesInValues (v2, v1, context) {
  if (v1 instanceof AbstractDbObject && v2 instanceof AbstractDbObject) {
    if (v1._isInherited && v2._isInherited) {
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
