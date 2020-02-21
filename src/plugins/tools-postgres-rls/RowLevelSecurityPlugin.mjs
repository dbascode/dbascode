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
          const defaultAcl = inst.defaultAcl
          if (defaultAcl && defaultAcl.length > 0) {
            const defActTable = inst.getSchema().getTable('default_acl')
            const aclSql = []
            const opMap = {
              select: 0b0001,
              update: 0b0010,
              delete: 0b0100,
              insert: 0b1000,
              all: 0b1111,
            }
            for (const rule of defaultAcl) {
              let mask = 0, perm = 0
              for (const op of Array.isArray(rule.allow) ? rule.allow : [rule.allow]) {
                const bits = opMap[op]
                if (bits) {
                  mask = mask | bits
                  perm = perm | bits
                }
              }
              for (const op of Array.isArray(rule.deny) ? rule.deny : [rule.deny]) {
                const bits = opMap[op]
                if (bits) {
                  mask = mask | bits
                  perm = perm & !bits
                }
              }
              if (mask !== 0) {
                const pad = '0000'
                const maskStr = mask.toString(2)
                const permStr = perm.toString(2)
                const sqlData = []
                sqlData.push(`'${rule.role}'`);
                sqlData.push(pad.substring(0, pad.length - maskStr.length) + maskStr)
                sqlData.push(pad.substring(0, pad.length - permStr.length) + permStr)
                aclSql.push(`(${sqlData.join(', ')})::${inst.getSchema().getQuotedName()}.row_acl`)
              }
            }
            addSql.push(`INSERT INTO ${defActTable.getObjectIdentifier('insert')} ("table", "acl") VALUES ( '${inst.name}', ARRAY[${aclSql.join(', ')}] );`)
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
