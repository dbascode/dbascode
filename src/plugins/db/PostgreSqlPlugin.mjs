/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 30.11.2019
 * Time: 11:41
 */
import PluginDescriptor from '../../dbascode/PluginDescriptor'
import { parsePgConfig } from './postgresql/utils'
import DataBase from './postgresql/DataBase'
import StateStore from './postgresql/StateStore'
import SqlExec from './postgresql/SqlExec'


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
