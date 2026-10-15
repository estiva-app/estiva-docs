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
- **Never describe a security gap that is not fixed yet.** Link its issue, and
  write the record once the fix has shipped.

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

# Records by area

An Area is what the call is about, not what kind of call it is: a product call
and a protocol call about Folders both go under Folders. A new area is a new
heading here.

## People

None yet.

## Folders

None yet.

## Links & widgets

None yet.

## Documents

None yet.

## Infrastructure

- [Relay-canonical by default; an app database is an exception](0001-relay-canonical-by-default.md) — Accepted, 2026-08-22
- [Foundation packages: one repo, public npm, built ESM, and a named owner for a break](0002-foundation-packages.md) — Accepted, 2026-08-26

# Research

Spikes and measurements a decision leaned on. They are not records and have no
status.

- [Do `screenerItems` and `deskOpenWork` need an index, or are they a fold?](research/SHR-7-screener-and-desk.md) — SHR-7, 2026-09-16
