#!/usr/bin/env bash
set -euo pipefail
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VERSION="$(cat "$APP_DIR/VERSION")"

test -f "$APP_DIR/portal/index.html"
test -f "$APP_DIR/portal/app.js"
test -f "$APP_DIR/portal/live.js"
test -f "$APP_DIR/portal/styles.css"
test -f "$APP_DIR/portal/mystnodes-mark.svg"
test -f "$APP_DIR/portal/updater.js"
test -f "$APP_DIR/nginx/default.conf"
test -x "$APP_DIR/status-agent/status.sh"
test -f "$APP_DIR/updater/lib.sh"
test -f "$APP_DIR/updater/serve.sh"
test -f "$APP_DIR/updater/watch.sh"
test -f "$APP_DIR/updater/update.sh"
test -f "$APP_DIR/updater/www/cgi-bin/status"
test -f "$APP_DIR/updater/www/cgi-bin/update"

grep -q 'location = /status.json' "$APP_DIR/nginx/default.conf"
grep -q 'location /live-api/' "$APP_DIR/nginx/default.conf"
grep -q 'limit_except GET HEAD' "$APP_DIR/nginx/default.conf"
grep -q 'location /update-api/' "$APP_DIR/nginx/default.conf"
grep -q 'updater.js' "$APP_DIR/nginx/default.conf"
grep -q 'location ~ \^/(app|live)\\.js\$' "$APP_DIR/nginx/default.conf"
grep -q 'Cache-Control "no-store"' "$APP_DIR/nginx/default.conf"
grep -Fq 'app.js?v=' "$APP_DIR/portal/index.html"
grep -Fq 'live.js?v=' "$APP_DIR/portal/index.html"
grep -Fq ':4449/' "$APP_DIR/portal/app.js"
grep -q 'status-agent' "$APP_DIR/docker-compose.yml"
grep -q 'update-agent' "$APP_DIR/docker-compose.yml"
grep -q '/var/run/docker.sock:/var/run/docker.sock' "$APP_DIR/docker-compose.yml"
grep -q '0.0.0.0:33060:80' "$APP_DIR/docker-compose.yml"
grep -q 'mysteriumnetwork/myst:1.39.5-alpine@sha256:d0c270c6bcb50c1004ba355c264f85aa16b3a5a414f8b9f8f5b0f449ea85a142' "$APP_DIR/docker-compose.yml"
grep -q 'http://127.0.0.1:4050' "$APP_DIR/status-agent/status.sh"
grep -q '/node/provider/series/earnings' "$APP_DIR/status-agent/status.sh"
grep -q '/node/provider/sessions' "$APP_DIR/status-agent/status.sh"

cmp "$APP_DIR/portal/index.html" "$APP_DIR/data/portal/index.html"
cmp "$APP_DIR/portal/app.js" "$APP_DIR/data/portal/app.js"
cmp "$APP_DIR/portal/live.js" "$APP_DIR/data/portal/live.js"
cmp "$APP_DIR/portal/styles.css" "$APP_DIR/data/portal/styles.css"
cmp "$APP_DIR/portal/mystnodes-mark.svg" "$APP_DIR/data/portal/mystnodes-mark.svg"
cmp "$APP_DIR/portal/updater.js" "$APP_DIR/data/portal/updater.js"
cmp "$APP_DIR/nginx/default.conf" "$APP_DIR/data/nginx/default.conf"
cmp "$APP_DIR/status-agent/status.sh" "$APP_DIR/data/status-agent/status.sh"

node --check "$APP_DIR/portal/app.js"
node --check "$APP_DIR/portal/live.js"
sh -n "$APP_DIR/status-agent/status.sh"

python3 - "$APP_DIR" "$VERSION" <<'PY'
from pathlib import Path
import yaml,sys
root=Path(sys.argv[1]); version=sys.argv[2]
app=yaml.safe_load((root/"5tratstore-app.yml").read_text())
review=yaml.safe_load((root/"5tratstore-review.yml").read_text())
compose=yaml.safe_load((root/"docker-compose.yml").read_text())
assert str(app["version"]) == version
assert str(review["appVersion"]) == version
assert review["security"]["dockerSocket"] is True
assert "update-agent" in compose["services"]
assert "portal-migrator" in compose["services"]
assert compose["services"]["portal"]["ports"] == ["0.0.0.0:33060:80"]
portal_mounts = compose["services"]["portal"]["volumes"]
assert "${APP_DATA_DIR}/data/portal:/usr/share/nginx/html:ro" in portal_mounts
assert "${APP_DATA_DIR}/data/nginx/default.conf:/etc/nginx/conf.d/default.conf:ro" in portal_mounts
assert compose["services"]["portal"]["depends_on"]["portal-migrator"]["condition"] == "service_healthy"
assert ":4449/" in compose["services"]["portal-migrator"]["command"][-1]
assert "exec tail -f /dev/null" in compose["services"]["portal-migrator"]["command"][-1]
assert compose["services"]["portal-migrator"]["restart"] == "unless-stopped"
print("PASS: version synchronization")
print("PASS: updater security declaration")
print("PASS: persistent portal migration sidecar")
PY

echo "PASS: packaged runtime files"
