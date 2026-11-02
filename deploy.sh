#!/usr/bin/env bash
# Publishes src/ to Home Assistant as a new, immutable version and prints the resource URL.
#
# Each deploy lands in its own folder (/config/www/lg-tv-remote/<version>/), so the browser
# and the Companion app can never serve a stale module: relative imports stay inside the folder.
# Usage: ./deploy.sh        (needs the HA "config" share mounted at /Volumes/config)
set -euo pipefail

TARGET="${HA_WWW_DIR:-/Volumes/config/www/lg-tv-remote}"
KEEP_VERSIONS=3
VERSION="$(date +%Y%m%d%H%M%S)"

cd "$(dirname "$0")"
[ -d "$(dirname "$TARGET")" ] || { echo "Share not mounted: $(dirname "$TARGET")" >&2; exit 1; }

npm test --silent

mkdir -p "$TARGET/$VERSION"
cp src/*.js "$TARGET/$VERSION/"

# Prune old versions, keeping the newest $KEEP_VERSIONS.
ls -1 "$TARGET" | sort | awk -v keep="$KEEP_VERSIONS" '{ v[NR] = $0 } END { for (i = 1; i <= NR - keep; i++) print v[i] }' |
  while read -r old; do rm -rf "${TARGET:?}/$old"; done

echo "/local/lg-tv-remote/$VERSION/lg-tv-remote-card.js"
