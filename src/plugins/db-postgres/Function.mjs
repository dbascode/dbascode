/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */
import AbstractSchemaObject from './AbstractSchemaObject'
import PropDefCollection from '../../dbascode/PropDefCollection'
import PropDef from '../../dbascode/PropDef'
import { arrayUnique } from '../../dbascode/utils'
import { parseTypedef } from './utils'
import Type from './Type'
import Table from './Table'

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
    // noinspection JSAnnotator
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
    return this.getIsFunction() ? 'FUNCTION' : 'PROCEDURE'
  }

  /**
   * @inheritDoc
   */
  getObjectIdentifier (operation, isParentContext) {
    if (operation === 'create' || operation === 'alter') {
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
    const realSchemaName = definition.schema ? definition.schema : this.getSchema().name
    const db = this.getDb()
    const schema = db.schemas[realSchemaName]
    const table = schema.tables[definition.type]
    if (table) {
      const sqlType = table.getObjectIdentifier('')
      return (definition.isArray) ? `SETOF ${sqlType}` : sqlType
    }
    return (definition.schema
      ? `${db.schemas[definition.schema].getObjectIdentifier('')}.${this.sql.escapeSqlId(definition.type)}`
      : this.sql.isBuiltinType(definition.type) ? definition.type : this.sql.escapeSqlId(definition.type))
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
   * Check if this function returns a result and should be declared as function.
   * Otherwise should be declared as procedure.
   * @return boolean
   */
  getIsFunction() {
    return this.returns && this.returns.type
  }

  /**
   * @inheritDoc
   */
  getSqlDefinition (operation) {
    const isFunction = this.getIsFunction()
    const returns = isFunction ? `RETURNS ${this.getArgType(this.returns)}` : ''
    const cost = this.cost && isFunction ? `COST ${this.cost}` : ''
    const leakProof = this.isLeakProof ? 'LEAKPROOF' : 'NOT LEAKPROOF'
    const securityDefiner = this.isSecurityDefiner ? 'SECURITY DEFINER' : ''
    const stability = isFunction ? this.getStabilitySql() : ''
    const parallelSafe = isFunction ? this.getParallelSafety() : ''
    return `${returns} LANGUAGE '${this.language}'
  ${cost} ${stability} ${isFunction ? leakProof : ''} ${securityDefiner} ${parallelSafe}
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
  getAlterPropSql (compared, propName, oldValue, curValue, context) {
    switch (propName) {
      case 'code':
      case 'language':
      case 'isSecurityDefiner':
      case 'isLeakProof':
      case 'cost':
      case 'stability':
      case 'parallelSafety':
        return this.getSqlDefinition('create')
      default:
        return super.getAlterPropSql(compared, propName, oldValue, curValue, context)
    }
  }

  /**
   * @inheritDoc
   */
  validate (previous, context) {
    super.validate(previous, context)
    if (this.code === null) {
      context.addError(this, `Function or procedure code can not be empty`)
    }
    // TODO: add args and return types validation
  }

  /**
   * @inheritDoc
   */
  setupDependencies () {
    super.setupDependencies()
    this._dependencies = arrayUnique([
      ...this._dependencies,
      ...this.getArgsAndReturnsDependencies(),
      ...this.getCodeDependencies(),
    ])
  }

  /**
   * Collects dependencies from function arguments and return value.
   * @return {String[]}
   */
  getArgsAndReturnsDependencies () {
    const db = this.getDb()
    const types = {...this.args, ...(this.returns ? {__ret: this.returns} : undefined)}
    const result = []
    for (const name of Object.keys(types)) {
      const { schema, type } = types[name]
      if (schema && type) {
        const schemaObj = db.getSchema(schema)
        if (schemaObj) {
          const object = schemaObj.types[type] || schemaObj.tables[type]
          if (object) {
            result.push(object.getPath())
          }
        }
      }
    }
    return result
  }

  /**
   * Collects dependencies from function code.
   * @return {String[]}
   */
  getCodeDependencies () {
    const db = this.getDb()
    // const thisSchema = this.getSchema()
    const result = []
    const allChildren = db.getAllChildrenRecurse()
    const allTypes = allChildren.filter(item => item instanceof Type)
    const allTables = allChildren.filter(item => item instanceof Table)

    const doSearch = (objects) => {
      for (const child of objects) {
        const name = child.sql.getFullyQualifiedName().split('.')
        const nameRe = name.map(item => `(?:"|)${item}(?:"|)`)
        const matches = [...this.code.matchAll(new RegExp(`(?:^|[^\\w])${nameRe.join('\\.')}(?:$|[^\\w])`, 'g'))]
        if (matches.length > 0) {
          result.push(child.getPath())
        }
      }
    }

    doSearch(allTypes)
    doSearch(allTables)

    return result
  }
}
