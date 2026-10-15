# A shape left over from early experiments is migrated or deleted, never kept on the relay for compatibility

- Date: 2026-09-15
- Status: Accepted
- Decided by: Miky, on FOL-25 (2026-09-15), and again in the CON-5 session of 2026-09-29, which filed CON-20
- Area: Protocol

## Who it affects

An outside company reading the Specification learns one shape for each thing,
not a current shape plus the history of Estiva's first weeks. Its app reads
topics as files and comments as comments, with no second code path for a
format that existed only while Miky and Katerina were trying things out. Miky
and Katerina lost some early conversation along the way: what could not be
moved was deleted.

## Context

On 2026-09-06, choosing CON-9's model, Miky had already said: "we are in early
stage and we are just having conversation me and Katerina. We should almost
never take into consideration existing content. It's all about setting good
architecture and protocol for the future."

On 2026-09-15 the Folder system had two generations side by side: topics that
were channels, and topics that were files. The ROADMAP had said since
2026-09-11 that there would be no data migration, so the agent described the
two as coexisting. On 2026-09-29, during CON-5, the agent again offered to keep
an old shape: readers would go on reading comment-shaped `kind:9` messages for
good.

## Decision

Miky, 2026-09-15: "we don't want to poison [the protocol] with obsolete stuff
from early experimentation. If it can be easily migrated it should be;
otherwise the content should simply be deleted." The protocol is for the whole
SaaS world and must not carry early-experiment residue.

- Each old object is sorted on its own: migrated, re-posted with a loss (for
  example, as comments marked "originally by X"), or deleted. FOL-25 did this
  for the old topic channels, with Miky sorting them.
- Only what is actually obsolete goes. A project's record channel, where its
  issues live, is the model and stayed; what was obsolete was topics being
  channels.
- On 2026-09-29 Miky asked for the comment-shaped `kind:9` messages to be
  migrated too ("this keeps coming up, a clean plate"). CON-20 republished them
  as `kind:1111`, and SPEC §6.4 now says a comment on an object is a
  `kind:1111`.

## Rejected alternatives

- **No data migration: old and new shapes coexist** (the ROADMAP line of
  2026-09-11). Rejected because it keeps obsolete early-experiment shapes in a
  protocol meant for everyone; the line was struck in estiva-docs#102.
- **Readers keep reading `kind:9` comments for ever** (offered in CON-5).
  Rejected for the same reason: a package that reads both shapes for ever is a
  permanent second code path kept for a week-old experiment.

## Consequences

- A design that leaves an old shape in place to avoid a migration is expected
  to be answered with migrate or delete; the migration and its measured size
  are offered up front.
- Migrations cost real work and lose things: a message cannot be re-signed by
  someone else, so a re-post can lose its author's signature.
- One shape per thing keeps the Specification and the shared packages short.
