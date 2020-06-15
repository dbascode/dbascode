/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */

/**
 * @var {Jest} jest
 */

import SqlRules from '../SqlRules'

test('loads and orders create changes correctly', async () => {
  const r = new SqlRules()

  expect(r.escapeSqlId('id')).toEqual("id")
});
