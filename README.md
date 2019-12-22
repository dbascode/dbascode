# DbAsCode
### Database As Code

A tool to manage database structure "as code" in `yaml` config files, allowing easy VCS storage, changes 
tracking, and automation. The main goal is to manage the structure. Data migrations (by using custom 
migrations) are also supported.

## Goals

This project is aiming to solve the following problems in database lifetime support:

- Having the full human-readable DB structure at any point in time (commit). In conventional migration systems,
you can not see the structure until you connect to a physical DB instance with all the migrations applied. 
Or you have to export the SQL structure manually. You also unable to know the exact structure "N days/months ago"
without applying all the migrations sequentially.
- Changes tracking. You can easily compare Yaml configuration files between commits and 
clearly understand what the exact changes were made. In conventional migration systems, you can not do that without 
special workarounds on exporting SQL DB structure on each build and store it somewhere. Or you have to 
deploy backups on live DB servers.
- Convenient changes comparison. Raw SQL migrations or structure dumps, as well as XML files are 
not so convenient to read change diffs. With Yaml, you will see only those changed lines, 
which actually have changed something in the DB.

### Why not Liquibase or Flyway?   

- Liquibase requires to describe migrations manually. You just move conventional old-style SQL migrations  
to another syntax (XML or Yaml). It doesn't solve any problems mentioned above.
- Flyway operates with SQL migrations. The same, it does some automation but still doesn't work for our goals.

### Why not an ORM with migrations?

ORMs with migrations support can be used to achieve our goals, but there are cases when we don't need their main 
functionality - object relations mapping used in some code. DbAsCode is focusing on describing DB structure without any 
relations to programming languages and data models.

## Project State

This project is currently in a very early development stage. It is not recommended to use it in production.

## Supported Database Types

Currently, only PostgreSQL is supported. Other DBMS support should arrive in the future.

## Installation

Using NPM:
```shell script
$ npm i dbascode
```

Using Yarn:
```shell script
$ yarn add dbascode
```

Install PostgreSQL client:

```shell script
$ apt-get install postgresql-client
```

You also can use the pre-configured Docker image. See Docker documentation if you're not yet familiar with it. 

## Usage

Running with NPM:
```shell script
$ npm run dbascode
```

Running with Yarn:
```shell script
$ yarn dbascode
```

Running with Docker:
```shell script
$ docker run pgascode
```

### Command line options

CLI syntax:

```shell script
$ dbascode <command> [options]
```

#### Commands

Command | Description
--------|------------
`plan <source>` | Compare old and new states and create a migration plan. The new state is read from the `source` file path. If the `---output` option specified, creates the plan file to be used for migration. DbAsCode will print changes in human-readable format to `stdout`. You can redirect the output to a file and save it as an artifact during CI/CD.
`migrate` | Performs migration. Either `--plan` or `--migration` options must be specified for migration. If a plan is specified, pgascode will read SQL queries to execute from it. If another migration was performed since the state file creation, the migration will fail. If a source is specified, pgascode will generate a migration plan and execute it immediately.

#### Options

Option | Description | Example
-------|-------------|-------
`--help` | Display CLI help.
`--version` | Display the tool version.
`--db-var` | Database configuration parameter (see particular DB plugin documentation). Multiple options are allowed. | `--db-var host=db.id.ap-northeast-1.rds.amazonaws.com --db-var db=mydbname --db-var user=root --db-var password=123`
`--plugin` | List of plugins to be loaded. Module names to import must be provided. | `--plugin=myplugin1 --plugin=myplugin2`
`--dbms` | The Database Management System name if it is not mentioned in the state config. | `--dbms=postgres`
`--wsl` | Pass true if DbAsCode is run under Windows but PostgreSQL client should be run under WSL. | `--wsl=1`
`--output` | Plan only. Specifies file name to store the migration plan. | `--output=/var/plan.json`
`--source` | Migrate only. Specifies the source file to be used for plan creation if no plan is passed for the migration. | `--source=/my-project/db.yml`
`--plan` | Migrate only. Specifies the plan file generated by the `plan` command and saved with the `--output` option. Determine changes to be made in the DB. | `--plan=/var/plan.json`

