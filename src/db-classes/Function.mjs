/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 11.10.2019
 * Time: 16:27
 */
import AbstractSchemaObject from './AbstractSchemaObject'
import { prepareArgs } from './db-utils'
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
   *
   * @param {string} name
   * @param {string} language
   * @param {string} returns
   * @param {number} [cost]
   * @param {boolean} [isSecurityDefiner]
   * @param {boolean} [isImmutable]
   * @param {string} [stability]
   * @param {string} [parallelSafety]
   * @param {Schema} [parent]
   * @param {string} code
   * @param {object} [args]
   * @param {boolean} [isLeakProof]
   * @param {object} [grant]
   * @param {object} [revoke]
   * @param {string} [comment]
   */
  constructor (
    {
      name,
      language,
      returns,
      cost = 10,
      isSecurityDefiner = false,
      stability = 'volatile',
      parallelSafety = 'unsafe',
      parent = undefined,
      code = '',
      args = {},
      isLeakProof = false,
      grant = {},
      revoke = {},
      comment = '',
    }
  ) {
    super({
      name,
      parent,
      grant,
      revoke,
      comment,
      fullAlter: true,
    })
    this.language = language
    this.returns = returns
    this.cost = cost
    this.isSecurityDefiner = isSecurityDefiner
    this.isLeakProof = isLeakProof
    this.stability = stability
    this.parallelSafety = parallelSafety
    this.code = code
    this.args = args
  }

  /**
   * Instantiate new object from config data
   * @param {string} name
   * @param {Object|null} cfg
   * @param {Schema} [parent]
   * @return {Function}
   */
  static createFromCfg (name, cfg, parent) {
    if (!cfg) {
      return null
    }
    const result = new Function(prepareArgs(parent, {
      name,
      parent,
      language: cfg.language,
      code: cfg.code,
      returns: cfg.returns,
      isSecurityDefiner: !!cfg.security_definer,
      cost: cfg.cost,
      stability: cfg.stability,
      parallelSafety: cfg.parallel_safety,
      args: cfg.arguments,
      isLeakProof: cfg.leakproof,
      grant: cfg.grant,
      revoke: cfg.revoke,
    }))
    return result.getDb().pluginOnObjectConfigured(result, cfg)
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
  getDefinition (operation, addSql) {
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
