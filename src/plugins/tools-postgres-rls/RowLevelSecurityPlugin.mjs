/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */
import PluginDescriptor from '../../dbascode/PluginDescriptor'
import { processCalculations } from '../../dbascode/AbstractDbObject'
import { TREE_INITIALIZED } from '../../dbascode/PluginEvent'
import PropDef from '../../dbascode/PropDef'
import PropDefCollection from '../../dbascode/PropDefCollection'
import { parseTypedef } from '../db-postgres/utils'
import { joinSql, parseArrayProp } from '../../dbascode/utils'

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

      getSqlDefinitionAfter: (origMethod, operation) => {
        if (operation !== 'create') {
          return origMethod(operation);
        }
        const sql = [origMethod(operation)]
        const rls = inst.getRowLevelSecurity()
        if (Object.keys(rls).length > 0) {
          sql.push(`ALTER TABLE ${inst.getObjectIdentifier('alter')} ENABLE ROW LEVEL SECURITY;`)
          for (const op in rls) {
            const checkType = op === 'insert' ? 'WITH CHECK' : 'USING'
            const name = `${inst.getParent().sql.getName()}_${inst.sql.getName()}`
            sql.push(`CREATE POLICY "${name}_acl_check_${op}" ON ${inst.getObjectIdentifier('alter')} FOR ${op.toUpperCase()} ${checkType} (${rls[op]});`)
          }
        }
        if (inst.hasDefaultAcl()) {
          sql.push(inst.getCreateDefAclRecordsSql())
        }
        return joinSql(sql)
      },

      getCreateDefAclRecordsSql() {
        const sql = []
        const defaultAcl = inst.defaultAcl
        const defAclTable = inst.getSchema().getTable('default_acl')
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
          for (const op of rule.allow ? (Array.isArray(rule.allow) ? rule.allow : [rule.allow]) : []) {
            const bits = opMap[op]
            if (bits) {
              mask = mask | bits
              perm = perm | bits
            }
          }
          for (const op of rule.deny ? (Array.isArray(rule.deny) ? rule.deny : [rule.deny]) : []) {
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
            sqlData.push(`'${rule.role}'`)
            sqlData.push(`B'${pad.substring(0, pad.length - maskStr.length) + maskStr}'`)
            sqlData.push(`B'${pad.substring(0, pad.length - permStr.length) + permStr}'`)
            aclSql.push(`(${sqlData.join(', ')})::${inst.getSchema().sql.getEscapedName()}.row_acl`)
          }
        }
        sql.push(`INSERT INTO ${defAclTable.getObjectIdentifier('insert')} ("table", "acl") VALUES ( '${inst.sql.getFullyQualifiedName()}', ARRAY[${aclSql.join(', ')}] );`)
        return joinSql(sql)
      },

      getDropDefAclRecordsSql() {
        const defAclTable = inst.getSchema().getTable('default_acl')
        if (!defAclTable) {
          return ''
        }
        return `DELETE FROM ${defAclTable.getObjectIdentifier('delete')} WHERE "table" = '${inst.sql.getFullyQualifiedName()}';`
      },

      getPropDefCollection (origMethod) {
        const result = new PropDefCollection([...origMethod().defs])
        result.addProp(new PropDef('rowLevelSecurity', { type: PropDef.map }))
        result.addProp(new PropDef('defaultAcl', { type: PropDef.map }))
        return result
      },

      getChangesAlterSql (origMethod, compared, changes) {
        let recreateDefaultAcl = false, newChanges = [...changes]
        for (const i in changes) {
          const change = changes[i]
          const propDef = parseArrayProp(change.path)
          if (propDef.name === 'defaultAcl') {
            recreateDefaultAcl = true
            delete newChanges[i]
          }
        }
        const sql = []
        sql.push(origMethod(compared, newChanges.filter(i => i)))
        if (recreateDefaultAcl) {
          const defAclTable = inst.getSchema().getTable('default_acl')
          sql.push(inst.getDropDefAclRecordsSql())
          sql.push(inst.getCreateDefAclRecordsSql())
        }
        return joinSql(sql)
      },

      hasDefaultAcl () {
        return inst.defaultAcl && inst.defaultAcl.length > 0
      },

      getDropSql (origMethod) {
        const sql = []
        sql.push(origMethod())
        if (inst.hasDefaultAcl()) {
          sql.push(inst.getDropDefAclRecordsSql())
        }
        return joinSql(sql)
      },

      setupDependencies: (origMethod) => {
        origMethod()
        if (inst.hasDefaultAcl()) {
          inst.addDependencyByPath(inst.getSchema().getTable('default_acl').getPath())
        }
      },

      validate (origMethod, previous, context) {
        origMethod(previous, context)
          const defaultAcl = inst.defaultAcl
          if (defaultAcl && defaultAcl.length > 0) {
            for (let i = 0; i < defaultAcl.length; i++) {
              const rule = defaultAcl[i]
              if (!rule.role) {
                context.addError(inst, `Table ${inst.sql.getFullyQualifiedName()} default ACL rule ${i}: role name must be set.`)
              }
            }
          }
      },
    }
    inst.applyMixin(mixin)
  }
}

export default new RowLevelSecurityPlugin({
  name: 'rls',
  version: 1,
})
