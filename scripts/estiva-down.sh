#!/usr/bin/env bash
#
# Stop the suite. Processes always; containers only with --deps, because the
# relay's Postgres holds every event published so far and stopping it is not
# what "I am done for the day" usually means.
#
#   estiva-down.sh          stop the app processes, keep the data
#   estiva-down.sh --deps   also stop the containers (data survives, in volumes)
#   estiva-down.sh --wipe   also DELETE the volumes. Every event is gone.

source "$(dirname "${BASH_SOURCE[0]}")/estiva-lib.sh"

if tmux_running; then
  tmux kill-session -t "$TMUX_SESSION"
  ok stopped "tmux session '$TMUX_SESSION'"
else
  note "no tmux session '$TMUX_SESSION' running"
fi

case "${1-}" in
  --deps)
    (cd "$BUZZ_DIR" && docker compose stop >/dev/null 2>&1)
    (cd "$ID_DIR" && pnpm db:down >/dev/null 2>&1)
    ok stopped "containers (volumes kept)"
    ;;
  --wipe)
    printf 'This deletes every event on the local relay and the local identity database.\nType WIPE to confirm: '
    read -r reply
    [[ "$reply" == WIPE ]] || { echo "aborted"; exit 1; }
    (cd "$BUZZ_DIR" && docker compose down -v >/dev/null 2>&1)
    (cd "$ID_DIR" && pnpm db:down >/dev/null 2>&1)
    ok wiped "containers and volumes"
    note "next start needs: pnpm migrate && pnpm seed in estiva-id"
    ;;
esac
