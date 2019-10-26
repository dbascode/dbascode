import cp from 'child_process'
import { convertPathToWsl, escapeShellArg } from './utils'

function executeSql (query, config) {
  const commonCmd = [
    '--dbname=' + (config.dbName || ''),
    '--host=' + (config.dbHost || ''),
    '--port=' + (config.dbPort || ''),
    '--username=' + (config.dbUser || ''),
    '--single-transaction',
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
  if (config.wsl) {
    const result = cp.spawnSync(
      'bash',
      [
        '-c',
        `PGPASSWORD=${config.dbPassword || ''} psql ${commonCmd.join(' ')}`
      ],
    )
    return {
      exitCode: result.status,
      stdout: result.stdout.toString(),
      stderr: result.stderr.toString(),
    }
  } else {
    const result = cp.spawnSync(
      'psql',
      commonCmd,
      {
        env: {
          PGPASSWORD: config.dbPassword,
        }
      },
    )
    return {
      exitCode: Number(result.status),
      stdout: result.stdout.toString(),
      stderr: result.stderr.toString(),
    }
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
  return {
    ...result,
    result: result.stdout ? JSON.parse(result.stdout) : null,
  }
}

export {
  executeSql,
  executeSqlJson,
}
