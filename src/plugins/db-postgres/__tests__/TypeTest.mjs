/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */

/**
 * @var {Jest} jest
 */

import { loadStateYaml } from '../../../dbascode/state-loader-yml'
import { getModuleDataPath } from '../test-utils'
import DataBase from '../DataBase'
import DbAsCode from '../../../dbascode/DbAsCode'
import PostgreSqlPlugin from '../PostgreSqlPlugin'
import Changes from '../../../dbascode/Changes'

/**
 * Load this test test data
 * @returns {Promise<DataBase>}
 */
async function loadTestData(idx = '') {
  const s = await loadStateYaml([getModuleDataPath(module.filename, idx)])
  return DataBase.createFromState(DataBase, s, DbAsCode.version, PostgreSqlPlugin.version)
}

test('creates alter enum SQL', async () => {
  const tree = await loadTestData('1')
  const tree2 = await loadTestData('2')

  const changes = new Changes(tree, tree2)
  changes.collectChanges(true)
  expect(changes.changes.length).toBe(1)
  changes.buildOrderedChanges()
  expect(changes.orderedChanges.length).toBe(1)
  expect(changes.getChangesSql()).toEqual(
`ALTER TYPE "schema"."T1" ADD VALUE 'V3';`
  )
})
