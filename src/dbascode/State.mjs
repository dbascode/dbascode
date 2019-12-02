/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 29.11.2019
 * Time: 20:56
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
