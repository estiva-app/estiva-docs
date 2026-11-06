# A request kept open hears every new event that asking again would return

- Date: 2026-11-06
- Status: Accepted
- Decided by: Miky, in the TOPI-12 kickoff session (2026-11-06), answering "Live rule" (C, live = stored, as recommended), and his merge of this record
- Area: Protocol

## Who it affects

Miky follows a topic at All in Peek. When Katerina comments on the Leaf page
"Navigation" that the topic lists, the topic lights up within seconds. The app
asks for comments on that page and does not need to know which team the page
is in. A mention of Miky, or a reaction to his message, reaches his apps live
the same way.

An outside company that keeps a request open, for example
`{"kinds":[7]}` for reactions, gets each new event it may read as it is
written. That is the same set it would get by asking again. OriginTrail lost
time to the old rule: such a request heard nothing from inside a team.

## Context

- SPEC §2 says an app asks the relay for a kind without naming a team and
  lets access control decide. §5 says a live request returns the same events
  as a stored read of the same filters, for the same reader.
- Upstream Buzz keeps live requests that name no team away from every event
  filed in a team (`fan_out_scoped`, documented in upstream 756dd7f65 after
  OriginTrail ran into it). A stored read of the same request returns those
  events. A live one stays silent.
- On 6 Nov Miky decided that an app listening for comments on particular
  files asks by the file alone, not by each file's team. The pre-review then
  showed that "by the file" is one case of a wider rule. Three readings were
  put to him:
  - files and comments only;
  - any request that names a value;
  - every request.
- A widened rule has to apply the stored read's own scope at live delivery,
  team by team, not a simpler check that only fitted the narrower rule.

## Decision

- A request kept open hears every new event that a stored read of the same
  request, by the same reader, would return. That covers a request that names
  no team, one that names a file or a person, and one that asks by kind
  alone.
- The relay checks each event against the reader's stored-read scope before
  sending it:
  - the teams the reader can read;
  - narrowed to the teams a scoped sign-in allows;
  - plus the system and unlisted teams the filter names.
  A team someone is removed from stops reaching them at once, as
  [someone-you-remove-loses-access-at-once](someone-you-remove-loses-access-at-once.md)
  requires. This holds on every server of the relay.
- A relay that keeps this rule says so in its NIP-11 `supported_extensions`.
  An app stops naming teams in its live requests only on a relay that says
  so.
- SPEC §5 states the rule and the flag, and the relay fork's NOSTR.md records
  it as a departure from upstream. The relay change is TOPI-12's.

## Rejected alternatives

- **Files and comments only** (a request naming `#A`, `#O`, `#a` or `#e`).
  This is the narrowest reading of the 6 Nov answer. A mention reaches the
  Important dot live only if the app lists every team. An outside company
  must learn which tag letters count. OriginTrail's request by kind would
  stay deaf.
- **Any request that names a value**, with requests by kind or author alone
  still deaf. Miky and Katerina would see the same as with the chosen rule,
  but SPEC would need an exception sentence, and OriginTrail's case would
  stay deaf.
- **Keep upstream's rule**, so that an app names each file's team. Interop
  shipped this as a stopgap in 0.86.0. The list of teams goes stale when a
  topic moves, and every outside app has to rediscover the rule.

## Consequences

- Live and stored reads mean the same thing, so a builder learns one rule.
- Peek's, Ship's and Leaf's live requests that ask by kind alone start
  receiving events from inside teams. Each one is checked when the relay
  change lands, so an app is not flooded by events it meant to filter out.
- The relay does more work for each event filed in a team: it looks up
  requests by kind as well, then makes one access check per match against a
  cached scope. This is measured before the relay change merges.
- It is hard to narrow later. Apps built on "live = stored" would go silent
  without an error.
- The fork departs further from upstream Buzz. The change could be offered
  upstream, since it closes the gap OriginTrail reported.
