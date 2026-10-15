# A Folder has no read state of its own: its chat is unread for you only when a message names you

- Date: 2026-10-01
- Status: Accepted
- Decided by: Miky, on CON-19 (2026-10-01; the ruling PEE-45's Decided lines cite)
- Area: Read state

## Who it affects

Miky and Katerina are told about a Folder's own chat (the messages about no
file) only when a message there names them. Being in a Folder does not make
every message in it something they are told about. An outside company's app
judges a Folder's chat by the same rule, so a mention lights in every app and
nothing else does.

## Context

Membership of a file decides whose unread a file's conversation is
([membership replaces following](membership-replaces-following.md)). A Folder
also has a member list, its channel roster, and SPEC §11.8 first said a Folder's
general stream was judged the same way, with the roster as its membership.
That would make every message in a Folder unread for everyone in it. Miky
ruled on 1 Oct that a Folder has no read state and its chat lights only for a
message naming you. The SPEC text that contradicted the ruling was corrected
in estiva-docs#232 (5 Oct).

## Decision

- A Folder's general conversation is not judged by membership: being on the
  Folder's roster does not make its messages unread for you (SPEC §11.8).
- A message there is unread for a person only when its content mentions them
  and it is newer than what they have read.
- There is no read state for a Folder as a whole.

## Rejected alternatives

- **Judge a Folder's chat by its roster**, as files are judged by membership
  (SPEC §11.8 as first written). Miky's ruling went the other way; the reason
  is not on record beyond it.

## Consequences

- A Folder never lights up for chatter that is not about you.
- Whether an app draws any indicator over a whole Folder is the app's choice,
  computed from the files' markers and writing nothing (SPEC §11.3). The
  `folder:` read-state context stays reserved and unspecified (SPEC §11.5).
- Two-way: nothing is written for a Folder's read state, so the rule can change
  without migrating anything.
