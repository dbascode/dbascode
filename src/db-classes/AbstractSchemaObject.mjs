/**
 * Created with PhpStorm.
 * User: pravdin
 * Date: 15.10.2019
 * Time: 19:48
 */
import AbstractDbObject from './AbstractDbObject'

/**
 * Abstract class for objects belonging to a schema
 */
export default class AbstractSchemaObject extends AbstractDbObject {
  /**
   * Returns Schema  object that the current object belongs to
   * @returns {DataBase}
   */
  getSchema () {
    let parent = this
    do {
      parent = parent._parent
    } while (parent && parent.getClassName() !== 'Schema')
    return parent
  }

  /**
   * @inheritDoc
   */
  getObjectIdentifier (operation, isParentContext) {
    if (!isParentContext) {
      const relType = this.getParentRelation()
      if (relType === '') {
        return this.getParentedName(true)
      }
    }
    return super.getObjectIdentifier(operation, isParentContext)
  }
}
