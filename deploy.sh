#!/usr/bin/env bash
# Deploy the site to Cloudflare Pages (project: dfg-consulting).
# Requires: npx wrangler login (once).
set -euo pipefail
cd "$(dirname "$0")"
DIST="$(mktemp -d)"
trap 'rm -rf "$DIST"' EXIT
rsync -a --exclude .git --exclude .claude --exclude README.md --exclude .gitignore --exclude deploy.sh ./ "$DIST"/
CLOUDFLARE_ACCOUNT_ID=92bc8d0944d701d39576e6a5ecca86f8 \
  npx wrangler pages deploy "$DIST" --project-name dfg-consulting --branch main --commit-dirty=true
