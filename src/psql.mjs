import cp from 'child_process'
import { convertPathToWsl, escapeShellArg } from './utils'

function executeSql (query, config) {
  const commonCmd = [
    '--dbname=' + (config.dbName || ''),
    '--host=' + (config.dbHost || ''),
    '--port=' + (config.dbPort || ''),
    '--username=' + (config.dbUser || ''),
    '--single-transaction',
    '-v',
    'ON_ERROR_STOP=1'
  ]
  if (config.plainResult) {
    commonCmd.push('-t')
  }
  if (config.isFile) {
    commonCmd.push('--file=' + (config.wsl ? convertPathToWsl(query) : query))
  } else {
    commonCmd.push('-c')
    commonCmd.push(config.wsl ? escapeShellArg(query) : query)
  }
  let result
  if (config.wsl) {
    result = cp.spawnSync(
      'bash',
      [
        '-c',
        `PGPASSWORD=${config.dbPassword || ''} psql ${commonCmd.join(' ')}`
      ],
    )
  } else {
    result = cp.spawnSync(
      'psql',
      commonCmd,
      {
        env: {
          PGPASSWORD: config.dbPassword,
        }
      },
    )
  }
  const err = result.stderr.toString()
  return {
    exitCode: result.status,
    stdout: result.stdout.toString(),
    stderr: err,
  }
}

function executeSqlJson (queryString, config) {
  const result = executeSql(
    `SELECT json_agg(__query) FROM (${queryString}) __query`,
    {
      ...config,
      plainResult: true,
      isFile: false,
    }
  )
  const res = result.stdout ? result.stdout.trim() : null
  return {
    ...result,
    result: res ? JSON.parse(res) : [],
  }
}

export {
  executeSql,
  executeSqlJson,
}
