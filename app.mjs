/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 02.10.2019
 * Time: 19:39
 */
import fs from 'fs'
import path from 'path'
import yargs from 'yargs'
import DataBase from './src/plugins/db/postgresql/DataBase'
import { loadConfig } from './src/loader'
import { fileURLToPath } from 'url'
import PostgraphilePlugin from './src/plugins/tools/PostgraphilePlugin'
import { getLoadLastStateSql, getStateSaveSql } from './src/plugins/db/postgresql/db-utils'
import { executeSql, executeSqlJson } from './src/plugins/db/postgresql/psql'
import { collectChanges, getChangesSql } from './src/dbascode/changes'
import RowLevelSecurityPlugin from './src/plugins/tools/RowLovelSecurityPlugin'
import DefaultRowsPlugin from './src/plugins/tools/DefaultRowsPlugin'
import DbAsCode from './src/dbascode/DbAsCode'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectDir = __dirname

const migrateCmd = 'migrate'
const planCmd = 'plan'
const defaultConfigFile = path.join(__dirname, 'default-sys', 'db.yml')
const version = 2

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
        describe: 'Configuration file to read database state from',
      })
      .option('output', {
        default: process.env.OUTPUT,
        describe: 'Plan file to store migration data on the `plan` command',
      })
    }
  })
  .array('db-var', {
    describe: 'Database configuration parameters (see particular DB plugin documentation)',
  })
  .array('plugins', {
    describe: 'List of plugins to be loaded. Module names to import must be provided.',
  })
  .option('wsl', {
    type: 'boolean',
    default: false,
    describe: 'Use WSL to run commands',
  })
  .option('dbms', {
    default: process.env.DBMS,
    describe: 'Database management system to work with.',
  })
  .demandCommand()
  .argv

const command = cliConfig._[0]


const dbAsCode = new DbAsCode(
  {
    plugins: cliConfig.plugins,
    dbms: cliConfig.dbms,
    dbVars: cliConfig.dbVars,
    source: cliConfig.source,
    wsl: cliConfig.wsl,
  },
  [
    __dirname + '/plugins/postgresql.mjs',
  ],
  version,
)

(async () => {
  await dbAsCode.determineCurrentDbmsType()
  await dbAsCode.initializePlugins()

  switch (command) {
    case planCmd: {
      console.log('Loading changes...')
      const [plan, changes] = dbAsCode.createPlan()
      console.log(`Current DB version: ${plan.id - 1}`)
      if (!changes.hasChanges()) {
        console.log('No changes detected. Nothing to do.')
        if (cliConfig.output) {
          fs.writeFileSync(cliConfig.output, JSON.stringify({ noChanges: true }, null, 2))
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
      console.log(plan.migrationSql)
      console.log('Done')
      break
    }

    case migrateCmd: {
      /**
       * @var {State} plan
       */
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
        const [p, changes] = dbAsCode.createPlan()
        plan = p
        if (!changes.hasChanges()) {
          console.log('No changes detected. Nothing to do.')
          break
        }
      }
      console.log('Executing SQL migration...')
      await dbAsCode.migrate(plan)
      break
    }

    default:
      console.log(`Unknown command '${command}'`)
      process.exit(1)
  }
})()



