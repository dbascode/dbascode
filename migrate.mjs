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
  getFileList,
} from './src/utils'
import DataBase from './src/db-classes/DataBase'
import { loadConfig } from './src/loader'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectDir = __dirname + '/..';

const configFile = path.join(projectDir, 'system/db.yml')
const outputDir = path.join(projectDir, 'output')
const migrationsDir = path.join(projectDir, 'migrations')


// if (fs.existsSync(outputDir)) {
//   rimraf.sync(outputDir + '/**');
// }


// const config = loadYaml(configFile)
const cliConfig = yargs
  // .default('schema', process.env.SCHEMA)
  .default('root-user-name', process.env.ROOT_USER_NAME)
  .default('root-user-password', process.env.ROOT_USER_PASSWORD)
  .default('default-locale', process.env.DEFAULT_LOCALE)
  .argv

const currentState = loadConfig(configFile)

const currentStateId = (new Date()).getTime()
const migrationSqlFile = path.join(migrationsDir, `migratioin${currentStateId}.sql`)
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

const currentDbTree = DataBase.createFromCfg(currentState, cliConfig)
const previousDbTree = DataBase.createFromCfg(previousState, cliConfig)

const sqlDump = currentDbTree.getChangesSql(previousDbTree)

if (currentDbTree.hasChanges(previousDbTree)) {
  if (sqlDump.length === 0) {
    throw new Error('Changes in state detected, but SQL dump is empty.')
  }
  fs.writeFileSync(currentStateDumpFile, JSON.stringify(currentState, null, 2))
  fs.writeFileSync(migrationSqlFile, sqlDump)
}

currentDbTree.dispose()
if (previousDbTree) {
  previousDbTree.dispose()
}
