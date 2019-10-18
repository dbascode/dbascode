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
  onObjectCreated(instance, config) {
    switch (instance.constructor.name) {
      case 'Table':
      case 'Column':
        this.applyOmitMixin(instance, config)
        break;
    }
  }

  /**
   * Applies Table class mixin
   * @param {Table} inst
   * @param {Object} cfg
   */
  applyOmitMixin(inst, cfg) {
    const omit = cfg.omit
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

      getComment: (origMethod) => {
        let comment = origMethod()
        if (inst.omit) {
          let addition = '@omit'
          if (isArray(inst.omit)) {
            addition += ' ' + inst.omit.join(',')
          }
          comment += (comment ? "\n" : '') + addition
        }
        return comment
      }
    })
  }
}

export default PostgraphilePlugin
