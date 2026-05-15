#!/usr/bin/env bash
# Builds the marketing site as a static export suitable for GitHub Pages.
#
# Env vars:
#   BASE_PATH                e.g. "/AI-Compliance" for project Pages
#   ASSET_PREFIX             usually same as BASE_PATH
#   NEXT_PUBLIC_SITE_URL     full canonical URL (https://user.github.io/AI-Compliance)
#   NEXT_PUBLIC_SCANNER_URL  where the live scanner lives (https://ai-compliance.vercel.app)
set -euo pipefail

cd "$(dirname "$0")/.."

STASH=".build-stash"
ORIG_CONFIG="next.config.js"
STATIC_CONFIG="next.config.static.js"

cleanup() {
  if [ -f "${ORIG_CONFIG}.orig" ]; then
    mv "${ORIG_CONFIG}.orig" "$ORIG_CONFIG"
  fi
  if [ -d "$STASH/api" ]; then
    mv "$STASH/api" app/api
  fi
  if [ -f "$STASH/opengraph-image.tsx" ]; then
    mv "$STASH/opengraph-image.tsx" app/opengraph-image.tsx
  fi
  rmdir "$STASH" 2>/dev/null || true
}
trap cleanup EXIT

# Stash server-only pieces that static export can't handle
mkdir -p "$STASH"
[ -d app/api ] && mv app/api "$STASH/api"
[ -f app/opengraph-image.tsx ] && mv app/opengraph-image.tsx "$STASH/opengraph-image.tsx"

# Swap in the static config
cp "$ORIG_CONFIG" "${ORIG_CONFIG}.orig"
cp "$STATIC_CONFIG" "$ORIG_CONFIG"

# Build
NEXT_PUBLIC_STATIC_BUILD=true \
  NEXT_PUBLIC_SCANNER_URL="${NEXT_PUBLIC_SCANNER_URL:-https://ai-compliance.vercel.app}" \
  npx next build

# GitHub Pages sometimes needs .nojekyll to serve _next/ paths
touch out/.nojekyll

echo ""
echo "Static export written to ./out"
