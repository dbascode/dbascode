/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 30.11.2019
 * Time: 11:41
 */
import PluginDescriptor from '../../dbascode/PluginDescriptor'
import { parsePgConfig } from './utils'
import DataBase from './DataBase'
import StateStore from './StateStore'
import SqlExec from './SqlExec'


/**
 * Postgres plugin descriptor
 */
class PostgreSqlPlugin extends PluginDescriptor{
  dbConfig = {
    host: null,
    port: 5432,
    user: null,
    password: null,
    db: null,
    wsl: false,
  }

  /**
   * Initialize plugin descriptor with the DbAsCode configuration
   * @param {DbAsCodeConfig} dbAsCodeConfig
   */
  init (dbAsCodeConfig) {
    super.init(dbAsCodeConfig)
    parsePgConfig(this.dbConfig, dbAsCodeConfig)
    this.dbConfig.wsl = dbAsCodeConfig.wsl
  }
}

export default new PostgreSqlPlugin({
  name: 'postgres',
  version: 1,
  dbClass: DataBase,
  stateStoreClass: StateStore,
  sqlExecClass: SqlExec,
})
