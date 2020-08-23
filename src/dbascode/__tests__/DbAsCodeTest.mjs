/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */
import fs from 'fs'
import DbAsCode from '../DbAsCode'
import Data from './DbAsCodeTest.data'
import { TREE_INITIALIZED } from '../PluginEvent'
import State from '../State'
import ChangesContext from '../ChangesContext'

/**
 * @var {Jest} jest
 */

test('throw error if plugin not found', async () => {
  const inst = new DbAsCode({}, [])
  expect(() => {inst.getPlugin('no-plugin')}).toThrowError('Plugin no-plugin not found')
})

test('initializes non-initialized plugin', async () => {
  const inst = new DbAsCode({}, [])
  const initProc = jest.fn()
  inst._pluginsMap = {plugin: { initialized: false, init: initProc }}
  expect(inst.getPlugin('plugin')).toBe(inst._pluginsMap.plugin)
  expect(initProc.mock.calls.length).toBe(1)
})

test('dont initialize already initialized plugin', async () => {
  const inst = new DbAsCode({}, [])
  const initProc = jest.fn()
  inst._pluginsMap = {plugin: { initialized: true, init: initProc }}
  expect(inst.getPlugin('plugin')).toBe(inst._pluginsMap.plugin)
  expect(initProc.mock.calls.length).toBe(0)
})

test('load preloaded plugins', async () => {
  let p
  const inst = new DbAsCode({}, [
    p = {
      name: "test plugin 1"
    },
  ])
  const initProc = jest.fn()
  await inst.initializePlugins()
  expect(inst._pluginsMap['test plugin 1']).toBe(p)
})

test('load plugins by path', async () => {
  const inst = new DbAsCode({}, [
    './__tests__/DbAsCodeTest.data.mjs',
  ])
  await inst.initializePlugins()
  expect(inst._pluginsMap['test plugin 2']).toBe(Data)
})

test('init using forced DBMS type', async () => {
  const inst = new DbAsCode({}, [
    {
      name: 'test-plugin',
      dbClass: {
        dbms: 'force-dbms',
      },
      stateStoreClass: {},
    }
  ])
  await inst.initializePlugins()
  inst.getDbPlugin = () => inst._plugins[0]
  await inst.determineCurrentDbmsType('force-dbms')
  expect(inst._dbPluginName).toBe('test-plugin')
})

test('init DBMS type fail if no plugins found', async () => {
  const inst = new DbAsCode({}, [])
  await inst.initializePlugins()
  try {
    await inst.determineCurrentDbmsType('force-dbms')
    throw new Error('Not expected to be called')
  } catch (e) {
    expect(e.message).toBe('Can not find implementation plugin for the force-dbms DBMS')
  }
})

test('init DBMS type fail if plugin found but not state storage found', async () => {
  const inst = new DbAsCode({}, [
    {
      name: 'test-plugin',
      dbClass: {
        dbms: 'force-dbms',
      },
    }
  ])
  inst.getDbPlugin = () => inst._plugins[0]
  await inst.initializePlugins()
  try {
    await inst.determineCurrentDbmsType('force-dbms')
    throw new Error('Not expected to be called')
  } catch (e) {
    expect(e.message).toBe('DBMS plugin for force-dbms was found, but it doesn\'t expose the StateStorage class')
  }
})

test('init DBMS using config value', async () => {
  const inst = new DbAsCode(
    {
      dbms: 'cfg-dbms'
    },
    [{
      name: 'test-plugin',
      dbClass: {
        dbms: 'cfg-dbms',
      },
      stateStoreClass: {},
    }]
  )
  await inst.initializePlugins()
  inst.getDbPlugin = () => inst._plugins[0]
  await inst.determineCurrentDbmsType('cfg-dbms')
  expect(inst._dbPluginName).toBe('test-plugin')
})

test('init DBMS using state value', async () => {
  const inst = new DbAsCode(
    {
      source: __dirname + '/DbAsCodeTest1.data.yml',
    },
    [{
      name: 'test-plugin',
      dbClass: {
        dbms: 'state-dbms',
      },
      stateStoreClass: {},
    }]
  )
  await inst.initializePlugins()
  inst.getDbPlugin = () => inst._plugins[0]
  await inst.determineCurrentDbmsType('state-dbms')
  expect(inst._dbPluginName).toBe('test-plugin')
})

