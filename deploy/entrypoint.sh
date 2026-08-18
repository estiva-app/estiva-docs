#!/bin/sh
#
# Decide the gate at container start, from the environment.
#
# The credential is never in the image. It arrives from /opt/estiva-docs/.env on
# the box, so rotating it is an edit and a restart rather than a rebuild, and an
# image that leaks tells an attacker nothing about the password.
#
# **Fails closed.** A docs site that quietly serves without its gate is exactly
# the silent failure this project keeps paying for: everything reports healthy
# and the thing you asked for is not happening. Refusing to start is loud, and
# an unauthenticated site is the one mistake here that cannot be taken back.

set -e

if [ "$DOCS_PUBLIC" = "true" ]; then
  # The deliberate path for "we are live, take the password off". Explicit
  # rather than inferred from an empty password, because the difference between
  # "we decided to be public" and "somebody forgot to set the variable" is the
  # whole point of this file.
  echo "auth: DISABLED — DOCS_PUBLIC=true, serving to anyone"
  sed -i '/auth_basic/d' /etc/nginx/conf.d/default.conf
  # A public site should be indexable; the noindex headers are part of being
  # pre-release, not part of being a docs site.
  sed -i '/X-Robots-Tag/d' /etc/nginx/conf.d/default.conf
  echo public > /run/docs-mode
  exec "$@"
fi

if [ -z "$DOCS_PASSWORD" ]; then
  echo "FATAL: DOCS_PASSWORD is not set." >&2
  echo "       Refusing to start rather than serving the docs unauthenticated." >&2
  echo "       Set it in /opt/estiva-docs/.env — or set DOCS_PUBLIC=true if the" >&2
  echo "       site is genuinely meant to be open now." >&2
  exit 1
fi

: "${DOCS_USER:=estiva}"
htpasswd -bBc /etc/nginx/.htpasswd "$DOCS_USER" "$DOCS_PASSWORD" >/dev/null
# The worker processes run as `nginx`, not root, and they are what open this
# file — on a request that actually carries credentials. Leaving it root-owned
# and 0600 produces the confusing shape where an anonymous request is correctly
# challenged with 401 and a *correct* password returns 500, because the
# challenge needs no file and the check does.
chown nginx:nginx /etc/nginx/.htpasswd
chmod 400 /etc/nginx/.htpasswd
echo "auth: enabled for user '$DOCS_USER'"
echo gated > /run/docs-mode

exec "$@"
