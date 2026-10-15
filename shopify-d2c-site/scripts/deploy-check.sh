#!/usr/bin/env bash
# Safe deploy to a live Shopify theme:
#   1. pulls the live theme and diffs it against the commit you last deployed, so edits made in
#      the Shopify admin are never overwritten silently;
#   2. on --push, pushes the current checkout to the live theme;
#   3. pulls it back and confirms key files match.
#
#   scripts/deploy-check.sh <store>.myshopify.com <themeId> <lastDeployedCommit> [--push]
set -euo pipefail
STORE=$1; THEME=$2; LAST=$3; PUSH=${4:-}
WORK=$(mktemp -d)
EXCLUDES=(-x .git -x node_modules -x src -x scripts -x brand -x docs -x legal -x package.json -x package-lock.json -x README.md -x .gitignore -x .shopify)

mkdir -p "$WORK/live" "$WORK/last"
shopify theme pull --store "$STORE" --theme "$THEME" --path "$WORK/live" >/dev/null
git archive "$LAST" | tar -x -C "$WORK/last"
echo "Live theme vs $LAST (anything listed was changed outside git):"
diff -rq "$WORK/last" "$WORK/live" "${EXCLUDES[@]}" || true

if [[ "$PUSH" == "--push" ]]; then
  shopify theme push --store "$STORE" --theme "$THEME" --path . --allow-live
  mkdir -p "$WORK/after"
  shopify theme pull --store "$STORE" --theme "$THEME" --path "$WORK/after" >/dev/null
  echo "After push (JSON templates may differ only in Shopify's formatting):"
  diff -rq . "$WORK/after" "${EXCLUDES[@]}" || true
fi
rm -rf "$WORK"
