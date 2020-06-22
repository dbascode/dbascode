/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */

import { loadStateYaml } from '../../../dbascode/state-loader-yml'
import DbAsCode from '../../../dbascode/DbAsCode'
import PostgreSqlPlugin from '../PostgreSqlPlugin'
import DataBase from '../DataBase'
import Column from '../Column'
import Sequence from '../Sequence'
import Table from '../Table'
import ForeignKey from '../ForeignKey'
import Index from '../Index'
import PrimaryKey from '../PrimaryKey'
import Trigger from '../Trigger'
import Role from '../Role'
import Changes from '../../../dbascode/Changes'

/**
 * @var {Jest} jest
 */

/**
 * Load this test test data
 * @returns {Promise<DataBase>}
 */
async function loadTestData(idx = '') {
  const s = await loadStateYaml([`./src/plugins/db-postgres/__tests__/DataBaseTest.data${idx}.yml`])
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
`CREATE EXTENSION IF NOT EXISTS 'pgcrypto';
CREATE ROLE "role1" WITH NOLOGIN NOSUPERUSER INHERIT NOCREATEDB NOCREATEROLE NOREPLICATION;
CREATE SCHEMA "helpdesk_public" ;
CREATE TABLE "helpdesk_public"."t1" (
 "id" int  DEFAULT NULL
);`
  )
})
