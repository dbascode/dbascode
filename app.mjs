/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 02.10.2019
 * Time: 19:39
 */
import fs from 'fs'
import path from 'path'
import yargs from 'yargs'
import DataBase from './src/db-classes/DataBase'
import { loadConfig } from './src/loader'
import { fileURLToPath } from 'url'
import PostgraphilePlugin from './src/plugins/PostgraphilePlugin'
import { getLoadLastStateSql, getStateSaveSql } from './src/db-classes/utils'
import { executeSql, executeSqlJson } from './src/psql'
import os from 'os'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectDir = __dirname

const showChangesCmd = 'show-changes'
const migrateCmd = 'migrate'
const planCmd = 'plan'

const defaultConfigFile = path.join(__dirname, 'default-sys', 'db.yml')

const cliConfig = yargs
  .command({
    command: `${migrateCmd} <source>`,
    desc: 'Create SQL migrations based on config differences',
    builder: yargs => {
      yargs.positional('source', {
        describe: 'Directory to read database state from',
      })
    }
  })
  .command({
    command: `${planCmd} <source>`,
    desc: 'Displays changes without performing actual migration. If the `migration-file` or `state-file` ' +
      'options are set, an SQL dump and current state data will be saved.',
    builder: yargs => {
      yargs.positional('source', {
        describe: 'Directory to read database state from',
      })
    }
  })
  .command({
    command: `${showChangesCmd} <source>`,
    desc: 'Show changes without creating any files',
    builder: yargs => {
      yargs.positional('source', {
        describe: 'Directory to read database state from',
      })
    }
  })
  .option('db-host', {
    default: process.env.DB_HOST,
    describe: 'Database host name',
  })
  .option('db-port', {
    default: process.env.DB_PORT || 5432,
    describe: 'Database port',
  })
  .option('db-name', {
    default: process.env.DB_NAME,
    describe: 'Database name',
  })
  .option('db-user', {
    default: process.env.DB_USER || 'root',
    describe: 'User name used to connect to Database. Assumed as a "root" for DB manipulations.',
  })
  .option('db-password', {
    default: process.env.DB_PASSWORD,
    describe: 'Password used to connect to Database',
  })
  .option('default-locale', {
    default: process.env.DEFAULT_LOCALE || 'en-US',
    describe: 'Default locale to use in multi-language strings',
  })
  .option('output', {
    default: process.env.OUTPUT || path.join(projectDir, 'plan.pgascode'),
    describe: 'Plan file to store migration data on the `plan` command',
  })
  .option('plan', {
    default: process.env.PLAN || path.join(projectDir, 'plan.pgascode'),
    describe: 'Plan file to load migration data on the `migrate` command',
  })
  .option('wsl', {
    type: 'boolean',
    default: false,
    describe: 'Use WSL to run psql',
  })
  .demandCommand()
  .argv

const command = cliConfig._[0]

function loadLastStateFromDB() {
  const cfg = {
    dbHost: cliConfig.dbHost,
    dbPort: cliConfig.dbPort,
    dbName: cliConfig.dbName,
    dbUser: cliConfig.dbUser,
    dbPassword: cliConfig.dbPassword,
    wsl: cliConfig.wsl,
  }
  let result = executeSqlJson('SELECT 1', cfg)
  if (result.exitCode !== 0) {
    throw new Error('Can not connect to DB: ' + result.stderr)
  }
  result = executeSqlJson(getLoadLastStateSql(), cfg)
  if (result.exitCode !== 0) {
    // Assume the state table doesn't exists.
    return {}
  }
  return result.result
}

function loadCurrentState () {
  const configFile = path.join(cliConfig.source, 'db.yml')
  return loadConfig([defaultConfigFile, configFile])
}

function loadChanges(prevState, curState) {
  const dbOverrides = {
    defaultLocale: cliConfig.defaultLocale,
    rootUserName: cliConfig.dbUser,
    rootPassword: cliConfig.dbPassword,
    dbName: cliConfig.dbName,
  }
  const currentDbTree = DataBase.createFromCfg(
    curState,
    dbOverrides,
    [
      new PostgraphilePlugin,
    ]
  )
  const previousDbTree = DataBase.createFromCfg(
    prevState,
    dbOverrides,
    [
      new PostgraphilePlugin,
    ]
  )
  const changes = currentDbTree.hasChanges(previousDbTree, true)
  return [
    changes,
    previousDbTree,
    currentDbTree,
  ]
}

function getMigrationSql (changes, prevTree, curTree) {
  let sqlDump = curTree.getChangesSql(prevTree, changes)
  if (changes.hasChanges()) {
    if (sqlDump.length === 0) {
      throw new Error('Changes in state detected, but SQL dump is empty.')
    }
  }
  return sqlDump
}

function disposeTrees (prevTree, curTree) {
  curTree.dispose()
  if (prevTree) {
    prevTree.dispose()
  }
}


switch (command) {
  case planCmd: {
    console.log('Creating migration plan...')
    console.log('Loading current DB state...')
    const prevStateData = loadLastStateFromDB()
    console.log('Loading new state...')
    const curState = loadCurrentState()
    const newStateId = prevStateData.id + 1
    const [changes, prevTree, curTree] = loadChanges(prevStateData.state, curState)
    const sql = getMigrationSql(changes, prevTree, curTree)
    const plan = {
      id: newStateId,
      newState: curState,
      migration: sql,
    }
    console.log('Writing plan...')
    fs.writeFileSync(cliConfig.output, JSON.stringify(plan, null, 2))
    console.log('Changes to be made:')
    console.log(changes.prettyPrint(true))
    console.log('Done')
    disposeTrees(prevTree, curTree)
    break
  }

  case showChangesCmd: {
    console.log('Loading changes...')
    console.log('Loading current DB state...')
    const prevStateData = loadLastStateFromDB()
    console.log('Loading new state...')
    const curState = loadCurrentState()
    const [changes, prevTree, curTree] = loadChanges(prevStateData.state, curState)
    const sql = getMigrationSql(changes, prevTree, curTree)
    console.log(`Current DB version: ${prevStateData.id + 0}`)
    console.log('Changes to be made:')
    console.log(changes.prettyPrint(true))
    console.log('SQL to execute:')
    console.log(sql)
    console.log('Done')
    disposeTrees(prevTree, curTree)
    break
  }

  case migrateCmd: {
    let plan
    if (cliConfig.plan) {
      console.log('Reading migration plan...')
      plan = JSON.parse(fs.readFileSync(cliConfig.plan).toString())
    } else {
      console.log('Creating migration plan...')
      console.log('Loading current DB state...')
      const prevStateData = loadLastStateFromDB()
      console.log('Loading new state...')
      const curState = loadCurrentState()
      const newStateId = prevStateData.id + 1
      const [changes, prevTree, curTree] = loadChanges(prevStateData.state, curState)
      const sql = getMigrationSql(changes, prevTree, curTree, curState, newStateId)
      const plan = {
        id: newStateId,
        newState: curState,
        migration: sql,
      }
      disposeTrees(prevTree, curTree)
    }
    console.log('Executing SQL migration...')
    const tmpDumpFile = path.join(os.tmpdir(), `pgascode${process.pid}.sql`)
    try {
      fs.writeFileSync(
        tmpDumpFile,
        plan.migration + "\n" + getStateSaveSql(plan.id, plan.newState),
      )
      const result = executeSql(tmpDumpFile, {isFile: true})
      console.log(result.stdout)
    } finally {
      fs.unlinkSync(tmpDumpFile)
    }
    console.log('Done')
    break
  }

  default:
    console.log(`Unknown command '${command}'`)
    process.exit(1)
}
