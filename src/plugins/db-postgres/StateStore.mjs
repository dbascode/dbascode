/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */
import path from 'path'
import { fileURLToPath } from 'url'
import AbstractStateStore from '../../dbascode/AbstractStateStore'
import { executeSql, executeSqlJson } from './psql'
import State from '../../dbascode/State'
import SqlRules from './SqlRules'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

/**
 * PostgreSQL state storage in the same DB
 */
export default class StateStore extends AbstractStateStore {
  /**
   * @inheritDoc
   */
  async getState () {
    let result = await executeSqlJson('SELECT 1', this._plugin.dbConfig)
    if (result.exitCode !== 0) {
      throw new Error('Can not connect to DB: ' + result.stderr)
    }
    result = await executeSqlJson(
      `SELECT * FROM dbascode.state ORDER BY id DESC LIMIT 1`,
      this._plugin.dbConfig
    )
    if (result.exitCode !== 0) {
      // Assume the state table doesn't exists.
      return new State({id: 0})
    }
    const res = result.result[0]
    if (res) {
      return new State({
        id: res.id,
        date: res.date,
        migrationSql: res.migrationSql,
        raw: JSON.parse(res.state),
        dbAsCodeVersion: res.dbascode_version,
        pluginVersion: res.plugin_version,
      })
    } else {
      return new State({id: 0})
    }
  }

  /**
   * @inheritDoc
   */
  async getStorageConfigPath () {
    // return `${__dirname}/state-storage.yml`
    return `${path.dirname(fileURLToPath(import.meta.url))}${path.sep}state-storage.yml`
  }

  /**
   * @inheritDoc
   */
  async getStateSaveSql (state) {
    // State date will be automatically set up by DB
    return (
      `INSERT INTO dbascode.state (id, state, migration, dbascode_version, plugin_version) 
      VALUES (
      ${state.id}, 
      ${SqlRules.escapeStringExpr(JSON.stringify(state.raw, null, 2))}, 
      ${SqlRules.escapeStringExpr(state.migrationSql)},
      ${Number(state.dbAsCodeVersion)}, 
      ${Number(state.pluginVersion)}
      );`
    )
  }
}
