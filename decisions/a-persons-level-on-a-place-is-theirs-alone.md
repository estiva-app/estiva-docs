# Your level on a topic or space is a fact kept on the place, and only you can set it: the relay refuses anyone else's, and every app ignores one you did not sign

- Date: 2026-11-02
- Status: Accepted
- Decided by: Miky, in the session shaping "Teams and following" (2026-11-02), on the inline brief "Where a person's level on a place is kept": A, as recommended
- Area: Read state

## Who it affects

Katerina sets #bug to All. Miky opens #bug and sees her there at All, in the
same read that shows who else is on it, and nobody but Katerina can change
that line. If Miky's app, or any other, tried to set her level, the relay
refuses it, and an app reading a partner company's relay that let it through
ignores it anyway.

An outside company reads a person's level the way it already reads who is on
a file, with nothing new to learn.

It came up on 2 Nov while shaping "Teams and following", the Teams stage of
the Initiative "Re-architecting Osnova protocol", from the protocol
pre-review of its draft.

## Context

- [a-team-has-members-and-followers-and-a-place-is-followed-at-a-level](a-team-has-members-and-followers-and-a-place-is-followed-at-a-level.md)
  (Accepted, 30 Oct) says you follow a topic or space at All, at Important or
  not at all, and that who follows it at each level is visible. It does not
  say where the level is kept or who may write it.
- Who is on a file is already kept beside the file, as a `member:<P>` change
  (SPEC §11.8). Anyone may set it to true; only a false signed by P counts,
  and it is the reader, not the relay, that checks it. The relay runs no
  field-specific rule on a change today.
- A shared Folder can live on a partner company's relay too
  ([a-shared-folder-lives-on-both-relays-and-its-host-runs-it](a-shared-folder-lives-on-both-relays-and-its-host-runs-it.md)),
  so a rule only our relay keeps is not part of the protocol.

## Decision

- **Your level is a change beside the place**, as who is on a file is: a
  `kind:1851` with the field `follow:<P>` and the value `all`, `important`,
  or empty for "no choice of mine", placed by the place's id, in its Folder,
  with a `p` naming you so one read finds everything you follow.
- **Only you set it.** The relay refuses a `follow:<P>` not signed by P, and
  every reader ignores one not signed by P, so it holds on any company's
  relay.
- **Not following is never written here.** The field takes no "none":
  turning off a team's default is kept in your own private list, so nobody
  sees that you switched a place off.
- **It places you on nothing.** `follow:<P>` is a membership field (SPEC
  §11.8), so its `p` does not make you a member of the place the way an
  assignee's does.
- Earlier levels stay readable: a change's history is append-only.

SPEC §11.8 carries it, in the project "Teams and following".

## Rejected alternatives

- **Your own small record per place**, replaceable only by you. Only your
  current level would be kept, and author-only would hold on any relay
  without a rule of ours. It is a new kind through every gate, and one more
  read per place for every reader; the record on following already took
  levels as one-way, so hiding the past bought little.
- **One public list per person** of the places they follow. It would show
  that you follow a place in a team the reader cannot open, and it is the
  public form of the private list the record on following turned down.

## Consequences

- A new relay rule and a new reader rule: the first field on a change that
  only one person may write.
- An app reads levels in the read it already makes for who is on a file.
- Once levels are published, they stay on the relay: one-way for the events,
  two-way for the rule.
