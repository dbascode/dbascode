/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 11.10.2019
 * Time: 16:27
 */
import AbstractSchemaObject from './AbstractSchemaObject'
import { processCalculations } from './db-utils'
import isString from 'lodash-es/isString'
import isObject from 'lodash-es/isObject'
import isEmpty from 'lodash-es/isEmpty'

/**
 * Function, Procedure, or Trigger Function object
 */
export default class Function extends AbstractSchemaObject {
  language
  returns
  cost = 10
  isSecurityDefiner = false
  stability = 'volatile'
  parallelSafety = 'unsafe'
  code = ''
  args = {}
  isLeakProof = false

  /**
   * @inheritDoc
   */
  applyConfigProperties (config) {
    this.language = config.language || ''
    this.code = config.code || ''
    this.returns = config.returns || ''
    this.isSecurityDefiner = !!config.security_definer
    this.cost = Number(config.cost)
    this.stability = config.stability || ''
    this.parallelSafety = config.parallel_safety
    this.args = config.arguments
    this.isLeakProof = config.leakproof
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
  getObjectClass () {
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
