#!/bin/bash
# Bitcoin SV: stop SV Node cleanly BEFORE any 5tratumOS app
# update, reinstall, down or uninstall. Run as root on the 5tratumOS host.
#
# Why: `5tratumos app down|uninstall` wrap `docker compose down` in
# `timeout 120s` and then `docker rm -f` (SIGKILL) whatever is still running,
# regardless of the 660 s stop_grace_period. SV Node can need minutes to
# flush its UTXO cache during initial sync. `app update` recreates the
# container using the OLD container's stop timeout (10 s if it had none).
# Stopping svnode here first, with an explicit long timeout, makes every
# later 5tratumOS step a no-op for the node.
#
# Usage:
#   bsv-safe-stop.sh                    stop svnode, confirm a clean exit
#   bsv-safe-stop.sh --then update      ...then `5tratumos app update kraskus-bsv-solo`
#   bsv-safe-stop.sh --then reinstall   ...then uninstall (keep data) + install
#                                        from the Kraskus Dev Store channel
# Exit status: 0 = clean stop confirmed (and follow-up done), 1 = refused.
set -u
APP=kraskus-bsv-solo
C="5tratumos-$APP-svnode-1"
TIMEOUT="${BSV_SAFE_STOP_TIMEOUT:-900}"
CHANNEL="${BSV_CHANNEL:-custom-kraskus-crypto-dev-store}"
DATA="/var/lib/5tratumos/apps/$APP/data/node"
THEN=""
[ "${1:-}" = "--then" ] && THEN="${2:-}"

say() { echo "[bsv-safe-stop $(date -u +%H:%M:%S)] $*"; }
refuse() { say "REFUSING: $*"; say "Nothing was updated or recreated. SV Node data is untouched."; exit 1; }

[ "$(id -u)" -eq 0 ] || refuse "run as root"
docker inspect "$C" >/dev/null 2>&1 || refuse "container $C not found"

if [ "$(docker inspect -f '{{.State.Running}}' "$C")" = "true" ]; then
  since="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  say "stopping $C with up to ${TIMEOUT}s for a clean SV Node shutdown"
  t0=$(date +%s)
  docker stop --time "$TIMEOUT" "$C" >/dev/null || refuse "docker stop failed"
  say "stopped after $(( $(date +%s) - t0 ))s"
else
  since=""
  say "$C is not running; checking how it last stopped"
fi

code="$(docker inspect -f '{{.State.ExitCode}}' "$C")"
oom="$(docker inspect -f '{{.State.OOMKilled}}' "$C")"
logs="$(docker logs ${since:+--since "$since"} --tail 200 "$C" 2>&1)"
bitcoind_done=no
tail -n 80 "$DATA/bitcoind.log" 2>/dev/null | grep -q "Shutdown: done" && bitcoind_done=yes

say "exit code=$code oom_killed=$oom bitcoind 'Shutdown: done'=$bitcoind_done"
echo "$logs" | grep -E "BSV_NODE_SHUTDOWN_(BEGIN|CLEAN|UNCLEAN|TIMEOUT)" | tail -3

[ "$oom" = "false" ] || refuse "SV Node was OOM-killed"
[ "$code" = "0" ] || refuse "SV Node exit code $code (137 = killed): shutdown not clean"
if echo "$logs" | grep -q "BSV_NODE_SHUTDOWN_CLEAN"; then
  [ -f "$DATA/.kraskus-node-clean-shutdown" ] || refuse "no clean-shutdown marker in the node datadir"
elif [ "$bitcoind_done" != "yes" ]; then
  # Images before the shutdown logging only leave bitcoind's own log line.
  refuse "bitcoind.log does not end with 'Shutdown: done'"
fi
say "CLEAN SHUTDOWN CONFIRMED"

case "$THEN" in
  "") say "svnode stays stopped. Next: 5tratumos app update $APP  (or --then reinstall)";;
  update)
    say "5tratumos app update $APP"
    5tratumos app update "$APP" || { say "update failed; svnode is stopped, start it with: 5tratumos app up $APP"; exit 1; }
    ;;
  reinstall)
    say "store sync + uninstall (keep data) + install from $CHANNEL"
    5tratumos store sync "$CHANNEL" || refuse "store sync failed"
    5tratumos app uninstall "$APP" || { say "uninstall failed; start the old version with: 5tratumos app up $APP"; exit 1; }
    [ -d "$DATA/chainstate" ] || { say "DATA DIR MISSING after uninstall -- stop and investigate before installing"; exit 1; }
    5tratumos app install "$APP" --channel "$CHANNEL" && 5tratumos app up "$APP" || exit 1
    ;;
  *) refuse "unknown --then '$THEN' (use update or reinstall)";;
esac
say "done"
