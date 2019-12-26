# PostgreSQL plugin

This plugin implements support for PostgreSQL databases management in DbAsCode.

## Object Tree

- [Database](#DataBase)
  - [Role](#Role)
  - [Schema](#Schema)
    - [Table](#Table)
      - [Column](#Column)
      - [Primary key](#PrimaryKey)
      - [Index](#Index)
      - [Unique key](#UniqueKey)
      - [Foreign key](#ForeignKey)
      - [Trigger](#Trigger)
    - [Sequence](#Sequence)
    - [Function](#Function)
    - [Type](#Type)
      - [Attribute](#Attribute)

## Options defined by objects

Default options may replace the entire object declaration making it shorter.

For example, the following declaration:

```yaml
columns:
  id: 
    type: int
  value:
    type: text
```

May be replaced with the following equivalent:

```yaml
columns:
  id: int
  type: text
```

**Note**: Fields marked with asterisk (*) are required and DbAsCode will fail if they are omitted.

<a name="DataBase"></a>
### Database

Option | Type | Default | Description
-------|------|---------| -----------
`extensions` | `string[]` | `[]` | Array of strings defining names of PostgreSQL extensions that should be enabled in the database.
`roles` | `Object<name, Role>` | `{}` | Map of roles in the database.

<a name="Role"></a>
### Role

Option | Type | Default | Description
-------|------|---------|------------
`member_of` | `string` | | Role name which this role is a member of. Equivalent to the following SQL: `GRANT member_of TO role`.
`is_client` | `boolean` | `false` | Defines whether this role or its members will be user for users impersonation. If `true`, then the following SQL will be generated: `GRANT role TO current_user` allowing the root user used for migrations to impersonate queries by this role.

<a name="Schema"></a>
### Schema

Option | Type | Default | Description
-------|------|---------|------------
`tables` | <code>Object<name, [Table](#table)></code> | `{}` | Map of tables in the schema.
`types` | <code>Object<name, [Type](#Type)></code> | `{}` | Map of types in the schema.
`functions` | <code>Object<name, [Function](#Function)></code> | `{}` | Map of functions in the schema. 
<a name="Schema-sequences"></a>`sequences` | <code>[Sequence](#Sequence)[]</code> | `{}` | Array of sequences in the schema.

<a name="Table"></a>
### Table

Option | Type | Default | Description
-------|------|---------|------------
`columns` | <code>Object<name, [Column](#Column)&vert;string></code> | `{}` | Map of columns in the table. Value can be a column definition object or a string value of the column [type](#Column-type).
`indexes` | <code>[Index](#Index)[]</code> | `[]` | Array of indexes in the table.
`primary_key` | <code>[PrimaryKey](#PrimaryKey)[]</code> | | Primary key definition.
`unique_keys` | <code>[UniqueKey](#UniqueKey)[]</code> | `[]` | Array of unique keys in the table.
`foreign_keys` | <code>[ForeignKey](#ForeignKey)[]</code> | `[]` | Array of unique keys in the table.
<a name="Table-primary_key"></a>`primary_key` | <code>[PrimaryKey](#PrimaryKey)</code> |  | Primary key of the table.
`triggers` | <code>Object<name, [Trigger](#Trigger)></code> | `{}` | Map of triggers in the table.

<a name="Column"></a>
### Column

Option | Type | Default | Description
-------|------|---------|------------
<a name="Column-type"></a>*`type` (Default) | `string` | `{}` | Map of columns in the table.
`foreign_key` | `string` | | Full name of a column used for the foreign key. Implicit foreign key object will be created in the table.
`allow_null` | `boolean` | `false` | Whether null values are allowed in the column.
`default` | <code>string &vert; null &vert; object</code> | `null` | Default value for the column. String values will be escaped. Null value will become raw `NULL`. Object values should be of the following format: `{ value: <string>, raw: <boolean> }`. The `value` field is the same as when the default value is not an object. The `raw` field, when set to `true`, prevents string value from escaping and is inserted in the resulting SQL as-is.
`autoincrement` | `boolean` | `false` | Is this column used as an auto-incremented primary key. This is the shortcut property. If set to `true`, then corresponding implicit [primary key](#Table-primary_key) will be added to the table and implicit [sequence](#Schema-sequences) to the schema. 
 
<a name="Index"></a>
### Index

Option | Type | Default | Description
-------|------|---------|------------
*`columns` (Default) | `string[]` | | Array of column names in the table used in the index.

<a name="PrimaryKey"></a>
### Primary key

Option | Type | Default | Description
-------|------|---------|------------
*`columns` (Default) | `string[]` | | Array of column names in the table used in the index.

<a name="UniqueKey"></a>
### Unique key

Option | Type | Default | Description
-------|------|---------|------------
*`columns` (Default) | `string[]` | | Array of column names in the table used in the index.

<a name="ForeignKey"></a>
### Foreign key

Option | Type | Default | Description
-------|------|---------|------------
*`column` | `string` | | Name of a column in the table which will be linked byt the foreign key.
*`ref` | `string` | | Full name of a column (in the form `table.column`) to be used in the foreign key.
`on_update` | `string` | `"restrict"` | One of the following values: `restrict` or `cascade` defining the key restriction behavior on updates.
`on_delete` | `string` | `"restrict"` | One of the following values: `restrict` or `cascade` defining the key restriction behavior on deletions.

<a name="Trigger"></a>
### Trigger

Option | Type | Default | Description
-------|------|---------|------------
*`operation` | `string` | | Type of query when the trigger will be executed: `insert`, `update`, or `select`.
*`when` | `string` | | When the trigger will be executed on the specified event: `before`, `after`, or `instead_of`.
*`what` | `string` | | Procedure name to execute on the event.

<a name="Sequence"></a>
### Sequence

Option | Type | Default | Description
-------|------|---------|------------
*`table` | `string` | | Table name which this sequence is used for.
*`column` | `string` | | Column name which this sequence is used for.

Table and column names are used to construct the sequence name only. This pair of values must be unique.

<a name="Function"></a>
### Function

Option | Type | Default | Description
-------|------|---------|------------
`table` | `language` | `sql` | Function language.
`returns` | `string` | | Return type name (in the form `schema.type` or `type`).
`arguments` | `Object<name, type>` | | Map of function arguments. Values must be in the in the form `schema.type` or `type`.
*`code` | `string` | | Function code. It is recommended to store function body in a separate file and include in the config using the [$file operator](README.md#Operators). 
`cost` | `number` | `10` | Function cost.
`security_definer` | `boolean` | `false` | Whether to add the `SECURITY DEFINER` option.
`stability` | `string` | `"volatile"` | The `STABILITY` option value.
`parallel_safety` | `string` | `"unsafe"` | The `STABILITY` option value.
`leak_proof` | `boolean` | `false` | Whether to add the `LEAK PROOF` option.

<a name="Type"></a>
### Type

Option | Type | Default | Description
-------|------|---------|------------
`is_enum` | `boolean` | `false` | Is this type an enum. If enum, the list of values must be defined. If not, the list of arguments must be defined. 
* `values` | `string[]` | `[]` | List of enum values.
* `attributes` | `Object<name, [Attribute](#Attribute)>` | {} | Map of type attributes if not an enum.

<a name="Attribute"></a>
### Attribute

Option | Type | Default | Description
-------|------|---------|------------
* `type` (Default) | `string` | | Type name of the attribute. 

