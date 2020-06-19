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

/**
 * @var {Jest} jest
 */

/**
 * Load this test test data
 * @returns {Promise<DataBase>}
 */
async function loadTestData(idx = '') {
  const s = await loadStateYaml([`./src/plugins/db-postgres/__tests__/TableTest.data${idx}.yml`])
  return DataBase.createFromState(DataBase, s, DbAsCode.version, PostgreSqlPlugin.version)
}

test('loads table config', async () => {
  const tree = await loadTestData()
  const schema = tree.getSchema('schema')
  expect(schema).not.toBeNull()
  const fktarget = tree.getSchema('schema').getTable('fktarget')
  expect(fktarget).toBeInstanceOf(Table)
  expect(fktarget).not.toBeNull()
  expect(fktarget.columns.id).toBeInstanceOf(Column)
  expect(fktarget.columns.id.isAutoIncrement).toBeTruthy()
  expect(fktarget.columns.id.allowNull).toBeFalsy()
  expect(fktarget.columns.id.type).toEqual({schema: undefined, type: 'int', isArray: false})
  expect(schema.sequences.fktarget_id_seq).toBeInstanceOf(Sequence)
  // Implicit FK from autoincrement
  expect(fktarget.primaryKey).toBeInstanceOf(PrimaryKey)
  expect(fktarget.primaryKey.columns).toEqual(['id'])

  const table = schema.tables.table
  expect(table).toBeInstanceOf(Table)
  expect(table.comment).toEqual('Table comment')

  expect(table.columns.id).toBeInstanceOf(Column)
  expect(table.columns.id.type).toEqual({schema: undefined, type: 'int', isArray: false})
  expect(table.columns.id.allowNull).toBeTruthy()
  expect(table.columns.id.foreignKey).toEqual('fktarget.id')

  expect(table.foreignKeys.length).toEqual(1)
  expect(table.foreignKeys[0]).toBeInstanceOf(ForeignKey)
  expect(table.foreignKeys[0].column).toEqual('id')
  expect(table.foreignKeys[0].ref).toEqual({schema: undefined, table: 'fktarget', column: 'id'})
  expect(table.foreignKeys[0].onDelete).toEqual('restrict')
  expect(table.foreignKeys[0].onUpdate).toEqual('restrict')

  expect(table.columns.value).toBeInstanceOf(Column)
  expect(table.columns.value.type).toEqual({schema: undefined, type: 'text', isArray: true})
  expect(table.columns.value.allowNull).toBeFalsy()

  expect(table.columns.value2).toBeInstanceOf(Column)
  expect(table.columns.value2.type).toEqual({schema: undefined, type: 'text', isArray: false})
  expect(table.columns.value2.defaultValue).toEqual('default value')

  expect(table.indexes.length).toEqual(1)
  expect(table.indexes[0]).toBeInstanceOf(Index)
  expect(table.indexes[0].columns).toEqual(['id'])

  expect(table.primaryKey).toBeInstanceOf(PrimaryKey)
  expect(table.primaryKey.columns).toEqual(['id', 'value'])

  expect(table.triggers.before_update).toBeInstanceOf(Trigger)
  expect(table.triggers.before_update.when).toEqual('before')
  expect(table.triggers.before_update.operation).toEqual('update')
  expect(table.triggers.before_update.what).toEqual('schema.update_modification_fields()')

  const table2 = schema.tables.table2
  expect(table2).toBeInstanceOf(Table)
  expect(table2.extends).toEqual('fktarget')
  expect(table2.columns.id).toBeInstanceOf(Column)
  expect(table2.columns.id.isInherited()).toBeTruthy()
  // Implicit FK from autoincrement
  expect(table2.primaryKey).toBeInstanceOf(PrimaryKey)
  expect(table2.primaryKey.isInherited()).toBeTruthy()
  expect(schema.sequences.table2_id_seq).toBeInstanceOf(Sequence)
})
