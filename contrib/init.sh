#!/bin/bash
set -e

git config --local core.hooksPath .githooks/
DIR=$(cd "$(dirname "$0")" && pwd)
chmod +x "$DIR/../.githooks/hooks--pre-commit"
