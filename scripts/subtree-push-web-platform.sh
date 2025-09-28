#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

prefix="apps/web"
remote="web-platform"
branch="main"

echo "[subtree] pushing ${prefix} to ${remote}/${branch}..."
git subtree push --prefix="$prefix" "$remote" "$branch"

