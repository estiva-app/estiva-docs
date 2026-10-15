# A Folder is a group the relay keeps a listing for; every other group is only a conversation space

- Date: 2026-10-02
- Status: Accepted
- Decided by: Miky, in the MAN-3 kickoff session
- Area: Folders

## Who it affects

When Miky or Katerina opens Folder navigation in any app, they see their
Folders and nothing else: not a DM, not the channel behind a Ship project, not
an old Peek topic channel. An outside company's app can tell a Folder from any
other group by one event the relay signs, without knowing anything about
Estiva's apps.

## Context

On the wire a Folder is a NIP-29 group (`kind:9007`). So are DMs, the channel a
Ship project's conversation lives in, and legacy Peek topic channels. Before
MAN-3 nothing said which groups are Folders, and running a Folder command on a
group with no listing emitted a listing naming only that command's file, so
everything else filed there stopped being listed on every surface (peek#192).

## Decision

- A Folder is a NIP-29 group whose relay keeps a listing for it: a
  relay-signed `kind:30890`. A group without one is not a Folder (SPEC §3).
- DMs, record channels and legacy topic channels are conversation spaces. An
  app never draws one in Folder navigation and never runs a Folder operation
  (SPEC §3.3) on one.
- A Folder gets its listing at birth: create is the `kind:9007` followed by an
  empty `kind:1852` add (SPEC §3.3).

## Rejected alternatives

None is on record: the call was made without written alternatives.

## Consequences

- Folder navigation is the same in every app, and a Folder command can no
  longer wipe a group's listing by running where there was none.
- The listing is the relay's: an app never signs a `kind:30890`, so a relay
  that does not keep one cannot host Folders.
- How this relates to who can read a file is open: see the Proposed
  [Who can read a file is decided on the file, and Folders are labels](folders-are-labels.md),
  which this record does not decide.
