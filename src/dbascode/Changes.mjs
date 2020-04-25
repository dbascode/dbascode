/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */
import isEmpty from 'lodash-es/isEmpty'
import AbstractDbObject from './AbstractDbObject'
import ChangesContext from './ChangesContext'
import isArray from 'lodash-es/isArray'
import ChildDef from './ChildDef'
import isObject from 'lodash-es/isObject'
import { joinSql, parseArrayProp } from './utils'
import isFunction from 'lodash-es/isFunction'

/**
 * @typedef {object} ChangedPropertyDef
 * @property old
 * @property cur
 * @property {function} allowEmptySql
 */
/**
 * Changes calculation routines.
 */
export default class Changes {
  /**
   * Returns SQL applying specified changes
   * @param {AbstractDbObject} previous
   * @param {AbstractDbObject} current
   * @param {ChangesContext} changes
   */
  getChangesSql (previous, current, changes) {
    const changedObjects = {}, permissionChangedObjects = {}, commentChangedObjects = {}
    const addChange = (list, objPath, oldObj, curObj, changeItem) => {
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
        changeObj.changeProp = (path, old, cur) => changeObj.changedProps[path] = { old, cur, allowEmptySql: () => changeItem.allowEmptySql = true }
        list[objPath] = changeObj
      }
      return list[objPath]
    }

    for (const changeItem of changes.changes) {
      const {path, old, cur} = changeItem
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
      const curChange = (list) => addChange(list, objectPath, lastDbObjOld, lastDbObjCur, changeItem)

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
  collectChanges (old, current, deep = false) {
    const context = new ChangesContext(deep)
    this.compareValues(current, old, context)
    return context
  }

  /**
   * Compare arrays
   * @param {array} v2
   * @param {array} v1
   * @param {ChangesContext} context
   * @return {void}
   * @private
   */
  compareArrays (v2, v1, context) {
    for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
      context.addToPath(i)
      try {
        this.compareValues(v2[i], v1[i], context)
      } finally {
        context.popPath()
      }
    }
  }

  /**
   * Returns a list of properties for the object to compare
   * @param {AbstractDbObject|object} obj
   * @param {boolean} includeChildren
   * @param {string|null} skipMode
   * @return {string[]}
   */
  getComparingProps (obj, includeChildren, skipMode) {
    if (obj instanceof AbstractDbObject) {
      const props = []
      if (includeChildren) {
        const childrenCol = obj.getChildrenDefCollection()
        if (childrenCol) {
          childrenCol.defs.forEach(
            def => (!skipClass(def.class_, skipMode) ? props.push(def.propName) : null)
          )
        }
      }
      if (!skipMode) {
        const propCol = obj.getPropDefCollection()
        if (propCol) {
          propCol.defs.forEach(def => props.push(def.name))
        }
      }
      return props
    } else {
      return Object.keys(obj).filter(prop => prop[0] !== '_')
    }
  }

