/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 11.10.2019
 * Time: 16:25
 */
import AbstractDbObject from './AbstractDbObject'
import Type from './Type'
import Function from './Function'
import Table from './Table'
import isEmpty from 'lodash-es/isEmpty'
import { arrayContainsEntirely } from '../utils'
import { cfgKeys } from './utils'

/**
 * Schema object.
 *
 * @field {DataBase} _parent
 * @property {DataBase} _parent
 */
class Schema extends AbstractDbObject {
  /**
   * @type {Object.<string, Table>}
   */
  tables = {}
  /**
   * @type {Object.<string, Type>}
   */
  types = {}
  /**
   * @type {Object.<string, Function>}
   */
  functions = {}
  _childrenProps = ['types', 'functions', 'tables']

  /**
   * Constructor
   * @param {string} name
   * @param {Object.<string, Table>} [tables]
   * @param {Object.<string, Function>} [functions]
   * @param {Object.<string, Type>} [types]
   * @param {DataBase} [parent]
   */
  constructor (
    {
      name,
      tables = {},
      functions = {},
      types = {},
      parent = undefined,
    }
  ) {
    super(name, parent)
    this.types = types
    this.tables = tables
    this.functions = functions
  }

  /**
   * Instantiate new object from config data
   * @param {string} name
   * @param {Object|null} cfg
   * @param {DataBase} [parent]
   * @return {Schema|null}
   */
  static createFromCfg(name, cfg, parent) {
    if (!cfg) {
      return null
    }
    const result = new Schema({
      name,
      parent,
    })
    for (const name of cfgKeys(cfg.types || {})) {
      Type.createFromCfg(name, cfg.types[name], result);
    }
    for (const name of cfgKeys(cfg.functions || {})) {
      Function.createFromCfg(name, cfg.functions[name], result);
    }

    // Import tables following their dependencies
    let restMap = {}
    cfgKeys(cfg.tables || {}).forEach(name => restMap[name] = 1)
    do {
      const newRestMap = {}
      for (const tableName of Object.keys(restMap)) {
        const tableCfg = cfg.tables[tableName]
        const dependencies = Table.getDependencies(tableCfg)
        if (arrayContainsEntirely(Object.keys(result.tables), dependencies)) {
          Table.createFromCfg(tableName, tableCfg, result);
        } else {
          newRestMap[tableName] = 1
        }
      }
      if (Object.keys(restMap).length === Object.keys(newRestMap).length) {
        throw new Error("Infinite loop")
      }
      restMap = newRestMap
    } while (!isEmpty(restMap))
    return result.getDb().pluginOnObjectConfigured(result, cfg)
  }

  getCreateSql () {
    return `CREATE SCHEMA ${this.getQuotedName()};\n`
  }

  getDropSql () {
    return `DROP SCHEMA ${this.getQuotedName()} CASCADE;\n`
  }

  /**
   * Check table exists by name.
   * @param name
   * @returns {boolean}
   */
  tableExists(name) {
    return !!this.tables[name]
  }

  /**
   * Returns table by name
   * @param name
   * @returns {*}
   */
  getTable(name) {
    return this.tables[name]
  }

  getCalculators () {
    return {
      schemaName: this.name,
    }
  }
}

export default Schema
