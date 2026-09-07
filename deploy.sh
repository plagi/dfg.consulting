#!/usr/bin/env bash
# Deploy the site to Cloudflare Pages (project: dfg-consulting).
# Requires: npx wrangler login (once).
set -euo pipefail
cd "$(dirname "$0")"
DIST="$(mktemp -d)"
trap 'rm -rf "$DIST"' EXIT
rsync -a --exclude .git --exclude .claude --exclude README.md --exclude .gitignore --exclude deploy.sh ./ "$DIST"/
# Cache-busting: stamp every /assets/*.css|js reference with a version so the CDN never serves a stale file.
VER="$(git rev-parse --short HEAD 2>/dev/null || date +%s)$( [ -n "$(git status --porcelain 2>/dev/null)" ] && echo "-$(date +%s)" )"
find "$DIST" -name '*.html' -print0 | while IFS= read -r -d '' f; do
  sed -E -i '' "s#(/assets/[a-z0-9_-]+\.(css|js))(\?v=[^\"']*)?#\1?v=${VER}#g" "$f"
done
CLOUDFLARE_ACCOUNT_ID=92bc8d0944d701d39576e6a5ecca86f8 \
  npx wrangler pages deploy "$DIST" --project-name dfg-consulting --branch main --commit-dirty=true
