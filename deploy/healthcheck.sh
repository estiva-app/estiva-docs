#!/bin/sh
#
# Healthy means "serving in the mode it was started in", not merely "nginx is
# up".
#
# A gated container that answers 200 to an anonymous request has lost its gate,
# and that is the failure worth catching here — nginx would report itself
# perfectly happy while the docs were public. So the expected status is derived
# from the mode the entrypoint recorded, and anything else is unhealthy.

set -e

expected=401
[ "$(cat /run/docs-mode 2>/dev/null)" = "public" ] && expected=200

status=$(wget -q -S -O /dev/null http://127.0.0.1/ 2>&1 | awk '/^  HTTP\//{print $2; exit}')

if [ "$status" != "$expected" ]; then
  echo "expected HTTP $expected, got ${status:-no response}" >&2
  exit 1
fi
