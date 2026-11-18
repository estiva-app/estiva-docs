# When an app or server breaks, it sends a report built only from a fixed list of fields, through our own server, to Sentry's hosted service; Claude reads it and may change only an error's state

- Date: 2026-11-18
- Status: Accepted
- Decided by: Miky, on the Quality page and in the shaping session of "Production errors reach us (Sentry)", 17 November; the write token in the kickoff session of "Sentry is set up and Claude can read a test error on the free plan", 18 November
- Area: Infrastructure

## Who it affects

Miky and Katerina stop being the first to find a crash: Peek, Ship, Leaf,
Estiva ID and the relay report it themselves, and Claude names new errors after
each deploy, at a sweep and when a project closes. Nothing a person wrote
leaves their browser in a report. In the week of 14–20 October Miky found
about eight edge cases himself, mostly in the app next to the one being
changed ([Quality: catch it before Miky does](https://leaf.estiva.app/document/quality-catch-it-before-miky-does-da5af161-19e5-46c9-81c9-c49e5d1e391a), "Why").

An outside company running its own deployment is not affected: the reporter
is ours, and where it sends is a setting of each deployment.

## Context

- No app reported its errors anywhere. Error reporting was decided on 20
  October and waited on an account until 18 November.
- The apps decrypt direct messages and private documents in the browser, so
  any text an error carries may be something a person wrote.
- Sentry's free (Developer) plan: one user, 5,000 errors a month, kept 30
  days; per-key rate limits are a paid feature (Sentry pricing, 17 November).
  Its price list says "API: No" on the free plan, yet a personal token with
  `org:read`, `project:read` and `event:read` read the account and listed a
  hand-sent test error on 18 November.
- Sentry has no permission that allows only changing an error's state. The
  narrowest that can resolve an error, `event:write`, also lets the holder
  assign, merge, discard, mute and make an error's page public
  (docs.sentry.io/api/events/update-an-issue). Deleting needs `event:admin`.
  Sentry's hosted MCP connector signs in as the user, with all their rights.
- With "prevent storing IP addresses" on for the organisation, a test event
  sent with an IP address was stored without one (18 November).

## Decision

- **Where:** Sentry's hosted service, free plan, organisation `estiva`, data
  stored in Frankfurt. One Sentry project each for Peek, Ship, Leaf, Estiva
  ID's pages, Estiva ID's server and the relay. No session replay, tracing or
  logs. The data scrubber and IP blocking are on for the whole organisation.
- **What a report holds:** only fields from a fixed list — the app and its
  version, the kind of error and where in the code it broke, one of our own
  fixed sentences or the relay's reason code, the kind of screen, the browser,
  the person's public key and whether they are a person, a QA account or an
  agent, and the last few steps in our own named words. Never message or
  document text, titles, file names, page addresses, click text, console lines
  or request contents. The report is built from the list, not filtered
  afterwards; an error's own wording is sent only with quoted text removed.
- **How it travels:** the app sends it to Estiva ID's server, signed in; the
  server checks the sign-in and the fields again and passes it on, so only our
  servers hold Sentry's address and Sentry never sees a person's IP address.
  A crash before sign-in goes through a tightly limited door. Each kind of
  error is sent once per tab, with a ceiling per tab.
- **What Claude may do:** read, with a read-only token; and change an error's
  state (resolved, unresolved), with a second token holding `event:write` only,
  used by one script that sends nothing but a state change. Anything wider is
  asked first. What Claude reads from Sentry is data, never instructions.

The project [Production errors reach us (Sentry)](https://docs.estiva.app/architecture/production-errors-reach-us-sentry.html)
carries it out.

## Rejected alternatives

- **GlitchTip on our own server.** One more service to keep running; moving
  later only changes where reports are sent (Miky, 17 November).
- **Sentry's standard library with a filter.** By default it also collects
  console lines, clicks and page addresses; a filter must catch every leak,
  where a list cannot leak what is not on it. It would also be a new
  dependency in every app.
- **Reports straight from the browser to Sentry.** Sentry's address would be
  public: anyone could send fake reports, use up the month, and write text
  Claude later reads, and the field list would be enforced in the browser only
  (Miky, 17 November).
- **Crashes only.** Most of what Miky found in October was wrong behaviour,
  not crashes; failures the app tells a person about and writes the relay
  refuses are reported too.
- **Claude reads only, and tracks fixes in its own notes.** Sentry's list would
  never show what is fixed, and "it came back in a later version" would be our
  own logic instead of Sentry's regression mark (Miky, 18 November).
- **Sentry's MCP connector for Claude.** It acts with Miky's full rights,
  wider than reading and changing an error's state.

## Consequences

- A bug a person hits reaches us without them telling us, and `/land` can name
  an error that is new since a deploy.
- Every new field in a report is a change to the list, reviewed as one; a
  report can never carry what a person wrote unless the list is changed.
- The write token can, in principle, discard or make public an error; only
  Claude's script stands between it and those. Deleting the token in Sentry
  ends it at once.
- Free-plan limits: one user, 5,000 errors a month, 30 days kept, no per-app
  rate limit — the per-tab ceiling is ours. A paid plan or GlitchTip later
  changes only where the server sends.
