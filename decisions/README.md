# Decisions

Why Estiva is the way it is: one record per decision that was hard to make, so
nobody — Miky, Katerina, a company building on the protocol, or an agent in a
fresh session — has to rediscover it, or rebuild an idea that was already
turned down.

Product calls, protocol calls and engineering calls all live here, in one
folder. Every record opens on the person it affects. This folder is in the
public repository and is not published on docs.estiva.app.

## Statuses

| Status | Means |
| --- | --- |
| Proposed | Written down, not decided. It binds nobody, and nothing is built on it. |
| Accepted | Decided by Miky (or Katerina, for how a screen looks). Build to it. |
| Rejected | Decided against. Kept, so the idea is not proposed again without new facts. |
| Superseded by `<name>.md` | Was Accepted; a newer Accepted record replaces it. |

## When to write one

Write a record only for a decision that is **hard to undo**, would be
**surprising without its context**, and was **a real trade-off** between options
that each had something going for them. Anything else stays a comment at the
code or a Decided line on its issue. When unsure, write it as Proposed: Miky's
accept or reject settles the bar too.

## The rules

- **Names, not numbers.** A record is `decisions/<kebab-case-name>.md`, named
  for what it decides (`relay-is-canonical.md`). 0001 and 0002 keep the names
  they had, because much links to them.
- **A Proposed record binds nobody and is never built.**
- **An agent never accepts its own record.** `Decided by` names the person who
  decided and where they said so: an issue, a session, a PR.
- **Rejected records are kept.**
- **A decided record is never rewritten, only superseded.** Write a new record
  with `- Supersedes: <old>.md`, and change only the old one's Status, to
  `Superseded by <new>.md`. A fix that changes no meaning may be made: a
  typo, a link moved to where the same document now lives, or the metadata
  lines brought to this folder's format.
- **Never describe a security gap that is not fixed yet.** A decision that
  closes one can be recorded now, linking the issue that carries it out and
  saying nothing about how things stand until then. Anything that would
  describe the gap, such as the earlier call the decision replaces, is written
  once the fix has shipped (Miky, 2026-10-15).
- **A brief is published once it is answered.** When a record is decided, the
  brief Miky decided on goes in `briefs/` beside it, as the HTML page it was,
  and the record links it, after the same check for unfixed gaps. A brief still
  waiting on Miky stays out of the repository (Miky, 2026-10-15).

## The template

Copy [`template.md`](template.md). The title is the decision as a sentence.
Then the lines `Date`, `Status`, `Decided by` and `Area`, and five sections in
this order:

1. **Who it affects** — what Miky, Katerina or an outside company see or can do
   because of it, and the real moment it came up in, if there was one.
2. **Context** — what was true and what forced the choice.
3. **Decision** — what we do.
4. **Rejected alternatives** — what was considered and why it was not taken.
5. **Consequences** — what gets easier, harder, or now hard to undo.

CI (`scripts/decisions.test.mjs`) refuses a record with a missing or misordered
section, an unknown Status, a bad Date, no person in `Decided by`, a numbered
name, a link that goes nowhere, or a record superseded by one that is not
Accepted. It also checks that every record is listed below, under its Area.

Code points to its record with a comment, `why:
https://github.com/estiva-app/estiva-docs/blob/main/decisions/<name>.md`. The
app repositories are private, so this CI cannot see them:
`node scripts/decision-pointers.mjs <repo>` checks that every pointer in a
repository names a record on `main` that is Accepted. Run it on the pull
request's repository before merging one that adds or moves a pointer.

# Records by area

An Area is what the call is about, not what kind of call it is: a product call
and a protocol call about Folders both go under Folders. A new area is a new
heading here.

## People

- [Someone you remove loses access the moment the removal lands](someone-you-remove-loses-access-at-once.md) — Accepted, 2026-10-14
- [A person's link carries their key: /person/katerina-npub1…](person-links-carry-the-key.md) — Accepted, 2026-10-14
- [A person's link names their handle: /person/katerina](person-links-name-the-handle.md) — Superseded by the one above, 2026-10-03

## Folders

- [Who can read a file is decided on the file, and Folders are labels](folders-are-labels.md) — Proposed, 2026-10-14; parked until the navigation rework

## Links & widgets

None yet.

## Documents

None yet.

## Devices & sessions

- [Peek keeps a plain copy of what it read on the device, until you sign out](peek-keeps-a-plain-copy-on-the-device-until-sign-out.md) — Accepted, 2026-10-14
- [Peek keeps no copy of what it read once the page reloads](peek-keeps-nothing-after-a-reload.md) — Superseded by the one above, 2026-10-07

## Infrastructure

- [Relay-canonical by default; an app database is an exception](0001-relay-canonical-by-default.md) — Accepted, 2026-08-22
- [Foundation packages: one repo, public npm, built ESM, and a named owner for a break](0002-foundation-packages.md) — Accepted, 2026-08-26

# Research

Spikes and measurements a decision leaned on. They are not records and have no
status.

- [Do `screenerItems` and `deskOpenWork` need an index, or are they a fold?](research/SHR-7-screener-and-desk.md) — SHR-7, 2026-09-16
