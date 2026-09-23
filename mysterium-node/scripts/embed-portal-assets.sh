#!/usr/bin/env bash
# Regenerate the portal-migrator payloads embedded in docker-compose.yml.
#
# 5tratumOS copies a Store recipe's data/ tree into APP_DATA_DIR only on first
# install (cp -an, never overwriting). Updates therefore have to carry the
# versioned application files themselves: the portal-migrator service embeds
# each file as a gzip+base64 payload and writes it into persistent storage
# before nginx and the status agent start. Run this script after changing any
# of the SOURCES below, then run scripts/self-check.sh.
set -euo pipefail
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE="$APP_DIR/docker-compose.yml"

# source file (relative to the recipe) -> path written inside the migrator
SOURCES=(
  "portal/app.js:/portal/app.js.new"
  "portal/live.js:/portal/live.js.new"
  "portal/styles.css:/portal/styles.css.new"
  "portal/index.html:/portal/index.html.new"
  "status-agent/status.sh:/status-agent/status.sh.new"
  "nginx/default.conf:/nginx/default.conf.new"
)

tmp="$(mktemp)"
cp "$COMPOSE" "$tmp"
for entry in "${SOURCES[@]}"; do
  src="${entry%%:*}"
  target="${entry#*:}"
  [ -s "$APP_DIR/$src" ] || { echo "missing source: $src" >&2; exit 1; }
  # -n: no file name / timestamp in the gzip header, so payloads are reproducible.
  payload="$(gzip -n -9 -c "$APP_DIR/$src" | base64 -w0)"
  line="      printf '%s' '${payload}' | base64 -d | gzip -d > ${target}"
  if ! grep -Fq "| base64 -d | gzip -d > ${target}" "$tmp"; then
    echo "docker-compose.yml has no payload line for ${target}" >&2; exit 1
  fi
  awk -v target="${target}" -v line="${line}" '
    index($0, "| base64 -d | gzip -d > " target) && $0 ~ /printf/ { print line; next }
    { print }
  ' "$tmp" > "$tmp.next"
  mv "$tmp.next" "$tmp"
done
mv "$tmp" "$COMPOSE"
echo "embedded ${#SOURCES[@]} payloads into docker-compose.yml"
