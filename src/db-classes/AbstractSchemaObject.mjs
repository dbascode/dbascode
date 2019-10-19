/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 15.10.2019
 * Time: 19:48
 */
import AbstractDbObject from './AbstractDbObject'

class AbstractSchemaObject extends AbstractDbObject {
  /**
   * Returns Schema  object that the current object belongs to
   * @returns {DataBase}
   */
  getSchema () {
    let parent = this
    do {
      parent = parent._parent
    } while (parent && parent.constructor.name !== 'Schema')
    return parent
  }

}

export default AbstractSchemaObject
