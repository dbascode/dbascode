/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 11.10.2019
 * Time: 16:27
 */
import AbstractSchemaObject from './AbstractSchemaObject'
import PropDefCollection from '../../dbascode/PropDefCollection'
import PropDef from '../../dbascode/PropDef'
import { arrayUnique } from '../../dbascode/utils'
import { parseTypedef } from './utils'

/**
 * Function, Procedure, or Trigger Function object
 * @property language
 * @property {ArgumentTypeDef} returns
 * @property cost
 * @property isSecurityDefiner
 * @property stability
 * @property parallelSafety
 * @property code
 * @property {Object.<string, ArgumentTypeDef>} args
 * @property isLeakProof
 */
export default class Function extends AbstractSchemaObject {
  /**
   * @type {PropDefCollection}
   */
  static propDefs = new PropDefCollection([
    new PropDef('language', { defaultValue: 'sql' }),
    new PropDef('returns', { type: PropDef.map, recreateOnChange: true }),
    new PropDef('cost', { type: PropDef.number, defaultValue: 10 }),
    new PropDef('isSecurityDefiner', { type: PropDef.bool, configName: 'security_definer' }),
    new PropDef('stability', { defaultValue: 'volatile' }),
    new PropDef('parallelSafety', { defaultValue: 'unsafe' }),
    new PropDef('code'),
    new PropDef('args', { configName: 'arguments', type: PropDef.map, recreateOnChange: true }),
    new PropDef('isLeakProof', { type: PropDef.bool, configName: 'leak_proof' }),
    ...this.propDefs.defs,
  ])

  /**
   * @inheritDoc
   */
  getConfigForApply (config) {
    const result = super.getConfigForApply(config)
    if (result && result.arguments) {
      for (const name of Object.keys(result.arguments)) {
        result.arguments[name] = parseTypedef(result.arguments[name])
      }
    }
    if (result.returns) {
      result.returns = parseTypedef(result.returns)
    }
    return result
  }

  getStabilitySql () {
    return this.stability.toUpperCase()
  }

  getParallelSafety () {
    return `PARALLEL ${this.parallelSafety.toUpperCase()}`
  }

  /**
   * @inheritDoc
   */
  getObjectClass (operation) {
    return this.returns ? 'FUNCTION' : 'PROCEDURE'
  }

  /**
   * @inheritDoc
   */
  getObjectIdentifier (operation, isParentContext) {
    if (operation === 'create') {
      return `${super.getObjectIdentifier(operation, false)}(${this.getFunctionArgs()})`
    } else {
      return `${super.getObjectIdentifier(operation, false)}(${this.getArgTypesList()})`
    }
  }

  /**
   * Returns raw string to be used as the list of function arguments in the function definition SQL
   * @returns {string}
   */
  getFunctionArgs () {
    const result = []
    for (const argName of Object.keys(this.args)) {
      result.push(`"${argName}" ${this.getArgType(this.args[argName])}`)
    }
    return result.join(', ')
  }

  /**
   * Returns raw string with the list of argument types to be used in GRANT/REVOKE/DROP SQL statements
   * @returns {string}
   */
  getArgTypesList () {
    const result = []
    for (const argName of Object.keys(this.args)) {
      result.push(this.getArgType(this.args[argName]))
    }
    return result.join(', ')
  }

  /**
   * Returns raw argument type string for SQL
   * @param {ArgumentTypeDef} definition
   * @returns {string}
   */
  getArgType (definition) {
    return (definition.schema
      ? `"${definition.schema}"."${definition.type}"`
      : definition.type)
      + (definition.isArray ? '[]' : '')
  }

  /**
   * @inheritDoc
   */
  getCreateOperator () {
    return 'CREATE OR REPLACE'
  }

  /**
   * @inheritDoc
   */
  getAlterOperator () {
    return 'CREATE OR REPLACE'
  }

  /**
   * @inheritDoc
   */
  getSqlDefinition (operation, addSql) {
    const returns = this.returns ? `RETURNS ${this.getArgType(this.returns)}` : ''
    const cost = this.cost ? `COST ${this.cost}` : ''
    const leakProof = this.isLeakProof ? 'LEAKPROOF' : 'NOT LEAKPROOF'
    const securityDefiner = this.isSecurityDefiner ? 'SECURITY DEFINER' : ''
    return `${returns} LANGUAGE '${this.language}'
  ${cost} ${this.getStabilitySql()} ${leakProof} ${securityDefiner} ${this.getParallelSafety()}
AS $BODY$
${this.code}
$BODY$`
  }

  /**
   * @inheritDoc
   */
  getParentRelation (operation) {
    return '-'
  }

  /**
   * @inheritDoc
   */
  getAlterPropSql (compared, propName, oldValue, curValue) {
    switch (propName) {
      case 'code':
      case 'language':
        return this.getSqlDefinition('create', [])
    }
  }

  setupDependencies () {
    super.setupDependencies()
    const db = this.getDb()
    const types = {...this.args, ...(this.returns ? {__ret: this.returns} : undefined)}
    for (const name of Object.keys(types)) {
      const { schema, type } = types[name]
      if (schema && type) {
        const schemaObj = db.getSchema(schema)
        const object = schemaObj.types[type] || schemaObj.tables[type]
        if (object) {
          this._dependencies.push(object.getPath())
        }
      }
    }
    this._dependencies = arrayUnique(this._dependencies)
  }
}