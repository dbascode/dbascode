/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */

/**
 * @var {Jest} jest
 */

import DataBase from '../DataBase'
import PostgreSqlPlugin from '../PostgreSqlPlugin'
import DbAsCode from '../../../dbascode/DbAsCode'
import { TREE_INITIALIZED } from '../../../dbascode/PluginEvent'
import PostgraphilePlugin from '../../tools-postgres-postgraphile/PostgraphilePlugin'
import RowLevelSecurityPlugin from '../../tools-postgres-rls/RowLevelSecurityPlugin'
import DefaultRowsPlugin from '../../tools-postgres-default-rows/DefaultRowsPlugin'
import { loadStateYaml } from '../../../dbascode/state-loader-yml'

/**
 * Load this test test data
 * @returns {Promise<AbstractDataBase>}
 */
async function loadTestData() {
  const s = await loadStateYaml(['./src/plugins/db-postgres/__tests__/ResolveDependenciesTest.data.yml'])
  return DataBase.createFromState(DataBase, s, DbAsCode.version, PostgreSqlPlugin.version)
}

function getDbac (tree) {
  const dbac = new DbAsCode(
    {},
    [
      PostgreSqlPlugin,
      PostgraphilePlugin,
      RowLevelSecurityPlugin,
      DefaultRowsPlugin,
    ],
  )
  dbac.pluginEvent(TREE_INITIALIZED, [tree])
  return dbac
}

