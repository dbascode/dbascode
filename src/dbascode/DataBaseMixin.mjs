/**
 * @licence This file is covered by the LICENSE.md file in the root of this project.
 * @copyright 2019 Alex Pravdin
 */
import { dispose } from './utils';
import PropDefCollection from './PropDefCollection'
import PropDef from './PropDef'

export default (Class) =>
  /**
   * Abstract database mixin that adds common database object methods
   * (initial load from config, postprocessing, etc).
   * @class DataBaseMixin
   * @extends AbstractDbObject
   * @property {number} dbmsVersion
   * @property {object} params
   */
  class extends Class {
    /**
     * Mark instance as belonging to the mixin
     * @type {boolean}
     */
    static isDataBaseMixin = true
    /**
     * @type {PropDefCollection}
     */
    static propDefs = new PropDefCollection([
      new PropDef('dbmsVersion', { type: PropDef.number }),
      new PropDef('params', { type: PropDef.map }),
      ...this.propDefs.defs,
    ])
    /**
     * Name if DBMS this object is intended for
     * @type {string}
     */
    static dbms
    /**
     * DbAsCode version number this object was generated with
     * @type {number}
     */
    _version
    /**
     * Postgres plugin version number this object was generated with
     * @type {number}
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
     * @param {typeof DataBaseMixin} class_
     * @param {Object|null} cfg
     * @param {number} dbAsCodeVersion
     * @param {number} pluginVersion
     * @param {boolean} isNew
     * @return {DataBaseMixin|null}
     */
    static createFromState (
      class_,
      cfg,
      dbAsCodeVersion,
      pluginVersion,
      isNew,
    ) {
      if (!cfg) {
        return undefined
      }
      const result = new class_({
        name: cfg.name || '',
        rawConfig: cfg,
      })
      result._version = dbAsCodeVersion
      result._pluginVersion = pluginVersion
      result.applyConfig(cfg)
      result.postprocessTree(isNew)
      // result.setupDependencies()
      return result
    }

    /**
     * Destroys all links in the tree to allow garbage collector
     */
    dispose () {
      dispose(this)
    }
  }
