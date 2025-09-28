#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

prefix="apps/web"
remote="web-platform"
branch="main"

echo "[subtree] pulling ${remote}/${branch} into ${prefix}..."
git fetch "$remote" "$branch"
git subtree pull --prefix="$prefix" "$remote" "$branch" -m "chore(subtree): pull ${remote}/${branch} into ${prefix}"

