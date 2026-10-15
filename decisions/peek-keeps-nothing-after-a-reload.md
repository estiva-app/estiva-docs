# Peek keeps no copy of what it read once the page reloads

- Date: 2026-10-07
- Status: Superseded by peek-keeps-a-plain-copy-on-the-device-until-sign-out.md
- Decided by: Miky, in the shaping of the project "Optimistic updates & caching for Peek"
- Area: Devices & sessions

## Who it affects

Miky and Katerina in Peek: switching between topics became instant, but after
a reload, or in a new tab, Peek read everything from the relay again before
showing it. Nothing Peek read was kept on the computer.

## Context

Katerina had hit the relay's limit clicking fast between topics, sends took
about 1.35 s to appear, and going back to a topic reloaded it. The project
built one store per person, in memory, that every view draws from. A copy
kept in the browser (IndexedDB) was offered too. Nobody had reported slowness
after a reload.

## Decision

The store lives in memory only. A copy that survives a reload is out of scope.

## Rejected alternatives

- **A copy in the browser that survives a reload.** Not needed: nobody had
  reported a slow reload.
- **Fewer requests and no store at all.** Turned down for one store every view
  draws from.

## Consequences

Every reload and every new tab waited on the relay, about 1.6 s before Desk
showed. When Miky asked on 12 Oct for Peek to open at once, this was reversed by
[Peek keeps a plain copy on the device until sign-out](peek-keeps-a-plain-copy-on-the-device-until-sign-out.md).
