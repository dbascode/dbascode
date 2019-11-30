/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 29.11.2019
 * Time: 19:32
 */
import DataBase from './postgresql/DataBase'
import StateStore from './postgresql/StateStore'
import SqlExec from './postgresql/SqlExec'
import PgPluginDescriptor from './postgresql/PgPluginDescriptor'

export default new PgPluginDescriptor({
  name: 'postgres',
  version: 1,
  dbClass: DataBase,
  stateStoreClass: StateStore,
  sqlExecClass: SqlExec,
})
