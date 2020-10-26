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
import { getModuleDataPath } from '../../db-postgres/test-utils'
import { TREE_INITIALIZED } from '../../../dbascode/PluginEvent'

/**
 * @var {Jest} jest
 */

/**
 * Load this test test data
 * @returns [Promise<State>, Promise<DataBase>]
 */
async function loadTestData(idx = '') {
  const dbAsCode = new DbAsCode(
    {
      source: getModuleDataPath(module.filename, idx),
    },
    [
      PostgreSqlPlugin,
      PostgraphilePlugin,
    ],
  )
  await dbAsCode.initializePlugins()
  await dbAsCode.determineCurrentDbmsType('postgres')
  const plan = await dbAsCode.createPlan({forceOldState: true})
  return [plan, dbAsCode.changes.newTree]
}

test('loads omit fields', async () => {
  const tree = (await loadTestData())[1]
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
  const state = (await loadTestData())[0]
  expect(state.migrationSql).toBe(
`CREATE SCHEMA "dbascode" ;
CREATE TABLE "dbascode"."state" (
 "id" int  DEFAULT NULL,
 "date" timestamp with time zone NOT NULL DEFAULT now(),
 "state" text  DEFAULT NULL,
 "migration" text  DEFAULT NULL,
 "dbascode_version" int  DEFAULT NULL,
 "plugin_version" int  DEFAULT NULL,
CONSTRAINT "state_pkey" PRIMARY KEY ("id")
);
COMMENT ON TABLE "dbascode"."state" IS 'Current state storage for PgAsCode';
CREATE INDEX "state_date_idx" ON "dbascode"."state" ("date");
CREATE INDEX "state_dbascode_version_idx" ON "dbascode"."state" ("dbascode_version");
CREATE INDEX "state_plugin_version_idx" ON "dbascode"."state" ("plugin_version");
CREATE SCHEMA "schema" ;
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
