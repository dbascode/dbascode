/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 17.10.2019
 * Time: 20:10
 */
/**
 * Abstract base class for all plugins.
 */
export default class AbstractPlugin {
  /**
   * Returns plugin name. Must be unique.
   * @returns {string}
   */
  getName() {
    return this.constructor.name
  }

  /**
   * Execute plugin on DB object creation.
   * @param {AbstractDbObject} instance
   * @param {Object} config
   * @returns {AbstractDbObject}
   */
  onObjectCreated(instance, config) {
  }

  /**
   * Execute plugin on calculating changes
   * @param {AbstractDbObject} old
   * @param {AbstractDbObject} cur
   * @param {ChangesContext} context
   */
  onCompareObjects (old, cur, context) {
  }
}
