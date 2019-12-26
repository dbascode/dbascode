/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */
import PluginDescriptor from '../../dbascode/PluginDescriptor'
import { processCalculations } from '../../dbascode/AbstractDbObject'
import { TREE_INITIALIZED } from '../../dbascode/PluginEvent'

/**
 * @typedef {object} RowLevelSecurityMixin Mixin applied to tables with the row level security routines.
 * @extends Table
 * @property {object} defaultAcl
 * @property {object} rowLevelSecurity
 * @method getRowLevelSecurity Returns row level security data combined with data inherited from ancestor
 */
/**
 * Row-level security functionality plugin
 */
class RowLevelSecurityPlugin extends PluginDescriptor {
  /**
   * @inheritDoc
   */
  event (eventName, args = []) {
    if (eventName === TREE_INITIALIZED) {
      this.onTreeInitialized(args[0])
    }
  }

  /**
   * Executed on a DB tree initialization completion
   * @param {DataBase} db
   */
  onTreeInitialized(db) {
    for (const schemaName of Object.keys(db.schemas)) {
      if (schemaName === 'pgascode') {
        continue
      }
      const schema = db.schemas[schemaName]
      for (const tableName of Object.keys(schema.tables)) {
        const table = schema.tables[tableName]
        this.applyMixin(table)
      }
    }
  }

  /**
   * Applies Table class mixin
   * @param {Table} inst
   */
  applyMixin(inst) {
    const config = processCalculations(inst, inst._rawConfig)
    const rowLevelSecurity = {}
    for (const op of Object.keys(config.row_level_security || {})) {
      rowLevelSecurity[op] = config.row_level_security[op]
    }

    const mixin = {
      defaultAcl: config.default_acl || [],
      rowLevelSecurity: rowLevelSecurity,

      /**
       * Returns row level security data combined with data inherited from ancestor
       * @return {object}
       */
      getRowLevelSecurity: () => {
        if (inst.extends) {
          const ancestor = inst.getSchema().getTable(inst.extends)
          return { ...ancestor.getRowLevelSecurity(), ...inst.rowLevelSecurity }
        } else {
          return inst.rowLevelSecurity
        }
      },

      getSqlDefinition: (origMethod, operation, addSql) => {
        const rls = inst.getRowLevelSecurity()
        if (Object.keys(rls).length > 0) {
          addSql.push(`ALTER TABLE ${inst.getObjectIdentifier('alter')} ENABLE ROW LEVEL SECURITY;`)
          for (const op in rls) {
            const checkType = op === 'insert' ? 'WITH CHECK' : 'USING'
            addSql.push(`CREATE POLICY "${inst.getParentedNameFlat()}_acl_check_${op}" ON ${inst.getObjectIdentifier('alter')} FOR ${op.toUpperCase()} ${checkType} (${rls[op]});`)
          }
          if (inst.defaultAcl.length > 0) {
            const defActTable = inst.getSchema().getTable('default_acl')
            addSql.push(`INSERT INTO ${defActTable.getObjectIdentifier('insert')} ("table", "acl") VALUES ('${inst.name}', '${JSON.stringify(inst.defaultAcl)}'::json);`)
          }
        }
        return origMethod(operation, addSql)
      },

      setupDependencies: (origMethod) => {
        const result = origMethod()
        if (inst.defaultAcl) {
          result.push(inst.getSchema().getTable('default_acl').getPath())
        }
        return result
      },
    }
    inst.applyMixin(mixin)
  }
}

export default new RowLevelSecurityPlugin({
  name: 'rls',
  version: 1,
})