test('returns db plugin by its name', () => {
  const inst = new DbAsCode()
  inst._dbPluginName = 'test-plug'
  let p
  inst._pluginsMap = {
    'test-plug': p = {
      initialized: true,
    }
  }
  expect(inst.getDbPlugin()).toBe(p)
})

test('create plan succeed on both states exists', async () => {
  const inst = new DbAsCode(
    {
      source: __dirname + '/DbAsCodeTest1.data.yml',
    },
    [],
  )
  let cfs, prevTree, curTree
  inst._pluginsMap = {
    'test-plug': {
      name: 'test-plug',
      initialized: true,
      getStateStore: () => ({
        getStorageConfigPath: () => '',
        getState: () => new State({id: 1}),
      }),
      getDbName: () => 'test',
      dbClass: {
        createFromState: cfs = jest.fn()
          .mockReturnValueOnce(prevTree = {
            _old: 1,
            validate: () => {},
            dispose: () => {},
          })
          .mockReturnValueOnce(curTree = {
            validate: jest.fn(),
            dispose: () => {},
          }),
      },
    },
  }
  inst._dbPluginName = 'test-plug'
  inst.getMigrationSql = () => 'migration sql'
  inst.pluginEvent = jest.fn()
  const state = await inst.createPlan({})
  expect(inst.pluginEvent.mock.calls[0][0]).toBe(TREE_INITIALIZED)
  expect(inst.pluginEvent.mock.calls[0][1]).toEqual([prevTree])
  expect(inst.pluginEvent.mock.calls[1][0]).toBe(TREE_INITIALIZED)
  expect(inst.pluginEvent.mock.calls[1][1]).toEqual([curTree])
  expect(curTree.validate.mock.calls.length).toBe(1)
  expect(state).toEqual(new State({
    id: 2,
    raw: {
      dbms: 'state-dbms',
    },
    migrationSql: 'migration sql',
    dbAsCodeVersion: DbAsCode.version,
    oldId: 1,
  }))
  expect(state.hasChanges).toBeFalsy()
})


test('create plan succeed on prev state not exists', async () => {
  const inst = new DbAsCode(
    {
      source: __dirname + '/DbAsCodeTest1.data.yml',
    },
    [],
  )
  let cfs, prevTree, curTree
  inst._pluginsMap = {
    'test-plug': {
      name: 'test-plug',
      initialized: true,
      getStateStore: () => ({
        getStorageConfigPath: () => '',
        getState: () => new State({id: 0}),
      }),
      getDbName: () => 'test',
      dbClass: {
        createFromState: cfs = jest.fn()
          .mockReturnValueOnce(undefined)
          .mockReturnValueOnce(curTree = {
            validate: jest.fn(),
            dispose: () => {},
            getAllDependencies: () => ({}),
            getAllChildrenRecurse: () => ([]),
          }),
      },
    },
  }
  inst._dbPluginName = 'test-plug'
  inst.getMigrationSql = () => 'migration sql'
  inst.pluginEvent = jest.fn()
  const state = await inst.createPlan({})
  expect(inst.pluginEvent.mock.calls[0][0]).toBe(TREE_INITIALIZED)
  expect(inst.pluginEvent.mock.calls[0][1]).toEqual([curTree])
  expect(curTree.validate.mock.calls.length).toBe(1)
  expect(state).toEqual(new State({
    id: 1,
    raw: {
      dbms: 'state-dbms',
    },
    migrationSql: 'migration sql',
    dbAsCodeVersion: DbAsCode.version,
    oldId: 0,
    hasChanges: true,
    hasSqlChanges: true,
  }))
  expect(state.hasChanges).toBeTruthy()
})

