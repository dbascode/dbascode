#!/usr/bin/env bash

BASEDIR=$(dirname "$(realpath "$0")")
node --experimental-modules --es-module-specifier-resolution=node --no-warnings "$BASEDIR/../app.mjs" "$@"
