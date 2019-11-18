/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 17.10.2019
 * Time: 20:07
 */
import AbstractPlugin from './AbstractPlugin'
import isBoolean from 'lodash-es/isBoolean'
import isArray from 'lodash-es/isArray'
import isString from 'lodash-es/isString'

class PostgraphilePlugin extends AbstractPlugin{
  /**
   * @inheritDoc
   */
  onObjectCreated(instance, config) {
    const type = instance.getClassName()
    switch (type) {
      case 'Table':
      case 'Column':
      case 'PrimaryKey':
        this.applyOmitMixin(instance, config, type)
        break;
    }
  }

  /**
   * @inheritDoc
   */
  onCompareObjects (old, cur, context) {
    switch (cur.getClassName()) {
      case 'PrimaryKey':
        if (old.getDb().getVersion() < 1) {
          // Update omits on primary keys
          context.addChangeWithPath(`${cur.getPath()}.comment`, old.comment, cur.comment)
        }
        break;
    }
  }

  /**
   * Applies Table class mixin
   * @param {Table|Column|PrimaryKey} inst
   * @param {Object} cfg
   * @param {string} type - DB object class type
   */
  applyOmitMixin(inst, cfg, type) {
    const omit = cfg ? cfg.omit : false
    inst.applyMixin({
      omit: isBoolean(omit)
        ? omit
        : (
          isArray(omit)
            ? omit
            : (
              isString(omit)
                ? [omit]
                : undefined
            )
        ),

      getOmitComment: () => {
        if (inst.omit) {
          let addition = '@omit'
          if (isArray(inst.omit)) {
            addition += ' ' + inst.omit.join(',')
          }
          return addition
        }
      },

      getComment: (origMethod) => {
        const omitComment = inst.getOmitComment()
        if (omitComment !== null && omitComment !== undefined) {
          return `${origMethod()}\n${omitComment}`.trim()
        } else {
          return origMethod()
        }
      },
    })
    if (type === 'Table' && inst.primaryKey) {
      inst.primaryKey.omit = inst.omit
    }
  }
}

export default PostgraphilePlugin
