/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
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
