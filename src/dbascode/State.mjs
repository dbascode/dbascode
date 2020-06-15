/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */
/**
 * State data.
 */
export default class State {
  /**
   * @type Number
   */
  oldId
  /**
   * @type Number
   */
  id
  /**
   * @type Date
   */
  date
  /**
   * @type object
   */
  raw
  /**
   * @type string
   */
  migrationSql
  /**
   * @type Number
   */
  dbAsCodeVersion
  /**
   * @type Number
   */
  pluginVersion
  /**
   * @type Boolean
   */
  hasChanges
  /**
   * @type Boolean
   */
  hasSqlChanges

  /**
   * Constructor
   * @param {number} oldId - previous state identifier
   * @param {number} id - state identifier
   * @param {Date} [date]
   * @param {object} [raw]
   * @param {string} [migrationSql]
   * @param {number} [dbAsCodeVersion]
   * @param {number} [pluginVersion]
   * @param {boolean} [hasChanges]
   * @param {boolean} [hasSqlChanges]
   */
  constructor (
    {
      oldId,
      id,
      date,
      raw,
      migrationSql,
      dbAsCodeVersion ,
      pluginVersion,
      hasChanges,
      hasSqlChanges,
    }
  ) {
    this.oldId = oldId
    this.id = id
    this.pluginVersion = pluginVersion
    this.date = date instanceof Date ? date : (date ? new Date(date): null)
    this.raw = raw
    this.migrationSql = migrationSql
    this.dbAsCodeVersion = dbAsCodeVersion
    this.hasChanges = hasChanges
    this.hasSqlChanges = hasSqlChanges
  }
}
