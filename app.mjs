/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 02.10.2019
 * Time: 19:39
 */
import fs from 'fs'
import path from 'path'
import yargs from 'yargs'
import {
  circularSafeStringify,
  getFileList,
} from './src/utils'
import DataBase from './src/db-classes/DataBase'
import { loadConfig } from './src/loader'
import { fileURLToPath } from 'url'
import PostgraphilePlugin from './src/plugins/PostgraphilePlugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectDir = __dirname


const cliConfig = yargs
  .command({
    command: 'migrate <source>',
    desc: 'Create SQL migrations based on config differences',
    builder: yargs => {
      yargs.positional('source', {
        describe: 'Directory to read database state from',
      })
    }
  })
  .command({
    command: 'plan <source>',
    desc: 'Create SQL migrations based on config differences',
    builder: yargs => {
      yargs.positional('source', {
        describe: 'Directory to read database state from',
      })
    }
  })
  .option('root-user-name', {
    default: process.env.ROOT_USER_NAME || 'root',
    describe: 'Root user name used to connect to Database',
  })
  .option('root-user-password', {
    default: process.env.ROOT_USER_PASSWORD,
    describe: 'Root user password used to connect to Database',
  })
  .option('default-locale', {
    default: process.env.DEFAULT_LOCALE || 'en-US',
    describe: 'Default locale to use in multi-language strings',
  })
  .option('state-dir', {
    default: process.env.STATE_DIR || path.join(projectDir, 'output'),
    describe: 'Directory to save current state to',
  })
  .option('migrations-dir', {
    default: process.env.MIGRATIONS_DIR || path.join(projectDir, 'migrations'),
    describe: 'Directory to save SQL migration files to',
  })
  .demandCommand()
  .argv

const command = cliConfig._[0]

if (command === 'migrate' || command === 'plan') {
  const configFile = path.join(cliConfig.source, 'db.yml')
  const outputDir = cliConfig.stateDir
  const migrationsDir = cliConfig.migrationsDir
  const currentState = loadConfig(configFile)
  const currentStateId = (new Date()).getTime()
  const migrationSqlFile = path.join(migrationsDir, `migration${currentStateId}.sql`)
  const currentStateDumpFile = path.join(outputDir, `state${currentStateId}.json`)
  if (!fs.existsSync(path.dirname(migrationSqlFile))) {
    fs.mkdirSync(path.dirname(migrationSqlFile))
  }
  if (!fs.existsSync(path.dirname(currentStateDumpFile))) {
    fs.mkdirSync(path.dirname(currentStateDumpFile))
  }

  const states = getFileList(path.join(path.dirname(currentStateDumpFile), 'state*.json'));
  const previousStateFile = states.sort().pop()
  const previousState = previousStateFile ? loadConfig(previousStateFile) : null

  const currentDbTree = DataBase.createFromCfg(
    currentState,
    cliConfig,
    [
      new PostgraphilePlugin,
    ]
  )
  const previousDbTree = DataBase.createFromCfg(
    previousState,
    cliConfig,
    [
      new PostgraphilePlugin,
    ]
  )

  const changes = currentDbTree.hasChanges(previousDbTree, true)

  if (command === 'plan') {
    if (changes.hasChanges()) {
      console.log(changes.prettyPrint(true))
    } else {
      console.log('No changes')
    }
  } else {
    const sqlDump = currentDbTree.getChangesSql(previousDbTree, changes)
    if (currentDbTree.hasChanges(previousDbTree)) {
      if (sqlDump.length === 0) {
        throw new Error('Changes in state detected, but SQL dump is empty.')
      }
      console.log(`Writing new state to ${currentStateDumpFile}...`)
      fs.writeFileSync(currentStateDumpFile, JSON.stringify(currentState, null, 2))
      console.log('Done')
      console.log(`Writing SQL migration to ${migrationSqlFile}...`)
      fs.writeFileSync(migrationSqlFile, sqlDump)
      console.log('Done')
    }
  }

  currentDbTree.dispose()
  if (previousDbTree) {
    previousDbTree.dispose()
  }
}
