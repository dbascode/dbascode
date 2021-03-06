/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */

import { loadStateYaml } from '../../../dbascode/state-loader-yml'
import DbAsCode from '../../../dbascode/DbAsCode'
import PostgreSqlPlugin from '../PostgreSqlPlugin'
import DataBase from '../DataBase'
import Function from '../Function'
import { getModuleDataPath } from '../test-utils'

/**
 * @var {Jest} jest
 */

/**
 * Load this test test data
 * @returns {Promise<DataBase>}
 */
async function loadTestData(idx = '') {
  const s = await loadStateYaml([getModuleDataPath(module.filename, idx)])
  const db = DataBase.createFromState(DataBase, s, DbAsCode.version, PostgreSqlPlugin.version, true)
  db.setupDependencies()
  return db
}

test('loads function', async() => {
  const tree = await loadTestData()
  const func = tree.schemas.schema.functions.func
  expect(func).toBeInstanceOf(Function)
  expect(func.language).toBe('plpgsql')
  expect(func.cost).toBe(555)
  expect(func.isSecurityDefiner).toBeTruthy()
  expect(func.language).toBe('plpgsql')
  expect(func.stability).toBe('stable')
  expect(func.parallelSafety).toBe('safe')
  expect(func.isLeakProof).toBeTruthy()
  expect(func.args).toMatchObject({
    a1: {
      schema: 'schema_public',
      type: 'type1',
      isArray: false,
    },
    a2: {
      schema: 'schema_private',
      type: 'type2',
      isArray: false,
    },
  })
  expect(func.code).toBe(
`DECLARE
    confirmRow "schema_private".confirmation_code%ROWTYPE;
    authRow "schema_private".service_auth_code%ROWTYPE;
    res "schema_public".admin_get_confirmation_code_result_status;
BEGIN
    CALL "schema_private".func1();
    SELECT * INTO authRow FROM "schema_private".service_auth_code WHERE;
    IF NOT FOUND THEN
        res.status := 'invalid'::"schema_public".admin_get_confirmation_code_result_status
        RETURN res;
    END IF;
    SELECT * INTO confirmRow FROM "schema_private".confirmation_code WHERE;
    IF NOT FOUND THEN
        res.status := 'pending'::"schema_public".admin_get_confirmation_code_result_status
        RETURN res;
    END IF;
    res.status := 'ok'::"schema_public".admin_get_confirmation_code_result_status
    res.code := confirmRow.code;
    res.client_info := confirmRow.client_info;
END;
`
  )
})

test('loads function dependencies', async() => {
  const tree = await loadTestData()
  const func = tree.schemas.schema.functions.func
  expect(func._dependencies).toMatchObject([
    'schemas.schema_public.types.type1',
    'schemas.schema_private.types.type2',
    'schemas.schema_public.types.admin_get_confirmation_code_result_status',
    'schemas.schema_private.tables.confirmation_code',
    'schemas.schema_private.tables.service_auth_code',
    'schemas.schema',
  ])
})

test('returns setof', async() => {
  const tree = await loadTestData(1)
  const func = tree.schemas.schema.functions.f1
  expect(func).toBeInstanceOf(Function)
  expect(func.getCreateSql()).toBe(
`CREATE OR REPLACE FUNCTION "schema"."f1"() RETURNS SETOF "schema"."t1" LANGUAGE 'sql'
  COST 10 VOLATILE NOT LEAKPROOF  PARALLEL UNSAFE
AS $BODY$
CODE
$BODY$;`
  )
})


test('scalar arg types', async() => {
  const tree = await loadTestData(2)
  const func = tree.schemas.schema.functions.f1
  expect(func).toBeInstanceOf(Function)
  expect(func.getCreateSql()).toBe(
`CREATE OR REPLACE FUNCTION "schema"."f1"("a1" int, "a2" text) RETURNS bigint LANGUAGE 'sql'
  COST 10 VOLATILE NOT LEAKPROOF  PARALLEL UNSAFE
AS $BODY$
CODE
$BODY$;`
  )
})

