/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 13.10.2019
 * Time: 21:10
 */

import isEqual from 'lodash-es/isEqual'
import {
  objectDifferenceKeys,
  objectIntersectionKeys,
} from '../utils'
import intersection from 'lodash-es/intersection'
import difference from 'lodash-es/difference'
import isEqualWith from 'lodash-es/isEqualWith'
import isFunction from 'lodash-es/isFunction'

/**
 * Base class for all DB objects
 */
class AbstractDbObject {
  /**
   * Object parent
   * @type {AbstractDbObject}
   */
  parent = undefined
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
   * Constructor
   * @param {String} name
   * @param {AbstractDbObject} [parent]
   */
  constructor (name, parent) {
    this.name = name
    this.parent = parent
  }

  /**
   * Names of properties of the Object type that store collections of child objects
   * @type {string[]}
   */
  objectCollectionProps = []
  /**
   * Names of properties of the Array type that store collections of child objects
   * @type {string[]}
   */
  arrayCollectionProps = []

  /**
   * Has changes compared to the previous state object
   * @param {AbstractDbObject} compared
   * @returns {boolean}
   */
  hasChanges (compared) {
    if (!compared) {
      return true
    } else {
      return !isEqual(this, compared)
    }
  }

  /**
   * Returns SQL dump to update the compared object to the current state
   * @public
   * @param {AbstractDbObject} [compared]
   * @param {boolean} [dropIfNoComparison]
   * @returns {string}
   */
  getChangesSql (compared, dropIfNoComparison) {
    let result = ''
    if (!compared) {
      if (dropIfNoComparison) {
        result += this.getChildrenChangesSql()
        result += this.getDropSql()
      } else {
        result += this.getCreateSql()
        result += this.getChildrenChangesSql()
      }
    } else if (this.hasChanges(compared)) {
      result += this.getAlterSql(compared)
      result += this.getChildrenChangesSql(compared)
    }
    return result
  }

  /**
   * Get changes SQL of children objects.
   * @private
   * @param {AbstractDbObject} [compared]
   * @returns {string}
   */
  getChildrenChangesSql (compared) {
    let result = ''
    for (const prop of this.objectCollectionProps) {
      result += AbstractDbObject.getChangesSqlObject(this[prop], (compared || {})[prop])
    }
    for (const prop of this.arrayCollectionProps) {
      result += AbstractDbObject.getChangesSqlArray(this[prop], (compared || {})[prop])
    }
    return result
  }

  /**
   * Returns changes SQL for the specified Object sets
   * @private
   * @param {Object} currentSet
   * @param {Object} previousSet
   * @returns {string}
   */
  static getChangesSqlObject (currentSet, previousSet) {
    let result = ''
    for (const key of objectIntersectionKeys(currentSet, previousSet)) {
      result += currentSet[key].getChangesSql(previousSet[key])
    }
    for (const key of objectDifferenceKeys(currentSet, previousSet)) {
      result += currentSet[key].getChangesSql()
    }
    for (const key of objectDifferenceKeys(previousSet, currentSet)) {
      result += currentSet.getChangesSql(undefined, true)
    }
    return result
  }

  /**
   * Returns changes SQL for the specified Object sets
   * @private
   * @param {Array} currentSet
   * @param {Array} previousSet
   * @returns {string}
   */
  static getChangesSqlArray (currentSet, previousSet) {
    let result = ''
    for (const key of intersection(currentSet, previousSet)) {
      result += currentSet[key].getChangesSql(previousSet[key])
    }
    for (const key of difference(currentSet, previousSet)) {
      result += currentSet[key].getChangesSql()
    }
    for (const key of difference(previousSet, currentSet)) {
      result += currentSet.getChangesSql(undefined, true)
    }
    return result
  }

  /**
   * Returns SQL for object creation
   * @protected
   * @returns {string}
   */
  getCreateSql () {
    return ''
  }

  /**
   * Returns SQL for object deletion
   * @protected
   * @returns {string}
   */
  getDropSql () {
    return ''
  }

  /**
   * Returns SQL for object update]
   * @protected
   * @param {AbstractDbObject} compared
   * @returns {string}
   */
  getAlterSql (compared) {
    return ''
  }

  /**
   * Returns name of this object prepended by parent's name for SQL use
   * @returns {string}
   */
  getParentedName (quoted = false) {
    return (
      this.parent
        ? (quoted ? this.parent.getQuotedName() : this.parent.name) + '.'
        : ''
    ) + (quoted ? this.getQuotedName() : this.name)
  }

  /**
   * Returns name of this object prepended by parent's name separated by underscore
   * @returns {string}
   */
  getParentedNameFlat (quoted = false) {
    const result = (this.parent ? this.parent.name + '_' : '') + this.name
    return quoted ? `"${result}"` : result
  }

  getQuotedName () {
    return `"${this.name}"`
  }

  /**
   * Returns DB object that the current object belongs to
   * @returns {DataBase}
   */
  getDb () {
    let parent = this
    do {
      parent = parent.parent
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
          parent = parent.parent
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
        result = result.replace(match[0], calcResult)
      }
    }
    return result
  }
}

export default AbstractDbObject
