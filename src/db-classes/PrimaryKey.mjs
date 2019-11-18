/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 16.11.2019
 * Time: 12:26
 */

import AbstractSchemaObject from './AbstractSchemaObject'
import isString from 'lodash-es/isString'

/**
 * Table primary key object
 */
export default class PrimaryKey extends AbstractSchemaObject {
  colNames = []
  isInherited = false

  /**
   * Constructor
   * @param {string[]} colNames
   * @param {Table} [parent]
   * @param {string} comment
   * @param {boolean} isInherited
   */
  constructor (
    {
      colNames,
      parent,
      comment = '',
      isInherited = false,
    }
  ) {
    super({
      name: `${parent.name}_pkey`,
      parent,
      comment,
      isSimpleChild: true,
      droppedByParent: true,
      createdByParent: true,
      fullAlter: true,
    })
    this.isInherited = isInherited
    this.colNames = colNames
  }

  /**
   * Instantiate new object from config data
   * @param {object} cfg
   * @param {Table} [parent]
   * @return {PrimaryKey}
   */
  static createFromCfg(cfg, parent) {
    if (isString(cfg)) {
      cfg = {columns: cfg}
    }
    if (!cfg.columns) {
      return null
    }
    const result = new PrimaryKey(
      {
        colNames: isString(cfg.columns) ? [cfg.columns] : (cfg.columns || []),
        comment: cfg.comment || '',
        parent,
      }
    )
    return result.getDb().pluginOnObjectConfigured(result, cfg)
  }

  /**
   * @inheritDoc
   */
  getParentRelation () {
    return 'ON'
  }

  /**
   * @inheritDoc
   */
  getObjectClass () {
    return 'CONSTRAINT'
  }

  /**
   * @inheritDoc
   */
  getDefinition () {
    return `PRIMARY KEY ("${this.colNames.join('", "')}")`
  }
}
