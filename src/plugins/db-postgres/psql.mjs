import cp from 'child_process'
import { convertPathToWsl, escapeShellArg } from '../../dbascode/utils'

/**
 * Executes SQL using the psql command
 * @param {string} query
 * @param {object} config
 * @return {Promise<SqlExecResult>}
 */
export async function executeSql (query, config) {
  const commonCmd = [
    '--dbname=' + (config.db || ''),
    '--host=' + (config.host || ''),
    '--port=' + (config.port || ''),
    '--username=' + (config.user || ''),
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
  let process
  if (config.wsl) {
    process = cp.spawn(
      'bash',
      [
        '-c',
        `PGPASSWORD=${config.password || ''} psql ${commonCmd.join(' ')}`
      ],
    )
  } else {
    process = cp.spawn(
      'psql',
      commonCmd,
      {
        env: {
          PGPASSWORD: config.password,
        }
      },
    )
  }

  const result = {
    exitCode: 0,
    stdout: '',
    stderr: '',
  }

  let resolved = false
  await new Promise((resolve, reject) => {
    process.stdout.on('data', data => result.stdout += data)
    process.stderr.on('data', data => result.stderr += data)
    process.on('exit', code => {
      result.exitCode = code
      if (!resolved) {
        resolve()
      }
    })
    process.on('error', err => {
      if (!resolved) {
        if (result.exitCode === 0) {
          result.exitCode = -1
        }
        resolve()
      }
    })
  })

  return result
}

export async function executeSqlJson (queryString, config) {
  const result = await executeSql(
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
