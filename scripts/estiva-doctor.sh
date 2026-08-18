#!/usr/bin/env bash
#
# One line per service, plus the checks that catch the failures which look like
# success from every other angle.
#
# Ordinary health is not enough here. A relay that is up but does not know a
# kind, an Estiva ID whose seed never ran, and a Peek that publishes into the
# void because one env var is unset all answer 200 to everything.

source "$(dirname "${BASH_SOURCE[0]}")/estiva-lib.sh"

echo
echo "Estiva Suite — status"
echo

# ---------------------------------------------------------------- processes --

if check_deps; then
  ok deps "$(docker ps --format '{{.Names}}' | grep -c '^buzz-\|postgres') containers"
else
  bad deps "docker containers not running — estiva-up.sh starts them"
fi

if check_relay; then
  ok relay "http://localhost:$PORT_RELAY"
else
  bad relay "nothing on :$PORT_RELAY"
fi

if check_id; then
  ok id "http://localhost:$PORT_ID"
else
  if port_open "$PORT_ID"; then
    warn id "listening on :$PORT_ID but /readyz is not ok — check its Postgres"
  else
    bad id "nothing on :$PORT_ID"
  fi
fi

check_convex && ok convex "http://localhost:$PORT_CONVEX" || bad convex "nothing on :$PORT_CONVEX"
check_peek   && ok peek   "http://localhost:$PORT_PEEK"   || bad peek   "nothing on :$PORT_PEEK"
check_ship   && ok ship   "http://localhost:$PORT_SHIP/ship/" || bad ship "nothing on :$PORT_SHIP"

# ------------------------------------------------------------- the real checks --

echo
echo "Checks that catch silent failures"
echo

# 1. Does the relay know our kinds?
#
#    A relay can be perfectly healthy and still reject every event an app
#    sends, with the refusal arriving *after* signing already succeeded.
#
#    This cannot be checked with a bare curl: `/query` requires NIP-98 auth and
#    returns 401 to an unsigned request, which is indistinguishable from a
#    refused kind unless you read the body. Estiva Ship already has a prober
#    that signs properly, so delegate to it rather than growing a second,
#    weaker implementation here.
if check_relay; then
  if [[ "${1-}" == "--deep" ]]; then
    if (cd "$SHIP_DIR" && RELAY_URL="http://localhost:$PORT_RELAY" npm run --silent probe \
          >"$LOG_DIR/probe.log" 2>&1); then
      ok kinds "relay accepts every kind Ship probes for"
    else
      warn kinds "the relay refused at least one kind"
      grep -iE 'restricted|unknown event kind|refus' "$LOG_DIR/probe.log" | head -5 | sed 's/^/        /'
      note "full output: $LOG_DIR/probe.log — see protocol/ADDING-A-KIND.md"
    fi
  else
    if check_relay_nip11; then
      note "relay is serving NIP-11; kind acceptance not checked (needs a signed probe)"
    else
      warn relay "listening on :$PORT_RELAY but not serving a NIP-11 document"
    fi
    note "run 'estiva-doctor.sh --deep' to ask the relay which kinds it accepts"
  fi
else
  note "skipped kind check (relay down)"
fi

# 2. Did Estiva ID's seed actually run, and does it still match the source?
#    `migrate` does not seed, so a fresh database authenticates fine and refuses
#    every /sign. A stale one is worse: it refuses exactly one kind.
#
#    `allowed_kinds` is an integer array, so it needs an explicit cast before
#    concatenation. Without it psql errors, the output is empty, and "the query
#    failed" is indistinguishable from "there are no rows" — which is how this
#    check first reported a correctly seeded database as empty.
if check_id; then
  rows=$(docker exec estiva-id-dev-postgres-1 psql -U estiva -d estiva_id -tAc \
          "select client_id, allowed_kinds::text from app_credentials" 2>&1)
  if [[ $? -ne 0 || "$rows" == *ERROR* ]]; then
    warn seed "could not read app_credentials"
    note "${rows%%$'\n'*}"
  elif [[ -z "$rows" ]]; then
    warn seed "app_credentials is empty — run 'pnpm seed' in estiva-id"
    note "/sign will refuse every kind with kind_not_allowed"
  else
    ok seed "$(echo "$rows" | tr '\n' ' ' | tr '|' '=')"
    # The database is the ceiling that actually applies; seed.ts is only what
    # the next re-seed would write. They drift, and the drift is one kind wide.
    for k in $(grep -oE 'allowedKinds: \[[0-9, ]+\]' "$ID_DIR/src/db/seed.ts" 2>/dev/null \
                 | tr -dc '0-9,\n' | tr ',' '\n' | sort -un); do
      echo "$rows" | grep -q "\b$k\b" || note "seed.ts has kind $k that the database does not"
    done
  fi
fi

# 3. Is Peek pointed at the relay at all? `convex/nostr/publish.ts` no-ops
#    silently when NOSTR_RELAY_URL is unset — the app works perfectly and
#    nothing ever reaches the relay.
if check_convex; then
  relay_env=$(cd "$PEEK_DIR" && CONVEX_AGENT_MODE=anonymous npx convex env get NOSTR_RELAY_URL 2>/dev/null | tail -1)
  if [[ -z "$relay_env" || "$relay_env" == *error* ]]; then
    warn publish "NOSTR_RELAY_URL is unset in Convex — Peek will not publish"
    note "npx convex env set NOSTR_RELAY_URL http://localhost:$PORT_RELAY"
  else
    ok publish "Peek publishes to $relay_env"
  fi
fi

# 3b. Estiva ID's three fail-closed env vars.
#
#     Each defaults to empty and each turns a feature off *silently* — the
#     service starts, authenticates and answers /readyz with all three blank.
if check_id; then
  idenv="$ID_DIR/.env"
  for pair in \
    "nip98|SIGN_NIP98_ALLOWED_URL_PREFIXES|empty means /sign REFUSES all NIP-98 — no app can authenticate to the relay bridge" \
    "bridge|RELAY_BRIDGE_URL|empty means profile publishing is OFF — kind:0 never reaches anyone" \
    "handles|COMMUNITY_HOST|empty means handles claim no community — Buzz discards a kind:0 that disagrees"
  do
    label=${pair%%|*}; rest=${pair#*|}; key=${rest%%|*}; why=${rest#*|}
    val=$(grep -E "^$key=" "$idenv" 2>/dev/null | cut -d= -f2-)
    if [[ -z "$val" ]]; then
      warn "$label" "$key is unset"
      note "$why"
    fi
  done
fi

# 4. Will Convex accept a token from the LOCAL Estiva ID? convex/auth.config.ts
#    pins the issuer, and a local identity service issues a different one.
issuer=$(grep -oE "domain: '[^']+'" "$PEEK_DIR/convex/auth.config.ts" 2>/dev/null | head -1 | cut -d"'" -f2)
if [[ "$issuer" == http://localhost:* ]]; then
  ok issuer "Convex trusts $issuer"
else
  warn issuer "Convex trusts $issuer — a local Estiva ID cannot sign you in"
  note "see local-dev/RUNNING.md § 'The sign-in blocker'"
fi

echo
