/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 30.11.2019
 * Time: 11:11
 */
import AbstractSqlExec from '../../dbascode/AbstractSqlExec'
import { executeSql } from './psql'

/**
 * SQL execution provider for PostgreSQL
 */
export default class SqlExec extends AbstractSqlExec {
  /**
   * @inheritDoc
   */
  async executeSql (sql, cfg) {
    return await executeSql(sql, {...this._plugin.dbConfig, ...cfg})
  }

}
