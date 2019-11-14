/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 11.10.2019
 * Time: 16:27
 */
import AbstractSchemaObject from './AbstractSchemaObject'
import { prepareArgs } from './utils'
import isString from 'lodash-es/isString'
import isObject from 'lodash-es/isObject'

/**
 * Function, Procedure, or Trigger Function object
 */
class Function extends AbstractSchemaObject {
  language
  returns
  cost = 10
  isSecurityDefiner = false
  stability = 'volatile'
  parallelSafety = 'unsafe'
  code = ''
  args = {}
  isLeakProof = false
  allowExecute = []
  denyExecute = []

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
   * @param {boolean} isLeakProof
   * @param {string[]} [allowExecute]
   * @param {string[]} [denyExecute]
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
      allowExecute = [],
      denyExecute = [],
    }
  ) {
    super(name, parent)
    this.language = language
    this.returns = returns
    this.cost = cost
    this.isSecurityDefiner = isSecurityDefiner
    this.isLeakProof = isLeakProof
    this.stability = stability
    this.parallelSafety = parallelSafety
    this.code = code
    this.args = args
    this.allowExecute = allowExecute
    this.denyExecute = denyExecute
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
      parallelSafety: !!cfg.parallel_safety,
      args: cfg.arguments,
      isLeakProof: cfg.leakproof,
      allowExecute: cfg.allow_execute,
      denyExecute: cfg.deny_execute,
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
   * Returns function type (PROCEDURE or FUNCTION) to use in SQL
   * @returns {string}
   */
  getFunctionType () {
    return this.returns ? 'FUNCTION' : 'PROCEDURE'
  }

  /**
   * Returns SQL with GRANT/REVOKE statements
   * @returns {string}
   */
  getGrants () {
    const result = []
    for (let role of this.allowExecute) {
      if (role.toLowerCase() !== 'public') {
        role = `"${role}"`
      }
      result.push(
        `GRANT EXECUTE ON ${this.getFunctionType()} ${this.getParentedName(true)}(${this.getArgTypesList()}) TO ${role};`
      )
    }
    for (let role of this.denyExecute) {
      if (role.toLowerCase() !== 'public') {
        role = `"${role}"`
      }
      result.push(
        `REVOKE ALL ON ${this.getFunctionType()} ${this.getParentedName(true)}(${this.getArgTypesList()}) FROM ${role};`
      )
    }
    return result.join("\n");
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
   * Returns full function create SQL
   * @returns {string}
   */
  getCreate () {
    const returns = this.returns ? `RETURNS ${this.returns}` : ''
    const cost = this.cost ? `COST ${this.cost}` : ''
    const leakProof = this.isLeakProof ? 'LEAKPROOF' : 'NOT LEAKPROOF'
    const securityDefiner = this.isSecurityDefiner ? 'SECURITY DEFINER' : ''
    return (
`CREATE ${this.getFunctionType()} ${this.getParentedName(true)}(${this.getFunctionArgs()})
  ${returns}
  LANGUAGE '${this.language}'
  ${cost} ${this.getStabilitySql()} ${leakProof} ${securityDefiner}
AS $BODY$
${this.code}
$BODY$;
${this.getGrants()}
`
    )
  }

  /**
   * Returns function DROP statement
   * @returns {string}
   */
  getDrop () {
    return `DROP ${this.getFunctionType()} ${this.getParentedName(true)}(${this.getArgTypesList()});`;
  }

  /**
   * @inheritDoc
   */
  getCreateSql (withParent, changedPropPath) {
    if (changedPropPath) {
      return this.getDrop() + this.getCreate()
    } else {
      return this.getCreate()
    }
  }

  /**
   * @inheritDoc
   */
  getDropSql (withParent, changedPropPath) {
    if (changedPropPath) {
      return this.getDrop() + this.getCreate()
    } else {
      return this.getDrop();
    }
  }

  /**
   * @inheritDoc
   */
  getAlterSql (compared, changedPropPath) {
    return this.getDrop() + this.getCreate()
  }
}

export default Function
