# Only a Folder's owners and admins can rename or archive it, and its name is the relay's channel name

- Date: 2026-10-03
- Status: Accepted
- Decided by: Miky, in the MAN-3 /land session
- Area: Folders

## Who it affects

A Folder Miky or Katerina made keeps its name and stays where they put it: a
member who can write in it cannot rename it or archive it. In every app the
Folder's name is the one its owners and admins set, and the Archive and Rename
controls appear only for them. An outside company's app shows the same name
and the same archived state, by reading two relay-signed events.

## Context

A Folder's name and its listing come from two events. The channel record
(`kind:39000`) is the relay's, and the relay lets only the channel's owners and
admins change its name (`kind:9002`). The listing's command (`kind:1852`) can
be sent by any member, and archive is a `kind:1851` change, which the relay
accepts from anybody. The relay refuses a client-signed `kind:39000` or
`kind:39001` (checked 2026-10-03, MAN-17), so the owners and admins it lists in
its `kind:39001` can be trusted. The security review at MAN-3's /land found
these calls missing from the kickoff, and Miky made them there.

## Decision

- A Folder's title is the `name` of its `kind:39000` and only that. A Folder
  command never carries a name, and a name in the listing is never shown
  (SPEC §3.2, §3.3).
- Archive and restore are for the Folder's owners and admins, the same people
  who may rename it. A reader counts an `archived` change only when it carries
  the Folder's own `h` and its author is an owner or admin on the relay's
  `kind:39001` (SPEC §3.2).

## Rejected alternatives

None is on record: the call was made without written alternatives.

## Consequences

- Rename and archive follow one rule, the relay's roles, so an app needs no
  role list of its own.
- An app that seeds a Folder for a test must also seed a `kind:39001` naming
  its creator, or the Rename and Archive controls stay hidden.
- Who may delete a Folder is a separate, wider rule (SPEC §3.3), not changed
  here.
