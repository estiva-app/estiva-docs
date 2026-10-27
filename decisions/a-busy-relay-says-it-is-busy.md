# A relay too busy to answer says it is busy, at every door; a host it does not know still gets the same answer as before

- Date: 2026-10-27
- Status: Accepted
- Decided by: Miky, in the kickoff session of APP-9 ("The relay keeps answering when several apps load at once"), 27 October
- Area: Protocol

## Who it affects

On Monday 26 October, 11:54–11:56, every read Claude made for Miky through
the Estiva agent came back "relay: no community is configured for this host",
and in the same minutes Peek's own reads failed. Nothing was misconfigured: the
relay had run out of database connections. The relay log shows the same failure
in bursts since 19 October, the largest on Friday 23 October, the morning Miky
found Leaf and Ship unusable.

With this decision Claude says "the relay is busy, try again in a moment", and
Leaf, Ship and Peek keep what is on screen and retry quietly instead of drawing
an empty screen. An outside company's client gets an answer it can act on
without reading prose: a status code on connect and a standard prefix on a
read. An outsider probing which companies a deployment hosts learns nothing
new.

## Context

- Every request to a Buzz relay first looks up which community its `Host`
  belongs to (SPEC §2), and that lookup needs a database connection.
- When the lookup cannot get one in time ("pool timed out"), the relay answers
  exactly as it does for a host it does not know: `404 relay: no community is
  configured for this host`, on the websocket upgrade and on every bridge door.
  Its comment says why: an unauthenticated caller must not be able to probe
  which communities exist. Upstream Buzz answers the same way today.
- That reason covers the unknown host only. A lookup that fails for want of a
  connection fails before the relay knows whether the host exists, so a
  distinct answer for it says nothing about which hosts are hosted.
- A read over the websocket whose historical query fails the same way ends
  today with `EOSE`, which a client reads as "that's everything": an empty
  screen, not an error.
- Upstream Buzz already tells the two failures apart in its database layer:
  `DbError::is_connection_unavailable()` matches a pool timeout, a closed pool
  or socket I/O, and its sweeps stop on it rather than retry each tenant. A
  read the database cancels for running too long already closes with
  `error: query timed out`, and upstream answers other "service is busy" cases
  with `503` and `Retry-After`.
- SPEC says nothing about either answer today.

## Decision

- **A relay that cannot reach its database says it is busy, at every door.**
  A full pool, a closed pool or a lost connection, during the host lookup or a
  read, is "busy, retry shortly": `503` with `Retry-After` when connecting or on
  a bridge request, and `CLOSED "error: relay busy"` on a websocket read, in
  place of `EOSE`. The body is generic and never echoes the host.
- **A read cut off for running too long keeps upstream's answer**,
  `CLOSED "error: query timed out"`, and a client does not repeat it unchanged:
  the same query would be cut off again.
- **A host the relay does not know still gets today's answer, byte for byte**:
  `404 relay: no community is configured for this host`.
- **Any other lookup failure** answers a generic `500`, never the unknown-host
  text.
- **Clients decide on the status code and the `error:` prefix, never on the
  prose.** On "busy" an app keeps what it has and retries with backoff, then
  shows the error it already has; Claude says "the relay is busy, try again in
  a moment", and the same for a `502` from the proxy while the relay restarts.
- The relay logs the real reason, and SPEC §2 states the three answers. The
  change is offered upstream, since it is upstream's shape applied to the door
  upstream still answers with a 404.

Carried out by APP-9 in Buzz (`nfb-demo-kinds`), estiva-agent and
estiva-foundation.

## Rejected alternatives

- **Keep one answer for every failed lookup** (today's behaviour, and
  upstream's). It hides nothing the busy answer would reveal, because the busy
  answer is given before the relay knows whether the host exists, and it costs
  every client the difference between "come back in a moment" and "you are
  pointed at the wrong place". A busy database kept looking like a
  configuration error to Claude and an empty workspace to the apps.
- **Fold the query timeout into "busy".** A query the database cut off is not
  helped by retrying it as it is; a client that retried it would add to the
  load that caused it. Upstream keeps the two apart, and so do we.
- **Say "busy" only in the apps, keep the relay's answers.** The apps cannot
  tell a busy relay from a wrong host on today's wire, so they would have to
  guess from timing or prose, and an outside company's client would guess
  differently.
- **A visible "busy" notice in Leaf, Ship and Peek now.** Moved to the
  project's Later list: a quiet retry that keeps the screen comes first (Miky,
  in the same session).

## Consequences

- A client can retry exactly the failures that a retry fixes, and stop on the
  ones it does not.
- The unknown-host answer stays the only one that names "no community", so the
  conformance test that holds it byte-identical keeps holding.
- `503` on the websocket upgrade and on the bridge becomes part of the wire.
  Undoing it later means every client that learned to retry on it falls back to
  treating a busy relay as broken; no stored events change, so it is cheap to
  undo on the relay and costly only in clients.
- Our fork answers differently from upstream at the host lookup until upstream
  takes the change; the upstream catch-up keeps it.
