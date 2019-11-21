/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 21.11.2019
 * Time: 9:55
 */
import AbstractPlugin from './AbstractPlugin'

/**
 * Add row-level security functionality
 */
export default class RowLevelSecurityPlugin extends AbstractPlugin {
  /**
   * @inheritDoc
   */
  onTreeInitialized(db) {
    for (const schemaName of Object.keys(db.schemas)) {
      if (schemaName === 'pgascode') {
        continue
      }
      const schema = db.schemas[schemaName]
      for (const tableName of Object.keys(schema.tables)) {
        const table = schema.tables[tableName]
        this.applyOmitMixin(table)
      }
    }
  }

  /**
   * Applies Table class mixin
   * @param {Table} inst
   */
  applyOmitMixin(inst) {
    const config = inst._rawConfig
    const rowLevelSecurity = {}
    for (const op of Object.keys(config.row_level_security || {})) {
      rowLevelSecurity[op] = config.row_level_security[op]
    }

    inst.applyMixin({
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

      getDefinition: (origMethod, operation, addSql) => {
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
      }
    })
  }

}
