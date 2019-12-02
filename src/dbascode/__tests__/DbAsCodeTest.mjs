/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 01.12.2019
 * Time: 18:39
 */

import DbAsCode from '../DbAsCode'


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
