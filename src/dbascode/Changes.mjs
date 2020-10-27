/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */
import AbstractDbObject from './AbstractDbObject'
import ChangesContext from './ChangesContext'
import isArray from 'lodash-es/isArray'
import ChildDef from './ChildDef'
import isObject from 'lodash-es/isObject'
import { circularSafeStringify, joinSql, parseArrayProp, replaceAll } from './utils'
import supportsColor from 'supports-color'
import isFunction from 'lodash-es/isFunction'
import isPlainObject from 'lodash-es/isPlainObject'
import { color } from '../console-utils'
import clone from 'lodash-es/clone'

/**
 * Changes calculation routines.
 */
export default class Changes {
  /**
   * @type {ChangeItem[]}
   */
  changes = []
  /**
   * @type {ChangeItem[]}
   */
  orderedChanges = []
  /**
   * @type {AbstractDbObject|undefined}
   */
  oldTree
  /**
   * @type {AbstractDbObject|undefined}
   */
  newTree

  /**
   * @param {AbstractDbObject|undefined} oldTree
   * @param {AbstractDbObject|undefined} newTree
   */
  constructor (oldTree, newTree) {
    this.oldTree = oldTree
    this.newTree = newTree
  }

  /**
   * Returns SQL for the collected changes
   * @return {string}
   */
  getChangesSql () {
    const childMap = this._getLatestChildMap()
    const oldChildMap = this._getOldChildMap()
    const result = []
    const mergedChangesMap = {}
    const parsedPropMap = {}

    for (const change of this.orderedChanges) {
      const dropping = change.cur === undefined
      const [obj, propName, objPath] = getDBObjectAndProp(change.path, dropping ? oldChildMap : childMap)
      if (mergedChangesMap[objPath] === undefined) {
        mergedChangesMap[objPath] = []
        parsedPropMap[objPath] = []
      }
      mergedChangesMap[objPath].push(change)
      parsedPropMap[objPath].push({obj, propName, objPath})
    }

    for (const objPath of Object.keys(mergedChangesMap)) {
      const changes = mergedChangesMap[objPath]
      const {obj, propName} = parsedPropMap[objPath][0]
      if (changes.length > 1) {
        result.push(obj.getChangesAlterSql(oldChildMap[objPath], changes))
      } else {
        const change = changes[0]
        const dropping = change.cur === undefined
        const creating = change.old === undefined
        if (!creating && !dropping || propName) {
          result.push(obj.getChangesAlterSql(oldChildMap[objPath], [change]))
        } else if (creating) {
          result.push(obj.getChangesCreateSql())
        } else if (dropping) {
          result.push(obj.getChangesDropSql())
        }
      }
    }

    return joinSql(result)
  }

  /**
   * Do we have any changes.
   * @returns {boolean}
   */
  hasChanges () {
    return this.changes.length > 0
  }

  /**
   * Do we have changes that must be reflected in SQL.
   * @returns {boolean}
   */
  hasSqlChanges () {
    return this.changes.filter(item => !item.allowEmptySql).length > 0
  }

  /**
   * Collect changes between DB object trees
   * @param {boolean} [deep] Whether to iterate over children
   * @return {void}
   */
  collectChanges (deep = false) {
    const context = new ChangesContext(deep)
    this.compareValues(this.newTree, this.oldTree, context)
    this.changes = context.changes
    this.buildOrderedChanges()
  }

  /**
   * Returns map of all children in the latest tree
   * @return {{}}
   * @private
   */
  _getLatestChildMap () {
    const childMap = {}
    if (this.newTree) {
      childMap[''] = this.newTree
      for (const child of this.newTree.getAllChildrenRecurse()) {
        childMap[child.getPath()] = child
      }
    }
    return childMap
  }

  /**
   * Returns map of all children in the latest tree
   * @return {{}}
   * @private
   */
  _getOldChildMap () {
    const childMap = {}
    if (this.oldTree) {
      childMap[''] = this.oldTree
      for (const child of this.oldTree.getAllChildrenRecurse()) {
        childMap[child.getPath()] = child
      }
    }
    return childMap
  }

