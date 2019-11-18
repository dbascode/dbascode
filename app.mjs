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
import { getLoadLastStateSql, getStateSaveSql } from './src/db-classes/db-utils'
import { executeSql, executeSqlJson } from './src/psql'
import os from 'os'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectDir = __dirname

const migrateCmd = 'migrate'
const planCmd = 'plan'
const defaultConfigFile = path.join(__dirname, 'default-sys', 'db.yml')
const version = 1

const cliConfig = yargs
  .command({
    command: `${migrateCmd}`,
    desc: 'Create SQL migrations based on config differences',
    builder: yargs => {
      yargs.option('source', {
        default: process.env.SOURCE,
        describe: 'Directory to read database state from on the `migrate` command',
      })
      .option('plan', {
        default: process.env.PLAN,
        describe: 'Plan file to load migration data on the `migrate` command',
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
      .option('output', {
        default: process.env.OUTPUT,
        describe: 'Plan file to store migration data on the `plan` command',
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
  .option('wsl', {
    type: 'boolean',
    default: false,
    describe: 'Use WSL to run psql',
  })
  .demandCommand()
  .argv

const command = cliConfig._[0]
const dbQueryCfg = {
  dbHost: cliConfig.dbHost,
  dbPort: cliConfig.dbPort,
  dbName: cliConfig.dbName,
  dbUser: cliConfig.dbUser,
  dbPassword: cliConfig.dbPassword,
  wsl: cliConfig.wsl,
}

function loadLastStateFromDB() {
  let result = executeSqlJson('SELECT 1', dbQueryCfg)
  if (result.exitCode !== 0) {
    throw new Error('Can not connect to DB: ' + result.stderr)
  }
  result = executeSqlJson(getLoadLastStateSql(), dbQueryCfg)
  if (result.exitCode !== 0) {
    // Assume the state table doesn't exists.
    return {id: 0}
  }
  const res = result.result[0]
  if (res) {
    return {
      ...res,
      state: JSON.parse(res.state)
    }
  } else {
    return {id: 0}
  }
}

function loadCurrentState () {
  const configFile = path.join(cliConfig.source, 'db.yml')
  return loadConfig([defaultConfigFile, configFile])
}

/**
 * Compare old and current states and return changes object with differences.
 * @param {object} prevState - Previous state
 * @param {object} curState - Current state
 * @param {number} prevVersion - PgAsCode version used to save previous state
 * @param {number} curVersion - PgAsCode version used to save previous state
 * @return {array}
 */
function buildChanges(prevState, curState, prevVersion, curVersion) {
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
    ],
    curVersion,
  )
  const previousDbTree = DataBase.createFromCfg(
    prevState,
    dbOverrides,
    [
      new PostgraphilePlugin,
    ],
    prevVersion,
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
    if (sqlDump.trim().length === 0) {
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

function createPlan() {
  console.log('Loading current DB state...')
  const prevStateData = loadLastStateFromDB()
  console.log('Loading new state...')
  const curState = loadCurrentState(version)
  const [changes, prevTree, curTree] =
    buildChanges(
      prevStateData.state,
      curState,
      prevStateData.pgascode_version,
      version,
    )
  try {
    const sql = getMigrationSql(changes, prevTree, curTree)
    return [
      {
        id: prevStateData.id + 1,
        newState: curState,
        migration: sql,
      },
      changes,
    ]
  } finally {
    disposeTrees(prevTree, curTree)
  }
}

function saveTempSqlFile(sql) {
  const tmpDumpFile = path.join(os.tmpdir(), `pgascode${process.pid}.sql`)
  fs.writeFileSync(
    tmpDumpFile,
    sql,
  )
  return tmpDumpFile
}

function executeSqlDump (sql) {
  const tmpDumpFile = saveTempSqlFile(sql)
  let result = {}
  try {
    result = executeSql(tmpDumpFile, { ...dbQueryCfg, isFile: true })
    console.log(result.stderr ? result.stderr : result.stdout)
    if (result.exitCode === 0) {
      console.log('Done')
    } else {
      console.log('Migration failed')
    }
  } finally {
    fs.unlinkSync(tmpDumpFile)
    if (result.exitCode !== 0) {
      process.exit(result.exitCode)
    }
  }
}


switch (command) {
  case planCmd: {
    console.log('Loading changes...')
    const [plan, changes] = createPlan()
    console.log(`Current DB version: ${plan.id - 1}`)
    if (!changes.hasChanges()) {
      console.log('No changes detected. Nothing to do.')
      if (cliConfig.output) {
        fs.writeFileSync(cliConfig.output, JSON.stringify({noChanges: true}, null, 2))
      }
      break
    }
    if (cliConfig.output) {
      console.log(`Writing plan to '${cliConfig.output}'...`)
      fs.writeFileSync(cliConfig.output, JSON.stringify(plan, null, 2))
    }
    console.log('Changes to be made:')
    console.log(changes.prettyPrint(true))
    console.log('SQL to execute:')
    console.log(plan.migration)
    console.log('Done')
    break
  }

  case migrateCmd: {
    let plan
    if (!cliConfig.plan && !cliConfig.source) {
      throw new Error('Either `plan` or `source` option must be specified to migrate.')
    }
    if (cliConfig.plan) {
      console.log('Reading migration plan...')
      plan = JSON.parse(fs.readFileSync(cliConfig.plan).toString())
      if (plan.noChanges) {
        console.log('Reading migration plan...')
        console.log('No changes. Nothing to do.')
        break;
      }
    } else {
      console.log('Input plan not set. Creating migration plan...')
      const [p, changes] = createPlan()
      plan = p
      if (!changes.hasChanges()) {
        console.log('No changes detected. Nothing to do.')
        break
      }
    }
    console.log('Executing SQL migration...')
    executeSqlDump(plan.migration + "\n" + getStateSaveSql(plan.id, plan.newState, plan.migration, version))
    break
  }

  default:
    console.log(`Unknown command '${command}'`)
    process.exit(1)
}