test('resolve dependencies correctly', async () => {
  const tree = await loadTestData()
  const dbac = getDbac(tree)

  const deps = tree.getAllDependencies()
  expect(deps).toEqual({
    'roles.test1': [
      '',
    ],
    'roles.test2': [
      '',
    ],
    'schemas.private_schema': [
      '',
    ],
    'schemas.public_schema': [
      '',
    ],
    'schemas.private_schema.functions.FF4': [
      'schemas.public_schema.types.TY1',
      'schemas.public_schema.tables.T3',
      'schemas.private_schema',
    ],
    'schemas.private_schema.tables.TT4': [
      'schemas.private_schema',
    ],
    'schemas.private_schema.tables.TT4.columns.col1': [
      'schemas.public_schema.types.TY1',
      'schemas.private_schema.tables.TT4',
    ],
    'schemas.public_schema.functions.F1': [
      'schemas.public_schema.tables.T1',
      'schemas.public_schema.tables.T2',
      'schemas.public_schema.tables.T3',
      'schemas.public_schema.types.TY2',
      'schemas.public_schema',
    ],
    'schemas.public_schema.functions.F2': [
      'schemas.public_schema.tables.T2',
      'schemas.public_schema',
    ],
    'schemas.public_schema.functions.F3': [
      'schemas.public_schema.types.TY2',
      'schemas.public_schema',
    ],
    'schemas.public_schema.tables.T1': [
      'schemas.public_schema',
    ],
    'schemas.public_schema.tables.T1.columns.id': [
      'schemas.public_schema.tables.T1',
    ],
    'schemas.public_schema.tables.T2': [
      'schemas.public_schema',
    ],
    'schemas.public_schema.tables.T2.columns.id': [
      'schemas.public_schema.tables.T2',
    ],
    'schemas.public_schema.tables.T3': [
      'schemas.public_schema',
    ],
    'schemas.public_schema.tables.T3.columns.col1': [
      'schemas.public_schema.types.TY3',
      'schemas.public_schema.tables.T3',
    ],
    'schemas.public_schema.tables.T5': [
      'schemas.public_schema',
    ],
    'schemas.public_schema.tables.T5.columns.col1': [
      'schemas.public_schema.tables.T5',
    ],
    'schemas.public_schema.tables.T5.foreignKeys[0]': [
      'schemas.public_schema.tables.T1',
      'schemas.public_schema.tables.T5',
    ],
    'schemas.public_schema.types.TY1': [
      'schemas.public_schema.tables.T1',
      'schemas.public_schema',
    ],
    'schemas.public_schema.types.TY1.attributes.t1': [
      'schemas.public_schema.types.TY1',
    ],
    'schemas.public_schema.types.TY2': [
      'schemas.public_schema.types.TY4',
      'schemas.public_schema',
    ],
    'schemas.public_schema.types.TY2.attributes.t4': [
      'schemas.public_schema.types.TY2',
    ],
    'schemas.public_schema.types.TY3': [
      'schemas.public_schema',
    ],
    'schemas.public_schema.types.TY4': [
      'schemas.public_schema',
    ],
  })

  // const backDeps = tree.createBackDependencies(deps)
  // expect(backDeps).toEqual({
  //   'schemas.public_schema.types.TY1': [
  //     'schemas.private_schema.functions.FF4',
  //     'schemas.private_schema.tables.TT4.columns.col1',
  //   ],
  //   'schemas.public_schema.types.TY2': [
  //     'schemas.public_schema.functions.F1',
  //     'schemas.public_schema.functions.F3',
  //   ],
  //   'schemas.public_schema.types.TY3': [
  //     'schemas.public_schema.tables.T3.columns.col1',
  //   ],
  //   'schemas.public_schema.types.TY4': [
  //     'schemas.public_schema.types.TY2',
  //   ],
  //   'schemas.public_schema.tables.T1': [
  //     'schemas.public_schema.types.TY1',
  //     'schemas.public_schema.functions.F1',
  //     'schemas.public_schema.tables.T5.foreignKeys[0]',
  //   ],
  //   'schemas.public_schema.tables.T2': [
  //     'schemas.public_schema.functions.F1',
  //     'schemas.public_schema.functions.F2',
  //   ],
  //   'schemas.public_schema.tables.T3': [
  //     'schemas.private_schema.functions.FF4',
  //     'schemas.public_schema.functions.F1',
  //   ],
  // })

  // const tree2 = await loadTestData()
  // const dbac = getDbac(tree2)
  // delete tree.schemas.public_schema.
  const changes = dbac.changes.collectChanges(undefined, tree, true)
  expect(changes.changes.map(c => c.path)).toEqual(expect.arrayContaining([
    '',
    'roles.test1',
    'roles.test2',
    'schemas.private_schema',
    'schemas.private_schema.tables.TT4',
    'schemas.private_schema.functions.FF4',
    'schemas.public_schema',
    'schemas.public_schema.types.TY1',
    'schemas.public_schema.types.TY2',
    'schemas.public_schema.types.TY3',
    'schemas.public_schema.types.TY4',
    'schemas.public_schema.tables.T1',
    'schemas.public_schema.tables.T2',
    'schemas.public_schema.tables.T3',
    'schemas.public_schema.tables.T5',
    'schemas.public_schema.functions.F1',
    'schemas.public_schema.functions.F2',
    'schemas.public_schema.functions.F3',
  ]))

  const orderedChanges = tree.getChildrenModificationCommands(changes, undefined)

  expect(orderedChanges.length).toEqual(changes.changes.length)
  expect(orderedChanges.map(c => c.path)).toEqual([
    '',
    'roles.test1',
    'roles.test2',
    'schemas.private_schema',
    'schemas.public_schema',
    'schemas.public_schema.types.TY3',
    'schemas.public_schema.tables.T3',
    'schemas.public_schema.tables.T1',
    'schemas.public_schema.types.TY1',
    'schemas.private_schema.functions.FF4',
    'schemas.private_schema.tables.TT4',
    'schemas.public_schema.types.TY4',
    'schemas.public_schema.types.TY2',
    'schemas.public_schema.tables.T2',
    'schemas.public_schema.functions.F1',
    'schemas.public_schema.functions.F2',
    'schemas.public_schema.functions.F3',
    'schemas.public_schema.tables.T5',
  ])
})
