/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */

import DbAsCode from '../../../dbascode/DbAsCode'
import PostgreSqlPlugin from '../../db-postgres/PostgreSqlPlugin'
import Table from '../../db-postgres/Table'
import Function from '../../db-postgres/Function'
import PostgraphilePlugin from '../PostgraphilePlugin'
import { getModuleDataPath } from '../../db-postgres/test-utils'
import Changes from '../../../dbascode/Changes.mjs'
import { loadStateYaml } from '../../../dbascode/state-loader-yml.mjs'
import DataBase from '../../db-postgres/DataBase.mjs'
import { TREE_INITIALIZED } from '../../../dbascode/PluginEvent.mjs'

/**
 * @var {Jest} jest
 */

/**
 * Load this test test data
 * @returns [Promise<State>, Promise<DataBase>]
 */
// async function loadTestData(idx = '') {
//   const dbAsCode = new DbAsCode(
//     {
//       source: getModuleDataPath(module.filename, idx),
//     },
//     [
//       PostgreSqlPlugin,
//       PostgraphilePlugin,
//     ],
//   )
//   await dbAsCode.initializePlugins()
//   await dbAsCode.determineCurrentDbmsType('postgres')
//   const plan = await dbAsCode.createPlan({forceOldState: true})
//   return [plan, dbAsCode.changes.newTree]
// }

/**
 * Load this test test data
 * @returns {Promise<AbstractDataBase>}
 */
async function loadTestData (idx) {
  const s = await loadStateYaml([getModuleDataPath(module.filename, idx)])
  const tree = DataBase.createFromState(DataBase, s, DbAsCode.version, PostgreSqlPlugin.version)
  await applyPlugins(tree)
  tree.setupDependencies()
  return tree
}

async function applyPlugins (tree) {
  const dbac = new DbAsCode(
    {},
    [
      PostgreSqlPlugin,
      PostgraphilePlugin,
    ],
  )
  await dbac.initializePlugins();
  dbac.pluginEvent(TREE_INITIALIZED, [tree])
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

test('creates correct omit SQL', async () => {
  const tree = await loadTestData()
  const changes = new Changes(undefined, tree)
  changes.collectChanges(true)
  expect(changes.getChangesSql()).toBe(
`CREATE SCHEMA "schema" ;
CREATE OR REPLACE PROCEDURE "schema"."func"()  LANGUAGE 'sql'
      
AS $BODY$

$BODY$;
COMMENT ON PROCEDURE "schema"."func"() IS '@omit';
CREATE TABLE "schema"."table" (
 "id" int  DEFAULT NULL
);
COMMENT ON COLUMN "schema"."table"."id" IS '@omit';
COMMENT ON TABLE "schema"."table" IS '@omit
Table comment';`
  )
})

test('creates correct omit SQL for updated omit', async () => {
  const tree = await loadTestData(1)
  const tree2 = await loadTestData(2)

  const changes = new Changes(tree, tree2)
  changes.collectChanges(true)

  expect(changes.getChangesSql()).toBe(
`COMMENT ON TABLE "schema"."table" IS '@omit create,update,delete
Table comment';`
  )
})
