/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */

import { loadStateYaml } from '../../../dbascode/state-loader-yml'
import DbAsCode from '../../../dbascode/DbAsCode'
import DataBase from '../../db-postgres/DataBase'
import PostgreSqlPlugin from '../../db-postgres/PostgreSqlPlugin'
import Table from '../../db-postgres/Table'
import Function from '../../db-postgres/Function'
import PostgraphilePlugin from '../PostgraphilePlugin'

/**
 * @var {Jest} jest
 */

/**
 * Load this test test data
 * @returns {Promise<DataBase>}
 */
async function loadTestData(idx = '') {
  const dbAsCode = new DbAsCode(
    {
      source: `./src/plugins/tools-postgres-postgraphile/__tests__/PostgraphilePluginTest.data${idx}.yml`,
    },
    [
      PostgreSqlPlugin,
      PostgraphilePlugin,
    ],
  )
  await dbAsCode.initializePlugins();
  await dbAsCode.determineCurrentDbmsType('postgres')
  const s = await dbAsCode.createPlan({forceOldState: true})
  return dbAsCode.changes.newTree
}

test('loads omit fields', async () => {
  const tree = await loadTestData()
  const schema = tree.getSchema('schema')
  expect(schema).not.toBeNull()
  const table = schema.tables.table
  expect(table).toBeInstanceOf(Table)
  expect(table.omit).toBeTruthy()
  expect(table.columns.id.omit).toBeTruthy()

  const func = schema.functions.func
  expect(func).toBeInstanceOf(Function)
  expect(func.omit).toBeTruthy()
})
