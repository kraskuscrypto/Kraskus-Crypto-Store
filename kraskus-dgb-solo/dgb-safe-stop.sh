#!/bin/bash
# DigiByte Solo by Kraskus: stop DigiByte Core cleanly BEFORE any 5tratumOS
# app down, uninstall, reinstall or node-version change. Run as root on the
# 5tratumOS host.
#
# Why: a node killed while flushing its UTXO cache can corrupt its
# chainstate (a full re-sync). The current 5tratumOS CLI honours the node's
# 10 minute stop_grace_period on update, down and uninstall; this script
# stops the node first with a longer timeout and CONFIRMS the clean exit
# (exit 0 + 'Shutdown: done') before anything is recreated or removed.
#
# Usage:
#   dgb-safe-stop.sh                    stop the node, confirm a clean exit
#   dgb-safe-stop.sh --then update      ...then `5tratumos app update kraskus-dgb-solo`
#   dgb-safe-stop.sh --then reinstall   ...then uninstall (keep data) + install
#                                        from the Kraskus Dev Store channel
# Exit status: 0 = clean stop confirmed (and follow-up done), 1 = refused.
set -u
APP=kraskus-dgb-solo
C="5tratumos-$APP-node-1"
TIMEOUT="${DGB_SAFE_STOP_TIMEOUT:-900}"
CHANNEL="${DGB_CHANNEL:-custom-kraskus-crypto-dev-store}"
DATA="/var/lib/5tratumos/apps/$APP/node"
THEN=""
[ "${1:-}" = "--then" ] && THEN="${2:-}"

say() { echo "[dgb-safe-stop $(date -u +%H:%M:%S)] $*"; }
refuse() { say "REFUSING: $*"; say "Nothing was updated or recreated. DigiByte chain and wallet data are untouched."; exit 1; }

[ "$(id -u)" -eq 0 ] || refuse "run as root"
docker inspect "$C" >/dev/null 2>&1 || refuse "container $C not found"

if [ "$(docker inspect -f '{{.State.Running}}' "$C")" = "true" ]; then
  say "stopping $C with up to ${TIMEOUT}s for a clean DigiByte Core shutdown"
  t0=$(date +%s)
  docker stop --time "$TIMEOUT" "$C" >/dev/null || refuse "docker stop failed"
  say "stopped after $(( $(date +%s) - t0 ))s"
else
  say "$C is not running; checking how it last stopped"
fi

code="$(docker inspect -f '{{.State.ExitCode}}' "$C")"
oom="$(docker inspect -f '{{.State.OOMKilled}}' "$C")"
done_line=no
tail -n 20 "$DATA/debug.log" 2>/dev/null | grep -q "Shutdown: done" && done_line=yes
say "exit code=$code oom_killed=$oom debug.log 'Shutdown: done'=$done_line"
[ "$oom" = "false" ] || refuse "DigiByte Core was OOM-killed"
[ "$code" = "0" ] || refuse "DigiByte Core exit code $code (137 = killed): shutdown not clean"
[ "$done_line" = "yes" ] || refuse "debug.log does not end with 'Shutdown: done'"
say "CLEAN SHUTDOWN CONFIRMED"

case "$THEN" in
  "") say "node stays stopped. Next: 5tratumos app update $APP  (or --then reinstall)";;
  update)
    say "5tratumos app update $APP"
    5tratumos app update "$APP" || { say "update failed; the node is stopped, start it with: 5tratumos app up $APP"; exit 1; }
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
