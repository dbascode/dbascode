/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 29.11.2019
 * Time: 19:38
 */
import AbstractDbObject from './AbstractDbObject'
import { dispose } from './utils'

/**
 * Abstract database class to be inherited by a specific DBMS implementation plugin
 */
export default class AbstractDataBase extends AbstractDbObject {
  /**
   * @type {string} Name if DBMS this object is intended for
   */
  static dbms
  /**
   * @type {number} DbAsCode version number this object was generated with
   */
  _version
  /**
   * @type {number} Postgres plugin version number this object was generated with
   */
  _pluginVersion

  /**
   * Returns version used to save this DB object. Automatically set up by DbAsCode on state save.
   * Useful for adding custom migrations on the tool version change.
   * @return {number}
   */
  getVersion () {
    return this._version
  }

  /**
   * Returns plugin version used to save this DB object. Automatically set up by DbAsCode on state save.
   * Useful for adding custom migrations on the plugin version change.
   * @return {number}
   */
  getPluginVersion () {
    return this._pluginVersion
  }

  /**
   * Instantiate new object from config data
   * @param {typeof AbstractDataBase} class_
   * @param {Object|null} cfg
   * @param {number} dbAsCodeVersion
   * @param {number} pluginVersion
   * @return {AbstractDataBase|null}
   */
  static createFromState(
    class_,
    cfg,
    dbAsCodeVersion,
    pluginVersion,
  ) {
    const result = new class_({
      name: '',
      rawConfig: cfg,
    })
    result._version = dbAsCodeVersion
    result._pluginVersion = pluginVersion
    result.applyConfig(cfg)
    result.postprocessTree()
    result.setupDependencies()
    return result
  }

  /**
   * Destroys all links in the tree to allow garbage collector
   */
  dispose () {
    dispose(this)
  }
}
