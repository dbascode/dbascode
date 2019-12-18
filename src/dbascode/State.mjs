/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */
/**
 * State data
 */
export default class State {
  id
  date
  raw
  migrationSql
  dbAsCodeVersion
  pluginVersion

  /**
   * Constructor
   * @param {number} id - state identifier
   * @param {Date} [date]
   * @param {object} [raw]
   * @param {string} [migrationSql]
   * @param {number} [dbAsCodeVersion]
   * @param {number} [pluginVersion]
   */
  constructor (
    {
      id,
      date,
      raw,
      migrationSql,
      dbAsCodeVersion ,
      pluginVersion,
    }
  ) {
    this.id = id
    this.pluginVersion = pluginVersion
    this.date = date instanceof Date ? date : (date ? new Date(date): null)
    this.raw = raw
    this.migrationSql = migrationSql
    this.dbAsCodeVersion = dbAsCodeVersion
  }
}
