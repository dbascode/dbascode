/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 30.11.2019
 * Time: 11:41
 */
import PluginDescriptor from '../../../dbascode/PluginDescriptor'
import { parsePgConfig } from './utils'

/**
 * Postgres plugin descriptor
 */
export default class PgPluginDescriptor extends PluginDescriptor{
  dbConfig = {
    host: null,
    port: 5432,
    user: null,
    password: null,
    db: null,
  }

  /**
   * Initialize plugin descriptor with the DbAsCode configuration
   * @param {DbAsCodeConfig} dbAsCodeConfig
   */
  init (dbAsCodeConfig) {
    super.init(dbAsCodeConfig)
    parsePgConfig(this.dbConfig, dbAsCodeConfig)
  }

}
