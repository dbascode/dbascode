/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */

import { loadStateYaml } from '../../../dbascode/state-loader-yml'
import DbAsCode from '../../../dbascode/DbAsCode'
import PostgreSqlPlugin from '../PostgreSqlPlugin'
import DataBase from '../DataBase'
import Role from '../Role'
import Changes from '../../../dbascode/Changes'
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
  return DataBase.createFromState(DataBase, s, DbAsCode.version, PostgreSqlPlugin.version)
}

test('loads db config', async () => {
  const tree = await loadTestData()
  expect(tree).toBeInstanceOf(DataBase)
  expect(tree.defaultLocale).toBe('en-US')
  expect(tree.extensions).toMatchObject(['pgcrypto'])
  expect(tree.roles.role1).toBeInstanceOf(Role)
  expect(tree.dbmsVersion).toBe(12)
  expect(tree.params).toMatchObject({
    privateSchema: 'helpdesk_private',
    publicSchema: 'helpdesk_public',
  })

  const changes = new Changes(undefined, tree)
  changes.collectChanges(true)

  expect(changes.getChangesSql()).toBe(
`CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE ROLE "role1" WITH NOLOGIN NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;
CREATE SCHEMA "helpdesk_public" ;
CREATE TABLE "helpdesk_public"."t1" (
 "id" int  DEFAULT NULL
);`
  )
})

test('table sql', async () => {
  const tree = await loadTestData(2)
  expect(tree).toBeInstanceOf(DataBase)

  const changes = new Changes(undefined, tree)
  changes.collectChanges(true)

  expect(changes.getChangesSql()).toBe(
`CREATE SCHEMA "helpdesk_public" ;
CREATE TABLE "helpdesk_public"."t2" (
 "id" int  DEFAULT NULL
);
CREATE TABLE "helpdesk_public"."t1" (
 "id" int  DEFAULT NULL,
 "value" text  DEFAULT NULL,
 "email" text  DEFAULT NULL,
 "t2_id" int  DEFAULT NULL,
CONSTRAINT "t1_email_idx" UNIQUE ("email"),
CONSTRAINT "t2_id_fkey" FOREIGN KEY ("t2_id")
      REFERENCES "helpdesk_public"."t2" ("id") 
      MATCH SIMPLE ON UPDATE RESTRICT ON DELETE RESTRICT
);
COMMENT ON COLUMN "helpdesk_public"."t1"."t2_id" IS 'Comment on FK';
CREATE INDEX "t1_id_idx" ON "helpdesk_public"."t1" ("id");
CREATE INDEX "t1_value_idx" ON "helpdesk_public"."t1" ("value");`
  )
})