test('create plan succeed on new state not exists', async () => {
  const inst = new DbAsCode(
    {
      source: __dirname + '/DbAsCodeTest1.data.yml',
    },
    [],
    {
      collectChanges: () => {return new ChangesContext(true)},
    }
  )
  let cfs, prevTree, curTree
  inst._pluginsMap = {
    'test-plug': {
      name: 'test-plug',
      initialized: true,
      getStateStore: () => ({
        getStorageConfigPath: () => '',
        getState: () => new State({id: 3}),
      }),
      getDbName: () => 'test',
      dbClass: {
        createFromState: cfs = jest.fn()
          .mockReturnValueOnce(prevTree = {
            _old: 1,
            validate: () => {},
            dispose: () => {},
            createBackDependencies: () => ({}),
            getAllDependencies: () => ({}),
            getAllChildrenRecurse: () => ([]),
            getDroppedByParent: () => false,
            getChildrenDefCollection: () => ({defs: []}),
          })
          .mockReturnValueOnce(undefined),
      },
    },
  }
  inst._dbPluginName = 'test-plug'
  inst.getMigrationSql = () => 'migration sql'
  inst.pluginEvent = jest.fn()
  const state = await inst.createPlan({})
  expect(inst.pluginEvent.mock.calls[0][0]).toBe(TREE_INITIALIZED)
  expect(inst.pluginEvent.mock.calls[0][1]).toEqual([prevTree])
  expect(state).toEqual(new State({
    id: 4,
    raw: {
      dbms: 'state-dbms',
    },
    migrationSql: 'migration sql',
    dbAsCodeVersion: DbAsCode.version,
    oldId: 3,
    hasChanges: true,
    hasSqlChanges: true,
  }))
  expect(state.hasChanges).toBeTruthy()
})

test('migrate successfully', async () => {
  const inst = new DbAsCode()
  const executeSql = jest.fn(file => {
    const s = fs.readFileSync(file).toString()
    if (s !== "Migration SQL\nState SQL") {
      throw new Error("Invalid SQL")
    }
    return {
      exitCode: 0,
      stderr: '',
      stdout: '',
    }
  })
  const getStateSaveSql = jest.fn().mockReturnValue('State SQL')
  inst._pluginsMap = {
    'test-plug': {
      name: 'test-plug',
      initialized: true,
      getStateStore: () => ({
        getStateSaveSql,
      }),
      getSqlExec: () => ({
        executeSql
      }),
    },
  }
  const state = new State({id: 5, raw: {a: 1}, migrationSql: 'Migration SQL'})
  inst._dbPluginName = 'test-plug'
  expect(await inst.migrate(state)).toBe(0)
  expect(getStateSaveSql.mock.calls[0][0]).toBe(state)
  expect(executeSql.mock.calls.length).toBe(1)
})

test('migration failed by exit code', async () => {
  const inst = new DbAsCode()
  const executeSql = jest.fn(file => {
    const s = fs.readFileSync(file).toString()
    if (s !== "Migration SQL\nState SQL") {
      throw new Error("Invalid SQL")
    }
    return {
      exitCode: 1,
      stderr: '',
      stdout: '',
    }
  })
  const getStateSaveSql = jest.fn().mockReturnValue('State SQL')
  inst._pluginsMap = {
    'test-plug': {
      name: 'test-plug',
      initialized: true,
      getStateStore: () => ({
        getStateSaveSql,
      }),
      getSqlExec: () => ({
        executeSql
      }),
    },
  }
  const state = new State({id: 5, raw: {a: 1}, migrationSql: 'Migration SQL'})
  inst._dbPluginName = 'test-plug'
  expect(await inst.migrate(state)).toBe(1)
  expect(getStateSaveSql.mock.calls[0][0]).toBe(state)
  expect(executeSql.mock.calls.length).toBe(1)
})

test('migration failed by exception', async () => {
  const inst = new DbAsCode()
  const executeSql = jest.fn(file => {
    const s = fs.readFileSync(file).toString()
    if (s !== "Migration SQL\nState SQL") {
      throw new Error("Invalid SQL")
    }
    throw new Error('Test error')
  })
  const getStateSaveSql = jest.fn().mockReturnValue('State SQL')
  inst._pluginsMap = {
    'test-plug': {
      name: 'test-plug',
      initialized: true,
      getStateStore: () => ({
        getStateSaveSql,
      }),
      getSqlExec: () => ({
        executeSql
      }),
    },
  }
  const state = new State({id: 5, raw: {a: 1}, migrationSql: 'Migration SQL'})
  inst._dbPluginName = 'test-plug'
  expect(await inst.migrate(state)).toBe(-1)
  expect(getStateSaveSql.mock.calls[0][0]).toBe(state)
  expect(executeSql.mock.calls.length).toBe(1)
})
