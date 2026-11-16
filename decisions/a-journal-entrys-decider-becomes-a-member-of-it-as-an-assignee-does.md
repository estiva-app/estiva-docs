# The person named as a Journal entry's decider becomes a member of the entry, as an assignee becomes a member of an issue, and hears its conversation as any member does

- Date: 2026-11-16
- Status: Accepted
- Decided by: Miky, in the shaping session of 16 November 2026 for the project "Insights, Journal and Risks", asked "A Journal entry says 'Decided by Katerina'. Is she told once only, or does she join the entry and hear about every later comment on it?": "Decision is a file. Basically Katerina become member of that file. It should have similar behavior as if Katerina gets assign to an issue." Lines marked as Claude's are read from the SPEC and the records cited, not his words; his merge of this record accepts them
- Area: Files

> Supersedes in part
> [a-journal-entry-shows-who-decided-and-who-wrote-it-and-the-decider-is-told-once](a-journal-entry-shows-who-decided-and-who-wrote-it-and-the-decider-is-told-once.md):
> its "the person named as the decider is told once, when they are named, the
> way a mention tells them", and its intelligence line, "an agent that writes
> an entry in someone's name reaches them this way … and in no other way".
> Its "Decided by X · written by Y", and "anyone may still accept the entry",
> stand.

## Who it affects

Katerina is named as the decider of how a screen looks; Miky, of most product
and protocol calls. Today Claude writes Decided lines in their names; as
Journal entries each reads "Decided by Katerina · written by Claude". Under
this call Katerina is on that entry as she is on an issue assigned to her:
when someone questions the decision in the entry's conversation, she hears it,
and she can correct a decision put in her name.

For an outside company: naming a decider is placing a person on a file, the
same event and the same rule as assigning an issue, so any app that already
handles assignees handles deciders.

## Context

- A Journal entry is a file of its own type, with a "Decided by" kept apart
  from who wrote it
  ([what-a-project-learns-decides-and-worries-about-are-insights-journal-entries-and-risks](what-a-project-learns-decides-and-worries-about-are-insights-journal-entries-and-risks.md),
  [a-journal-entry-shows-who-decided-and-who-wrote-it-and-the-decider-is-told-once](a-journal-entry-shows-who-decided-and-who-wrote-it-and-the-decider-is-told-once.md)).
- What an assignee gets today (SPEC §11.8, "Membership: whose unread a stream
  is"):
  - **Assigning places her on the file.** A change on the file carrying
    `["p", P]`, whose field is not a membership field and whose value is not
    empty, makes P a member: "an assignee, a lead". A writer that places a
    person MUST add the `p`; a change places a person exactly when its input
    is of type `pubkey` (§7.3).
  - **Membership decides whose unread a file's conversation is, in every
    app**; her unread starts when she joined; she leaves only by her own
    change, and may mute
    ([membership-replaces-following](membership-replaces-following.md)).
  - **Being placed is not unread by itself**: the change is not a message.
    Every later message in the file's conversation is unread for her (SPEC
    §11.8, "What membership changes about unread";
    [a-mention-in-a-files-text-adds-the-person-with-no-unread](a-mention-in-a-files-text-adds-the-person-with-no-unread.md)).
  - On a file a topic lists, the file's other conversations reach a member in
    the Screener or on the Desk; at Important only what names her lights the
    topic
    ([at-important-what-names-you-on-a-listed-file-lights-the-topic](at-important-what-names-you-on-a-listed-file-lights-the-topic.md)).
  - Membership grants no access; she finds every file she was placed on with
    one `#p` read (SPEC §11.8).
  - Anyone may add her back after she left
    ([anyone-may-add-a-person-to-a-file](anyone-may-add-a-person-to-a-file.md)).

## Decision

- *Claude's, the general rule his answer applies (SPEC §11.8):* **a person
  named in a person field of any file becomes a member of that file**, as an
  assignee does on an issue, or a hiring manager on an open position.
- **Naming a person as a Journal entry's decider makes them a member of the
  entry**, as assigning a person to an issue makes them a member of the issue.
- **They hear the entry's conversation as a member does**: every later
  message in it is unread for them, under their own mute and levels, in every
  app.
- *Claude's, read from SPEC §11.8:* **"Decided by" is a person field, and
  either of the two placement triggers makes the decider a member:**
  - named on the entry when it is made: the entry's first record carries
    `["p", <decider>]`, and they join at its `created_at` ("was named on it
    when it was made");
  - named later: a change setting "Decided by" carries `["p", <decider>]`, and
    they join from that change ("was placed on it").

  Nothing before they joined is unread for them.
- *Claude's:* **what they see at the moment of being named is what an
  assignee sees when assigned.** The placement itself makes nothing unread
  (SPEC §11.8); each app shows a file newly placed on a person the way it
  shows a new assignment, and the `#p` read finds it.
- *Claude's:* **naming a decider again after they left places them again**,
  as re-assigning someone does; only they can leave.
- *Claude's:* **an agent that names someone as a decider reaches them this
  way**: as a member of that entry, under their own following and levels.
  Naming them is still the only way intelligence reaches them
  ([intelligence-works-in-the-background-and-reaches-you-only-by-naming-you](intelligence-works-in-the-background-and-reaches-you-only-by-naming-you.md));
  what changes is that being named on an entry puts them on it, not only
  tells them once.

## Rejected alternatives

- **Told once only** (the recommendation he turned down). The decider is told
  once, when named, the way a mention tells them, and does not hear later
  comments. Its reason was that it keeps attention: one notice per entry,
  however much the entry is discussed. Turned down: "Decision is a file", and
  the person it names belongs on it the way an assignee belongs on an issue
  (Miky).
- **A comment that mentions her.** Whoever names her also writes a comment in
  the entry's conversation that mentions her. *Claude's reading of why it
  lost:* it tells her only if someone writes that message; it puts her on the
  entry as a side effect of a comment rather than of the field that names
  her; and an agent naming many deciders would also write as many comments.

## Consequences

- One rule for every person field: an app that handles assignees handles
  deciders, with no new event and no new notice.
- A decider hears every later comment on the entries that name them, so an
  agent writing many entries in Miky's or Katerina's name adds that many
  conversations to their unread. They can mute or leave an entry; how often an
  agent may name someone is still open, with loops.
- *Claude's:* a wrong "Decided by" is still caught by the person it names,
  now through the entry showing among the files placed on them rather than
  through a one-time notice. How an app draws that, on the Desk and in the
  Activity indicator, is shaped with the build.
- The build declares "Decided by" as a person field (§7.3), so every writer
  adds the `p` that places the decider.
