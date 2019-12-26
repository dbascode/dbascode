#!/usr/bin/env node
/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */
import fs from 'fs'
import yargs from 'yargs'
import DbAsCode from './src/dbascode/DbAsCode'
import PostgreSqlPlugin from './src/plugins/db-postgres/PostgreSqlPlugin'
import PostgraphilePlugin from './src/plugins/tools-postgres-postgraphile/PostgraphilePlugin'
import RowLevelSecurityPlugin from './src/plugins/tools-postgres-rls/RowLevelSecurityPlugin'
import DefaultRowsPlugin from './src/plugins/tools-postgres-default-rows/DefaultRowsPlugin'

const migrateCmd = 'migrate'
const planCmd = 'plan'

/**
 * @property {string[]} dbVar
 * @property {string} dbms
 * @property {string} wsl
 * @property {string} plan
 * @property {string} source
 * @property {string} output
 * @property {string[]} plugins
 */
const cliConfig = yargs
  .command({
    command: `${migrateCmd}`,
    desc: 'Create SQL migrations based on config differences',
    builder: yargs => {
      yargs.option('source', {
        default: process.env.DBAC_SOURCE,
        describe: 'Directory to read database state from on the `migrate` command',
      })
      .option('plan', {
        default: process.env.DBAC_PLAN,
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
        default: process.env.DBAC_SOURCE,
        describe: 'Configuration file to read database state from',
      })
      .option('output', {
        default: process.env.DBAC_OUTPUT,
        describe: 'Plan file to store migration data on the `plan` command',
      })
    }
  })
  .option('db-var', {
    type: 'array',
    default: (process.env.DBAC_DB_VAR || '').split('|').filter(Boolean),
    describe: 'Database configuration parameters (see particular DB plugin documentation)',
  })
  .option('plugin', {
    type: 'array',
    default: (process.env.DBAC_PLUGIN || '').split('|').filter(Boolean),
    describe: 'List of plugins to be loaded. Module names to import must be provided.',
  })
  .option('wsl', {
    type: 'boolean',
    default: process.env.DBAC_WSL,
    describe: 'Use WSL to run commands',
  })
  .option('dbms', {
    default: process.env.DBAC_DBMS,
    describe: 'Database management system to work with.',
  })
  .demandCommand()
  .argv

const command = cliConfig._[0]


const dbAsCode = new DbAsCode(
  {
    plugins: cliConfig.plugin || [],
    dbms: cliConfig.dbms,
    dbVars: cliConfig.dbVar || [],
    source: cliConfig.source,
    wsl: cliConfig.wsl,
  },
  [
    // 'file://' + __dirname + '/src/plugins/db-postgres/postgresql/PostgreSqlPlugin.mjs',
    PostgreSqlPlugin,
    PostgraphilePlugin,
    RowLevelSecurityPlugin,
    DefaultRowsPlugin,
  ],
);

async function main() {
  switch (command) {
    case planCmd: {
      console.log(`Running command ${command}`)
      await dbAsCode.initializePlugins()
      await dbAsCode.determineCurrentDbmsType()
      console.log('Loading changes...')
      const [plan, changes] = await dbAsCode.createPlan()
      console.log(`Current DB version: ${plan.id - 1}`)
      if (!changes.hasChanges()) {
        console.log('No changes detected. Nothing to do.')
        if (cliConfig.output) {
          fs.writeFileSync(cliConfig.output, JSON.stringify({ noChanges: true }, null, 2))
        }
        break
      }
      plan.dbms = dbAsCode.getDbPlugin().dbClass.dbms
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
      console.log(`Running command ${command}`)
      await dbAsCode.initializePlugins()
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
        await dbAsCode.determineCurrentDbmsType(plan.dbms)
      } else {
        console.log('Input plan not set. Creating migration plan...')
        await dbAsCode.determineCurrentDbmsType()
        const [p, changes] = await dbAsCode.createPlan()
        plan = p
        if (!changes.hasChanges()) {
          console.log('No changes detected. Nothing to do.')
          break
        }
      }
      console.log('Executing SQL migration...')
      const exitCode = await dbAsCode.migrate(plan)
      if (exitCode !== 0) {
        process.exit(exitCode)
      }
      break
    }

    default:
      console.log(`Unknown command '${command}'`)
      process.exit(1)
  }
}

(async () => {
  try {
    await main()
  } catch (e) {
    if (process.env.DBASCODE_DOCKER) {
      console.error('Unhandled exception: ' + e.message)
      process.exit(2)
    } else {
      throw e
    }
  }
})()


