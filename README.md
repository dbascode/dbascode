# DbAsCode
### Database As Code

A tool to manage database structure "as code" in `yaml` config files, allowing easy VCS storage, changes 
tracking, and automation.

## Supported Databases

Currently, only PostgreSQL is supported. Other DBMS support should arrive in the future.

## Project State

This project is currently on the very early development stage. It is not recommended to use it in production.

## Installation

Using NPM:
```shell script
git clone https://gitlab.com/interico/pgascode
cd dbascode
npm run fix-modules
```

Or using Yarn:
```shell script
git clone https://gitlab.com/interico/pgascode
cd pgascode
yarn run fix-modules
```

## Usage

```shell script
npm run migrate
```
