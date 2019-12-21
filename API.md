## Classes

<dl>
<dt><a href="#AbstractDataBase">AbstractDataBase</a></dt>
<dd><p>Abstract database class to be inherited by a specific DBMS implementation plugin.</p></dd>
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
<dt><a href="#AbstractDataBase">AbstractDataBase</a></dt>
<dd><p>Abstract database class to be inherited by a specific DBMS implementation plugin.</p></dd>
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
<dt><a href="#prevTree">prevTree</a> : <code><a href="#AbstractDataBase">AbstractDataBase</a></code></dt>
<dd></dd>
<dt><a href="#curTree">curTree</a> : <code><a href="#AbstractDataBase">AbstractDataBase</a></code></dt>
<dd></dd>
<dt><a href="#default">default</a></dt>
<dd></dd>
<dt><a href="#default">default</a></dt>
<dd></dd>
<dt><a href="#default">default</a></dt>
<dd></dd>
<dt><a href="#prevTree">prevTree</a> : <code><a href="#AbstractDataBase">AbstractDataBase</a></code></dt>
<dd></dd>
<dt><a href="#curTree">curTree</a> : <code><a href="#AbstractDataBase">AbstractDataBase</a></code></dt>
<dd></dd>
<dt><a href="#default">default</a></dt>
<dd></dd>
<dt><a href="#default">default</a></dt>
<dd></dd>
<dt><a href="#default">default</a></dt>
<dd></dd>
<dt><a href="#jest">jest</a> : <code>Jest</code></dt>
<dd></dd>
<dt><a href="#jest">jest</a> : <code>Jest</code></dt>
<dd></dd>
</dl>

## Constants