**Docker Note**: Keep in mind that all paths are valid inside the container only. To work
with files on your host machine you should mount local directories/files. This will be 
described below.

#### Environment Variables

If PgAsCode will not find CLI options passed it will look for options in environment variables. Options are passed using 
the `DBAC_` variable name prefix and an option name in uppercase (hyphens are replaced by underscores):

```shell script
$ docker run -e DBAC_DB_VAR="host=some.host|port=5432|password=123" -e DBAC_DBMS=postgres -e DBAC_PLAN=/var/plan.json pgascode migrate
```

Options `--plugins` and `--db-var` should be passed as single variables with list values separated by the `|` character.

#### Docker and files on the host

To allow a container working with files on the host you should mount directories to the container and point
command line options to the mounted paths. Example:

```shell script
$ docker run -e DBAC_DB_VAR="host=some.host|port=5432|password=123" -v /my-project/config:/source -v /my-project/output:/output pgascode plan /source/db.yml --output=/output/plan.json
$ docker run -e DBAC_DB_VAR="host=some.host|port=5432|password=123" -v /my-project/output:/output pgascode migrate --plan=/output/plan.json
```

This example assumes the following:

- `/my-project` - your project directory on the host.
- `/my-project/config/db.yml` - location of the DbAsCode configuration on the host.
- `/my-project/output` - directory on the host where DbAsCode plan will be saved.
- `/source` - directory in the container where the host directory `/my-project/config` is mounted making the container's path `/source/db.yml` pointing to the `/my-project/config/db.yml`.
- `/output` - directory in the container where the host directory `/my-project/output` is mounted and where DbAsCode will save the plan. Plan will be available by the `/my-project/output/plan.json` path.

## Configuration Syntax

State configuration is written in Yaml files to allow convenient readability by humans.

DbAsCode is plugin-driven and most of the functionality is implemented in plugins. There are some very 
basic common configuration options.

The configuration consists of DbObjects and their properties. Properties can contain scalars, arrays, objects, 
and other DbObjects. For example, a table may contain some scalar properties like table comment and default encoding.
It also contains a list of columns. In this case, we can represent the table as an instance of a DbObject with scalar 
properties `comment` and `encoding`, and with an array property `columns` which contains columns (which are also 
DbObject instances).

For the details of the possible configuration options refer to the [API docs](API.md). 

Also, check docs of particular plugins:

- [PostgreSQL](src/plugins/db-postgres/README.md)

### Special Value Syntax

You can use the following special values syntax:

Operator | Description | Example
---------|-------------|--------
`$include <yaml path>` | Parse the specified Yaml file and set it's content as the value. File path is relative to the file where this operator is used. | <pre lang="yaml">tables:<br>  account: $include schema/account.yml<br>  account_type: $include schema/account_type.yml</code>
`$file <file path>` | Reads the specified file and set it's content as the string value. File path is relative to the file where this operator is used. | <pre lang="yaml">functions:<br>  acl_check:<br>    language: plpgsql<br>    code: $file functions/acl_check.sql</code>
`${parameterValue}` | Search for dynamic value and place it's value as raw value (no type checking and quotation is applied). Values are defined in plugins. | <pre lang="yaml">tables:<br>  user:<br>    user_type: ${schemaName}.user_type</code>

## Examples

```yaml
# Schema for DbAsCode state storage
schemas:
  dbascode:
    tables:
      state:
        comment: Current state storage for PgAsCode
        omit: true
        columns:
          id:
            type: int
          date:
            type: timestamp with time zone
            default:
              value: now()
              raw: true
          state:
            type: text
          migration:
            type: text
            allow_null: true
          dbascode_version:
            type: int
          plugin_version:
            type: int
        indexes:
          - date
          - dbascode_version
          - plugin_version
        primary_key: id 
```

## Plugins development

[See plugins development documentation](PLUGIN-DEV.md).

## API

[See the API docs](API.md).

## License

[MIT](LICENSE.md)
