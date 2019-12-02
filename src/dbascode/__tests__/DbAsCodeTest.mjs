/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 01.12.2019
 * Time: 18:39
 */

import DbAsCode from '../DbAsCode'
import Data from './DbAsCodeTest.data'


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
      source: __dirname + '/DbAsCodeTest.data.yml',
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

