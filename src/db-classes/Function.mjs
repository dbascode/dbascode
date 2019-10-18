/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 11.10.2019
 * Time: 16:27
 */
import AbstractSchemaObject from './AbstractSchemaObject'
import { prepareArgs } from './utils'

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
  args = ''
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
   * @param {string} [args]
   * @param {boolean} isLeakProof
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
      args = '',
      isLeakProof = false,
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
    if (parent) {
      parent.functions[name] = this
    }
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
    }))
    return result.getDb().pluginOnObjectConfigured(result, cfg)
  }

  getStabilitySql () {
    return this.stability.toUpperCase()
  }

  getParallelSafety () {
    return `PARALLEL ${this.parallelSafety.toUpperCase()}`
  }

  getCreateSql () {
    const type = this.returns ? 'FUNCTION' : 'PROCEDURE'
    const returns = this.returns ? `RETURNS ${this.returns}` : ''
    const cost = this.cost ? `COST ${this.cost}` : ''
    const leakProof = this.isLeakProof ? 'LEAKPROOF' : 'NOT LEAKPROOF'
    const securityDefiner = this.isSecurityDefiner ? 'SECURITY DEFINER' : ''
    return (
`CREATE ${type} ${this.getParentedName(true)}(${this.args})
  ${returns}
  LANGUAGE '${this.language}'
  ${cost} ${this.getStabilitySql()} ${leakProof} ${securityDefiner}
AS $BODY$
${this.code}
$BODY$;
`
    )
  }
}

export default Function
