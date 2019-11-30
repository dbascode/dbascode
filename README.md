# DbAsCode
### Database As Code

A tool to manage databases structure "as code" in `yaml` config files, allowing easy VCS storage, changes 
tracking, and automation.

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

## Contribution

**Important:** Before making any commit, run the `contrib/init.sh` script. It will add some required git hooks. 
