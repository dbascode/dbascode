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
  convertPathToWsl,
  getFileList,
} from './src/utils'
import DataBase from './src/db-classes/DataBase'
import { loadConfig } from './src/loader'
import { fileURLToPath } from 'url'
import PostgraphilePlugin from './src/plugins/PostgraphilePlugin'
import cp from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const projectDir = __dirname

const showChangesCmd = 'show-changes'
const migrateCmd = 'migrate'
const planCmd = 'plan'

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
    default: process.env.DB_NAME,
    describe: 'Database host name',
  })
  .option('db-port', {
    default: process.env.DB_NAME || 5432,
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
  .option('state-dir', {
    default: process.env.STATE_DIR || path.join(projectDir, 'output'),
    describe: 'Directory to save current state to. Unused if the `state-file` option is set.',
  })
  .option('state-file', {
    default: process.env.STATE_FILE,
    describe: 'File path to save current state to.',
  })
  .option('migration-dir', {
    default: process.env.MIGRATION_DIR || path.join(projectDir, 'migrations'),
    describe: 'Directory to save SQL migration files to. Unused if the `migration-file` option is set.',
  })
  .option('migration-file', {
    default: process.env.MIGRATION_FILE,
    describe: 'File path to save SQL migration to',
  })
  .option('wsl', {
    type: 'boolean',
    default: false,
    describe: 'Use WSL to run psql',
  })
  .demandCommand()
  .argv

const command = cliConfig._[0]

if (command === planCmd || command === showChangesCmd || command === migrateCmd) {
  const configFile = path.join(cliConfig.source, 'db.yml')
  const outputDir = cliConfig.stateDir
  const migrationsDir = cliConfig.migrationDir
  const currentState = loadConfig(configFile)
  const currentStateId = (new Date()).getTime()
  const migrationSqlFile = cliConfig.migrationFile
    ? cliConfig.migrationFile
    : path.join(migrationsDir, `migration${currentStateId}.sql`)
  const currentStateDumpFile = cliConfig.stateFile
    ? cliConfig.stateFile
    : path.join(outputDir, `state${currentStateId}.json`)
  if (!fs.existsSync(path.dirname(migrationSqlFile))) {
    fs.mkdirSync(path.dirname(migrationSqlFile))
  }
  if (!fs.existsSync(path.dirname(currentStateDumpFile))) {
    fs.mkdirSync(path.dirname(currentStateDumpFile))
  }

  const states = getFileList(path.join(path.dirname(currentStateDumpFile), 'state*.json'));
  const previousStateFile = states.sort().pop()
  const previousState = previousStateFile ? loadConfig(previousStateFile) : null
  const dbOverrides = {
    defaultLocale: cliConfig.defaultLocale,
    rootUserName: cliConfig.dbUser,
    rootPassword: cliConfig.dbPassword,
    dbName: cliConfig.dbName,
  }

  const currentDbTree = DataBase.createFromCfg(
    currentState,
    dbOverrides,
    [
      new PostgraphilePlugin,
    ]
  )
  const previousDbTree = DataBase.createFromCfg(
    previousState,
    dbOverrides,
    [
      new PostgraphilePlugin,
    ]
  )

  const changes = currentDbTree.hasChanges(previousDbTree, true)

  if (command === planCmd || command === showChangesCmd) {
    if (changes.hasChanges()) {
      console.log(changes.prettyPrint(true))
    } else {
      console.log('No changes')
    }
  }
  if (command === planCmd || command === migrateCmd) {
    const sqlDump = currentDbTree.getChangesSql(previousDbTree, changes)
    if (changes.hasChanges()) {
      if (sqlDump.length === 0) {
        throw new Error('Changes in state detected, but SQL dump is empty.')
      }
      if (command === migrateCmd || command === planCmd && cliConfig.migrationFile) {
        console.log(`Writing SQL migration to ${migrationSqlFile}...`)
        fs.writeFileSync(migrationSqlFile, sqlDump)
        console.log('Done')
      }
      if (command === planCmd && cliConfig.stateFile) {
        console.log(`Writing new state to ${currentStateDumpFile}...`)
        fs.writeFileSync(currentStateDumpFile, JSON.stringify(currentState, null, 2))
        console.log('All done')
      }

      if (command === migrateCmd) {
        const commonCmd = [
          '--dbname=' + currentDbTree.name,
          '--host=' + cliConfig.dbHost,
          '--port=' + cliConfig.dbPort,
          '--username=' + currentDbTree._rootUserName,
          '--file=' + (cliConfig.wsl ? convertPathToWsl(migrationSqlFile) : migrationSqlFile),
          '--single-transaction',
        ]
        const env = {
          PGPASSWORD: currentDbTree._rootPassword,
        }
        let ls
        console.log(`Running SQL migration...`)
        if (cliConfig.wsl) {
          ls = cp.spawn(
            'bash',
            [
              '-c',
              `PGPASSWORD=${currentDbTree._rootPassword} psql ${commonCmd.join(' ')}`
            ],
          )
        } else {
          ls = cp.spawn(
            'psql',
            commonCmd,
            {env},
          )
        }

        ls.stdout.on('data', data => {
          console.log(`stdout: ${data}`);
        })

        ls.stderr.on('data', data => {
          console.log(`stderr: ${data}`);
        })

        ls.on('close', code => {
          if (code === 0) {
            console.log(`Done SQL.`)
            console.log(`Writing new state to ${currentStateDumpFile}...`)
            fs.writeFileSync(currentStateDumpFile, JSON.stringify(currentState, null, 2))
            console.log('All done')
          } else {
            console.log(`Failed to execute SQL (exit code: ${code})`);
          }
        })
      }
    } else {
      console.log('No changes')
    }
  }

  currentDbTree.dispose()
  if (previousDbTree) {
    previousDbTree.dispose()
  }
} else {
  console.log(`Unknown command '${command}'`)
  process.exit(1)
}