<dl>
<dt><a href="#TREE_INITIALIZED">TREE_INITIALIZED</a></dt>
<dd></dd>
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
<dt><a href="#loadTestData">loadTestData()</a> ⇒ <code><a href="#AbstractDataBase">Promise.&lt;AbstractDataBase&gt;</a></code></dt>
<dd><p>Load this test test data</p></dd>
<dt><a href="#escapeRawText">escapeRawText(s)</a></dt>
<dd><p>Escape text to insert to DB (not adds single quotes)</p></dd>
<dt><a href="#escapeString">escapeString(s)</a></dt>
<dd><p>Escape string to insert to DB (adds single quotes)</p></dd>
<dt><a href="#parsePgConfig">parsePgConfig(vars, dbAsCodeConfig)</a></dt>
<dd><p>Parse DbAsCode config and fill the vars object with the corresponding values</p></dd>
<dt><a href="#parseTypedef">parseTypedef(def)</a> ⇒ <code><a href="#ArgumentTypeDef">ArgumentTypeDef</a></code></dt>
<dd><p>Parse type definition of a type argument or function argument</p></dd>
<dt><a href="#getRowLevelSecurity">getRowLevelSecurity()</a> ⇒ <code>object</code></dt>
<dd><p>Returns row level security data combined with data inherited from ancestor</p></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#SqlExecResult">SqlExecResult</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#DbAsCodeConfig">DbAsCodeConfig</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#VersionedPropName">VersionedPropName</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#ValidateError">ValidateError</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#SqlExecResult">SqlExecResult</a> : <code>object</code></dt>
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
        * [.propDefs](#AbstractDataBase+propDefs) : [<code>PropDefCollection</code>](#PropDefCollection)
        * [.dbms](#AbstractDataBase+dbms) : <code>string</code>
        * [._version](#AbstractDataBase+_version) : <code>number</code>
        * [._pluginVersion](#AbstractDataBase+_pluginVersion) : <code>number</code>
        * [.getVersion()](#AbstractDataBase+getVersion) ⇒ <code>number</code>
        * [.getPluginVersion()](#AbstractDataBase+getPluginVersion) ⇒ <code>number</code>
        * [.dispose()](#AbstractDataBase+dispose)
        * [.getVersion()](#AbstractDataBase+getVersion) ⇒ <code>number</code>
        * [.getPluginVersion()](#AbstractDataBase+getPluginVersion) ⇒ <code>number</code>
        * [.dispose()](#AbstractDataBase+dispose)
    * _static_
        * [.createFromState(class_, cfg, dbAsCodeVersion, pluginVersion)](#AbstractDataBase.createFromState) ⇒ [<code>AbstractDataBase</code>](#AbstractDataBase) \| <code>null</code>
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

<a name="AbstractSqlExec"></a>

## AbstractSqlExec
<p>Abstract ancestor class for all sql execution implementations in plugins.</p>

**Kind**: global class  

* [AbstractSqlExec](#AbstractSqlExec)
    * [new AbstractSqlExec(dbAsCodeConfig, plugin)](#new_AbstractSqlExec_new)
    * [new AbstractSqlExec(dbAsCodeConfig, plugin)](#new_AbstractSqlExec_new)
    * [.dbAsCodeConfig](#AbstractSqlExec+dbAsCodeConfig) : [<code>DbAsCodeConfig</code>](#DbAsCodeConfig)
    * [._plugin](#AbstractSqlExec+_plugin) : [<code>PluginDescriptor</code>](#PluginDescriptor)
    * [.dbAsCodeConfig](#AbstractSqlExec+dbAsCodeConfig) : [<code>DbAsCodeConfig</code>](#DbAsCodeConfig)
    * [._plugin](#AbstractSqlExec+_plugin) : [<code>PluginDescriptor</code>](#PluginDescriptor)
    * [.executeSql(sql, cfg)](#AbstractSqlExec+executeSql) ⇒ [<code>Promise.&lt;SqlExecResult&gt;</code>](#SqlExecResult)
    * [.executeSql(sql, cfg)](#AbstractSqlExec+executeSql) ⇒ [<code>Promise.&lt;SqlExecResult&gt;</code>](#SqlExecResult)

<a name="new_AbstractSqlExec_new"></a>

### new AbstractSqlExec(dbAsCodeConfig, plugin)
<p>Constructor</p>


| Param | Type |
| --- | --- |
| dbAsCodeConfig | [<code>DbAsCodeConfig</code>](#DbAsCodeConfig) | 
| plugin | [<code>PluginDescriptor</code>](#PluginDescriptor) | 

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
    * [new AbstractStateStore(dbAsCodeConfig, plugin)](#new_AbstractStateStore_new)
    * [.dbAsCodeConfig](#AbstractStateStore+dbAsCodeConfig) : [<code>DbAsCodeConfig</code>](#DbAsCodeConfig)
    * [._plugin](#AbstractStateStore+_plugin) : [<code>PluginDescriptor</code>](#PluginDescriptor)
    * [.dbAsCodeConfig](#AbstractStateStore+dbAsCodeConfig) : [<code>DbAsCodeConfig</code>](#DbAsCodeConfig)
    * [._plugin](#AbstractStateStore+_plugin) : [<code>PluginDescriptor</code>](#PluginDescriptor)
    * [.getState()](#AbstractStateStore+getState) ⇒ [<code>Promise.&lt;State&gt;</code>](#State)
    * [.getStorageConfigPath()](#AbstractStateStore+getStorageConfigPath) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.getStateSaveSql(state)](#AbstractStateStore+getStateSaveSql) ⇒ <code>Promise.&lt;string&gt;</code>
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
| previous | <code>AbstractDbObject</code> | 
| current | <code>AbstractDbObject</code> | 
| changes | [<code>ChangesContext</code>](#ChangesContext) | 

<a name="Changes+collectChanges"></a>

### changes.collectChanges(old, current, [deep]) ⇒ [<code>ChangesContext</code>](#ChangesContext)
<p>Has changes old to the previous state object</p>

**Kind**: instance method of [<code>Changes</code>](#Changes)  

| Param | Type | Default |
| --- | --- | --- |
| old | <code>AbstractDbObject</code> |  | 
| current | <code>AbstractDbObject</code> |  | 
| [deep] | <code>boolean</code> | <code>false</code> | 

<a name="Changes+getObjectForChangeLog"></a>

### changes.getObjectForChangeLog(obj) ⇒ <code>Object</code>
**Kind**: instance method of [<code>Changes</code>](#Changes)  

| Param | Type |
| --- | --- |
| obj | <code>AbstractDbObject</code> | 

<a name="Changes+hasChangesInValues"></a>

### changes.hasChangesInValues(v2, v1, context) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>Changes</code>](#Changes)  

| Param | Type |
| --- | --- |
| v2 | <code>AbstractDbObject</code> \| <code>\*</code> | 
| v1 | <code>AbstractDbObject</code> \| <code>\*</code> | 
| context | [<code>ChangesContext</code>](#ChangesContext) | 

<a name="Changes+getChangesSql"></a>

### changes.getChangesSql(previous, current, changes)
<p>Returns SQL applying specified changes</p>

**Kind**: instance method of [<code>Changes</code>](#Changes)  

| Param | Type |
| --- | --- |
| previous | <code>AbstractDbObject</code> | 
| current | <code>AbstractDbObject</code> | 
| changes | [<code>ChangesContext</code>](#ChangesContext) | 

<a name="Changes+collectChanges"></a>

### changes.collectChanges(old, current, [deep]) ⇒ [<code>ChangesContext</code>](#ChangesContext)
<p>Has changes old to the previous state object</p>

**Kind**: instance method of [<code>Changes</code>](#Changes)  

| Param | Type | Default |
| --- | --- | --- |
| old | <code>AbstractDbObject</code> |  | 
| current | <code>AbstractDbObject</code> |  | 
| [deep] | <code>boolean</code> | <code>false</code> | 

<a name="Changes+getObjectForChangeLog"></a>

### changes.getObjectForChangeLog(obj) ⇒ <code>Object</code>
**Kind**: instance method of [<code>Changes</code>](#Changes)  

| Param | Type |
| --- | --- |
| obj | <code>AbstractDbObject</code> | 

<a name="Changes+hasChangesInValues"></a>

### changes.hasChangesInValues(v2, v1, context) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>Changes</code>](#Changes)  

| Param | Type |
| --- | --- |
| v2 | <code>AbstractDbObject</code> \| <code>\*</code> | 
| v1 | <code>AbstractDbObject</code> \| <code>\*</code> | 
| context | [<code>ChangesContext</code>](#ChangesContext) | 

<a name="ChangesContext"></a>

## ChangesContext
<p>Context to store changes between two DB trees.</p>

**Kind**: global class  

* [ChangesContext](#ChangesContext)
    * [.addChangeWithPath(path, old, cur)](#ChangesContext+addChangeWithPath)
    * [.addChangeWithPath(path, old, cur)](#ChangesContext+addChangeWithPath)

<a name="ChangesContext+addChangeWithPath"></a>

### changesContext.addChangeWithPath(path, old, cur)
<p>Add change from a plugin</p>

**Kind**: instance method of [<code>ChangesContext</code>](#ChangesContext)  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 
| old | <code>\*</code> | 
| cur | <code>\*</code> | 

<a name="ChangesContext+addChangeWithPath"></a>

### changesContext.addChangeWithPath(path, old, cur)
<p>Add change from a plugin</p>

**Kind**: instance method of [<code>ChangesContext</code>](#ChangesContext)  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 
| old | <code>\*</code> | 
| cur | <code>\*</code> | 

<a name="ChildDef"></a>

## ChildDef
<p>Children prop with DB class object(s) definition.</p>

**Kind**: global class  

* [ChildDef](#ChildDef)
    * [new ChildDef(class_, propType)](#new_ChildDef_new)
    * [new ChildDef(class_, propType)](#new_ChildDef_new)
    * [.class_](#ChildDef+class_) : <code>Class.&lt;AbstractDbObject&gt;</code>
    * [.propType](#ChildDef+propType) : <code>string</code>
    * [.propName](#ChildDef+propName) : <code>string</code>
    * [.configPropName](#ChildDef+configPropName) : <code>string</code>
    * [.class_](#ChildDef+class_) : <code>Class.&lt;AbstractDbObject&gt;</code>
    * [.propType](#ChildDef+propType) : <code>string</code>
    * [.propName](#ChildDef+propName) : <code>string</code>
    * [.configPropName](#ChildDef+configPropName) : <code>string</code>
    * [.getPropertyName()](#ChildDef+getPropertyName) ⇒ <code>string</code>
    * [.getConfigName()](#ChildDef+getConfigName) ⇒ <code>string</code>
    * [.getPropertyName()](#ChildDef+getPropertyName) ⇒ <code>string</code>
    * [.getConfigName()](#ChildDef+getConfigName) ⇒ <code>string</code>

<a name="new_ChildDef_new"></a>

### new ChildDef(class_, propType)
<p>Constructor</p>


| Param | Type | Description |
| --- | --- | --- |
| class_ | <code>Class.&lt;AbstractDbObject&gt;</code> |  |
| propType | <code>string</code> | <p>property type (single, map, or array)</p> |

<a name="new_ChildDef_new"></a>

### new ChildDef(class_, propType)
<p>Constructor</p>


| Param | Type | Description |
| --- | --- | --- |
| class_ | <code>Class.&lt;AbstractDbObject&gt;</code> |  |
| propType | <code>string</code> | <p>property type (single, map, or array)</p> |

<a name="ChildDef+class_"></a>

### childDef.class\_ : <code>Class.&lt;AbstractDbObject&gt;</code>
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
<a name="ChildDef+class_"></a>

### childDef.class\_ : <code>Class.&lt;AbstractDbObject&gt;</code>
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
    * [new ChildDefCollection(defs)](#new_ChildDefCollection_new)
    * [.defs](#ChildDefCollection+defs) : [<code>Array.&lt;ChildDef&gt;</code>](#ChildDef)
    * [.defs](#ChildDefCollection+defs) : [<code>Array.&lt;ChildDef&gt;</code>](#ChildDef)
    * [.initProps(object)](#ChildDefCollection+initProps)
    * [.initConfig(object)](#ChildDefCollection+initConfig)
    * [.getDefByClass(class_)](#ChildDefCollection+getDefByClass) ⇒ [<code>ChildDef</code>](#ChildDef)
    * [.getDefByObject(object)](#ChildDefCollection+getDefByObject) ⇒ [<code>ChildDef</code>](#ChildDef)
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

<a name="new_ChildDefCollection_new"></a>

### new ChildDefCollection(defs)
<p>Constructor</p>


| Param | Type |
| --- | --- |
| defs | [<code>Array.&lt;ChildDef&gt;</code>](#ChildDef) | 

<a name="ChildDefCollection+defs"></a>

### childDefCollection.defs : [<code>Array.&lt;ChildDef&gt;</code>](#ChildDef)
**Kind**: instance property of [<code>ChildDefCollection</code>](#ChildDefCollection)  
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
| class_ | <code>Class.&lt;AbstractDbObject&gt;</code> | 

<a name="ChildDefCollection+getDefByObject"></a>

### childDefCollection.getDefByObject(object) ⇒ [<code>ChildDef</code>](#ChildDef)
<p>Returns ChildDef by child object</p>

**Kind**: instance method of [<code>ChildDefCollection</code>](#ChildDefCollection)  

| Param | Type |
| --- | --- |
| object | <code>AbstractDbObject</code> | 

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
| class_ | <code>Class.&lt;AbstractDbObject&gt;</code> | 

<a name="ChildDefCollection+getDefByObject"></a>

### childDefCollection.getDefByObject(object) ⇒ [<code>ChildDef</code>](#ChildDef)
<p>Returns ChildDef by child object</p>

**Kind**: instance method of [<code>ChildDefCollection</code>](#ChildDefCollection)  

| Param | Type |
| --- | --- |
| object | <code>AbstractDbObject</code> | 

<a name="DbAsCode"></a>

## DbAsCode
<p>Main class of the DbAsCode tool.</p>

**Kind**: global class  

* [DbAsCode](#DbAsCode)
    * [new DbAsCode(config, predefinedPlugins, changes)](#new_DbAsCode_new)
    * [new DbAsCode(config, predefinedPlugins, changes)](#new_DbAsCode_new)
    * [.config](#DbAsCode+config) : [<code>DbAsCodeConfig</code>](#DbAsCodeConfig)
    * [.version](#DbAsCode+version) : <code>number</code>
    * [.changes](#DbAsCode+changes) : [<code>Changes</code>](#Changes)
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
    * [new PluginDescriptor(name, version, [dbClass], [stateStoreClass], [sqlExecClass], [eventHandler])](#new_PluginDescriptor_new)
    * [.init(dbAsCodeConfig)](#PluginDescriptor+init)
    * [.getStateStore()](#PluginDescriptor+getStateStore) ⇒ <code>\*</code>
    * [.getSqlExec()](#PluginDescriptor+getSqlExec) ⇒ [<code>AbstractSqlExec</code>](#AbstractSqlExec)
    * [.event(eventName, args)](#PluginDescriptor+event)
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
    * [new PropDef(name, [type], [defaultValue], [configName], [isDefault], [normalize], [validate], [allowNull], [recreateOnChange])](#new_PropDef_new)
    * [.apply(obj, config)](#PropDef+apply)
    * [.getConfigName(obj)](#PropDef+getConfigName) ⇒ <code>\*</code>
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
| obj | <code>AbstractDbObject</code> | 
| config | <code>\*</code> | 

<a name="PropDef+getConfigName"></a>

### propDef.getConfigName(obj) ⇒ <code>\*</code>
<p>Returns config name</p>

**Kind**: instance method of [<code>PropDef</code>](#PropDef)  

| Param | Type |
| --- | --- |
| obj | <code>AbstractDbObject</code> | 

<a name="PropDef+apply"></a>

### propDef.apply(obj, config)
<p>Applies config value to the object</p>

**Kind**: instance method of [<code>PropDef</code>](#PropDef)  

| Param | Type |
| --- | --- |
| obj | <code>AbstractDbObject</code> | 
| config | <code>\*</code> | 

<a name="PropDef+getConfigName"></a>

### propDef.getConfigName(obj) ⇒ <code>\*</code>
<p>Returns config name</p>

**Kind**: instance method of [<code>PropDef</code>](#PropDef)  

| Param | Type |
| --- | --- |
| obj | <code>AbstractDbObject</code> | 

<a name="PropDefCollection"></a>

## PropDefCollection
<p>Collection of object property definitions.</p>

**Kind**: global class  

* [PropDefCollection](#PropDefCollection)
    * [new PropDefCollection(defs)](#new_PropDefCollection_new)
    * [new PropDefCollection(defs)](#new_PropDefCollection_new)
    * [.defs](#PropDefCollection+defs) : [<code>Array.&lt;PropDef&gt;</code>](#PropDef)
    * [.defs](#PropDefCollection+defs) : [<code>Array.&lt;PropDef&gt;</code>](#PropDef)
    * [.getDefaultProp()](#PropDefCollection+getDefaultProp) ⇒ [<code>PropDef</code>](#PropDef)
    * [.initProps(object)](#PropDefCollection+initProps)
    * [.findPropByName(name)](#PropDefCollection+findPropByName) ⇒ [<code>PropDef</code>](#PropDef)
    * [.getDefaultProp()](#PropDefCollection+getDefaultProp) ⇒ [<code>PropDef</code>](#PropDef)
    * [.initProps(object)](#PropDefCollection+initProps)
    * [.findPropByName(name)](#PropDefCollection+findPropByName) ⇒ [<code>PropDef</code>](#PropDef)

<a name="new_PropDefCollection_new"></a>

### new PropDefCollection(defs)
<p>Constructor</p>


| Param | Type |
| --- | --- |
| defs | [<code>Array.&lt;PropDef&gt;</code>](#PropDef) | 

<a name="new_PropDefCollection_new"></a>

### new PropDefCollection(defs)
<p>Constructor</p>


| Param | Type |
| --- | --- |
| defs | [<code>Array.&lt;PropDef&gt;</code>](#PropDef) | 

<a name="PropDefCollection+defs"></a>

### propDefCollection.defs : [<code>Array.&lt;PropDef&gt;</code>](#PropDef)
**Kind**: instance property of [<code>PropDefCollection</code>](#PropDefCollection)  
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

* [State](#State)
    * [new State(id, [date], [raw], [migrationSql], [dbAsCodeVersion], [pluginVersion])](#new_State_new)
    * [new State(id, [date], [raw], [migrationSql], [dbAsCodeVersion], [pluginVersion])](#new_State_new)

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
    * [new ValidationContext(prevTree, curTree)](#new_ValidationContext_new)
    * [.errors](#ValidationContext+errors) : [<code>Array.&lt;ValidateError&gt;</code>](#ValidateError)
    * [.prevTree](#ValidationContext+prevTree)
    * [.curTree](#ValidationContext+curTree)
    * [.errors](#ValidationContext+errors) : [<code>Array.&lt;ValidateError&gt;</code>](#ValidateError)
    * [.prevTree](#ValidationContext+prevTree)
    * [.curTree](#ValidationContext+curTree)
    * [.hasErrors()](#ValidationContext+hasErrors) ⇒ <code>boolean</code>
    * [.addError(obj, message)](#ValidationContext+addError)
    * [.printErrors()](#ValidationContext+printErrors) ⇒ <code>string</code>
    * [.hasErrors()](#ValidationContext+hasErrors) ⇒ <code>boolean</code>
    * [.addError(obj, message)](#ValidationContext+addError)
    * [.printErrors()](#ValidationContext+printErrors) ⇒ <code>string</code>

<a name="new_ValidationContext_new"></a>

### new ValidationContext(prevTree, curTree)
<p>Constructor</p>


| Param | Type |
| --- | --- |
| prevTree | <code>AbstractDbObject</code> \| <code>undefined</code> | 
| curTree | <code>AbstractDbObject</code> \| <code>undefined</code> | 

<a name="new_ValidationContext_new"></a>

### new ValidationContext(prevTree, curTree)
<p>Constructor</p>


| Param | Type |
| --- | --- |
| prevTree | <code>AbstractDbObject</code> \| <code>undefined</code> | 
| curTree | <code>AbstractDbObject</code> \| <code>undefined</code> | 

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
| obj | <code>AbstractDbObject</code> | 
| message | <code>string</code> | 

<a name="ValidationContext+printErrors"></a>

### validationContext.printErrors() ⇒ <code>string</code>
<p>Returns string with all errors in the context for human-readable printing.</p>

**Kind**: instance method of [<code>ValidationContext</code>](#ValidationContext)  
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
| obj | <code>AbstractDbObject</code> | 
| message | <code>string</code> | 

<a name="ValidationContext+printErrors"></a>

### validationContext.printErrors() ⇒ <code>string</code>
<p>Returns string with all errors in the context for human-readable printing.</p>

**Kind**: instance method of [<code>ValidationContext</code>](#ValidationContext)  
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
        * [.propDefs](#AbstractDataBase+propDefs) : [<code>PropDefCollection</code>](#PropDefCollection)
        * [.dbms](#AbstractDataBase+dbms) : <code>string</code>
        * [._version](#AbstractDataBase+_version) : <code>number</code>
        * [._pluginVersion](#AbstractDataBase+_pluginVersion) : <code>number</code>
        * [.getVersion()](#AbstractDataBase+getVersion) ⇒ <code>number</code>
        * [.getPluginVersion()](#AbstractDataBase+getPluginVersion) ⇒ <code>number</code>
        * [.dispose()](#AbstractDataBase+dispose)
        * [.getVersion()](#AbstractDataBase+getVersion) ⇒ <code>number</code>
        * [.getPluginVersion()](#AbstractDataBase+getPluginVersion) ⇒ <code>number</code>
        * [.dispose()](#AbstractDataBase+dispose)
    * _static_
        * [.createFromState(class_, cfg, dbAsCodeVersion, pluginVersion)](#AbstractDataBase.createFromState) ⇒ [<code>AbstractDataBase</code>](#AbstractDataBase) \| <code>null</code>
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

<a name="AbstractSqlExec"></a>

## AbstractSqlExec
<p>Abstract ancestor class for all sql execution implementations in plugins.</p>

**Kind**: global class  

* [AbstractSqlExec](#AbstractSqlExec)
    * [new AbstractSqlExec(dbAsCodeConfig, plugin)](#new_AbstractSqlExec_new)
    * [new AbstractSqlExec(dbAsCodeConfig, plugin)](#new_AbstractSqlExec_new)
    * [.dbAsCodeConfig](#AbstractSqlExec+dbAsCodeConfig) : [<code>DbAsCodeConfig</code>](#DbAsCodeConfig)
    * [._plugin](#AbstractSqlExec+_plugin) : [<code>PluginDescriptor</code>](#PluginDescriptor)
    * [.dbAsCodeConfig](#AbstractSqlExec+dbAsCodeConfig) : [<code>DbAsCodeConfig</code>](#DbAsCodeConfig)
    * [._plugin](#AbstractSqlExec+_plugin) : [<code>PluginDescriptor</code>](#PluginDescriptor)
    * [.executeSql(sql, cfg)](#AbstractSqlExec+executeSql) ⇒ [<code>Promise.&lt;SqlExecResult&gt;</code>](#SqlExecResult)
    * [.executeSql(sql, cfg)](#AbstractSqlExec+executeSql) ⇒ [<code>Promise.&lt;SqlExecResult&gt;</code>](#SqlExecResult)

<a name="new_AbstractSqlExec_new"></a>

### new AbstractSqlExec(dbAsCodeConfig, plugin)
<p>Constructor</p>


| Param | Type |
| --- | --- |
| dbAsCodeConfig | [<code>DbAsCodeConfig</code>](#DbAsCodeConfig) | 
| plugin | [<code>PluginDescriptor</code>](#PluginDescriptor) | 

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
    * [new AbstractStateStore(dbAsCodeConfig, plugin)](#new_AbstractStateStore_new)
    * [.dbAsCodeConfig](#AbstractStateStore+dbAsCodeConfig) : [<code>DbAsCodeConfig</code>](#DbAsCodeConfig)
    * [._plugin](#AbstractStateStore+_plugin) : [<code>PluginDescriptor</code>](#PluginDescriptor)
    * [.dbAsCodeConfig](#AbstractStateStore+dbAsCodeConfig) : [<code>DbAsCodeConfig</code>](#DbAsCodeConfig)
    * [._plugin](#AbstractStateStore+_plugin) : [<code>PluginDescriptor</code>](#PluginDescriptor)
    * [.getState()](#AbstractStateStore+getState) ⇒ [<code>Promise.&lt;State&gt;</code>](#State)
    * [.getStorageConfigPath()](#AbstractStateStore+getStorageConfigPath) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.getStateSaveSql(state)](#AbstractStateStore+getStateSaveSql) ⇒ <code>Promise.&lt;string&gt;</code>
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
| previous | <code>AbstractDbObject</code> | 
| current | <code>AbstractDbObject</code> | 
| changes | [<code>ChangesContext</code>](#ChangesContext) | 

<a name="Changes+collectChanges"></a>

### changes.collectChanges(old, current, [deep]) ⇒ [<code>ChangesContext</code>](#ChangesContext)
<p>Has changes old to the previous state object</p>

**Kind**: instance method of [<code>Changes</code>](#Changes)  

| Param | Type | Default |
| --- | --- | --- |
| old | <code>AbstractDbObject</code> |  | 
| current | <code>AbstractDbObject</code> |  | 
| [deep] | <code>boolean</code> | <code>false</code> | 

<a name="Changes+getObjectForChangeLog"></a>

### changes.getObjectForChangeLog(obj) ⇒ <code>Object</code>
**Kind**: instance method of [<code>Changes</code>](#Changes)  

| Param | Type |
| --- | --- |
| obj | <code>AbstractDbObject</code> | 

<a name="Changes+hasChangesInValues"></a>

### changes.hasChangesInValues(v2, v1, context) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>Changes</code>](#Changes)  

| Param | Type |
| --- | --- |
| v2 | <code>AbstractDbObject</code> \| <code>\*</code> | 
| v1 | <code>AbstractDbObject</code> \| <code>\*</code> | 
| context | [<code>ChangesContext</code>](#ChangesContext) | 

<a name="Changes+getChangesSql"></a>

### changes.getChangesSql(previous, current, changes)
<p>Returns SQL applying specified changes</p>

**Kind**: instance method of [<code>Changes</code>](#Changes)  

| Param | Type |
| --- | --- |
| previous | <code>AbstractDbObject</code> | 
| current | <code>AbstractDbObject</code> | 
| changes | [<code>ChangesContext</code>](#ChangesContext) | 

<a name="Changes+collectChanges"></a>

### changes.collectChanges(old, current, [deep]) ⇒ [<code>ChangesContext</code>](#ChangesContext)
<p>Has changes old to the previous state object</p>

**Kind**: instance method of [<code>Changes</code>](#Changes)  

| Param | Type | Default |
| --- | --- | --- |
| old | <code>AbstractDbObject</code> |  | 
| current | <code>AbstractDbObject</code> |  | 
| [deep] | <code>boolean</code> | <code>false</code> | 

<a name="Changes+getObjectForChangeLog"></a>

### changes.getObjectForChangeLog(obj) ⇒ <code>Object</code>
**Kind**: instance method of [<code>Changes</code>](#Changes)  

| Param | Type |
| --- | --- |
| obj | <code>AbstractDbObject</code> | 

<a name="Changes+hasChangesInValues"></a>

### changes.hasChangesInValues(v2, v1, context) ⇒ <code>boolean</code>
**Kind**: instance method of [<code>Changes</code>](#Changes)  

| Param | Type |
| --- | --- |
| v2 | <code>AbstractDbObject</code> \| <code>\*</code> | 
| v1 | <code>AbstractDbObject</code> \| <code>\*</code> | 
| context | [<code>ChangesContext</code>](#ChangesContext) | 

<a name="ChangesContext"></a>

## ChangesContext
<p>Context to store changes between two DB trees.</p>

**Kind**: global class  

* [ChangesContext](#ChangesContext)
    * [.addChangeWithPath(path, old, cur)](#ChangesContext+addChangeWithPath)
    * [.addChangeWithPath(path, old, cur)](#ChangesContext+addChangeWithPath)

<a name="ChangesContext+addChangeWithPath"></a>

### changesContext.addChangeWithPath(path, old, cur)
<p>Add change from a plugin</p>

**Kind**: instance method of [<code>ChangesContext</code>](#ChangesContext)  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 
| old | <code>\*</code> | 
| cur | <code>\*</code> | 

<a name="ChangesContext+addChangeWithPath"></a>

### changesContext.addChangeWithPath(path, old, cur)
<p>Add change from a plugin</p>

**Kind**: instance method of [<code>ChangesContext</code>](#ChangesContext)  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 
| old | <code>\*</code> | 
| cur | <code>\*</code> | 

<a name="ChildDef"></a>

## ChildDef
<p>Children prop with DB class object(s) definition.</p>

**Kind**: global class  

* [ChildDef](#ChildDef)
    * [new ChildDef(class_, propType)](#new_ChildDef_new)
    * [new ChildDef(class_, propType)](#new_ChildDef_new)
    * [.class_](#ChildDef+class_) : <code>Class.&lt;AbstractDbObject&gt;</code>
    * [.propType](#ChildDef+propType) : <code>string</code>
    * [.propName](#ChildDef+propName) : <code>string</code>
    * [.configPropName](#ChildDef+configPropName) : <code>string</code>
    * [.class_](#ChildDef+class_) : <code>Class.&lt;AbstractDbObject&gt;</code>
    * [.propType](#ChildDef+propType) : <code>string</code>
    * [.propName](#ChildDef+propName) : <code>string</code>
    * [.configPropName](#ChildDef+configPropName) : <code>string</code>
    * [.getPropertyName()](#ChildDef+getPropertyName) ⇒ <code>string</code>
    * [.getConfigName()](#ChildDef+getConfigName) ⇒ <code>string</code>
    * [.getPropertyName()](#ChildDef+getPropertyName) ⇒ <code>string</code>
    * [.getConfigName()](#ChildDef+getConfigName) ⇒ <code>string</code>

<a name="new_ChildDef_new"></a>

### new ChildDef(class_, propType)
<p>Constructor</p>


| Param | Type | Description |
| --- | --- | --- |
| class_ | <code>Class.&lt;AbstractDbObject&gt;</code> |  |
| propType | <code>string</code> | <p>property type (single, map, or array)</p> |

<a name="new_ChildDef_new"></a>

### new ChildDef(class_, propType)
<p>Constructor</p>


| Param | Type | Description |
| --- | --- | --- |
| class_ | <code>Class.&lt;AbstractDbObject&gt;</code> |  |
| propType | <code>string</code> | <p>property type (single, map, or array)</p> |

<a name="ChildDef+class_"></a>

### childDef.class\_ : <code>Class.&lt;AbstractDbObject&gt;</code>
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
<a name="ChildDef+class_"></a>

### childDef.class\_ : <code>Class.&lt;AbstractDbObject&gt;</code>
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
    * [new ChildDefCollection(defs)](#new_ChildDefCollection_new)
    * [.defs](#ChildDefCollection+defs) : [<code>Array.&lt;ChildDef&gt;</code>](#ChildDef)
    * [.defs](#ChildDefCollection+defs) : [<code>Array.&lt;ChildDef&gt;</code>](#ChildDef)
    * [.initProps(object)](#ChildDefCollection+initProps)
    * [.initConfig(object)](#ChildDefCollection+initConfig)
    * [.getDefByClass(class_)](#ChildDefCollection+getDefByClass) ⇒ [<code>ChildDef</code>](#ChildDef)
    * [.getDefByObject(object)](#ChildDefCollection+getDefByObject) ⇒ [<code>ChildDef</code>](#ChildDef)
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

<a name="new_ChildDefCollection_new"></a>

### new ChildDefCollection(defs)
<p>Constructor</p>


| Param | Type |
| --- | --- |
| defs | [<code>Array.&lt;ChildDef&gt;</code>](#ChildDef) | 

<a name="ChildDefCollection+defs"></a>

### childDefCollection.defs : [<code>Array.&lt;ChildDef&gt;</code>](#ChildDef)
**Kind**: instance property of [<code>ChildDefCollection</code>](#ChildDefCollection)  
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
| class_ | <code>Class.&lt;AbstractDbObject&gt;</code> | 

<a name="ChildDefCollection+getDefByObject"></a>

### childDefCollection.getDefByObject(object) ⇒ [<code>ChildDef</code>](#ChildDef)
<p>Returns ChildDef by child object</p>

**Kind**: instance method of [<code>ChildDefCollection</code>](#ChildDefCollection)  

| Param | Type |
| --- | --- |
| object | <code>AbstractDbObject</code> | 

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
| class_ | <code>Class.&lt;AbstractDbObject&gt;</code> | 

<a name="ChildDefCollection+getDefByObject"></a>

### childDefCollection.getDefByObject(object) ⇒ [<code>ChildDef</code>](#ChildDef)
<p>Returns ChildDef by child object</p>

**Kind**: instance method of [<code>ChildDefCollection</code>](#ChildDefCollection)  

| Param | Type |
| --- | --- |
| object | <code>AbstractDbObject</code> | 

<a name="DbAsCode"></a>

## DbAsCode
<p>Main class of the DbAsCode tool.</p>

**Kind**: global class  

* [DbAsCode](#DbAsCode)
    * [new DbAsCode(config, predefinedPlugins, changes)](#new_DbAsCode_new)
    * [new DbAsCode(config, predefinedPlugins, changes)](#new_DbAsCode_new)
    * [.config](#DbAsCode+config) : [<code>DbAsCodeConfig</code>](#DbAsCodeConfig)
    * [.version](#DbAsCode+version) : <code>number</code>
    * [.changes](#DbAsCode+changes) : [<code>Changes</code>](#Changes)
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
    * [new PluginDescriptor(name, version, [dbClass], [stateStoreClass], [sqlExecClass], [eventHandler])](#new_PluginDescriptor_new)
    * [.init(dbAsCodeConfig)](#PluginDescriptor+init)
    * [.getStateStore()](#PluginDescriptor+getStateStore) ⇒ <code>\*</code>
    * [.getSqlExec()](#PluginDescriptor+getSqlExec) ⇒ [<code>AbstractSqlExec</code>](#AbstractSqlExec)
    * [.event(eventName, args)](#PluginDescriptor+event)
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
    * [new PropDef(name, [type], [defaultValue], [configName], [isDefault], [normalize], [validate], [allowNull], [recreateOnChange])](#new_PropDef_new)
    * [.apply(obj, config)](#PropDef+apply)
    * [.getConfigName(obj)](#PropDef+getConfigName) ⇒ <code>\*</code>
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
| obj | <code>AbstractDbObject</code> | 
| config | <code>\*</code> | 

<a name="PropDef+getConfigName"></a>

### propDef.getConfigName(obj) ⇒ <code>\*</code>
<p>Returns config name</p>

**Kind**: instance method of [<code>PropDef</code>](#PropDef)  

| Param | Type |
| --- | --- |
| obj | <code>AbstractDbObject</code> | 

<a name="PropDef+apply"></a>

### propDef.apply(obj, config)
<p>Applies config value to the object</p>

**Kind**: instance method of [<code>PropDef</code>](#PropDef)  

| Param | Type |
| --- | --- |
| obj | <code>AbstractDbObject</code> | 
| config | <code>\*</code> | 

<a name="PropDef+getConfigName"></a>

### propDef.getConfigName(obj) ⇒ <code>\*</code>
<p>Returns config name</p>

**Kind**: instance method of [<code>PropDef</code>](#PropDef)  

| Param | Type |
| --- | --- |
| obj | <code>AbstractDbObject</code> | 

<a name="PropDefCollection"></a>

## PropDefCollection
<p>Collection of object property definitions.</p>

**Kind**: global class  

* [PropDefCollection](#PropDefCollection)
    * [new PropDefCollection(defs)](#new_PropDefCollection_new)
    * [new PropDefCollection(defs)](#new_PropDefCollection_new)
    * [.defs](#PropDefCollection+defs) : [<code>Array.&lt;PropDef&gt;</code>](#PropDef)
    * [.defs](#PropDefCollection+defs) : [<code>Array.&lt;PropDef&gt;</code>](#PropDef)
    * [.getDefaultProp()](#PropDefCollection+getDefaultProp) ⇒ [<code>PropDef</code>](#PropDef)
    * [.initProps(object)](#PropDefCollection+initProps)
    * [.findPropByName(name)](#PropDefCollection+findPropByName) ⇒ [<code>PropDef</code>](#PropDef)
    * [.getDefaultProp()](#PropDefCollection+getDefaultProp) ⇒ [<code>PropDef</code>](#PropDef)
    * [.initProps(object)](#PropDefCollection+initProps)
    * [.findPropByName(name)](#PropDefCollection+findPropByName) ⇒ [<code>PropDef</code>](#PropDef)

<a name="new_PropDefCollection_new"></a>

### new PropDefCollection(defs)
<p>Constructor</p>


| Param | Type |
| --- | --- |
| defs | [<code>Array.&lt;PropDef&gt;</code>](#PropDef) | 

<a name="new_PropDefCollection_new"></a>

### new PropDefCollection(defs)
<p>Constructor</p>


| Param | Type |
| --- | --- |
| defs | [<code>Array.&lt;PropDef&gt;</code>](#PropDef) | 

<a name="PropDefCollection+defs"></a>

### propDefCollection.defs : [<code>Array.&lt;PropDef&gt;</code>](#PropDef)
**Kind**: instance property of [<code>PropDefCollection</code>](#PropDefCollection)  
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

* [State](#State)
    * [new State(id, [date], [raw], [migrationSql], [dbAsCodeVersion], [pluginVersion])](#new_State_new)
    * [new State(id, [date], [raw], [migrationSql], [dbAsCodeVersion], [pluginVersion])](#new_State_new)

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
    * [new ValidationContext(prevTree, curTree)](#new_ValidationContext_new)
    * [.errors](#ValidationContext+errors) : [<code>Array.&lt;ValidateError&gt;</code>](#ValidateError)
    * [.prevTree](#ValidationContext+prevTree)
    * [.curTree](#ValidationContext+curTree)
    * [.errors](#ValidationContext+errors) : [<code>Array.&lt;ValidateError&gt;</code>](#ValidateError)
    * [.prevTree](#ValidationContext+prevTree)
    * [.curTree](#ValidationContext+curTree)
    * [.hasErrors()](#ValidationContext+hasErrors) ⇒ <code>boolean</code>
    * [.addError(obj, message)](#ValidationContext+addError)
    * [.printErrors()](#ValidationContext+printErrors) ⇒ <code>string</code>
    * [.hasErrors()](#ValidationContext+hasErrors) ⇒ <code>boolean</code>
    * [.addError(obj, message)](#ValidationContext+addError)
    * [.printErrors()](#ValidationContext+printErrors) ⇒ <code>string</code>

<a name="new_ValidationContext_new"></a>

### new ValidationContext(prevTree, curTree)
<p>Constructor</p>


| Param | Type |
| --- | --- |
| prevTree | <code>AbstractDbObject</code> \| <code>undefined</code> | 
| curTree | <code>AbstractDbObject</code> \| <code>undefined</code> | 

<a name="new_ValidationContext_new"></a>

### new ValidationContext(prevTree, curTree)
<p>Constructor</p>


| Param | Type |
| --- | --- |
| prevTree | <code>AbstractDbObject</code> \| <code>undefined</code> | 
| curTree | <code>AbstractDbObject</code> \| <code>undefined</code> | 

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
| obj | <code>AbstractDbObject</code> | 
| message | <code>string</code> | 

<a name="ValidationContext+printErrors"></a>

### validationContext.printErrors() ⇒ <code>string</code>
<p>Returns string with all errors in the context for human-readable printing.</p>

**Kind**: instance method of [<code>ValidationContext</code>](#ValidationContext)  
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
| obj | <code>AbstractDbObject</code> | 
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
    * [.pluginOnTreeInitialized(config)](#DataBase+pluginOnTreeInitialized)
    * [.pluginOnCompareObjects(old, cur, context)](#DataBase+pluginOnCompareObjects)
    * [.getSchema(name)](#DataBase+getSchema) ⇒
    * [.validate()](#DataBase+validate)

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
<a name="DataBase+pluginOnTreeInitialized"></a>

### dataBase.pluginOnTreeInitialized(config)
<p>Executes plugins when an object is created and configured</p>

**Kind**: instance method of [<code>DataBase</code>](#DataBase)  

| Param | Type |
| --- | --- |
| config | <code>Object</code> | 

<a name="DataBase+pluginOnCompareObjects"></a>

### dataBase.pluginOnCompareObjects(old, cur, context)
<p>Executes plugins to provide custom object comparison when calculating changes</p>

**Kind**: instance method of [<code>DataBase</code>](#DataBase)  

| Param | Type |
| --- | --- |
| old | <code>AbstractDbObject</code> | 
| cur | <code>AbstractDbObject</code> | 
| context | [<code>ChangesContext</code>](#ChangesContext) | 

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
| columns | <code>Array.&lt;Column&gt;</code> | 
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
| inst | [<code>Table</code>](#Table) \| <code>Column</code> \| [<code>PrimaryKey</code>](#PrimaryKey) | 

<a name="default"></a>

## default
**Kind**: global variable  
**Licence**: This file is covered by the LICENSE.md file in the root of this project.  
**Copyright**: 2019 Alex Pravdin  
<a name="prevTree"></a>

## prevTree : [<code>AbstractDataBase</code>](#AbstractDataBase)
**Kind**: global variable  
<a name="curTree"></a>

## curTree : [<code>AbstractDataBase</code>](#AbstractDataBase)
**Kind**: global variable  
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
<a name="prevTree"></a>

## prevTree : [<code>AbstractDataBase</code>](#AbstractDataBase)
**Kind**: global variable  
<a name="curTree"></a>

## curTree : [<code>AbstractDataBase</code>](#AbstractDataBase)
**Kind**: global variable  
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
<a name="jest"></a>

## jest : <code>Jest</code>
**Kind**: global variable  
<a name="jest"></a>

## jest : <code>Jest</code>
**Kind**: global variable  
<a name="TREE_INITIALIZED"></a>

## TREE\_INITIALIZED
**Kind**: global constant  
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
| obj | <code>AbstractDbObject</code> | 
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

<a name="processCalculations"></a>

## processCalculations(obj, args) ⇒ <code>\*</code>
<p>Process calculations in string config values</p>

**Kind**: global function  

| Param | Type |
| --- | --- |
| obj | <code>AbstractDbObject</code> | 
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

<a name="loadTestData"></a>

## loadTestData() ⇒ [<code>Promise.&lt;AbstractDataBase&gt;</code>](#AbstractDataBase)
<p>Load this test test data</p>

**Kind**: global function  
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

<a name="getRowLevelSecurity"></a>

## getRowLevelSecurity() ⇒ <code>object</code>
<p>Returns row level security data combined with data inherited from ancestor</p>

**Kind**: global function  
<a name="SqlExecResult"></a>

## SqlExecResult : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| exitCode | <code>int</code> | 
| stdout | <code>string</code> | 
| stderr | <code>string</code> | 

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

<a name="SqlExecResult"></a>

## SqlExecResult : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| exitCode | <code>int</code> | 
| stdout | <code>string</code> | 
| stderr | <code>string</code> | 

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

