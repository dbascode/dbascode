## Classes

<dl>
<dt><a href="#AbstractDataBase">AbstractDataBase</a></dt>
<dd><p>Abstract database class to be inherited by a specific DBMS implementation plugin.</p></dd>
<dt><a href="#AbstractDbObject">AbstractDbObject</a></dt>
<dd><p>Base class for all DB objects.</p></dd>
<dt><a href="#AbstractSqlExec">AbstractSqlExec</a></dt>
<dd><p>Abstract ancestor class for all sql execution implementations in plugins.</p></dd>
<dt><a href="#AbstractStateStore">AbstractStateStore</a></dt>
<dd><p>Abstract ancestor class for state storage classes.</p></dd>
<dt><a href="#Changes">Changes</a></dt>
<dd><p>Changes calculation routines.</p></dd>
<dt><a href="#ChangesContext">ChangesContext</a></dt>
<dd><p>Context to store changes between two DB trees.</p></dd>
<dt><a href="#ChildDef">ChildDef</a></dt>
<dd><p>Children prop with DB class object(s) definition.</p></dd>
<dt><a href="#ChildDefCollection">ChildDefCollection</a></dt>
<dd><p>Collection of children definitions.</p></dd>
<dt><a href="#DbAsCode">DbAsCode</a></dt>
<dd><p>Main class of the DbAsCode tool.</p></dd>
<dt><a href="#PluginDescriptor">PluginDescriptor</a></dt>
<dd><p>Class describing a plugin and its capabilities.</p></dd>
<dt><a href="#PropDef">PropDef</a></dt>
<dd><p>Object property definition (scalar and non-DB classes).</p></dd>
<dt><a href="#PropDefCollection">PropDefCollection</a></dt>
<dd><p>Collection of object property definitions.</p></dd>
<dt><a href="#State">State</a></dt>
<dd><p>State data.</p></dd>
<dt><a href="#ValidationContext">ValidationContext</a></dt>
<dd><p>Tree validation context.</p></dd>
<dt><a href="#AbstractSchemaObject">AbstractSchemaObject</a></dt>
<dd><p>Abstract class for objects belonging to a schema</p></dd>
<dt><a href="#Column">Column</a></dt>
<dd><p>Column in a table</p></dd>
<dt><a href="#DataBase">DataBase</a></dt>
<dd><p>PostgreSQL database object</p></dd>
<dt><a href="#ForeignKey">ForeignKey</a></dt>
<dd><p>Foreign key in a column</p></dd>
<dt><a href="#Index">Index</a></dt>
<dd><p>Index in a table</p></dd>
<dt><a href="#PostgreSqlPlugin">PostgreSqlPlugin</a></dt>
<dd><p>Postgres plugin descriptor</p></dd>
<dt><a href="#PrimaryKey">PrimaryKey</a></dt>
<dd><p>Table primary key object</p></dd>
<dt><a href="#Role">Role</a></dt>
<dd><p>Role in a database</p></dd>
<dt><a href="#Schema">Schema</a></dt>
<dd><p>Database schema object.</p></dd>
<dt><a href="#Sequence">Sequence</a></dt>
<dd><p>Autoincrement sequence class</p></dd>
<dt><a href="#Table">Table</a></dt>
<dd><p>Table object</p></dd>
<dt><a href="#Trigger">Trigger</a></dt>
<dd><p>Trigger on a table</p></dd>
<dt><a href="#UniqueKey">UniqueKey</a></dt>
<dd><p>Unique key of a table</p></dd>
<dt><a href="#PostgraphilePlugin">PostgraphilePlugin</a></dt>
<dd><p>Some Postgraphile-specific add-ons</p></dd>
</dl>

## Members

<dl>
<dt><a href="#default">default</a></dt>
<dd></dd>
<dt><a href="#default">default</a></dt>
<dd></dd>
<dt><a href="#default">default</a></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#TREE_INITIALIZED">TREE_INITIALIZED</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#processCalculations">processCalculations(obj, args)</a> ⇒ <code>*</code></dt>
<dd><p>Process calculations in string config values</p></dd>
<dt><a href="#doLoadConfig">doLoadConfig(configFiles)</a> ⇒ <code>*</code></dt>
<dd><p>Load the whole DB config with postprocessing. Config files are merged and loaded as the single config.</p></dd>
<dt><a href="#recursePostProcess">recursePostProcess(cfg, [dir])</a> ⇒ <code>*</code></dt>
<dd><p>Postprocessing</p></dd>
<dt><a href="#filterConfig">filterConfig(cfg)</a> ⇒ <code>*</code></dt>
<dd><p>Returns config without directory context</p></dd>
<dt><a href="#arrayContainsEntirely">arrayContainsEntirely(ary1, ary2)</a> ⇒ <code>boolean</code></dt>
<dd><p>Is array2 entirely present in array1</p></dd>
<dt><a href="#objectDifference">objectDifference(o1, o2)</a> ⇒ <code>Object</code></dt>
<dd><p>Returns object with keys from object1 that do not exists in object2</p></dd>
<dt><a href="#objectDifferenceKeys">objectDifferenceKeys(o1, o2)</a> ⇒ <code>Array</code></dt>
<dd><p>Returns object with keys from object1 that do not exists in object2</p></dd>
<dt><a href="#objectIntersection">objectIntersection(o1, o2)</a> ⇒ <code>Object</code></dt>
<dd><p>Returns object with keys exists in both objects</p></dd>
<dt><a href="#objectIntersectionKeys">objectIntersectionKeys(o1, o2)</a> ⇒ <code>Array</code></dt>
<dd><p>Returns object with keys exists in both objects</p></dd>
<dt><a href="#camelCaseToUnderscore">camelCaseToUnderscore(s)</a> ⇒ <code>string</code></dt>
<dd><p>Converts camelCase notation to the underscore-separated</p></dd>
<dt><a href="#getPropValue">getPropValue(obj, prop)</a></dt>
<dd><p>Returns object property value by property path</p></dd>
<dt><a href="#parseArrayProp">parseArrayProp(name)</a></dt>
<dd><p>Parses property name into name itself and array index if any</p></dd>
<dt><a href="#joinSql">joinSql(sql)</a></dt>
<dd><p>Joins array of SQL queries filtering empty ones</p></dd>
<dt><a href="#arrayUnique">arrayUnique(ary)</a> ⇒ <code>array</code></dt>
<dd><p>Removes duplicates from an array. Returns new copy of the source array.</p></dd>
<dt><a href="#saveTempSqlFile">saveTempSqlFile(sql)</a> ⇒ <code>*</code></dt>
<dd></dd>
<dt><a href="#escapeRawText">escapeRawText(s)</a></dt>
<dd><p>Escape text to insert to DB (not adds single quotes)</p></dd>
<dt><a href="#escapeString">escapeString(s)</a></dt>
<dd><p>Escape string to insert to DB (adds single quotes)</p></dd>
<dt><a href="#parsePgConfig">parsePgConfig(vars, dbAsCodeConfig)</a></dt>
<dd><p>Parse DbAsCode config and fill the vars object with the corresponding values</p></dd>
<dt><a href="#parseTypedef">parseTypedef(def)</a> ⇒ <code><a href="#ArgumentTypeDef">ArgumentTypeDef</a></code></dt>
<dd><p>Parse type definition of a type argument or function argument</p></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#SqlExecResult">SqlExecResult</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#ChangedPropertyDef">ChangedPropertyDef</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#DbAsCodeConfig">DbAsCodeConfig</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#VersionedPropName">VersionedPropName</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#ValidateError">ValidateError</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#FKeyRef">FKeyRef</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#ArgumentTypeDef">ArgumentTypeDef</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="AbstractDataBase"></a>

## AbstractDataBase
<p>Abstract database class to be inherited by a specific DBMS implementation plugin.</p>

**Kind**: global class  
**Properties**

| Name | Type |
| --- | --- |
| dbmsVersion | <code>number</code> | 
| params | <code>object</code> | 


