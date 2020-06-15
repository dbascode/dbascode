/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */

/**
 * @var {Jest} jest
 */
import { loadStateYaml } from '../state-loader-yml'
import DbAsCode from '../DbAsCode'
import PostgreSqlPlugin from '../../plugins/db-postgres/PostgreSqlPlugin'
import PostgraphilePlugin from '../../plugins/tools-postgres-postgraphile/PostgraphilePlugin'
import RowLevelSecurityPlugin from '../../plugins/tools-postgres-rls/RowLevelSecurityPlugin'
import DefaultRowsPlugin from '../../plugins/tools-postgres-default-rows/DefaultRowsPlugin'
import { TREE_INITIALIZED } from '../PluginEvent'
import DataBase from '../../plugins/db-postgres/DataBase'
import Changes from '../Changes'
import isObject from 'lodash-es/isObject'

/**
 * Load this test test data
 * @returns {Promise<AbstractDataBase>}
 */
async function loadTestData (idx) {
  const s = await loadStateYaml([`./src/dbascode/__tests__/ChangesTest.data${idx}.yml`])
  const tree = DataBase.createFromState(DataBase, s, DbAsCode.version, PostgreSqlPlugin.version)
  applyPlugins(tree)
  return tree
}

function applyPlugins (tree) {
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
}

function formatChange(v) {
  if (isObject(v)) {
    return v.class ? v.class : Object.values(v).join(',')
  } else {
    return v ? v : '~'
  }
}

function formatChangeLine(c) {
  return `${c.path}: ${formatChange(c.old)} -> ${formatChange(c.cur)}`
}

test('loads and orders create changes correctly', async () => {
  const tree = await loadTestData(1)

  const changes = new Changes(undefined, tree)
  changes.collectChanges(true)
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

  const orderedChanges = changes.orderedChanges

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
});

test('loads and orders modify changes correctly', async () => {
  const tree = await loadTestData(1)
  const tree2 = await loadTestData(2)

  const changes = new Changes(tree, tree2)
  changes.collectChanges(true)

  expect(changes.changes.map(formatChangeLine)).toEqual(expect.arrayContaining([
    'comment: ~ -> DB comment',
    'schemas.private_schema.functions.FF4.cost: 2000 -> 10',
    'schemas.private_schema.tables.TT4.comment: Test comment -> ~',
    'schemas.private_schema.comment: ~ -> Schema comment',
    'schemas.public_schema.tables.T1.comment: Test comment T1 -> ~',
    'schemas.public_schema.tables.T2.comment: ~ -> Test comment T2',
    'schemas.public_schema.tables.T3.comment: ~ -> Test comment T3',
  ]))

  const orderedChanges = changes.orderedChanges

  expect(orderedChanges.length).toEqual(changes.changes.length)
  expect(orderedChanges.map(formatChangeLine)).toEqual([
    'schemas.private_schema.functions.FF4.cost: 2000 -> 10',
    'schemas.private_schema.tables.TT4.comment: Test comment -> ~',
    'schemas.private_schema.comment: ~ -> Schema comment',
    'schemas.public_schema.tables.T1.comment: Test comment T1 -> ~',
    'schemas.public_schema.tables.T2.comment: ~ -> Test comment T2',
    'schemas.public_schema.tables.T3.comment: ~ -> Test comment T3',
    'comment: ~ -> DB comment',
  ])
})

test('loads and orders drop changes correctly', async () => {
  const tree = await loadTestData(1)
  const tree2 = await loadTestData(3)

  const changes = new Changes(tree, tree2)
  changes.collectChanges(true)

  expect(changes.changes.map(formatChangeLine)).toEqual(expect.arrayContaining([
    'schemas.private_schema: Schema -> ~',
    'schemas.private_schema.functions.FF4: Function -> ~',
    'schemas.private_schema.tables.TT4: Table -> ~',
    'schemas.public_schema.functions.F1.args.A3: public_schema,T3,false -> ~',
    'schemas.public_schema.functions.F3: Function -> ~',
    'schemas.public_schema.tables.T1.comment: Test comment T1 -> ~',
    'schemas.public_schema.tables.T2.comment: ~ -> Test comment T2',
    'schemas.public_schema.tables.T3.comment: ~ -> Test comment T3',
    'schemas.public_schema.tables.T3.columns.col2: Column -> ~',
  ]))

  const orderedChanges = changes.orderedChanges

  expect(orderedChanges.length).toEqual(changes.changes.length)
  expect(orderedChanges.map(formatChangeLine)).toEqual([
    'schemas.private_schema.tables.TT4: Table -> ~',
    'schemas.private_schema.functions.FF4: Function -> ~',
    'schemas.private_schema: Schema -> ~',
    'schemas.public_schema.functions.F1.args.A3: public_schema,T3,false -> ~',
    'schemas.public_schema.functions.F3: Function -> ~',
    'schemas.public_schema.tables.T1.comment: Test comment T1 -> ~',
    'schemas.public_schema.tables.T2.comment: ~ -> Test comment T2',
    'schemas.public_schema.tables.T3.columns.col2: Column -> ~',
    'schemas.public_schema.tables.T3.comment: ~ -> Test comment T3',
  ])
})

test('function arguments deletion is correct', async () => {
  const tree = await loadTestData(4)
  const tree2 = await loadTestData(5)

  const changes = new Changes(tree, tree2)
  changes.collectChanges(true)

  expect(changes.changes.map(formatChangeLine)).toEqual([
    'schemas.public_schema.functions.F1.args.A1: public_schema,T1,false -> ~',
  ])
})

test('creates table sql', async () => {
  const tree = await loadTestData('-sql')

  const changes = new Changes(undefined, tree)
  changes.collectChanges(true)

  expect(changes.changes.map(formatChangeLine)).toEqual([
    ': ~ -> DataBase',
    'schemas.public_schema: ~ -> Schema',
    'schemas.public_schema.tables.T1: ~ -> Table',
  ])

  expect(changes.changes.length).toEqual(changes.orderedChanges.length)

  expect(changes.getChangesSql()).toEqual(
`CREATE SCHEMA "public_schema" ;
CREATE TABLE "public_schema"."T1" (
 "id" int  DEFAULT NULL,
 "name" text  DEFAULT NULL,
 "value" text  DEFAULT NULL
);`
  )
})

test('group changes of simple props on single db object ', async () => {
  const tree = await loadTestData('-sql')
  const tree2 = await loadTestData('-sql1')

  const changes = new Changes(tree, tree2)
  changes.collectChanges(true)

  expect(changes.orderedChanges.length).toEqual(changes.changes.length)

  expect(changes.orderedChanges.map(formatChangeLine)).toEqual([
    'schemas.public_schema.tables.T1.columns.value.allowNull: ~ -> true',
    'schemas.public_schema.tables.T1.columns.value.comment: ~ -> Comment',
    'schemas.public_schema.tables.T2: ~ -> Table',
  ])

  expect(changes.getChangesSql()).toEqual(
`ALTER TABLE "public_schema"."T1" ALTER COLUMN "value" DROP NOT NULL;
COMMENT ON COLUMN "public_schema"."T1"."value" IS 'Comment';
CREATE TABLE "public_schema"."T2" (
 "id" int  DEFAULT NULL
);`
  )
})
