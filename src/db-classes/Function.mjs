/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 11.10.2019
 * Time: 16:27
 */
import AbstractSchemaObject from './AbstractSchemaObject'
import isString from 'lodash-es/isString'
import isObject from 'lodash-es/isObject'
import PropDefCollection from './PropDefCollection'
import PropDef from './PropDef'

/**
 * Function, Procedure, or Trigger Function object
 */
export default class Function extends AbstractSchemaObject {
  /**
   * @property language
   * @property returns
   * @property cost
   * @property isSecurityDefiner
   * @property stability
   * @property parallelSafety
   * @property code
   * @property args
   * @property isLeakProof
   */
  /**
   * @type {PropDefCollection}
   */
  static propDefs = new PropDefCollection([
    new PropDef({ name: 'language', defaultValue: 'sql' }),
    new PropDef({ name: 'returns' }),
    new PropDef({ name: 'cost', type: PropDef.number, defaultValue: 10 }),
    new PropDef({ name: 'isSecurityDefiner', type: PropDef.bool, configName: 'security_definer' }),
    new PropDef({ name: 'stability', defaultValue: 'volatile' }),
    new PropDef({ name: 'parallelSafety', defaultValue: 'unsafe' }),
    new PropDef({ name: 'code' }),
    new PropDef({ name: 'args', configName: 'arguments', type: PropDef.map }),
    new PropDef({ name: 'isLeakProof', type: PropDef.bool }),
  ])

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
   * @param definition
   * @returns {string}
   */
  getArgType (definition) {
    if (isString(definition)) {
      return definition
    } else if (isObject(definition)) {
      return definition.schema ? `"${definition.schema}".${definition.type}` : definition.type
    }
    throw new Error(`Unknown argument type definition format: ${JSON.stringify(definition)}`)
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
    const returns = this.returns ? `RETURNS ${this.returns}` : ''
    const cost = this.cost ? `COST ${this.cost}` : ''
    const leakProof = this.isLeakProof ? 'LEAKPROOF' : 'NOT LEAKPROOF'
    const securityDefiner = this.isSecurityDefiner ? 'SECURITY DEFINER' : ''
    return `${returns} LANGUAGE '${this.language}'
  ${cost} ${this.getStabilitySql()} ${leakProof} ${securityDefiner} ${this.getParallelSafety()}
AS $BODY$
${this.code}
$BODY$`
  }
}
