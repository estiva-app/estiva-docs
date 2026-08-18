#!/usr/bin/env bash
#
# Start the whole Estiva Suite locally, in dependency order, waiting for each
# service to actually answer before starting the next.
#
# Usage:
#   estiva-up.sh                 everything
#   estiva-up.sh relay id        just those, plus what they depend on
#
# Each service gets a tmux window in the `estiva` session:
#   tmux attach -t estiva        watch them
#   estiva-down.sh               stop them
#   estiva-doctor.sh             what is actually running
#
# This is the every-run script. The first run on a new machine needs
# estiva-bootstrap.sh, which compiles ~1,000 Rust crates and takes ~20 minutes.

source "$(dirname "${BASH_SOURCE[0]}")/estiva-lib.sh"

want=("$@"); [[ ${#want[@]} -eq 0 ]] && want=("${SERVICES[@]}")
wants() { [[ " ${want[*]} " == *" $1 "* ]]; }

mkdir -p "$LOG_DIR"
echo
echo "Starting Estiva Suite  (logs → $LOG_DIR)"
echo

# --- preconditions, checked before anything starts -------------------------
#
# Every one of these produces a failure downstream that reads as a code problem
# rather than a missing tool, so they are worth one second up front.

fail=0
for dir in "$BUZZ_DIR" "$ID_DIR" "$PEEK_DIR" "$SHIP_DIR"; do
  [[ -d $dir ]] || { bad setup "missing repo: $dir"; fail=1; }
done
command -v docker >/dev/null || { bad setup "docker not on PATH"; fail=1; }
docker info >/dev/null 2>&1 || { bad setup "docker is not running — start Docker Desktop"; fail=1; }
command -v tmux >/dev/null   || { bad setup "tmux not on PATH (apt install tmux)"; fail=1; }
[[ -f "$ID_DIR/.env" ]] || { bad setup "$ID_DIR/.env missing — see local-dev/RUNNING.md"; fail=1; }
(( fail )) && { echo; exit 1; }

# --- 1. stateful dependencies ----------------------------------------------
# Buzz's Postgres/Redis/MinIO and Estiva ID's own Postgres, which sits on 5433
# precisely so the two do not collide.

if wants deps; then
  if check_deps; then
    ok deps "already running"
  else
    echo "  ..    deps      starting containers"
    # `just relay` would start these itself, but doing it here means a failure
    # here is reported as a dependency failure rather than as the relay
    # mysteriously not compiling.
    (cd "$BUZZ_DIR" && docker compose up -d >>"$LOG_DIR/deps.log" 2>&1) || true
    (cd "$ID_DIR" && pnpm db:up >>"$LOG_DIR/deps.log" 2>&1) || true
    wait_for deps 60 check_deps || exit 1
    ok deps "up"
  fi
fi

# --- 2. the relay ----------------------------------------------------------
# Everything else publishes here, so it goes first. `just relay` also runs
# migrations and seeds the loopback community rows.

if wants relay; then
  if check_relay; then
    ok relay "already running on :$PORT_RELAY"
  else
    start_window relay "$BUZZ_DIR" "./bin/just relay" check_relay
    echo "  ..    relay     compiling / starting (first run is slow)"
    wait_for relay 900 check_relay || exit 1
    ok relay "http://localhost:$PORT_RELAY"
  fi
fi

# --- 3. Estiva ID ----------------------------------------------------------

if wants id; then
  if check_id; then
    ok id "already running on :$PORT_ID"
  else
    start_window id "$ID_DIR" "pnpm dev" check_id
    wait_for id 60 check_id || exit 1
    ok id "http://localhost:$PORT_ID"
  fi
fi

# --- 4. Convex ------------------------------------------------------------
# CONVEX_AGENT_MODE=anonymous runs the backend entirely on this machine, with
# no account and no cloud deployment. Data lives in peek-app/.convex.

if wants convex; then
  if check_convex; then
    ok convex "already running on :$PORT_CONVEX"
  else
    deployment=$(convex_local_deployment) || {
      bad convex "no local Convex deployment in $PEEK_DIR/.convex/local"
      note "run estiva-bootstrap.sh — it creates one"
      exit 1
    }
    # CONVEX_TMPDIR keeps the temp dir on the project's filesystem; without it
    # convex warns on every start and file watching is unreliable under WSL.
    start_window convex "$PEEK_DIR" \
      "CONVEX_AGENT_MODE=anonymous CONVEX_DEPLOYMENT=$deployment CONVEX_TMPDIR=$PEEK_DIR/.convex/tmp npx convex dev" check_convex
    wait_for convex 180 check_convex || exit 1
    ok convex "http://localhost:$PORT_CONVEX"
  fi
fi

# --- 5. the apps ----------------------------------------------------------

if wants peek; then
  if check_peek; then
    ok peek "already running on :$PORT_PEEK"
  else
    start_window peek "$PEEK_DIR" "npm run dev" check_peek
    wait_for peek 90 check_peek || exit 1
    ok peek "http://localhost:$PORT_PEEK"
  fi
fi

if wants ship; then
  if check_ship; then
    ok ship "already running on :$PORT_SHIP"
  else
    # Ship bakes its relay and identity origins in at build time, so the build
    # has to happen with the local ones set — a bundle built against the
    # defaults loads fine and then talks to production.
    start_window ship "$SHIP_DIR" \
      "RELAY_URL=http://localhost:$PORT_RELAY ID_BASE=http://localhost:$PORT_ID CLIENT_ID=estiva-ship npm run serve" check_ship
    wait_for ship 120 check_ship || exit 1
    ok ship "http://localhost:$PORT_SHIP/ship/"
  fi
fi

echo
echo "  tmux attach -t $TMUX_SESSION     watch the logs"
echo "  estiva-doctor.sh                 what is actually working"
echo
