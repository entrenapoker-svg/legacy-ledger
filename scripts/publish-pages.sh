#!/usr/bin/env bash
# Builds the web app as a static site and publishes it to the gh-pages branch.
set -euo pipefail
cd "$(dirname "$0")/../app"
REPO_NAME=$(basename "$(git rev-parse --show-toplevel)")
NEXT_PUBLIC_BASE_PATH="/$REPO_NAME" NEXT_PUBLIC_DEFAULT_CLUSTER="${CLUSTER:-devnet}" npm run build
touch out/.nojekyll
cd out
rm -rf .git
git init -q -b gh-pages
git add -A
git commit -q -m "Publish web app"
git -c credential.helper= -c "credential.helper=!gh auth git-credential" push -f "$(git -C .. remote get-url origin)" gh-pages
rm -rf .git
echo "Published to gh-pages"
