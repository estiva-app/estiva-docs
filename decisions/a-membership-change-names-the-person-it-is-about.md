# Every add, join or leave on a file names the person it is about, so any app finds a file's members with one small read

- Date: 2026-11-10
- Status: Accepted
- Decided by: Miky, in the ALO-19 /land session of 2026-11-10, answering "must every add, join or leave change on a file name the person it's about, so any app can find a file's members cheaply?" (issue ALO-19, its `## Decided` lines)
- Area: Read state

## Who it affects

Miky, Katerina and their Claude sessions, every time Ship, Peek, Leaf or the
agent opens a project, issue or page and shows who is on it: the members come
from one small read instead of every change the file ever had. An outside
company's app finds a file's members the same way, with one standard filter,
and its relay refuses a membership change that would hide from that filter.

It came up in ALO-19, where Ship and Peek stopped reading every change of a
file to work out its members (ship#397, peek#634).

## Context

Checked on production on 10 Nov 2026:

- SPEC §11.8 drew the membership change (`kind:1851` setting `member:<P>` or
  `follow:<P>`) with a trailing `["p", P]`, but never said it MUST be there,
  and the relay did not refuse one without it.
- Every writer of ours adds it: `buildMembershipChange` in
  `@estiva-app/conversation` has since 0.2.0.
- Of 1,993 changes on projects, 22 carry a `p` (16 lead, 6 member). 16
  `member:` changes on projects lack one, all written 1–2 Nov 2026, all on
  QA-1's test projects, none since.
- Folding members from every change and from the `#p` read gave identical
  members on 162 of 168 projects. The 6 that differ are QA-1 test projects,
  where QA-2 was added by a change that does not name them.
- Reading every change costs 3.3 MB on the largest project and grows with
  every save, against
  [opening-a-file-reads-its-current-text-not-its-history](opening-a-file-reads-its-current-text-not-its-history.md).
  The `#p` read costs about 2 KB on the same project.

## Decision

- **A membership change MUST name its person.** A `kind:1851` setting
  `member:<P>` or `follow:<P>` carries `["p", P]`, and the relay refuses one
  without it.
- **Every app finds a file's members with one read:** the file's changes
  naming anyone with an Estiva profile,
  `{"kinds": [1851], "#a": [<file>], "#p": [<every kind:0 key>]}`, plus the
  file's root and its stream, then folds them as §11.8 says. The same in Ship,
  Peek, Leaf and the agent.
- **The 16 early changes without a `p` are rewritten or deleted**, as
  [early-shapes-are-migrated-or-deleted](early-shapes-are-migrated-or-deleted.md)
  says.

SPEC §11.8 carries it out; ship#397 and peek#634 read members this way, and
the relay's refusal is a change to estiva-app/buzz.

## Rejected alternatives

- **No rule; apps read each `member:` field's newest change from the relay's
  field list, plus the `#p` read for past placements.** It catches a change
  that names nobody, but "member since" can drift for someone added again, a
  stray `false` signed by someone else can hide an earlier add, and every app
  and outside company must copy a two-read recipe that differs from SPEC's
  fold.
- **Keep reading every change.** Exact, but 3.3 MB and growing on every open,
  against
  [opening-a-file-reads-its-current-text-not-its-history](opening-a-file-reads-its-current-text-not-its-history.md).

## Consequences

- Opening a file costs the same for its members however long its history,
  and every app finds the same members with the same filter.
- A writer that leaves out the `p` is refused, so a membership change can
  never be invisible to the members read again.
- The rule is one-way once events are on the relay: dropping it later would
  need the slower read back in every app. The early changes are rewritten or
  deleted once, so nothing on production disagrees with it.
- A person without an Estiva profile (`kind:0`) is missed by the members read;
  everyone a company adds has one.
