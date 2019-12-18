/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */

import Column from '../Column'
import ValidationContext from '../../../dbascode/ValidationContext'
import DataBase from '../DataBase'
import { loadStateYaml } from '../../../dbascode/state-loader-yml'
import DbAsCode from '../../../dbascode/DbAsCode'
import PostgreSqlPlugin from '../PostgreSqlPlugin'

/**
 * @var {Jest} jest
 */

/**
 * Load this test test data
 * @returns {Promise<AbstractDataBase>}
 */
async function loadTestData() {
  const s = await loadStateYaml(['./src/plugins/db-postgres/__tests__/ColumnTest.data.yml'])
  return DataBase.createFromState(DataBase, s, DbAsCode.version, PostgreSqlPlugin.version)
}

test('validate fail on unknown type', async () => {
  const col = new Column({name: 'test'})
  col.type = 'asdfg'
  const ctx = new ValidationContext(undefined, undefined)
  col.validate(undefined, ctx)
  expect(ctx.hasErrors()).toBeTruthy()
  expect(ctx.errors[0].message).toEqual('Unknown column type: asdfg')
})

test('validate success on a known type', async () => {
  const col = new Column({name: 'test'})
  col.type = 'text'
  const ctx = new ValidationContext(undefined, undefined)
  col.validate(undefined, ctx)
  expect(ctx.hasErrors()).toBeFalsy()
})

test('validate success on the numeric type', async () => {
  const col = new Column({name: 'test'})
  col.type = 'numeric(21,6)'
  const ctx = new ValidationContext(undefined, undefined)
  col.validate(undefined, ctx)
  expect(ctx.hasErrors()).toBeFalsy()
})

test('validate fail on autoincrement on non-integer', async () => {
  const col = new Column({name: 'test'})
  col.type = 'text'
  col.isAutoIncrement = true
  const ctx = new ValidationContext(undefined, undefined)
  col.validate(undefined, ctx)
  expect(ctx.hasErrors()).toBeTruthy()
  expect(ctx.errors[0].message).toEqual('Autoincrement values are only allowed on integer fields, text specified')
})

test('validate success on autoincrement on integer', async () => {
  const col = new Column({name: 'test'})
  col.type = 'bigint'
  col.isAutoIncrement = true
  const ctx = new ValidationContext(undefined, undefined)
  col.validate(undefined, ctx)
  expect(ctx.hasErrors()).toBeFalsy()
})

test('validate fail on custom type schema not found', async () => {
  const tree = await loadTestData()
  const col = tree.getSchema('test-schema').getTable('test-table1').columns['col1']
  const ctx = new ValidationContext(undefined, undefined)
  col.validate(undefined, ctx)
  expect(ctx.hasErrors()).toBeTruthy()
  expect(ctx.errors[0].message).toEqual('Unknown column type: wrong-schema.wrong-type - schema wrong-schema not found')
})

test('validate fail on custom type not found', async () => {
  const tree = await loadTestData()
  const col = tree.getSchema('test-schema').getTable('test-table1').columns['col2']
  const ctx = new ValidationContext(undefined, undefined)
  col.validate(undefined, ctx)
  expect(ctx.hasErrors()).toBeTruthy()
  expect(ctx.errors[0].message).toEqual('Unknown column type: test-schema.wrong-type - type wrong-type not found in schema test-schema')
})

test('validate custom type success', async () => {
  const tree = await loadTestData()
  const col = tree.getSchema('test-schema').getTable('test-table1').columns['col3']
  const ctx = new ValidationContext(undefined, undefined)
  col.validate(undefined, ctx)
  expect(ctx.hasErrors()).toBeFalsy()
})

test('validate custom type array success', async () => {
  const tree = await loadTestData()
  const col = tree.getSchema('test-schema').getTable('test-table1').columns['col4']
  const ctx = new ValidationContext(undefined, undefined)
  col.validate(undefined, ctx)
  expect(ctx.hasErrors()).toBeFalsy()
})