  /**
   *
   * @param {AbstractDbObject} obj
   * @param {string|null} skipMode
   * @return {object}
   */
  getObjectForChangeLog (obj, skipMode) {
    const props = this.getComparingProps(obj, false, null)
    const result = { class: obj.getClassName() }
    const defs = obj.getChildrenDefCollection()
    for (const prop of props) {
      result[prop] = obj[prop]
    }
    if (defs) {
      // Do not add independent objects to changelog - they will have their own change operations.
      // Loop through skipped children.
      for (const def of defs.defs.filter(def => skipClass(def.class_, skipMode))) {
        const prop = def.propName
        const v = obj[prop]
        if (v !== undefined && v !== null) {
          switch (def.propType) {
            case ChildDef.single:
              result[prop] = this.getObjectForChangeLog(v, skipMode)
              break
            case ChildDef.map:
              result[prop] = {}
              for (const sp of Object.keys(v)) {
                result[prop][sp] = this.getObjectForChangeLog(v[sp], skipMode)
              }
              break
            case ChildDef.array:
              result[prop] = []
              for (const item of v) {
                result[prop].push(this.getObjectForChangeLog(item, skipMode))
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

  /**
   * Merge arrays and unique values
   * @param {array} a1
   * @param {array} a2
   * @return {array}
   */
  mergeAndUnique (a1, a2) {
    return a1.concat(a2).filter((item, i, a) => a.indexOf(item) === i)
  }

  /**
   * Compare objects and get changes between them.
   * @param {object|AbstractDbObject|undefined} v2
   * @param {object|AbstractDbObject|undefined} v1
   * @param {ChangesContext} context
   * @param {string|null} skipMode - skip plain values and objects created/dropped by parent (when new object is created/old is dropped). Pass 'create' if skipping on creation, 'drop' if on dropping.
   * @return {void}
   * @private
   */
  compareObjects (v2, v1, context, skipMode) {
    if (context.isInStack(v1) || context.isInStack(v2)) {
      return
    }
    context.addToStack(v1)
    context.addToStack(v2)

    try {
      let v1Props = v1 ? this.getComparingProps(v1, context.deep, skipMode) : []
      let v2Props = v2 ? this.getComparingProps(v2, context.deep, skipMode) : []

      for (const prop of this.mergeAndUnique(v1Props, v2Props)) {
        context.addToPath(prop)
        try {
          const v1Value = v1 ? v1[prop] : undefined
          const v2Value = v2 ? v2[prop] : undefined
          this.compareValues(v2Value, v1Value, context)
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
   * Compare any values and get changes between them.
   * @param {AbstractDbObject|*} v2
   * @param {AbstractDbObject|*} v1
   * @param {ChangesContext} context
   * @return {void}
   * @private
   */
  compareValues (v2, v1, context) {
    if (v1 instanceof AbstractDbObject && v2 instanceof AbstractDbObject) {
      if (v1._isInherited && v2._isInherited) {
        return
      }
      this.compareObjects(v2, v1, context, null)
    } else if (isFunction(v1) && isFunction(v2)) {
      // Do nothing with functions
    } else if (isArray(v1) && isArray(v2)) {
      this.compareArrays(v2, v1, context)
    } else if (isObject(v1) && isObject(v2)) {
      // Do not add to changes between plain objects, lookup deeper
      this.compareObjects(v2, v1, context, null)
    } else if (isObject(v1) && v2 === undefined) {
      // Do not add to changes between plain objects
      // Lookup deeper as usual for plain objects, lookup for DB object only if v1 is a DB object
      const isDbObj = v1 instanceof AbstractDbObject
      if (isDbObj) {
        context.addChange(
          this.getObjectForChangeLog(v1, 'drop'),
          v2,
        )
      }
      this.compareObjects(v2, v1, context, isDbObj ? 'drop' : null)
    } else if (isObject(v2) && v1 === undefined) {
      // Do not add to changes between plain objects
      // Lookup deeper as usual for plain objects, lookup for DB object only if v2 is a DB object
      const isDbObj = v2 instanceof AbstractDbObject
      if (isDbObj) {
        context.addChange(
          v1,
          this.getObjectForChangeLog(v2, 'create'),
        )
      }
      this.compareObjects(v2, v1, context, isDbObj ? 'create' : null)
    } else {
      if (v1 !== v2) {
        context.addChange(
          v1 instanceof AbstractDbObject ? this.getObjectForChangeLog(v1, null) : v1,
          v2 instanceof AbstractDbObject ? this.getObjectForChangeLog(v2, null) : v2,
        )
      }
    }
  }

}

/**
 * Where to skip this class of objects or not
 * @param {typeof AbstractDbObject} class_
 * @param {string|null} mode
 * @return {boolean}
 */
function skipClass(class_, mode) {
  return (
    mode === null ||
    mode === 'create' && class_.createdByParent ||
    mode === 'drop' && class_.droppedByParent
  )
}
