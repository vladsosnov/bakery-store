#!/bin/sh

set -eu

repo_root=$(git rev-parse --show-toplevel)

git config core.hooksPath "$repo_root/.githooks"

echo "Git hooks enabled from $repo_root/.githooks"
