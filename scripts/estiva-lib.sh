#!/usr/bin/env bash
# Shared definitions for the estiva-* scripts. Sourced, not run.
#
# One place defines where each repo lives and which port each service uses, so
# `up`, `down` and `doctor` cannot disagree about what "the relay" means.

set -uo pipefail

: "${ESTIVA_ROOT:=$HOME}"

BUZZ_DIR="$ESTIVA_ROOT/buzz"
ID_DIR="$ESTIVA_ROOT/estiva-id"
PEEK_DIR="$ESTIVA_ROOT/peek-app"
SHIP_DIR="$ESTIVA_ROOT/estiva-ship"
DOCS_DIR="$ESTIVA_ROOT/estiva-docs"

RUN_DIR="$DOCS_DIR/.run"
LOG_DIR="$RUN_DIR/logs"

PORT_RELAY=3000
PORT_CONVEX=3210
PORT_PEEK=5173
PORT_SHIP=5190
PORT_ID=8787

# Services in dependency order. Nothing below starts before the thing above it
# is answering — a service that starts against a dependency that is still
# booting fails in ways that read as configuration errors.
SERVICES=(deps relay id convex peek ship)

if [[ -t 1 ]]; then
  C_OK=$'\033[32m'; C_BAD=$'\033[31m'; C_WARN=$'\033[33m'; C_DIM=$'\033[2m'; C_OFF=$'\033[0m'
else
  C_OK=; C_BAD=; C_WARN=; C_DIM=; C_OFF=
fi

ok()   { printf '  %sok%s    %-9s %s\n'   "$C_OK"   "$C_OFF" "$1" "${2-}"; }
bad()  { printf '  %sDOWN%s  %-9s %s\n'   "$C_BAD"  "$C_OFF" "$1" "${2-}"; }
warn() { printf '  %swarn%s  %-9s %s\n'   "$C_WARN" "$C_OFF" "$1" "${2-}"; }
note() { printf '        %s%s%s\n' "$C_DIM" "$1" "$C_OFF"; }

# Is something listening? Ask the kernel, not a guess about whether we started it.
port_open() { (exec 3<>"/dev/tcp/127.0.0.1/$1") 2>/dev/null && exec 3>&-; }

# `curl -w '%{http_code}'` already prints 000 when the connection fails, and it
# also exits non-zero — so an `|| echo 000` fallback appends a SECOND 000 and
# yields "000000", which compares unequal to "000" and reads as success. This
# cost a doctor run that reported a dead relay as healthy.
http_code() {
  local out
  out=$(curl -s -o /dev/null -m "${2:-3}" -w '%{http_code}' "$1" 2>/dev/null)
  printf '%s' "${out:-000}"
}

# Wait until a check passes, or fail loudly saying which one and for how long.
# The point of this file: a start script that returns before its service is
# ready hands the next one a dependency that is not there.
wait_for() {
  local label=$1 seconds=$2; shift 2
  local waited=0
  until "$@" >/dev/null 2>&1; do
    if (( waited >= seconds )); then
      printf '  %sTIMEOUT%s %s did not come up within %ss\n' "$C_BAD" "$C_OFF" "$label" "$seconds" >&2
      printf '          log: %s/%s.log\n' "$LOG_DIR" "$label" >&2
      return 1
    fi
    sleep 1; waited=$(( waited + 1 ))
  done
  return 0
}

check_relay()  { [[ $(http_code "http://localhost:$PORT_RELAY/") != 000 ]]; }
check_relay_nip11() {
  curl -s -m 3 -H 'Accept: application/nostr+json' "http://localhost:$PORT_RELAY/" 2>/dev/null \
    | grep -q '"supported_nips"'
}
check_id()     { curl -s -m 3 "http://localhost:$PORT_ID/readyz" 2>/dev/null | grep -q '"status":"ok"'; }
check_convex() { [[ $(http_code "http://localhost:$PORT_CONVEX/version") == 200 ]]; }
check_peek()   { [[ $(http_code "http://localhost:$PORT_PEEK/") == 200 ]]; }
check_ship()   { [[ $(http_code "http://localhost:$PORT_SHIP/ship/") == 200 ]]; }
check_deps()   { docker ps --format '{{.Names}}' 2>/dev/null | grep -q '^buzz-postgres$'; }

# Which local Convex deployment to run against.
#
# `.env.local` names a CLOUD deployment (`dev:hallowed-stork-966`), and that
# wins over CONVEX_AGENT_MODE — so `npx convex dev` stops on an interactive
# "You don't have access to the selected project / create a new project?"
# prompt, which under a launcher looks exactly like a hang. Naming the local
# deployment explicitly in the environment overrides the file without editing
# it, so the cloud pointer is left alone for whoever needs it.
convex_local_deployment() {
  local cfg name
  cfg=$(ls -1 "$PEEK_DIR"/.convex/local/*/config.json 2>/dev/null | head -1)
  [[ -n "$cfg" ]] || return 1
  name=$(grep -oE '"deploymentName":"[^"]+"' "$cfg" | cut -d'"' -f4)
  [[ -n "$name" ]] || return 1
  printf 'anonymous:%s' "$name"
}

# tmux is how a service keeps running after this script exits, and how you get
# at its output afterwards without a pidfile dance.
TMUX_SESSION=estiva
tmux_running() { tmux has-session -t "$TMUX_SESSION" 2>/dev/null; }
window_running() { tmux list-windows -t "$TMUX_SESSION" -F '#W' 2>/dev/null | grep -qx "$1"; }

# A tmux window that exists is not the same as a service that works — a run
# that died on an interactive prompt leaves the window sitting there forever,
# and treating that as "already running" makes every subsequent start a no-op
# that times out. The caller passes its readiness check so we can tell the two
# apart and replace a window that is not serving.
start_window() {
  local name=$1 dir=$2 cmd=$3 check=${4-}
  mkdir -p "$LOG_DIR"
  if window_running "$name"; then
    if [[ -z $check ]] || "$check" >/dev/null 2>&1; then
      note "$name already running in tmux"; return 0
    fi
    note "$name has a tmux window but is not answering — restarting it"
    tmux kill-window -t "$TMUX_SESSION:$name" 2>/dev/null
  fi
  if tmux_running; then
    tmux new-window -t "$TMUX_SESSION" -n "$name" -c "$dir" "$cmd 2>&1 | tee $LOG_DIR/$name.log"
  else
    tmux new-session -d -s "$TMUX_SESSION" -n "$name" -c "$dir" "$cmd 2>&1 | tee $LOG_DIR/$name.log"
  fi
}