  /**
   * Reorder changes to be executed in the correct order according to dependencies
   * @return {void}
   */
  buildOrderedChanges () {
    if (this.changes.length === 0) {
      return
    }

    const result = []
    const changeMap = {}
    for (const change of this.changes) {
      changeMap[change.path] = change
    }
    const changeMapCopy = clone(changeMap)

    const deps = this.newTree ? this.newTree.getAllDependencies() : {}

    const childMap = this._getLatestChildMap()
    const oldChildMap = this._getOldChildMap()

    const oldDeps = this.oldTree ? this.oldTree.getAllDependencies() : {}
    const oldBackDeps = this.oldTree ? this.oldTree.createBackDependencies(oldDeps) : {}

    const processingContext = {}

    const isProcessing = path => !!processingContext[path]
    const beginProcessing = path => { processingContext[path] = 1 }
    const endProcessing = path => { delete processingContext[path] }

    // Add change instruction to the result if it was not added already
    const addChangeToResult = objPath => {
      if (changeMap[objPath]) {
        result.push(changeMap[objPath])
        delete changeMap[objPath]
      }
    }

    // Check object's creation operation already added to the result
    const objAlreadyExists = function (objPath) {
      // If object creation command is in the changeMap then it is not added to the result, thus not created.
      // If not in the changes list then it existed before applying changes.
      return !(changeMap[objPath] && changeMap[objPath].old === undefined)
    }

    // Check object's dropping operation already added to the result
    const objAlreadyDropped = function (objPath) {
      return !(changeMap[objPath] && changeMap[objPath].cur === undefined)
    }

    // Check object's dropping operation already added to the result
    const objShouldBeDropped = (objPath) => {
      return changeMapCopy[objPath] && changeMapCopy[objPath].cur === undefined
    }

    const doMergeDependenciesToParent = function (map, objPath, parentPath) {
      // Remove dependency on parent
      map[objPath] = map[objPath] ? map[objPath].filter(p => p !== parentPath) : []
      // Merge parent deps and obj deps
      map[parentPath] = mergeAndUnique(map[parentPath], map[objPath])
      // Remove dependencies of the object
      delete map[objPath]
    }

    const mergeDependenciesToParent = function (objPath, parentPath) {
      doMergeDependenciesToParent(deps, objPath, parentPath)
    }

    const mergeOldBackDependenciesToParent = function (objPath, parentPath) {
      doMergeDependenciesToParent(oldBackDeps, objPath, parentPath)
    }

    // Ensure object of the specified path is set to be created.
    // Ensure dependencies are created before the object.
    const ensureExists = function (path) {
      const [obj, propName, objPath] = getDBObjectAndProp(path, childMap)

      if (propName) {
        // If changing a property then assume the object already created before changes.
        // Just add this change to the result.
        addChangeToResult(path)
      } else {
        const objExists = objAlreadyExists(objPath)
        const parentPath = obj.getParent() ? obj.getParent().getPath() : null
        const parentExists = parentPath !== null ? objAlreadyExists(parentPath) : false
        if (obj.getCreatedByParent()) {
          if (objExists) {
            // Nothing to do here, object already exists. Dependencies must be already checked.
            return
          } else {
            if (parentExists) {
              // If parent already exists then it will be altered to add obj object.
              // Do nothing and go through dependencies.
            } else {
              // Object will be created by its parent - move all obj dependencies to the parent dependencies
              mergeDependenciesToParent(objPath, parentPath)
              ensureExists(parentPath)
              delete changeMap[objPath]
              delete changeMap[path]
              return
            }
          }
        } else {
          if (!objExists) {
            const defs = obj.getChildrenDefCollection()
            if (defs) {
              const defsToCreate = defs.defs.filter(def => def.class_.createdByParent)
              // Dependencies of defsToCreate should be treated as the obj dependencies
              for (const def of defsToCreate) {
                for (const child of obj.getChildrenByDef(def)) {
                  mergeDependenciesToParent(child.getPath(), objPath)
                }
              }
            }
          }
        }

        const objDeps = deps[objPath]
        if (objDeps && objDeps.length > 0) {
          for (let i = objDeps.length - 1; i >= 0; i--) {
            ensureExists(objDeps[i])
            objDeps.pop()
          }
        }
        addChangeToResult(objPath)
      }
    }

    // Ensure object of the specified path is set to be dropped.
    // Ensure dependencies are dropped before the object.
    const ensureDropped = function (path) {
      const [obj, propName, objPath] = getDBObjectAndProp(path, oldChildMap)

      if (propName) {
        // Need to drop a parameter, not the whole object.
        // Just drop it without processing dependencies.
        addChangeToResult(objPath)
      } else {
        beginProcessing(objPath)
        const parentPath = obj.getParent() ? obj.getParent().getPath() : null
        const parentDropped = objAlreadyDropped(parentPath)
        const parentShouldBeDropped = objShouldBeDropped(parentPath)
        const droppedByParent = obj.getDroppedByParent()
        const objDropped = droppedByParent
          ? parentShouldBeDropped && parentDropped || !parentShouldBeDropped && objAlreadyDropped(objPath)
          : objAlreadyDropped(objPath)

        // Dropping the whole object with dependencies processing.
        if (objDropped) {
          // Nothing to do here, object already dropped. Dependencies must be already checked.
          endProcessing(objPath)
          return
        }
        if (droppedByParent) {
          // If the whole parent should be dropped then add parent to our dependencies to drop before this object.
          if (parentShouldBeDropped) {
            // If parent is already processing its dropping then do nothing
            if (!isProcessing(parentPath)) {
              ensureDropped(parentPath)
            }
          } else {
            // Otherwise, only drop this object separately from its parent
            addChangeToResult(objPath)
          }
          endProcessing(objPath)
          return
        }

        // Collect dependencies of dependent children of this object
        // (independent ones will be dropped by a separate command).
        const defs = obj.getChildrenDefCollection()
        if (defs) {
          const defsToDrop = defs.defs.filter(def => def.class_.droppedByParent)
          // Dependencies of defsToDrop should be treated as the obj dependencies
          for (const def of defsToDrop) {
            for (const child of obj.getChildrenByDef(def)) {
              mergeOldBackDependenciesToParent(child.getPath(), objPath)
            }
          }
        }
        // Now drop dependencies
        const objDeps = oldBackDeps[objPath]
        if (objDeps && objDeps.length > 0) {
          for (let i = objDeps.length - 1; i >= 0; i--) {
            ensureDropped(objDeps[i])
            objDeps.pop()
          }
        }
        // Now drop this object
        addChangeToResult(objPath)
        endProcessing(path)
      }
    }

    for (const change of this.changes) {
      if (change.cur) {
        // Modification or creation
        ensureExists(change.path)
      } else {
        // Deletion
        ensureDropped(change.path)
      }
    }

    this.orderedChanges = result
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
   * @private
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
   * Create flat object from DB object to represent its data in pretty-printed changelog
   * @param {AbstractDbObject} obj
   * @param {string|null} skipMode
   * @return {object}
   * @private
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

      for (const prop of mergeAndUnique(v1Props, v2Props)) {
        context.addToPath(prop)
        try {
          const v1Value = v1 ? v1[prop] : undefined
          const v2Value = v2 ? v2[prop] : undefined
          this.compareValues(v2Value, v1Value, context, skipMode)
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
   * @param {string|null} skipMode
   * @return {void}
   * @private
   */
  compareValues (v2, v1, context, skipMode = null) {
    if (v1 instanceof AbstractDbObject && v2 instanceof AbstractDbObject) {
      if (v1.isInherited() && v2.isInherited()) {
        return
      }
      this.compareObjects(v2, v1, context, null)
    } else if (isFunction(v1) && isFunction(v2)) {
      // Do nothing with functions
    } else if (isArray(v1) && isArray(v2)) {
      this.compareArrays(v2, v1, context)
    } else if (isObject(v1) && isObject(v2)) {
      // Do not add to changes between plain objects, lookup deeper for each field changes
      this.compareObjects(v2, v1, context, null)
    } else if (isObject(v1) && v2 === undefined) {
      // Do not add to changes between plain objects
      // Lookup deeper as usual for plain objects, lookup for DB object only if v1 is a DB object
      if (v1 instanceof AbstractDbObject) {
        context.addChange(
          this.getObjectForChangeLog(v1, 'drop'),
          v2,
        )
        this.compareObjects(v2, v1, context, 'drop')
      } else {
        if (hasDbObject(v1)) {
          // If this plain object contains DbObjects then do full check.
          this.compareObjects(v2, v1, context, null)
        } else if (skipMode === null) {
          // If no DbObjects and we're not dropping a parent DBObject then
          // just drop this plain object at once.
          context.addChange(v1, v2)
        }
      }
    } else if (isObject(v2) && v1 === undefined) {
      // Do not add to changes between plain objects.
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

  /**
   * Print changes to console
   * @param {boolean} colored
   * @return {string}
   */
  prettyPrint (colored) {
    const useColors = colored && supportsColor.stdout
    const delColor = color.FgRed
    const addColor = color.FgGreen
    const editColor = color.FgYellow
    const coloredText = (text, clr) => {
      return `${useColors ? clr : ''}${text}${useColors ? color.Reset : ''}`
    }
    const printVal = v => (isObject(v) || isArray(v) ? "\n" : '') + circularSafeStringify(v, true)

    const result = []
    for (const {path, old, cur} of this.changes) {
      if (old && cur) {
        result.push(
          `${coloredText(`~ ${path}`, editColor)}: ${coloredText(printVal(old), editColor)} => ${coloredText(printVal(cur), editColor)}\n`
        )
      } else if (!old && cur) {
        result.push(
          `${coloredText(`+ ${path}`, addColor)}: ${printVal(cur)}\n`
        )
      } else if (old && !cur) {
        result.push(
          `${coloredText(`- ${path}`, delColor)}\n`
        )
      }
    }
    return result.join('')
  }
}

/**
 * Parse property path and return the last element and the previous property.
 * @param {string} path
 * @return {[*, *]}
 */
const getLastProp = function (path) {
  const p = parseArrayProp(path).path
  const prop = p.splice(p.length - 1, 1)
  return [
    p.join('.'),
    prop[0],
  ]
}

/**
 * Parse object path and return DbObject that path belongs to, object path and object property
 * name (if path identifies is a property).
 * @param {string} path
 * @param {object} map
 * @return {(AbstractDbObject|string)[]}
 */
function getDBObjectAndProp (path, map) {
  let result, propName = '', objPath = path, lastResult = null
  do {
    result = map[objPath.replace(/\.(\d+)/g, '[$1]')]
    if (result === lastResult && result !== undefined) {
      throw new Error(`Can't find ${path}`)
    }
    lastResult = result
    if (!result) {
      if (!objPath) {
        throw new Error(`Can't find ${path}`)
      }
      const [shortPath, propAdd] = getLastProp(objPath)
      objPath = shortPath
      propName = propAdd + (propName.length ? '.' : '') + propName
    }
  } while (!result)
  return [result, propName, objPath]
}

/**
 * Checks any type of variable for containing DbObjects
 * @param {*} obj
 * @return {boolean}
 */
function hasDbObject (obj) {
  if (obj instanceof AbstractDbObject) {
    return true
  } else if (isArray(obj)) {
    for (const k of obj) {
      if (hasDbObject(obj[k])) {
        return true
      }
    }
  } else if (isPlainObject(obj)) {
    for (const k of Object.keys(obj)) {
      if (hasDbObject(obj[k])) {
        return true
      }
    }
  }
  return false
}

/**
 * Check should this class be skipped from changes collection or not
 * @param {typeof AbstractDbObject} class_
 * @param {string|null} mode
 * @return {boolean}
 */
function skipClass (class_, mode) {
  return mode === null
    ? false
    : mode === 'create' && class_.createdByParent ||
    mode === 'drop' && class_.droppedByParent
}

/**
 * Merge arrays and unique values
 * @param {array} a1
 * @param {array} a2
 * @return {array}
 */
function mergeAndUnique (a1, a2) {
  return a1.concat(a2).filter((item, i, a) => a.indexOf(item) === i)
}
