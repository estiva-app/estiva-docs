#!/usr/bin/env bash
#
# First run on a new machine. Separate from estiva-up.sh on purpose: this
# compiles ~1,000 Rust crates and takes about 20 minutes, and burying that
# inside the daily command makes the daily command feel broken.
#
# Safe to re-run.

source "$(dirname "${BASH_SOURCE[0]}")/estiva-lib.sh"

echo
echo "Estiva Suite — first-run setup"
echo "This compiles the relay from source. Expect ~20 minutes."
echo

fail=0
for dir in "$BUZZ_DIR" "$ID_DIR" "$PEEK_DIR" "$SHIP_DIR"; do
  [[ -d $dir ]] || { bad repo "missing: $dir"; fail=1; }
done
(( fail )) && { note "the five repos must be siblings — see ../README.md"; exit 1; }

command -v docker >/dev/null || { bad tool "docker not installed"; exit 1; }
docker info >/dev/null 2>&1  || { bad tool "docker is not running"; exit 1; }
command -v tmux  >/dev/null  || { bad tool "tmux not installed (apt install tmux)"; exit 1; }
command -v pnpm  >/dev/null  || { bad tool "pnpm not installed (npm i -g pnpm)"; exit 1; }
ok tools "docker, tmux, pnpm, node $(node -v)"

# --- Estiva ID -------------------------------------------------------------
# The service refuses to start without a real key-encryption key, because
# silently defaulting it would be worse than failing.

if [[ ! -f "$ID_DIR/.env" ]]; then
  cp "$ID_DIR/.env.example" "$ID_DIR/.env"
  sed -i "s/^KEY_ENCRYPTION_KEK=.*/KEY_ENCRYPTION_KEK=$(openssl rand -hex 32)/" "$ID_DIR/.env"
  ok env "created $ID_DIR/.env with a fresh KEK"
else
  ok env "$ID_DIR/.env already exists"
fi

# The three fail-closed variables. Each defaults to empty, and empty turns a
# feature OFF silently — the service starts and answers /readyz with all three
# blank. Set them here so a first run is not quietly half-configured.
set_env() {
  local key=$1 val=$2 file="$ID_DIR/.env"
  if grep -qE "^$key=.+" "$file"; then
    note "$key already set — leaving it alone"
  else
    sed -i "s|^$key=.*|$key=$val|" "$file"
    ok env "$key=$val"
  fi
}
set_env SIGN_NIP98_ALLOWED_URL_PREFIXES "http://localhost:$PORT_RELAY"
set_env RELAY_BRIDGE_URL                "http://localhost:$PORT_RELAY"

(cd "$ID_DIR" && pnpm install >/dev/null 2>&1) && ok deps "estiva-id node_modules"
(cd "$ID_DIR" && pnpm db:up >/dev/null 2>&1)
wait_for id-postgres 60 docker exec estiva-id-dev-postgres-1 pg_isready -U estiva || exit 1
(cd "$ID_DIR" && pnpm migrate && pnpm seed) >/dev/null 2>&1 && ok db "migrated and seeded"

# --- the apps --------------------------------------------------------------

(cd "$PEEK_DIR" && npm install >/dev/null 2>&1) && ok deps "peek node_modules"
(cd "$SHIP_DIR" && npm install >/dev/null 2>&1) && ok deps "ship node_modules"

# --- Convex ----------------------------------------------------------------
# Create the local anonymous deployment if there is not one. `--once` exits
# after pushing, which is what we want here — estiva-up.sh runs the watcher.

if convex_local_deployment >/dev/null; then
  ok convex "local deployment $(convex_local_deployment) already exists"
else
  echo "  ..    convex    creating a local deployment"
  (cd "$PEEK_DIR" && CONVEX_AGENT_MODE=anonymous npx convex dev --once >/dev/null 2>&1)
  convex_local_deployment >/dev/null && ok convex "created $(convex_local_deployment)" \
    || { bad convex "could not create a local deployment"; exit 1; }
fi

echo
echo "  Now run:  estiva-up.sh"
echo "  Then:     estiva-doctor.sh"
echo
echo "  Read local-dev/RUNNING.md § 'What is broken locally right now' before"
echo "  concluding anything is wrong with your machine."
echo
