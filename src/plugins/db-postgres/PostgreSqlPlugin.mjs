/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */
import PluginDescriptor from '../../dbascode/PluginDescriptor'
import { parsePgConfig } from './utils'
import DataBase from './DataBase'
import StateStore from './StateStore'
import SqlExec from './SqlExec'


/**
 * Postgres plugin descriptor
 */
class PostgreSqlPlugin extends PluginDescriptor {
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

  /**
   * @inheritDoc
   */
  getDbName () {
    return this.dbConfig.db
  }
}

export default new PostgreSqlPlugin({
  name: 'postgres',
  version: 1,
  dbClass: DataBase,
  stateStoreClass: StateStore,
  sqlExecClass: SqlExec,
})