* [AbstractDataBase](#AbstractDataBase)
    * _instance_
        * [.propDefs](#AbstractDataBase+propDefs) : [<code>PropDefCollection</code>](#PropDefCollection)
        * [.dbms](#AbstractDataBase+dbms) : <code>string</code>
        * [._version](#AbstractDataBase+_version) : <code>number</code>
        * [._pluginVersion](#AbstractDataBase+_pluginVersion) : <code>number</code>
        * [.getVersion()](#AbstractDataBase+getVersion) ⇒ <code>number</code>
        * [.getPluginVersion()](#AbstractDataBase+getPluginVersion) ⇒ <code>number</code>
        * [.dispose()](#AbstractDataBase+dispose)
    * _static_
        * [.createFromState(class_, cfg, dbAsCodeVersion, pluginVersion)](#AbstractDataBase.createFromState) ⇒ [<code>AbstractDataBase</code>](#AbstractDataBase) \| <code>null</code>

<a name="AbstractDataBase+propDefs"></a>

### abstractDataBase.propDefs : [<code>PropDefCollection</code>](#PropDefCollection)
**Kind**: instance property of [<code>AbstractDataBase</code>](#AbstractDataBase)  
<a name="AbstractDataBase+dbms"></a>

### abstractDataBase.dbms : <code>string</code>
<p>Name if DBMS this object is intended for</p>

**Kind**: instance property of [<code>AbstractDataBase</code>](#AbstractDataBase)  
<a name="AbstractDataBase+_version"></a>

### abstractDataBase.\_version : <code>number</code>
<p>DbAsCode version number this object was generated with</p>

**Kind**: instance property of [<code>AbstractDataBase</code>](#AbstractDataBase)  
<a name="AbstractDataBase+_pluginVersion"></a>

### abstractDataBase.\_pluginVersion : <code>number</code>
<p>Postgres plugin version number this object was generated with</p>

**Kind**: instance property of [<code>AbstractDataBase</code>](#AbstractDataBase)  
<a name="AbstractDataBase+getVersion"></a>

### abstractDataBase.getVersion() ⇒ <code>number</code>
<p>Returns version used to save this DB object. Automatically set up by DbAsCode on state save.
Useful for adding custom migrations on the tool version change.</p>

**Kind**: instance method of [<code>AbstractDataBase</code>](#AbstractDataBase)  
<a name="AbstractDataBase+getPluginVersion"></a>

### abstractDataBase.getPluginVersion() ⇒ <code>number</code>
<p>Returns plugin version used to save this DB object. Automatically set up by DbAsCode on state save.
Useful for adding custom migrations on the plugin version change.</p>

**Kind**: instance method of [<code>AbstractDataBase</code>](#AbstractDataBase)  
<a name="AbstractDataBase+dispose"></a>

### abstractDataBase.dispose()
<p>Destroys all links in the tree to allow garbage collector</p>

**Kind**: instance method of [<code>AbstractDataBase</code>](#AbstractDataBase)  
<a name="AbstractDataBase.createFromState"></a>

### AbstractDataBase.createFromState(class_, cfg, dbAsCodeVersion, pluginVersion) ⇒ [<code>AbstractDataBase</code>](#AbstractDataBase) \| <code>null</code>
<p>Instantiate new object from config data</p>

**Kind**: static method of [<code>AbstractDataBase</code>](#AbstractDataBase)  

| Param | Type |
| --- | --- |
| class_ | [<code>Class.&lt;AbstractDataBase&gt;</code>](#AbstractDataBase) | 
| cfg | <code>Object</code> \| <code>null</code> | 
| dbAsCodeVersion | <code>number</code> | 
| pluginVersion | <code>number</code> | 

<a name="AbstractDbObject"></a>

## AbstractDbObject
<p>Base class for all DB objects.</p>

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| comment | <code>string</code> |  |
| extends | <code>string</code> | <p>Object that this object extends, inheriting its children and some properties. Inherited children must have the _isInherited property set to true.</p> |
| grant | <code>object</code> |  |
| revoke | <code>object</code> |  |


* [AbstractDbObject](#AbstractDbObject)
    * [.AbstractDbObject](#AbstractDbObject+AbstractDbObject)
        * [new exports.AbstractDbObject([name], [parent], [rawConfig], [isInherited])](#new_AbstractDbObject+AbstractDbObject_new)
    * [.name](#AbstractDbObject+name) : <code>string</code>
    * [._dependencies](#AbstractDbObject+_dependencies) : <code>Array.&lt;string&gt;</code>
    * [._rawConfig](#AbstractDbObject+_rawConfig) : <code>\*</code>
    * [._isInherited](#AbstractDbObject+_isInherited) : <code>boolean</code>
    * [.childrenDefs](#AbstractDbObject+childrenDefs) : [<code>ChildDefCollection</code>](#ChildDefCollection)
    * [.propDefs](#AbstractDbObject+propDefs) : [<code>PropDefCollection</code>](#PropDefCollection)
    * [.configName](#AbstractDbObject+configName) : <code>string</code>
    * [.createdByParent](#AbstractDbObject+createdByParent) : <code>boolean</code>
    * [.droppedByParent](#AbstractDbObject+droppedByParent) : <code>boolean</code>
    * [.alterWithParent](#AbstractDbObject+alterWithParent) : <code>boolean</code>
    * [.fullAlter](#AbstractDbObject+fullAlter) : <code>boolean</code>
    * [.getClassName()](#AbstractDbObject+getClassName) ⇒ <code>string</code>
    * [.getClass()](#AbstractDbObject+getClass) ⇒ [<code>Class.&lt;AbstractDbObject&gt;</code>](#AbstractDbObject)
    * [.getCreatedByParent()](#AbstractDbObject+getCreatedByParent) ⇒ <code>boolean</code>
    * [.getDroppedByParent()](#AbstractDbObject+getDroppedByParent) ⇒ <code>boolean</code>
    * [.getAlterWithParent()](#AbstractDbObject+getAlterWithParent) ⇒ <code>boolean</code>
    * [.getFullAlter()](#AbstractDbObject+getFullAlter) ⇒ <code>boolean</code>
    * [.getChildrenDefCollection()](#AbstractDbObject+getChildrenDefCollection) ⇒ [<code>ChildDefCollection</code>](#ChildDefCollection)
    * [.getPropDefCollection()](#AbstractDbObject+getPropDefCollection) ⇒ [<code>PropDefCollection</code>](#PropDefCollection)
    * [.getChildrenByDefs(defs)](#AbstractDbObject+getChildrenByDefs) ⇒ [<code>Array.&lt;AbstractDbObject&gt;</code>](#AbstractDbObject)
    * [.getAllChildren()](#AbstractDbObject+getAllChildren) ⇒ [<code>Array.&lt;AbstractDbObject&gt;</code>](#AbstractDbObject)
    * [.getChildrenByDef(def)](#AbstractDbObject+getChildrenByDef) ⇒ [<code>Array.&lt;AbstractDbObject&gt;</code>](#AbstractDbObject)
    * [.getChildrenByType(class_)](#AbstractDbObject+getChildrenByType) ⇒ [<code>Array.&lt;AbstractDbObject&gt;</code>](#AbstractDbObject)
    * [.findChildByDefAndName(def, name)](#AbstractDbObject+findChildByDefAndName) ⇒ [<code>AbstractDbObject</code>](#AbstractDbObject)
    * [.findChildByClassAndName(class_, name)](#AbstractDbObject+findChildByClassAndName) ⇒ [<code>AbstractDbObject</code>](#AbstractDbObject)
    * [.getCommentChangesSql(previous)](#AbstractDbObject+getCommentChangesSql) ⇒ <code>string</code>
    * [.getQuotedComment()](#AbstractDbObject+getQuotedComment) ⇒ <code>string</code>
    * [.getPermissionsChangesSql(previous)](#AbstractDbObject+getPermissionsChangesSql) ⇒ <code>string</code>
    * [.getCreateSqlWithChildren()](#AbstractDbObject+getCreateSqlWithChildren) ⇒ <code>string</code>
    * [.getDropSqlWithChildren()](#AbstractDbObject+getDropSqlWithChildren) ⇒ <code>string</code>
    * [.getCreateSql()](#AbstractDbObject+getCreateSql) ⇒ <code>string</code>
    * [.getCreateOperator()](#AbstractDbObject+getCreateOperator) ⇒ <code>string</code>
    * [.getSeparateCreateSql()](#AbstractDbObject+getSeparateCreateSql) ⇒ <code>string</code>
    * [.getSqlDefinition(operation, addSql)](#AbstractDbObject+getSqlDefinition) ⇒ <code>string</code>
    * [.getDropSql()](#AbstractDbObject+getDropSql) ⇒ <code>string</code>
    * [.getSeparateDropSql()](#AbstractDbObject+getSeparateDropSql) ⇒ <code>string</code>
    * [.getPermissionSql(type, operation, role)](#AbstractDbObject+getPermissionSql) ⇒ <code>string</code>
    * [.getObjectClass(operation)](#AbstractDbObject+getObjectClass) ⇒ <code>string</code>
    * [.getObjectIdentifier(operation, isParentContext)](#AbstractDbObject+getObjectIdentifier) ⇒ <code>string</code>
    * [.getParentRelation(operation)](#AbstractDbObject+getParentRelation) ⇒ <code>string</code>
    * [.getAlterSql(compared, changes)](#AbstractDbObject+getAlterSql) ⇒ <code>string</code>
    * [.getAlterPropSql(compared, propName, oldValue, curValue)](#AbstractDbObject+getAlterPropSql) ⇒ <code>string</code> \| <code>Array.&lt;string&gt;</code> \| <code>undefined</code>
    * [.getAlterOperator()](#AbstractDbObject+getAlterOperator) ⇒ <code>string</code>
    * [.getAlterWithParentOperator()](#AbstractDbObject+getAlterWithParentOperator) ⇒ <code>string</code>
    * [.getFullAlterSql()](#AbstractDbObject+getFullAlterSql) ⇒ <code>string</code>
    * [.getParentedName()](#AbstractDbObject+getParentedName) ⇒ <code>string</code>
    * [.getParentedNameFlat()](#AbstractDbObject+getParentedNameFlat) ⇒ <code>string</code>
    * [.getQuotedName()](#AbstractDbObject+getQuotedName) ⇒ <code>string</code>
    * [.getChildByPath(path)](#AbstractDbObject+getChildByPath) ⇒ [<code>AbstractDbObject</code>](#AbstractDbObject) \| <code>\*</code>
    * [.getPath()](#AbstractDbObject+getPath) ⇒ <code>string</code>
    * [.getDb()](#AbstractDbObject+getDb) ⇒ [<code>AbstractDataBase</code>](#AbstractDataBase)
    * [.getCalculators()](#AbstractDbObject+getCalculators) ⇒ <code>Object</code>
    * [.processCalculations(value)](#AbstractDbObject+processCalculations) ⇒ <code>string</code>
    * [.applyMixin(mixin)](#AbstractDbObject+applyMixin)
    * [.getParent()](#AbstractDbObject+getParent) ⇒ [<code>AbstractDbObject</code>](#AbstractDbObject)
    * [.postprocessTree()](#AbstractDbObject+postprocessTree)
    * [.setupDependencies()](#AbstractDbObject+setupDependencies)
    * [.applyConfig(config)](#AbstractDbObject+applyConfig) ⇒ <code>object</code>
    * [.getConfigForApply(config)](#AbstractDbObject+getConfigForApply) ⇒ <code>object</code>
    * [.getConfigPropNameForChild(def)](#AbstractDbObject+getConfigPropNameForChild)
    * [.createChildrenFromConfig(config, isInherited)](#AbstractDbObject+createChildrenFromConfig)
    * [.applyConfigProperties(config)](#AbstractDbObject+applyConfigProperties)
    * [.addChild(child)](#AbstractDbObject+addChild)
    * [.validate(previous, context)](#AbstractDbObject+validate) ⇒

<a name="AbstractDbObject+AbstractDbObject"></a>

### abstractDbObject.AbstractDbObject
**Kind**: instance class of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="new_AbstractDbObject+AbstractDbObject_new"></a>

#### new exports.AbstractDbObject([name], [parent], [rawConfig], [isInherited])
<p>Constructor</p>


| Param | Type |
| --- | --- |
| [name] | <code>String</code> | 
| [parent] | [<code>AbstractDbObject</code>](#AbstractDbObject) | 
| [rawConfig] | <code>\*</code> | 
| [isInherited] | <code>boolean</code> | 

<a name="AbstractDbObject+name"></a>

### abstractDbObject.name : <code>string</code>
**Kind**: instance property of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+_dependencies"></a>

### abstractDbObject.\_dependencies : <code>Array.&lt;string&gt;</code>
<p>List of object dependencies. Stores an array of paths to objects</p>

**Kind**: instance property of [<code>AbstractDbObject</code>](#AbstractDbObject)  
**Access**: protected  
<a name="AbstractDbObject+_rawConfig"></a>

### abstractDbObject.\_rawConfig : <code>\*</code>
<p>Raw object configuration from state. For use by plugins.</p>

**Kind**: instance property of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+_isInherited"></a>

### abstractDbObject.\_isInherited : <code>boolean</code>
<p>Is this object inherited. Inherited objects should not be exported to SQL.</p>

**Kind**: instance property of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+childrenDefs"></a>

### abstractDbObject.childrenDefs : [<code>ChildDefCollection</code>](#ChildDefCollection)
<p>List of children definitions</p>

**Kind**: instance property of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+propDefs"></a>

### abstractDbObject.propDefs : [<code>PropDefCollection</code>](#PropDefCollection)
<p>List of properties definitions</p>

**Kind**: instance property of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+configName"></a>

### abstractDbObject.configName : <code>string</code>
<p>Name of a state key where object configuration is found</p>

**Kind**: instance property of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+createdByParent"></a>

### abstractDbObject.createdByParent : <code>boolean</code>
<p>Whether the object is automatically created by its parent while parent constructing.
This object still can be created separately by altering its prent object.</p>

**Kind**: instance property of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+droppedByParent"></a>

### abstractDbObject.droppedByParent : <code>boolean</code>
<p>Whether the object is automatically dropped by its parent without additional queries.
This object still can be dropped separately by altering its prent object.</p>

**Kind**: instance property of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+alterWithParent"></a>

### abstractDbObject.alterWithParent : <code>boolean</code>
<p>Whether parent object must be altered on altering its parent object.</p>

**Kind**: instance property of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+fullAlter"></a>

### abstractDbObject.fullAlter : <code>boolean</code>
<p>Use the whole object definition on ALTER instead of prop-by-prop alteration</p>

**Kind**: instance property of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+getClassName"></a>

### abstractDbObject.getClassName() ⇒ <code>string</code>
<p>Returns class name of this object</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+getClass"></a>

### abstractDbObject.getClass() ⇒ [<code>Class.&lt;AbstractDbObject&gt;</code>](#AbstractDbObject)
<p>Returns class name of this object</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+getCreatedByParent"></a>

### abstractDbObject.getCreatedByParent() ⇒ <code>boolean</code>
**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+getDroppedByParent"></a>

### abstractDbObject.getDroppedByParent() ⇒ <code>boolean</code>
**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+getAlterWithParent"></a>

### abstractDbObject.getAlterWithParent() ⇒ <code>boolean</code>
**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+getFullAlter"></a>

### abstractDbObject.getFullAlter() ⇒ <code>boolean</code>
**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+getChildrenDefCollection"></a>

### abstractDbObject.getChildrenDefCollection() ⇒ [<code>ChildDefCollection</code>](#ChildDefCollection)
**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+getPropDefCollection"></a>

### abstractDbObject.getPropDefCollection() ⇒ [<code>PropDefCollection</code>](#PropDefCollection)
**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+getChildrenByDefs"></a>

### abstractDbObject.getChildrenByDefs(defs) ⇒ [<code>Array.&lt;AbstractDbObject&gt;</code>](#AbstractDbObject)
<p>Returns all children by array of ChildDefs</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  

| Param | Type |
| --- | --- |
| defs | [<code>Array.&lt;ChildDef&gt;</code>](#ChildDef) | 

<a name="AbstractDbObject+getAllChildren"></a>

### abstractDbObject.getAllChildren() ⇒ [<code>Array.&lt;AbstractDbObject&gt;</code>](#AbstractDbObject)
<p>Returns all children of all DB types</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+getChildrenByDef"></a>

### abstractDbObject.getChildrenByDef(def) ⇒ [<code>Array.&lt;AbstractDbObject&gt;</code>](#AbstractDbObject)
<p>Returns all children by the specified ChildDef</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  

| Param | Type |
| --- | --- |
| def | [<code>ChildDef</code>](#ChildDef) | 

<a name="AbstractDbObject+getChildrenByType"></a>

### abstractDbObject.getChildrenByType(class_) ⇒ [<code>Array.&lt;AbstractDbObject&gt;</code>](#AbstractDbObject)
<p>Returns all children of the specified type</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  

| Param | Type |
| --- | --- |
| class_ | [<code>Class.&lt;AbstractDbObject&gt;</code>](#AbstractDbObject) | 

<a name="AbstractDbObject+findChildByDefAndName"></a>

### abstractDbObject.findChildByDefAndName(def, name) ⇒ [<code>AbstractDbObject</code>](#AbstractDbObject)
<p>Search for children of the specified definition and name</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  

| Param | Type |
| --- | --- |
| def | [<code>ChildDef</code>](#ChildDef) | 
| name | <code>string</code> | 

<a name="AbstractDbObject+findChildByClassAndName"></a>

### abstractDbObject.findChildByClassAndName(class_, name) ⇒ [<code>AbstractDbObject</code>](#AbstractDbObject)
<p>Search for children of the specified class and name</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  

| Param | Type |
| --- | --- |
| class_ | [<code>Class.&lt;AbstractDbObject&gt;</code>](#AbstractDbObject) | 
| name | <code>string</code> | 

<a name="AbstractDbObject+getCommentChangesSql"></a>

### abstractDbObject.getCommentChangesSql(previous) ⇒ <code>string</code>
<p>Returns SQL for comments update</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  

| Param | Type |
| --- | --- |
| previous | [<code>AbstractDbObject</code>](#AbstractDbObject) | 

<a name="AbstractDbObject+getQuotedComment"></a>

### abstractDbObject.getQuotedComment() ⇒ <code>string</code>
<p>Returns this object comment</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+getPermissionsChangesSql"></a>

### abstractDbObject.getPermissionsChangesSql(previous) ⇒ <code>string</code>
<p>Returns SQL for permissions update</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  

| Param |
| --- |
| previous | 

<a name="AbstractDbObject+getCreateSqlWithChildren"></a>

### abstractDbObject.getCreateSqlWithChildren() ⇒ <code>string</code>
<p>Returns CREATE SQL statement for the object and all its children</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+getDropSqlWithChildren"></a>

### abstractDbObject.getDropSqlWithChildren() ⇒ <code>string</code>
<p>Returns DROP SQL statement for the object</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+getCreateSql"></a>

### abstractDbObject.getCreateSql() ⇒ <code>string</code>
<p>Returns SQL for object creation</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  
**Access**: protected  
<a name="AbstractDbObject+getCreateOperator"></a>

### abstractDbObject.getCreateOperator() ⇒ <code>string</code>
<p>Returns operator for the CREATE operation</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  
**Access**: protected  
<a name="AbstractDbObject+getSeparateCreateSql"></a>

### abstractDbObject.getSeparateCreateSql() ⇒ <code>string</code>
<p>Returns SQL for object creation for objects created by its parents</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  
**Access**: protected  
<a name="AbstractDbObject+getSqlDefinition"></a>

### abstractDbObject.getSqlDefinition(operation, addSql) ⇒ <code>string</code>
<p>Returns SQL text of the definition body of the object (without object type and name).</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  

| Param | Type | Description |
| --- | --- | --- |
| operation | <code>string</code> |  |
| addSql | <code>array</code> | <p>Array to add additional SQL queries after the current definition will be executed.</p> |

<a name="AbstractDbObject+getDropSql"></a>

### abstractDbObject.getDropSql() ⇒ <code>string</code>
<p>Returns SQL for object deletion</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  
**Access**: protected  
<a name="AbstractDbObject+getSeparateDropSql"></a>

### abstractDbObject.getSeparateDropSql() ⇒ <code>string</code>
<p>Returns SQL for object deletion separately from its parent</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  
**Access**: protected  
<a name="AbstractDbObject+getPermissionSql"></a>

### abstractDbObject.getPermissionSql(type, operation, role) ⇒ <code>string</code>
<p>Returns GRANT/REVOKE SQL statement</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  

| Param |
| --- |
| type | 
| operation | 
| role | 

<a name="AbstractDbObject+getObjectClass"></a>

### abstractDbObject.getObjectClass(operation) ⇒ <code>string</code>
<p>Returns object class name for use in SQL</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  

| Param | Type |
| --- | --- |
| operation | <code>string</code> | 

<a name="AbstractDbObject+getObjectIdentifier"></a>

### abstractDbObject.getObjectIdentifier(operation, isParentContext) ⇒ <code>string</code>
<p>Returns object identifier for use in SQL.</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| operation | <code>string</code> |  |  |
| isParentContext | <code>boolean</code> | <code>false</code> | <p>Is the requested identifier to be used inside the parent object</p> |

<a name="AbstractDbObject+getParentRelation"></a>

### abstractDbObject.getParentRelation(operation) ⇒ <code>string</code>
<p>Returns parent relation type: '' or '.' or 'ON' or '-'
'' - use regular identification, i.e.: <code>role</code> or <code>schema.table</code>
<code>.</code> - use dot separator in addition to the parent identifier, i.e.: <code>schema.table.column</code>
<code>ON</code> - use the <code>ON</code> operator on the parent, i.e.: <code>index ON schema.table</code>
<code>-</code> - use regular identification, but alter object using per property changes, not a whole object recreation.</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  

| Param | Type | Description |
| --- | --- | --- |
| operation | <code>string</code> | <p>operation which ir requiring the relation</p> |

<a name="AbstractDbObject+getAlterSql"></a>

### abstractDbObject.getAlterSql(compared, changes) ⇒ <code>string</code>
<p>Returns SQL for object update</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  

| Param | Type | Description |
| --- | --- | --- |
| compared | [<code>AbstractDbObject</code>](#AbstractDbObject) |  |
| changes | <code>Object.&lt;string, ChangedPropertyDef&gt;</code> | <p>dot-separated paths to the changed properties with old and new values (empty if the whole object changed)</p> |

<a name="AbstractDbObject+getAlterPropSql"></a>

### abstractDbObject.getAlterPropSql(compared, propName, oldValue, curValue) ⇒ <code>string</code> \| <code>Array.&lt;string&gt;</code> \| <code>undefined</code>
<p>Returns SQL for alteration of a particular property</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  

| Param | Type |
| --- | --- |
| compared | [<code>AbstractDbObject</code>](#AbstractDbObject) | 
| propName | <code>string</code> | 
| oldValue | <code>\*</code> | 
| curValue | <code>\*</code> | 

<a name="AbstractDbObject+getAlterOperator"></a>

### abstractDbObject.getAlterOperator() ⇒ <code>string</code>
<p>Returns SQL operator used on changing this object.</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+getAlterWithParentOperator"></a>

### abstractDbObject.getAlterWithParentOperator() ⇒ <code>string</code>
<p>Returns SQL operator used on changing this object.</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+getFullAlterSql"></a>

### abstractDbObject.getFullAlterSql() ⇒ <code>string</code>
<p>Returns ALTER SQL for  objects which are fully recreated on alteration.</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+getParentedName"></a>

### abstractDbObject.getParentedName() ⇒ <code>string</code>
<p>Returns name of this object prepended by _parent's name for SQL use</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+getParentedNameFlat"></a>

### abstractDbObject.getParentedNameFlat() ⇒ <code>string</code>
<p>Returns name of this object prepended by _parent's name separated by underscore</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+getQuotedName"></a>

### abstractDbObject.getQuotedName() ⇒ <code>string</code>
<p>Returns name escaped for DB identifiers</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+getChildByPath"></a>

### abstractDbObject.getChildByPath(path) ⇒ [<code>AbstractDbObject</code>](#AbstractDbObject) \| <code>\*</code>
<p>Returns a child by its path</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  

| Param |
| --- |
| path | 

<a name="AbstractDbObject+getPath"></a>

### abstractDbObject.getPath() ⇒ <code>string</code>
<p>Returns full path of the object</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+getDb"></a>

### abstractDbObject.getDb() ⇒ [<code>AbstractDataBase</code>](#AbstractDataBase)
<p>Returns DB object that the current object belongs to</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+getCalculators"></a>

### abstractDbObject.getCalculators() ⇒ <code>Object</code>
<p>Returns a map of calculations for calculated values in config</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+processCalculations"></a>

### abstractDbObject.processCalculations(value) ⇒ <code>string</code>
<p>Replace calculated values in strings</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  

| Param | Type |
| --- | --- |
| value | <code>string</code> | 

<a name="AbstractDbObject+applyMixin"></a>

### abstractDbObject.applyMixin(mixin)
<p>Applies a mixin to the current object</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  

| Param | Type |
| --- | --- |
| mixin | <code>Object</code> | 

<a name="AbstractDbObject+getParent"></a>

### abstractDbObject.getParent() ⇒ [<code>AbstractDbObject</code>](#AbstractDbObject)
<p>Returns parent of this object</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+postprocessTree"></a>

### abstractDbObject.postprocessTree()
<p>Executed after all the explicit objects are created from the state. It's time to create implicit
objects if any.</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+setupDependencies"></a>

### abstractDbObject.setupDependencies()
<p>Fills the dependencies list of this object and its children. Must throw an exception if
a dependency object is not found in the current tree.</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  
<a name="AbstractDbObject+applyConfig"></a>

### abstractDbObject.applyConfig(config) ⇒ <code>object</code>
<p>Applies raw state config to the object.</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>string</code> \| <code>Object</code> \| <code>null</code> | <p>Raw state config for this object</p> |

<a name="AbstractDbObject+getConfigForApply"></a>

### abstractDbObject.getConfigForApply(config) ⇒ <code>object</code>
<p>Filters state config data removing unneeded and excessive options.</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  

| Param | Type |
| --- | --- |
| config | <code>object</code> | 

<a name="AbstractDbObject+getConfigPropNameForChild"></a>

### abstractDbObject.getConfigPropNameForChild(def)
<p>Returns state config property name for child/children of the specified definition.</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  

| Param | Type |
| --- | --- |
| def | [<code>ChildDef</code>](#ChildDef) | 

<a name="AbstractDbObject+createChildrenFromConfig"></a>

### abstractDbObject.createChildrenFromConfig(config, isInherited)
<p>Creates db children for this object from state config.</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  

| Param | Type |
| --- | --- |
| config | <code>\*</code> | 
| isInherited | <code>boolean</code> | 

<a name="AbstractDbObject+applyConfigProperties"></a>

### abstractDbObject.applyConfigProperties(config)
<p>Method to be overridden by specific DB classes to initialize properties from the state config
on object creation.</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  

| Param | Type |
| --- | --- |
| config | <code>object</code> \| <code>string</code> \| <code>\*</code> | 

<a name="AbstractDbObject+addChild"></a>

### abstractDbObject.addChild(child)
<p>Correctly adds child to the object</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  

| Param | Type |
| --- | --- |
| child | [<code>AbstractDbObject</code>](#AbstractDbObject) | 

<a name="AbstractDbObject+validate"></a>

### abstractDbObject.validate(previous, context) ⇒
<p>Validates this object and its children settings.</p>

**Kind**: instance method of [<code>AbstractDbObject</code>](#AbstractDbObject)  
**Returns**: <p>void</p>  

| Param | Type | Description |
| --- | --- | --- |
| previous | [<code>AbstractDbObject</code>](#AbstractDbObject) \| <code>undefined</code> | <p>Previous object or to compare with of <code>undefined</code> if this object is newly created.</p> |
| context | [<code>ValidationContext</code>](#ValidationContext) |  |

<a name="AbstractSqlExec"></a>

## AbstractSqlExec
<p>Abstract ancestor class for all sql execution implementations in plugins.</p>

**Kind**: global class  

* [AbstractSqlExec](#AbstractSqlExec)
    * [new AbstractSqlExec(dbAsCodeConfig, plugin)](#new_AbstractSqlExec_new)
    * [.dbAsCodeConfig](#AbstractSqlExec+dbAsCodeConfig) : [<code>DbAsCodeConfig</code>](#DbAsCodeConfig)
    * [._plugin](#AbstractSqlExec+_plugin) : [<code>PluginDescriptor</code>](#PluginDescriptor)
    * [.executeSql(sql, cfg)](#AbstractSqlExec+executeSql) ⇒ [<code>Promise.&lt;SqlExecResult&gt;</code>](#SqlExecResult)

<a name="new_AbstractSqlExec_new"></a>

### new AbstractSqlExec(dbAsCodeConfig, plugin)
<p>Constructor</p>


| Param | Type |
| --- | --- |
| dbAsCodeConfig | [<code>DbAsCodeConfig</code>](#DbAsCodeConfig) | 
| plugin | [<code>PluginDescriptor</code>](#PluginDescriptor) | 

<a name="AbstractSqlExec+dbAsCodeConfig"></a>

### abstractSqlExec.dbAsCodeConfig : [<code>DbAsCodeConfig</code>](#DbAsCodeConfig)
**Kind**: instance property of [<code>AbstractSqlExec</code>](#AbstractSqlExec)  
<a name="AbstractSqlExec+_plugin"></a>

### abstractSqlExec.\_plugin : [<code>PluginDescriptor</code>](#PluginDescriptor)
**Kind**: instance property of [<code>AbstractSqlExec</code>](#AbstractSqlExec)  
<a name="AbstractSqlExec+executeSql"></a>

### abstractSqlExec.executeSql(sql, cfg) ⇒ [<code>Promise.&lt;SqlExecResult&gt;</code>](#SqlExecResult)
<p>Execute SQL script on the DB server. The whole script must be run in a single transaction. None
of the queries should affect DB state if any of the queries has failed.</p>

**Kind**: instance method of [<code>AbstractSqlExec</code>](#AbstractSqlExec)  

| Param | Type |
| --- | --- |
| sql | <code>string</code> | 
| cfg | <code>object</code> | 

<a name="AbstractStateStore"></a>

## AbstractStateStore
<p>Abstract ancestor class for state storage classes.</p>

**Kind**: global class  

* [AbstractStateStore](#AbstractStateStore)
    * [new AbstractStateStore(dbAsCodeConfig, plugin)](#new_AbstractStateStore_new)
    * [.dbAsCodeConfig](#AbstractStateStore+dbAsCodeConfig) : [<code>DbAsCodeConfig</code>](#DbAsCodeConfig)
    * [._plugin](#AbstractStateStore+_plugin) : [<code>PluginDescriptor</code>](#PluginDescriptor)
    * [.getState()](#AbstractStateStore+getState) ⇒ [<code>Promise.&lt;State&gt;</code>](#State)
    * [.getStorageConfigPath()](#AbstractStateStore+getStorageConfigPath) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.getStateSaveSql(state)](#AbstractStateStore+getStateSaveSql) ⇒ <code>Promise.&lt;string&gt;</code>

<a name="new_AbstractStateStore_new"></a>

### new AbstractStateStore(dbAsCodeConfig, plugin)
<p>Constructor</p>


| Param | Type |
| --- | --- |
| dbAsCodeConfig | [<code>DbAsCodeConfig</code>](#DbAsCodeConfig) | 
| plugin | [<code>PluginDescriptor</code>](#PluginDescriptor) | 

<a name="AbstractStateStore+dbAsCodeConfig"></a>

### abstractStateStore.dbAsCodeConfig : [<code>DbAsCodeConfig</code>](#DbAsCodeConfig)
**Kind**: instance property of [<code>AbstractStateStore</code>](#AbstractStateStore)  
<a name="AbstractStateStore+_plugin"></a>

### abstractStateStore.\_plugin : [<code>PluginDescriptor</code>](#PluginDescriptor)
**Kind**: instance property of [<code>AbstractStateStore</code>](#AbstractStateStore)  
<a name="AbstractStateStore+getState"></a>

### abstractStateStore.getState() ⇒ [<code>Promise.&lt;State&gt;</code>](#State)
<p>Loads the current (last) state of the database</p>

**Kind**: instance method of [<code>AbstractStateStore</code>](#AbstractStateStore)  
<a name="AbstractStateStore+getStorageConfigPath"></a>

### abstractStateStore.getStorageConfigPath() ⇒ <code>Promise.&lt;string&gt;</code>
<p>Returns state storage configuration file name</p>

**Kind**: instance method of [<code>AbstractStateStore</code>](#AbstractStateStore)  
<a name="AbstractStateStore+getStateSaveSql"></a>

### abstractStateStore.getStateSaveSql(state) ⇒ <code>Promise.&lt;string&gt;</code>
<p>Returns SQL to save state to the DB</p>

**Kind**: instance method of [<code>AbstractStateStore</code>](#AbstractStateStore)  

| Param | Type |
| --- | --- |
| state | [<code>State</code>](#State) | 

<a name="Changes"></a>

## Changes
<p>Changes calculation routines.</p>

**Kind**: global class  

* [Changes](#Changes)
    * [.getChangesSql(previous, current, changes)](#Changes+getChangesSql)
    * [.collectChanges(old, current, [deep])](#Changes+collectChanges) ⇒ [<code>ChangesContext</code>](#ChangesContext)
    * [.getObjectForChangeLog(obj)](#Changes+getObjectForChangeLog) ⇒ <code>Object</code>
    * [.hasChangesInValues(v2, v1, context)](#Changes+hasChangesInValues) ⇒ <code>boolean</code>

<a name="Changes+getChangesSql"></a>

### changes.getChangesSql(previous, current, changes)
<p>Returns SQL applying specified changes</p>

**Kind**: instance method of [<code>Changes</code>](#Changes)  

| Param | Type |
| --- | --- |
| previous | [<code>AbstractDbObject</code>](#AbstractDbObject) | 
| current | [<code>AbstractDbObject</code>](#AbstractDbObject) | 
| changes | [<code>ChangesContext</code>](#ChangesContext) | 

<a name="Changes+collectChanges"></a>

### changes.collectChanges(old, current, [deep]) ⇒ [<code>ChangesContext</code>](#ChangesContext)
<p>Has changes old to the previous state object</p>

**Kind**: instance method of [<code>Changes</code>](#Changes)  

| Param | Type | Default |
| --- | --- | --- |
| old | [<code>AbstractDbObject</code>](#AbstractDbObject) |  | 
| current | [<code>AbstractDbObject</code>](#AbstractDbObject) |  | 
| [deep] | <code>boolean</code> | <code>false</code> | 

<a name="Changes+getObjectForChangeLog"></a>

### changes.getObjectForChangeLog(obj) ⇒ <code>Object</code>
**Kind**: instance method of [<code>Changes</code>](#Changes)  

| Param | Type |
| --- | --- |
| obj | [<code>AbstractDbObject</code>](#AbstractDbObject) | 

<a name="Changes+hasChangesInValues"></a>

### changes.hasChangesInValues(v2, v1, context) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>Changes</code>](#Changes)  

| Param | Type |
| --- | --- |
| v2 | [<code>AbstractDbObject</code>](#AbstractDbObject) \| <code>\*</code> | 
| v1 | [<code>AbstractDbObject</code>](#AbstractDbObject) \| <code>\*</code> | 
| context | [<code>ChangesContext</code>](#ChangesContext) | 

<a name="ChangesContext"></a>

## ChangesContext
<p>Context to store changes between two DB trees.</p>

**Kind**: global class  

* [ChangesContext](#ChangesContext)
    * [.changes](#ChangesContext+changes) : <code>Array.&lt;ChangeItem&gt;</code>
    * [.addChangeWithPath(path, old, cur)](#ChangesContext+addChangeWithPath)
    * [.hasChanges()](#ChangesContext+hasChanges) ⇒ <code>boolean</code>
    * [.hasSqlChanges()](#ChangesContext+hasSqlChanges) ⇒ <code>boolean</code>

<a name="ChangesContext+changes"></a>

### changesContext.changes : <code>Array.&lt;ChangeItem&gt;</code>
**Kind**: instance property of [<code>ChangesContext</code>](#ChangesContext)  
<a name="ChangesContext+addChangeWithPath"></a>

### changesContext.addChangeWithPath(path, old, cur)
<p>Add change from a plugin</p>

**Kind**: instance method of [<code>ChangesContext</code>](#ChangesContext)  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 
| old | <code>\*</code> | 
| cur | <code>\*</code> | 

<a name="ChangesContext+hasChanges"></a>

### changesContext.hasChanges() ⇒ <code>boolean</code>
<p>Do we have any changes.</p>

**Kind**: instance method of [<code>ChangesContext</code>](#ChangesContext)  
<a name="ChangesContext+hasSqlChanges"></a>

### changesContext.hasSqlChanges() ⇒ <code>boolean</code>
<p>Do we have changes that must be reflected in SQL.</p>

**Kind**: instance method of [<code>ChangesContext</code>](#ChangesContext)  
<a name="ChildDef"></a>

## ChildDef
<p>Children prop with DB class object(s) definition.</p>

**Kind**: global class  

* [ChildDef](#ChildDef)
    * [new ChildDef(class_, propType)](#new_ChildDef_new)
    * [.class_](#ChildDef+class_) : [<code>Class.&lt;AbstractDbObject&gt;</code>](#AbstractDbObject)
    * [.propType](#ChildDef+propType) : <code>string</code>
    * [.propName](#ChildDef+propName) : <code>string</code>
    * [.configPropName](#ChildDef+configPropName) : <code>string</code>
    * [.getPropertyName()](#ChildDef+getPropertyName) ⇒ <code>string</code>
    * [.getConfigName()](#ChildDef+getConfigName) ⇒ <code>string</code>

<a name="new_ChildDef_new"></a>

### new ChildDef(class_, propType)
<p>Constructor</p>


| Param | Type | Description |
| --- | --- | --- |
| class_ | [<code>Class.&lt;AbstractDbObject&gt;</code>](#AbstractDbObject) |  |
| propType | <code>string</code> | <p>property type (single, map, or array)</p> |

<a name="ChildDef+class_"></a>

### childDef.class\_ : [<code>Class.&lt;AbstractDbObject&gt;</code>](#AbstractDbObject)
**Kind**: instance property of [<code>ChildDef</code>](#ChildDef)  
<a name="ChildDef+propType"></a>

### childDef.propType : <code>string</code>
**Kind**: instance property of [<code>ChildDef</code>](#ChildDef)  
<a name="ChildDef+propName"></a>

### childDef.propName : <code>string</code>
<p>Property name where this class objects should be stored at parent</p>

**Kind**: instance property of [<code>ChildDef</code>](#ChildDef)  
<a name="ChildDef+configPropName"></a>

### childDef.configPropName : <code>string</code>
<p>Config property name where this class objects configuration is stored in state</p>

**Kind**: instance property of [<code>ChildDef</code>](#ChildDef)  
<a name="ChildDef+getPropertyName"></a>

### childDef.getPropertyName() ⇒ <code>string</code>
<p>Returns property name where this class objects should be stored</p>

**Kind**: instance method of [<code>ChildDef</code>](#ChildDef)  
<a name="ChildDef+getConfigName"></a>

### childDef.getConfigName() ⇒ <code>string</code>
<p>Returns config property name where this class objects configuration is stored in state</p>

**Kind**: instance method of [<code>ChildDef</code>](#ChildDef)  
<a name="ChildDefCollection"></a>

## ChildDefCollection
<p>Collection of children definitions.</p>

**Kind**: global class  

* [ChildDefCollection](#ChildDefCollection)
    * [new ChildDefCollection(defs)](#new_ChildDefCollection_new)
    * [.defs](#ChildDefCollection+defs) : [<code>Array.&lt;ChildDef&gt;</code>](#ChildDef)
    * [.initProps(object)](#ChildDefCollection+initProps)
    * [.initConfig(object)](#ChildDefCollection+initConfig)
    * [.getDefByClass(class_)](#ChildDefCollection+getDefByClass) ⇒ [<code>ChildDef</code>](#ChildDef)
    * [.getDefByObject(object)](#ChildDefCollection+getDefByObject) ⇒ [<code>ChildDef</code>](#ChildDef)

<a name="new_ChildDefCollection_new"></a>

### new ChildDefCollection(defs)
<p>Constructor</p>


| Param | Type |
| --- | --- |
| defs | [<code>Array.&lt;ChildDef&gt;</code>](#ChildDef) | 

<a name="ChildDefCollection+defs"></a>

### childDefCollection.defs : [<code>Array.&lt;ChildDef&gt;</code>](#ChildDef)
**Kind**: instance property of [<code>ChildDefCollection</code>](#ChildDefCollection)  
<a name="ChildDefCollection+initProps"></a>

### childDefCollection.initProps(object)
<p>Initialize object props after creation</p>

**Kind**: instance method of [<code>ChildDefCollection</code>](#ChildDefCollection)  

| Param |
| --- |
| object | 

<a name="ChildDefCollection+initConfig"></a>

### childDefCollection.initConfig(object)
<p>Initialize config props</p>

**Kind**: instance method of [<code>ChildDefCollection</code>](#ChildDefCollection)  

| Param |
| --- |
| object | 

<a name="ChildDefCollection+getDefByClass"></a>

### childDefCollection.getDefByClass(class_) ⇒ [<code>ChildDef</code>](#ChildDef)
<p>Returns ChildDef by class reference</p>

**Kind**: instance method of [<code>ChildDefCollection</code>](#ChildDefCollection)  

| Param | Type |
| --- | --- |
| class_ | [<code>Class.&lt;AbstractDbObject&gt;</code>](#AbstractDbObject) | 

<a name="ChildDefCollection+getDefByObject"></a>

### childDefCollection.getDefByObject(object) ⇒ [<code>ChildDef</code>](#ChildDef)
<p>Returns ChildDef by child object</p>

**Kind**: instance method of [<code>ChildDefCollection</code>](#ChildDefCollection)  

| Param | Type |
| --- | --- |
| object | [<code>AbstractDbObject</code>](#AbstractDbObject) | 

<a name="DbAsCode"></a>

## DbAsCode
<p>Main class of the DbAsCode tool.</p>

**Kind**: global class  

* [DbAsCode](#DbAsCode)
    * [new DbAsCode(config, predefinedPlugins, changes)](#new_DbAsCode_new)
    * [.config](#DbAsCode+config) : [<code>DbAsCodeConfig</code>](#DbAsCodeConfig)
    * [.version](#DbAsCode+version) : <code>number</code>
    * [.changes](#DbAsCode+changes) : [<code>Changes</code>](#Changes)
    * [.getPlugin(name)](#DbAsCode+getPlugin) ⇒ [<code>PluginDescriptor</code>](#PluginDescriptor)
    * [.getDbPlugin()](#DbAsCode+getDbPlugin) ⇒ [<code>PluginDescriptor</code>](#PluginDescriptor)
    * [.initializePlugins()](#DbAsCode+initializePlugins) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.determineCurrentDbmsType(forcedValue)](#DbAsCode+determineCurrentDbmsType) ⇒ <code>Promise.&lt;void&gt;</code>
    * [.createPlan()](#DbAsCode+createPlan) ⇒ <code>Promise.&lt;(Array.&lt;State&gt;\|Array.&lt;ChangesContext&gt;)&gt;</code>
    * [.migrate(newState)](#DbAsCode+migrate) ⇒ <code>Promise.&lt;number&gt;</code>
    * [.pluginEvent(eventName, args)](#DbAsCode+pluginEvent)

<a name="new_DbAsCode_new"></a>

### new DbAsCode(config, predefinedPlugins, changes)
<p>Constructor</p>


| Param | Type |
| --- | --- |
| config | [<code>DbAsCodeConfig</code>](#DbAsCodeConfig) | 
| predefinedPlugins | <code>Array.&lt;string&gt;</code> \| [<code>Array.&lt;PluginDescriptor&gt;</code>](#PluginDescriptor) | 
| changes | [<code>Changes</code>](#Changes) | 

<a name="DbAsCode+config"></a>

### dbAsCode.config : [<code>DbAsCodeConfig</code>](#DbAsCodeConfig)
**Kind**: instance property of [<code>DbAsCode</code>](#DbAsCode)  
<a name="DbAsCode+version"></a>

### dbAsCode.version : <code>number</code>
**Kind**: instance property of [<code>DbAsCode</code>](#DbAsCode)  
<a name="DbAsCode+changes"></a>

### dbAsCode.changes : [<code>Changes</code>](#Changes)
**Kind**: instance property of [<code>DbAsCode</code>](#DbAsCode)  
<a name="DbAsCode+getPlugin"></a>

### dbAsCode.getPlugin(name) ⇒ [<code>PluginDescriptor</code>](#PluginDescriptor)
<p>Returns plugin by its name</p>

**Kind**: instance method of [<code>DbAsCode</code>](#DbAsCode)  

| Param |
| --- |
| name | 

<a name="DbAsCode+getDbPlugin"></a>

### dbAsCode.getDbPlugin() ⇒ [<code>PluginDescriptor</code>](#PluginDescriptor)
<p>Returns current DB plugin</p>

**Kind**: instance method of [<code>DbAsCode</code>](#DbAsCode)  
<a name="DbAsCode+initializePlugins"></a>

### dbAsCode.initializePlugins() ⇒ <code>Promise.&lt;void&gt;</code>
<p>Resolve all plugins and load its modules</p>

**Kind**: instance method of [<code>DbAsCode</code>](#DbAsCode)  
<a name="DbAsCode+determineCurrentDbmsType"></a>

### dbAsCode.determineCurrentDbmsType(forcedValue) ⇒ <code>Promise.&lt;void&gt;</code>
<p>Find out the current DBMS and initialize db plugin</p>

**Kind**: instance method of [<code>DbAsCode</code>](#DbAsCode)  

| Param | Type | Description |
| --- | --- | --- |
| forcedValue | <code>string</code> | <p>Enforced DBMS value (to use when loading an existing plan)</p> |

<a name="DbAsCode+createPlan"></a>

### dbAsCode.createPlan() ⇒ <code>Promise.&lt;(Array.&lt;State&gt;\|Array.&lt;ChangesContext&gt;)&gt;</code>
<p>Create migration plan.</p>

**Kind**: instance method of [<code>DbAsCode</code>](#DbAsCode)  
<a name="DbAsCode+migrate"></a>

### dbAsCode.migrate(newState) ⇒ <code>Promise.&lt;number&gt;</code>
<p>Runs SQL migration of the plan</p>

**Kind**: instance method of [<code>DbAsCode</code>](#DbAsCode)  

| Param | Type |
| --- | --- |
| newState | [<code>State</code>](#State) | 

<a name="DbAsCode+pluginEvent"></a>

### dbAsCode.pluginEvent(eventName, args)
<p>Execute plugin event</p>

**Kind**: instance method of [<code>DbAsCode</code>](#DbAsCode)  

| Param | Type |
| --- | --- |
| eventName | <code>string</code> | 
| args | <code>array</code> | 

<a name="PluginDescriptor"></a>

## PluginDescriptor
<p>Class describing a plugin and its capabilities.</p>

**Kind**: global class  

* [PluginDescriptor](#PluginDescriptor)
    * [new PluginDescriptor(name, version, [dbClass], [stateStoreClass], [sqlExecClass], [eventHandler])](#new_PluginDescriptor_new)
    * [.init(dbAsCodeConfig)](#PluginDescriptor+init)
    * [.getStateStore()](#PluginDescriptor+getStateStore) ⇒ <code>\*</code>
    * [.getSqlExec()](#PluginDescriptor+getSqlExec) ⇒ [<code>AbstractSqlExec</code>](#AbstractSqlExec)
    * [.event(eventName, args)](#PluginDescriptor+event)

<a name="new_PluginDescriptor_new"></a>

### new PluginDescriptor(name, version, [dbClass], [stateStoreClass], [sqlExecClass], [eventHandler])
<p>Constructor</p>


| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| version | <code>number</code> | 
| [dbClass] | <code>Class.&lt;(AbstractDataBase\|null)&gt;</code> | 
| [stateStoreClass] | <code>Class.&lt;(AbstractStateStore\|null)&gt;</code> | 
| [sqlExecClass] | <code>Class.&lt;(AbstractSqlExec\|null)&gt;</code> | 
| [eventHandler] | <code>function</code> \| <code>null</code> | 

<a name="PluginDescriptor+init"></a>

### pluginDescriptor.init(dbAsCodeConfig)
<p>Initialize plugin descriptor with the DbAsCode configuration</p>

**Kind**: instance method of [<code>PluginDescriptor</code>](#PluginDescriptor)  

| Param |
| --- |
| dbAsCodeConfig | 

<a name="PluginDescriptor+getStateStore"></a>

### pluginDescriptor.getStateStore() ⇒ <code>\*</code>
<p>Returns state storage instance</p>

**Kind**: instance method of [<code>PluginDescriptor</code>](#PluginDescriptor)  
<a name="PluginDescriptor+getSqlExec"></a>

### pluginDescriptor.getSqlExec() ⇒ [<code>AbstractSqlExec</code>](#AbstractSqlExec)
<p>Returns SQL exec provider</p>

**Kind**: instance method of [<code>PluginDescriptor</code>](#PluginDescriptor)  
<a name="PluginDescriptor+event"></a>

### pluginDescriptor.event(eventName, args)
<p>Execute plugin event</p>

**Kind**: instance method of [<code>PluginDescriptor</code>](#PluginDescriptor)  

| Param | Type |
| --- | --- |
| eventName | <code>string</code> | 
| args | <code>array</code> | 

<a name="PropDef"></a>

## PropDef
<p>Object property definition (scalar and non-DB classes).</p>

**Kind**: global class  

* [PropDef](#PropDef)
    * [new PropDef(name, [type], [defaultValue], [configName], [isDefault], [normalize], [validate], [allowNull], [recreateOnChange])](#new_PropDef_new)
    * [.apply(obj, config)](#PropDef+apply)
    * [.getConfigName(obj)](#PropDef+getConfigName) ⇒ <code>\*</code>

<a name="new_PropDef_new"></a>

### new PropDef(name, [type], [defaultValue], [configName], [isDefault], [normalize], [validate], [allowNull], [recreateOnChange])
<p>Constructor</p>


| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| [type] | <code>string</code> | 
| [defaultValue] | <code>\*</code> | 
| [configName] | <code>string</code> \| [<code>Array.&lt;VersionedPropName&gt;</code>](#VersionedPropName) | 
| [isDefault] | <code>boolean</code> | 
| [normalize] | <code>function</code> | 
| [validate] | <code>function</code> | 
| [allowNull] | <code>boolean</code> | 
| [recreateOnChange] | <code>boolean</code> | 

<a name="PropDef+apply"></a>

### propDef.apply(obj, config)
<p>Applies config value to the object</p>

**Kind**: instance method of [<code>PropDef</code>](#PropDef)  

| Param | Type |
| --- | --- |
| obj | [<code>AbstractDbObject</code>](#AbstractDbObject) | 
| config | <code>\*</code> | 

<a name="PropDef+getConfigName"></a>

### propDef.getConfigName(obj) ⇒ <code>\*</code>
<p>Returns config name</p>

**Kind**: instance method of [<code>PropDef</code>](#PropDef)  

| Param | Type |
| --- | --- |
| obj | [<code>AbstractDbObject</code>](#AbstractDbObject) | 

<a name="PropDefCollection"></a>

## PropDefCollection
<p>Collection of object property definitions.</p>

**Kind**: global class  

* [PropDefCollection](#PropDefCollection)
    * [new PropDefCollection(defs)](#new_PropDefCollection_new)
    * [.defs](#PropDefCollection+defs) : [<code>Array.&lt;PropDef&gt;</code>](#PropDef)
    * [.getDefaultProp()](#PropDefCollection+getDefaultProp) ⇒ [<code>PropDef</code>](#PropDef)
    * [.initProps(object)](#PropDefCollection+initProps)
    * [.findPropByName(name)](#PropDefCollection+findPropByName) ⇒ [<code>PropDef</code>](#PropDef)

<a name="new_PropDefCollection_new"></a>

### new PropDefCollection(defs)
<p>Constructor</p>


| Param | Type |
| --- | --- |
| defs | [<code>Array.&lt;PropDef&gt;</code>](#PropDef) | 

<a name="PropDefCollection+defs"></a>

### propDefCollection.defs : [<code>Array.&lt;PropDef&gt;</code>](#PropDef)
**Kind**: instance property of [<code>PropDefCollection</code>](#PropDefCollection)  
<a name="PropDefCollection+getDefaultProp"></a>

### propDefCollection.getDefaultProp() ⇒ [<code>PropDef</code>](#PropDef)
<p>Returns default property</p>

**Kind**: instance method of [<code>PropDefCollection</code>](#PropDefCollection)  
<a name="PropDefCollection+initProps"></a>

### propDefCollection.initProps(object)
<p>Initialize object props after creation</p>

**Kind**: instance method of [<code>PropDefCollection</code>](#PropDefCollection)  

| Param |
| --- |
| object | 

<a name="PropDefCollection+findPropByName"></a>

### propDefCollection.findPropByName(name) ⇒ [<code>PropDef</code>](#PropDef)
<p>Returns property definition by its name</p>

**Kind**: instance method of [<code>PropDefCollection</code>](#PropDefCollection)  

| Param |
| --- |
| name | 

<a name="State"></a>

## State
<p>State data.</p>

**Kind**: global class  
<a name="new_State_new"></a>

### new State(id, [date], [raw], [migrationSql], [dbAsCodeVersion], [pluginVersion])
<p>Constructor</p>


| Param | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | <p>state identifier</p> |
| [date] | <code>Date</code> |  |
| [raw] | <code>object</code> |  |
| [migrationSql] | <code>string</code> |  |
| [dbAsCodeVersion] | <code>number</code> |  |
| [pluginVersion] | <code>number</code> |  |

<a name="ValidationContext"></a>

## ValidationContext
<p>Tree validation context.</p>

**Kind**: global class  

* [ValidationContext](#ValidationContext)
    * [new ValidationContext(prevTree, curTree)](#new_ValidationContext_new)
    * [.errors](#ValidationContext+errors) : [<code>Array.&lt;ValidateError&gt;</code>](#ValidateError)
    * [.prevTree](#ValidationContext+prevTree)
    * [.curTree](#ValidationContext+curTree)
    * [.hasErrors()](#ValidationContext+hasErrors) ⇒ <code>boolean</code>
    * [.addError(obj, message)](#ValidationContext+addError)
    * [.printErrors()](#ValidationContext+printErrors) ⇒ <code>string</code>

<a name="new_ValidationContext_new"></a>

### new ValidationContext(prevTree, curTree)
<p>Constructor</p>


| Param | Type |
| --- | --- |
| prevTree | [<code>AbstractDbObject</code>](#AbstractDbObject) \| <code>undefined</code> | 
| curTree | [<code>AbstractDbObject</code>](#AbstractDbObject) \| <code>undefined</code> | 

<a name="ValidationContext+errors"></a>

### validationContext.errors : [<code>Array.&lt;ValidateError&gt;</code>](#ValidateError)
**Kind**: instance property of [<code>ValidationContext</code>](#ValidationContext)  
<a name="ValidationContext+prevTree"></a>

### validationContext.prevTree
<p>{AbstractDbObject|undefined}</p>

**Kind**: instance property of [<code>ValidationContext</code>](#ValidationContext)  
<a name="ValidationContext+curTree"></a>

### validationContext.curTree
<p>{AbstractDbObject|undefined}</p>

**Kind**: instance property of [<code>ValidationContext</code>](#ValidationContext)  
<a name="ValidationContext+hasErrors"></a>

### validationContext.hasErrors() ⇒ <code>boolean</code>
<p>Does this context contains errors.</p>

**Kind**: instance method of [<code>ValidationContext</code>](#ValidationContext)  
<a name="ValidationContext+addError"></a>

### validationContext.addError(obj, message)
<p>Add error to the list of errors automatically filling the object path.</p>

**Kind**: instance method of [<code>ValidationContext</code>](#ValidationContext)  

| Param | Type |
| --- | --- |
| obj | [<code>AbstractDbObject</code>](#AbstractDbObject) | 
| message | <code>string</code> | 

<a name="ValidationContext+printErrors"></a>

### validationContext.printErrors() ⇒ <code>string</code>
<p>Returns string with all errors in the context for human-readable printing.</p>

**Kind**: instance method of [<code>ValidationContext</code>](#ValidationContext)  
<a name="AbstractSchemaObject"></a>

## AbstractSchemaObject
<p>Abstract class for objects belonging to a schema</p>

**Kind**: global class  

* [AbstractSchemaObject](#AbstractSchemaObject)
    * [.getSchema()](#AbstractSchemaObject+getSchema) ⇒ [<code>Schema</code>](#Schema)
    * [.getObjectIdentifier()](#AbstractSchemaObject+getObjectIdentifier)

<a name="AbstractSchemaObject+getSchema"></a>

### abstractSchemaObject.getSchema() ⇒ [<code>Schema</code>](#Schema)
<p>Returns Schema  object that the current object belongs to</p>

**Kind**: instance method of [<code>AbstractSchemaObject</code>](#AbstractSchemaObject)  
<a name="AbstractSchemaObject+getObjectIdentifier"></a>

### abstractSchemaObject.getObjectIdentifier()
**Kind**: instance method of [<code>AbstractSchemaObject</code>](#AbstractSchemaObject)  
<a name="Column"></a>

## Column
<p>Column in a table</p>

**Kind**: global class  
**Properties**

| Name | Type |
| --- | --- |
| type | <code>string</code> | 
| foreignKey | <code>string</code> | 
| allowNull | <code>boolean</code> | 
| defaultValue | <code>string</code> \| <code>null</code> | 
| isAutoIncrement | <code>boolean</code> | 


* [Column](#Column)
    * [.postprocessTree()](#Column+postprocessTree)
    * [.getDefaultValueSql()](#Column+getDefaultValueSql) ⇒ <code>string</code>
    * [.getParentRelation()](#Column+getParentRelation)
    * [.getSqlDefinition()](#Column+getSqlDefinition)
    * [.getObjectClass()](#Column+getObjectClass)
    * [.getAutoIncSeqName()](#Column+getAutoIncSeqName) ⇒ <code>string</code>
    * [.getType()](#Column+getType) ⇒ <code>string</code>
    * [.getAllowNull()](#Column+getAllowNull) ⇒ <code>boolean</code>
    * [.getAlterPropSql()](#Column+getAlterPropSql)
    * [.isTextual()](#Column+isTextual) ⇒ <code>boolean</code>
    * [.isNumeric()](#Column+isNumeric) ⇒ <code>boolean</code>
    * [.isCustomType()](#Column+isCustomType) ⇒ <code>boolean</code>
    * [.validate(previous)](#Column+validate)

<a name="Column+postprocessTree"></a>

### column.postprocessTree()
**Kind**: instance method of [<code>Column</code>](#Column)  
<a name="Column+getDefaultValueSql"></a>

### column.getDefaultValueSql() ⇒ <code>string</code>
<p>Returns SQL for default value definition</p>

**Kind**: instance method of [<code>Column</code>](#Column)  
<a name="Column+getParentRelation"></a>

### column.getParentRelation()
**Kind**: instance method of [<code>Column</code>](#Column)  
<a name="Column+getSqlDefinition"></a>

### column.getSqlDefinition()
**Kind**: instance method of [<code>Column</code>](#Column)  
<a name="Column+getObjectClass"></a>

### column.getObjectClass()
**Kind**: instance method of [<code>Column</code>](#Column)  
<a name="Column+getAutoIncSeqName"></a>

### column.getAutoIncSeqName() ⇒ <code>string</code>
<p>Returns full name of autoincrement sequence for this column</p>

**Kind**: instance method of [<code>Column</code>](#Column)  
<a name="Column+getType"></a>

### column.getType() ⇒ <code>string</code>
<p>Returns field type</p>

**Kind**: instance method of [<code>Column</code>](#Column)  
<a name="Column+getAllowNull"></a>

### column.getAllowNull() ⇒ <code>boolean</code>
<p>Calculates whether NULL is allowed as the field value</p>

**Kind**: instance method of [<code>Column</code>](#Column)  
<a name="Column+getAlterPropSql"></a>

### column.getAlterPropSql()
**Kind**: instance method of [<code>Column</code>](#Column)  
<a name="Column+isTextual"></a>

### column.isTextual() ⇒ <code>boolean</code>
<p>Is this field a text one</p>

**Kind**: instance method of [<code>Column</code>](#Column)  
<a name="Column+isNumeric"></a>

### column.isNumeric() ⇒ <code>boolean</code>
<p>Is this field a numeric one</p>

**Kind**: instance method of [<code>Column</code>](#Column)  
<a name="Column+isCustomType"></a>

### column.isCustomType() ⇒ <code>boolean</code>
<p>Is this field of a custom type</p>

**Kind**: instance method of [<code>Column</code>](#Column)  
<a name="Column+validate"></a>

### column.validate(previous)
**Kind**: instance method of [<code>Column</code>](#Column)  

| Param | Type |
| --- | --- |
| previous | [<code>Column</code>](#Column) | 

<a name="DataBase"></a>

## DataBase
<p>PostgreSQL database object</p>

**Kind**: global class  
**Properties**

| Name | Type |
| --- | --- |
| defaultLocale | <code>string</code> | 
| extensions | <code>Array.&lt;string&gt;</code> | 
| roles | <code>Object.&lt;string, Role&gt;</code> | 
| schemas | <code>Object.&lt;string, Schema&gt;</code> | 


* [DataBase](#DataBase)
    * [.dbms](#DataBase+dbms) : <code>string</code>
    * [.propDefs](#DataBase+propDefs) : [<code>PropDefCollection</code>](#PropDefCollection)
    * [.childrenDefs](#DataBase+childrenDefs) : [<code>ChildDefCollection</code>](#ChildDefCollection)
    * [.getCreateSql()](#DataBase+getCreateSql) ⇒ <code>string</code>
    * [.getCalculators()](#DataBase+getCalculators)
    * [.getSchema(name)](#DataBase+getSchema) ⇒
    * [.validate()](#DataBase+validate)
    * [.getAlterPropSql()](#DataBase+getAlterPropSql)

<a name="DataBase+dbms"></a>

### dataBase.dbms : <code>string</code>
**Kind**: instance property of [<code>DataBase</code>](#DataBase)  
<a name="DataBase+propDefs"></a>

### dataBase.propDefs : [<code>PropDefCollection</code>](#PropDefCollection)
**Kind**: instance property of [<code>DataBase</code>](#DataBase)  
<a name="DataBase+childrenDefs"></a>

### dataBase.childrenDefs : [<code>ChildDefCollection</code>](#ChildDefCollection)
**Kind**: instance property of [<code>DataBase</code>](#DataBase)  
<a name="DataBase+getCreateSql"></a>

### dataBase.getCreateSql() ⇒ <code>string</code>
<p>Returns SQL for object creation</p>

**Kind**: instance method of [<code>DataBase</code>](#DataBase)  
<a name="DataBase+getCalculators"></a>

### dataBase.getCalculators()
**Kind**: instance method of [<code>DataBase</code>](#DataBase)  
<a name="DataBase+getSchema"></a>

### dataBase.getSchema(name) ⇒
<p>Returns a schema object by name</p>

**Kind**: instance method of [<code>DataBase</code>](#DataBase)  
**Returns**: <p>Schema</p>  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

<a name="DataBase+validate"></a>

### dataBase.validate()
**Kind**: instance method of [<code>DataBase</code>](#DataBase)  
<a name="DataBase+getAlterPropSql"></a>

### dataBase.getAlterPropSql()
**Kind**: instance method of [<code>DataBase</code>](#DataBase)  
<a name="ForeignKey"></a>

## ForeignKey
<p>Foreign key in a column</p>

**Kind**: global class  
**Properties**

| Name | Type |
| --- | --- |
| column | <code>string</code> | 
| onUpdate | <code>string</code> | 
| onDelete | <code>string</code> | 
| ref | [<code>FKeyRef</code>](#FKeyRef) | 


* [ForeignKey](#ForeignKey)
    * [.applyConfigProperties()](#ForeignKey+applyConfigProperties)
    * [.getOnUpdate()](#ForeignKey+getOnUpdate) ⇒ <code>string</code>
    * [.getOnDelete()](#ForeignKey+getOnDelete)
    * [.getSqlDefinition()](#ForeignKey+getSqlDefinition)
    * [.getObjectClass()](#ForeignKey+getObjectClass)
    * [.getParentRelation()](#ForeignKey+getParentRelation)

<a name="ForeignKey+applyConfigProperties"></a>

### foreignKey.applyConfigProperties()
**Kind**: instance method of [<code>ForeignKey</code>](#ForeignKey)  
<a name="ForeignKey+getOnUpdate"></a>

### foreignKey.getOnUpdate() ⇒ <code>string</code>
<p>Returns ON UPDATE SQL</p>

**Kind**: instance method of [<code>ForeignKey</code>](#ForeignKey)  
<a name="ForeignKey+getOnDelete"></a>

### foreignKey.getOnDelete()
<p>Returns ON DELETE SQL</p>

**Kind**: instance method of [<code>ForeignKey</code>](#ForeignKey)  
<a name="ForeignKey+getSqlDefinition"></a>

### foreignKey.getSqlDefinition()
**Kind**: instance method of [<code>ForeignKey</code>](#ForeignKey)  
<a name="ForeignKey+getObjectClass"></a>

### foreignKey.getObjectClass()
**Kind**: instance method of [<code>ForeignKey</code>](#ForeignKey)  
<a name="ForeignKey+getParentRelation"></a>

### foreignKey.getParentRelation()
**Kind**: instance method of [<code>ForeignKey</code>](#ForeignKey)  
<a name="Index"></a>

## Index
<p>Index in a table</p>

**Kind**: global class  
**Properties**

| Name | Type |
| --- | --- |
| columns | <code>Array.&lt;string&gt;</code> | 


* [Index](#Index)
    * [.applyConfigProperties()](#Index+applyConfigProperties)
    * [.getParentRelation()](#Index+getParentRelation)
    * [.getObjectIdentifier()](#Index+getObjectIdentifier)
    * [.getSqlDefinition()](#Index+getSqlDefinition)

<a name="Index+applyConfigProperties"></a>

### index.applyConfigProperties()
**Kind**: instance method of [<code>Index</code>](#Index)  
<a name="Index+getParentRelation"></a>

### index.getParentRelation()
**Kind**: instance method of [<code>Index</code>](#Index)  
<a name="Index+getObjectIdentifier"></a>

### index.getObjectIdentifier()
**Kind**: instance method of [<code>Index</code>](#Index)  
<a name="Index+getSqlDefinition"></a>

### index.getSqlDefinition()
**Kind**: instance method of [<code>Index</code>](#Index)  
<a name="PostgreSqlPlugin"></a>

## PostgreSqlPlugin
<p>Postgres plugin descriptor</p>

**Kind**: global class  
<a name="PostgreSqlPlugin+init"></a>

### postgreSqlPlugin.init(dbAsCodeConfig)
<p>Initialize plugin descriptor with the DbAsCode configuration</p>

**Kind**: instance method of [<code>PostgreSqlPlugin</code>](#PostgreSqlPlugin)  

| Param | Type |
| --- | --- |
| dbAsCodeConfig | [<code>DbAsCodeConfig</code>](#DbAsCodeConfig) | 

<a name="PrimaryKey"></a>

## PrimaryKey
<p>Table primary key object</p>

**Kind**: global class  
**Properties**

| Name | Type |
| --- | --- |
| columns | <code>Array.&lt;string&gt;</code> | 


* [PrimaryKey](#PrimaryKey)
    * [.applyConfigProperties()](#PrimaryKey+applyConfigProperties)
    * [.getParentRelation()](#PrimaryKey+getParentRelation)
    * [.getObjectClass()](#PrimaryKey+getObjectClass)
    * [.getSqlDefinition()](#PrimaryKey+getSqlDefinition)

<a name="PrimaryKey+applyConfigProperties"></a>

### primaryKey.applyConfigProperties()
**Kind**: instance method of [<code>PrimaryKey</code>](#PrimaryKey)  
<a name="PrimaryKey+getParentRelation"></a>

### primaryKey.getParentRelation()
**Kind**: instance method of [<code>PrimaryKey</code>](#PrimaryKey)  
<a name="PrimaryKey+getObjectClass"></a>

### primaryKey.getObjectClass()
**Kind**: instance method of [<code>PrimaryKey</code>](#PrimaryKey)  
<a name="PrimaryKey+getSqlDefinition"></a>

### primaryKey.getSqlDefinition()
**Kind**: instance method of [<code>PrimaryKey</code>](#PrimaryKey)  
<a name="Role"></a>

## Role
<p>Role in a database</p>

**Kind**: global class  
**Properties**

| Name | Type |
| --- | --- |
| memberOf | <code>Array.&lt;string&gt;</code> | 
| isClient | <code>boolean</code> | 

<a name="Role+getSqlDefinition"></a>

### role.getSqlDefinition()
**Kind**: instance method of [<code>Role</code>](#Role)  
<a name="Schema"></a>

## Schema
<p>Database schema object.</p>

**Kind**: global class  
**Properties**

| Name | Type |
| --- | --- |
| tables | <code>Object.&lt;string, Table&gt;</code> | 
| types | <code>Object.&lt;string, Type&gt;</code> | 
| functions | <code>Object.&lt;string, function()&gt;</code> | 
| sequences | <code>Object.&lt;string, Sequence&gt;</code> | 


* [Schema](#Schema)
    * [.childrenDefs](#Schema+childrenDefs) : [<code>ChildDefCollection</code>](#ChildDefCollection)
    * [.tableExists(name)](#Schema+tableExists) ⇒ <code>boolean</code>
    * [.getTable(name)](#Schema+getTable) ⇒ <code>\*</code>
    * [.getCalculators()](#Schema+getCalculators)

<a name="Schema+childrenDefs"></a>

### schema.childrenDefs : [<code>ChildDefCollection</code>](#ChildDefCollection)
**Kind**: instance property of [<code>Schema</code>](#Schema)  
<a name="Schema+tableExists"></a>

### schema.tableExists(name) ⇒ <code>boolean</code>
<p>Check table exists by name.</p>

**Kind**: instance method of [<code>Schema</code>](#Schema)  

| Param |
| --- |
| name | 

<a name="Schema+getTable"></a>

### schema.getTable(name) ⇒ <code>\*</code>
<p>Returns table by name</p>

**Kind**: instance method of [<code>Schema</code>](#Schema)  

| Param |
| --- |
| name | 

<a name="Schema+getCalculators"></a>

### schema.getCalculators()
**Kind**: instance method of [<code>Schema</code>](#Schema)  
<a name="Sequence"></a>

## Sequence
<p>Autoincrement sequence class</p>

**Kind**: global class  
**Properties**

| Name | Type |
| --- | --- |
| table | <code>string</code> | 
| column | <code>string</code> | 


* [Sequence](#Sequence)
    * [.applyConfigProperties()](#Sequence+applyConfigProperties)
    * [.getSqlDefinition()](#Sequence+getSqlDefinition)

<a name="Sequence+applyConfigProperties"></a>

### sequence.applyConfigProperties()
**Kind**: instance method of [<code>Sequence</code>](#Sequence)  
<a name="Sequence+getSqlDefinition"></a>

### sequence.getSqlDefinition()
**Kind**: instance method of [<code>Sequence</code>](#Sequence)  
<a name="Table"></a>

## Table
<p>Table object</p>

**Kind**: global class  
**Properties**

| Name | Type |
| --- | --- |
| foreignKeys | [<code>ForeignKey</code>](#ForeignKey) | 
| columns | [<code>Array.&lt;Column&gt;</code>](#Column) | 
| indexes | [<code>Array.&lt;Index&gt;</code>](#Index) | 
| triggers | [<code>Array.&lt;Trigger&gt;</code>](#Trigger) | 
| uniqueKeys | [<code>Array.&lt;UniqueKey&gt;</code>](#UniqueKey) | 
| primaryKey | [<code>PrimaryKey</code>](#PrimaryKey) | 


* [Table](#Table)
    * [.childrenDefs](#Table+childrenDefs) : [<code>ChildDefCollection</code>](#ChildDefCollection)
    * [.postprocessTree()](#Table+postprocessTree)
    * [.setupDependencies()](#Table+setupDependencies)
    * [.getSqlDefinition()](#Table+getSqlDefinition)

<a name="Table+childrenDefs"></a>

### table.childrenDefs : [<code>ChildDefCollection</code>](#ChildDefCollection)
**Kind**: instance property of [<code>Table</code>](#Table)  
<a name="Table+postprocessTree"></a>

### table.postprocessTree()
**Kind**: instance method of [<code>Table</code>](#Table)  
<a name="Table+setupDependencies"></a>

### table.setupDependencies()
<p>Fills the dependencies list of this object</p>

**Kind**: instance method of [<code>Table</code>](#Table)  
<a name="Table+getSqlDefinition"></a>

### table.getSqlDefinition()
**Kind**: instance method of [<code>Table</code>](#Table)  
<a name="Trigger"></a>

## Trigger
<p>Trigger on a table</p>

**Kind**: global class  
**Properties**

| Name | Type |
| --- | --- |
| operation | <code>string</code> | 
| when | <code>string</code> | 
| what | <code>string</code> | 


* [Trigger](#Trigger)
    * [.applyConfigProperties()](#Trigger+applyConfigProperties)
    * [.getSqlDefinition()](#Trigger+getSqlDefinition)
    * [.getParentRelation()](#Trigger+getParentRelation)
    * [.getObjectIdentifier()](#Trigger+getObjectIdentifier)
    * [.getSqlTriggerType()](#Trigger+getSqlTriggerType) ⇒ <code>string</code>

<a name="Trigger+applyConfigProperties"></a>

### trigger.applyConfigProperties()
**Kind**: instance method of [<code>Trigger</code>](#Trigger)  
<a name="Trigger+getSqlDefinition"></a>

### trigger.getSqlDefinition()
**Kind**: instance method of [<code>Trigger</code>](#Trigger)  
<a name="Trigger+getParentRelation"></a>

### trigger.getParentRelation()
**Kind**: instance method of [<code>Trigger</code>](#Trigger)  
<a name="Trigger+getObjectIdentifier"></a>

### trigger.getObjectIdentifier()
**Kind**: instance method of [<code>Trigger</code>](#Trigger)  
<a name="Trigger+getSqlTriggerType"></a>

### trigger.getSqlTriggerType() ⇒ <code>string</code>
<p>Returns SQL trigger type</p>

**Kind**: instance method of [<code>Trigger</code>](#Trigger)  
<a name="UniqueKey"></a>

## UniqueKey
<p>Unique key of a table</p>

**Kind**: global class  
**Properties**

| Name | Type |
| --- | --- |
| columns | <code>Array.&lt;string&gt;</code> | 


* [UniqueKey](#UniqueKey)
    * [.applyConfigProperties()](#UniqueKey+applyConfigProperties)
    * [.getParentRelation()](#UniqueKey+getParentRelation)
    * [.getObjectClass()](#UniqueKey+getObjectClass)
    * [.getSqlDefinition()](#UniqueKey+getSqlDefinition)

<a name="UniqueKey+applyConfigProperties"></a>

### uniqueKey.applyConfigProperties()
**Kind**: instance method of [<code>UniqueKey</code>](#UniqueKey)  
<a name="UniqueKey+getParentRelation"></a>

### uniqueKey.getParentRelation()
**Kind**: instance method of [<code>UniqueKey</code>](#UniqueKey)  
<a name="UniqueKey+getObjectClass"></a>

### uniqueKey.getObjectClass()
**Kind**: instance method of [<code>UniqueKey</code>](#UniqueKey)  
<a name="UniqueKey+getSqlDefinition"></a>

### uniqueKey.getSqlDefinition()
**Kind**: instance method of [<code>UniqueKey</code>](#UniqueKey)  
<a name="PostgraphilePlugin"></a>

## PostgraphilePlugin
<p>Some Postgraphile-specific add-ons</p>

**Kind**: global class  

* [PostgraphilePlugin](#PostgraphilePlugin)
    * [.event()](#PostgraphilePlugin+event)
    * [.onTreeInitialized(db)](#PostgraphilePlugin+onTreeInitialized)
    * [.applyOmitMixin(inst)](#PostgraphilePlugin+applyOmitMixin)

<a name="PostgraphilePlugin+event"></a>

### postgraphilePlugin.event()
**Kind**: instance method of [<code>PostgraphilePlugin</code>](#PostgraphilePlugin)  
<a name="PostgraphilePlugin+onTreeInitialized"></a>

### postgraphilePlugin.onTreeInitialized(db)
<p>Executed on a DB tree initialization completion</p>

**Kind**: instance method of [<code>PostgraphilePlugin</code>](#PostgraphilePlugin)  

| Param | Type |
| --- | --- |
| db | [<code>DataBase</code>](#DataBase) | 

<a name="PostgraphilePlugin+applyOmitMixin"></a>

### postgraphilePlugin.applyOmitMixin(inst)
<p>Applies Table class mixin</p>

**Kind**: instance method of [<code>PostgraphilePlugin</code>](#PostgraphilePlugin)  

| Param | Type |
| --- | --- |
| inst | [<code>Table</code>](#Table) \| [<code>Column</code>](#Column) \| [<code>PrimaryKey</code>](#PrimaryKey) | 

<a name="default"></a>

## default
**Kind**: global variable  
**Licence**: This file is covered by the LICENSE.md file in the root of this project.  
**Copyright**: 2019 Alex Pravdin  
<a name="default"></a>

## default
**Kind**: global variable  
**Licence**: This file is covered by the LICENSE.md file in the root of this project.  
**Copyright**: 2019 Alex Pravdin  
<a name="default"></a>

## default
**Kind**: global variable  
**Licence**: This file is covered by the LICENSE.md file in the root of this project.  
**Copyright**: 2019 Alex Pravdin  
<a name="TREE_INITIALIZED"></a>

## TREE\_INITIALIZED
**Kind**: global constant  
**Licence**: This file is covered by the LICENSE.md file in the root of this project.  
**Copyright**: 2019 Alex Pravdin  
<a name="processCalculations"></a>

## processCalculations(obj, args) ⇒ <code>\*</code>
<p>Process calculations in string config values</p>

**Kind**: global function  

| Param | Type |
| --- | --- |
| obj | [<code>AbstractDbObject</code>](#AbstractDbObject) | 
| args | <code>Object.&lt;string, \*&gt;</code> | 

<a name="doLoadConfig"></a>

## doLoadConfig(configFiles) ⇒ <code>\*</code>
<p>Load the whole DB config with postprocessing. Config files are merged and loaded as the single config.</p>

**Kind**: global function  

| Param | Type |
| --- | --- |
| configFiles | <code>Array.&lt;string&gt;</code> | 

<a name="recursePostProcess"></a>

## recursePostProcess(cfg, [dir]) ⇒ <code>\*</code>
<p>Postprocessing</p>

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| cfg | <code>\*</code> |  |
| [dir] | <code>string</code> | <p>Last directory context</p> |

<a name="filterConfig"></a>

## filterConfig(cfg) ⇒ <code>\*</code>
<p>Returns config without directory context</p>

**Kind**: global function  

| Param |
| --- |
| cfg | 

<a name="arrayContainsEntirely"></a>

## arrayContainsEntirely(ary1, ary2) ⇒ <code>boolean</code>
<p>Is array2 entirely present in array1</p>

**Kind**: global function  

| Param | Type |
| --- | --- |
| ary1 | <code>Array</code> | 
| ary2 | <code>Array</code> | 

<a name="objectDifference"></a>

## objectDifference(o1, o2) ⇒ <code>Object</code>
<p>Returns object with keys from object1 that do not exists in object2</p>

**Kind**: global function  

| Param | Type |
| --- | --- |
| o1 | <code>Object</code> | 
| o2 | <code>Object</code> | 

<a name="objectDifferenceKeys"></a>

## objectDifferenceKeys(o1, o2) ⇒ <code>Array</code>
<p>Returns object with keys from object1 that do not exists in object2</p>

**Kind**: global function  

| Param | Type |
| --- | --- |
| o1 | <code>Object</code> | 
| o2 | <code>Object</code> | 

<a name="objectIntersection"></a>

## objectIntersection(o1, o2) ⇒ <code>Object</code>
<p>Returns object with keys exists in both objects</p>

**Kind**: global function  

| Param | Type |
| --- | --- |
| o1 | <code>Object</code> | 
| o2 | <code>Object</code> | 

<a name="objectIntersectionKeys"></a>

## objectIntersectionKeys(o1, o2) ⇒ <code>Array</code>
<p>Returns object with keys exists in both objects</p>

**Kind**: global function  

| Param | Type |
| --- | --- |
| o1 | <code>Object</code> | 
| o2 | <code>Object</code> | 

<a name="camelCaseToUnderscore"></a>

## camelCaseToUnderscore(s) ⇒ <code>string</code>
<p>Converts camelCase notation to the underscore-separated</p>

**Kind**: global function  

| Param | Type |
| --- | --- |
| s | <code>string</code> | 

<a name="getPropValue"></a>

## getPropValue(obj, prop)
<p>Returns object property value by property path</p>

**Kind**: global function  

| Param | Type |
| --- | --- |
| obj | <code>object</code> | 
| prop | <code>string</code> | 

<a name="parseArrayProp"></a>

## parseArrayProp(name)
<p>Parses property name into name itself and array index if any</p>

**Kind**: global function  

| Param |
| --- |
| name | 

<a name="joinSql"></a>

## joinSql(sql)
<p>Joins array of SQL queries filtering empty ones</p>

**Kind**: global function  

| Param | Type |
| --- | --- |
| sql | <code>Array.&lt;string&gt;</code> | 

<a name="arrayUnique"></a>

## arrayUnique(ary) ⇒ <code>array</code>
<p>Removes duplicates from an array. Returns new copy of the source array.</p>

**Kind**: global function  

| Param | Type |
| --- | --- |
| ary | <code>array</code> | 

<a name="saveTempSqlFile"></a>

## saveTempSqlFile(sql) ⇒ <code>\*</code>
**Kind**: global function  

| Param |
| --- |
| sql | 

<a name="escapeRawText"></a>

## escapeRawText(s)
<p>Escape text to insert to DB (not adds single quotes)</p>

**Kind**: global function  

| Param | Type |
| --- | --- |
| s | <code>string</code> | 

<a name="escapeString"></a>

## escapeString(s)
<p>Escape string to insert to DB (adds single quotes)</p>

**Kind**: global function  

| Param | Type |
| --- | --- |
| s | <code>string</code> | 

<a name="parsePgConfig"></a>

## parsePgConfig(vars, dbAsCodeConfig)
<p>Parse DbAsCode config and fill the vars object with the corresponding values</p>

**Kind**: global function  

| Param | Type |
| --- | --- |
| vars | <code>object</code> | 
| dbAsCodeConfig | [<code>DbAsCodeConfig</code>](#DbAsCodeConfig) | 

<a name="parseTypedef"></a>

## parseTypedef(def) ⇒ [<code>ArgumentTypeDef</code>](#ArgumentTypeDef)
<p>Parse type definition of a type argument or function argument</p>

**Kind**: global function  

| Param | Type |
| --- | --- |
| def | <code>string</code> \| [<code>ArgumentTypeDef</code>](#ArgumentTypeDef) | 

<a name="SqlExecResult"></a>

## SqlExecResult : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| exitCode | <code>int</code> | 
| stdout | <code>string</code> | 
| stderr | <code>string</code> | 

<a name="ChangedPropertyDef"></a>

## ChangedPropertyDef : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| old |  | 
| cur |  | 
| allowEmptySql | <code>function</code> | 

<a name="DbAsCodeConfig"></a>

## DbAsCodeConfig : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| dbVars | <code>Array.&lt;string&gt;</code> | 
| plugins | <code>Array.&lt;string&gt;</code> \| [<code>Array.&lt;PluginDescriptor&gt;</code>](#PluginDescriptor) | 
| source | <code>string</code> | 
| dbms | <code>string</code> | 
| wsl | <code>boolean</code> | 

<a name="VersionedPropName"></a>

## VersionedPropName : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| version | <code>number</code> | 
| name | <code>string</code> | 

<a name="ValidateError"></a>

## ValidateError : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| path | <code>string</code> | 
| message | <code>string</code> | 

<a name="FKeyRef"></a>

## FKeyRef : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| schema | <code>string</code> | 
| table | <code>string</code> | 
| column | <code>string</code> | 

<a name="ArgumentTypeDef"></a>

## ArgumentTypeDef : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| schema | <code>string</code> \| <code>undefined</code> | 
| type | <code>string</code> | 
| isArray | <code>boolean</code> | 

