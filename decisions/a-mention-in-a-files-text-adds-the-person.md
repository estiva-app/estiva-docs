# A mention in a file's text adds the person, as the Add button does, and being added shows one unread

- Date: 2026-10-20
- Status: Accepted
- Decided by: Miky, in the WBD-2 kickoff session (2026-10-20), and his merge of this record
- Supersedes: a-person-mentioned-in-a-files-text-is-told-once.md
- Area: Read state

## Who it affects

When Miky writes `@Katerina` in a Leaf page or a Ship description and saves,
Katerina is added to that file exactly as if he had clicked Add in its
Members: she becomes a member, and the file shows her one unread in Peek, Ship
and Leaf until she opens it. Fixing a typo in that page later tells her
nothing, so if she left she stays out. If someone writes `@Katerina` there
again later, she is added again. Being added with the Add button shows her the
same one unread. An outside company's app that lets people mention someone in
a file's text writes the same Add, and every app counts it.

## Context

- [a-person-mentioned-in-a-files-text-is-told-once](a-person-mentioned-in-a-files-text-is-told-once.md)
  (Accepted 2026-10-19) had every text save tag the people its text names,
  and readers count a save as a mention only when the save before it did not
  name the person.
- Its premise was false. It said text saves "join their membership read
  (`#p`)", but a save that took a name out carries no `p`, so that read never
  returns it. Peek folds membership from that read alone (`foldMemberships`,
  peek `src/nostr/membership.ts`), and SPEC §11.8 promised that "the members a
  fold finds are exactly what the `#p` filter returns". Every reader would have
  to read each such file's whole save history as well: about 1 KB for a
  typical file, and 2 MB for the largest project description on production
  (measured as the agent on 2026-10-20, 90 days, 286 files).
- The kickoff's protocol review found more: six SPEC sections, a new kind of
  unread item, the creation row, readers having to ship before any writer, and
  generic Nostr clients notifying on every typo fix. Asked whether that was
  worth it, Miky chose the shape below.
- Anyone may already add anyone to a file, and every app folds the Add the
  same way
  ([anyone-may-add-a-person-to-a-file](anyone-may-add-a-person-to-a-file.md),
  SPEC §11.8 *The membership change*). The Add carries `["p", P]`, so the
  person's own membership read already finds it. Until now being added showed
  nothing until somebody wrote in the file's conversation.

## Decision

- **Writing a mention into a file's text adds the person.** When a save of a
  file's text names someone by `nostr:npub` whom the version the writer edited
  did not name, the writer also signs the membership change that adds them
  (`member:<P>` = `true`). A creation whose text names someone does the same.
  That is the only event a mention in a file's text writes.
- **A save of a file's text carries no `p` for the people it names.** A typo
  fix is just a text save, so it changes nobody's membership and tells nobody.
- **Being added by someone else shows one unread on the file until the person
  opens it**, whether by a mention or the Add button. Adding yourself (Join)
  does not.
- **Taking a mention out removes nobody.** Only the person leaves (SPEC §11.8).

## Rejected alternatives

- **Every text save tags the people it names, and readers look back at the
  save before** (the superseded record). Correct everywhere, but every reader,
  an outside company's included, needs a second read of each such file's
  history, and membership is no longer one query. About five PRs, readers
  before writers, and a SPEC warning for generic notifiers, for a moment no
  one has hit yet.
- **Each save points to the version it was edited from, and readers compare
  the two.** Cheap reads, but "the save before" becomes "what the writer saw",
  two people editing at once can both count, and the tag is permanent.
- **Readers fold only what the tagged read returns.** Peek and Ship would
  disagree about who is a member, and a leave would come undone in Peek.
- **A mention in a document is a chip that tells no one, for now.** A mention
  would mean less in a page than in a message.
- **Only a mention's Add shows the unread, the button stays silent.** One
  event would carry two meanings, and an outside reader would need a marker to
  tell them apart.

## Consequences

- SPEC follows: §11.8 (a mention written into a file's text is written as an
  Add; being added by someone else is one unread item until the file is
  opened; the sentence that the members a fold finds are exactly what `#p`
  returns stays true), §13.1 (a text save carries no `p` for its mentions),
  and §7.3 (a writer of a prose input writes the Adds).
- A writer compares the mentions in what it saves with the version it loaded.
  That is the one thing it needs, and it is local to the edit: nothing is kept
  between edits. Leaf, Ship, Peek's panel through interop and the agent's
  description writes each use one shared helper for it.
- An outside writer that does not write the Add tells nobody: its mention is
  a chip. No reader ever over-joins anyone.
- The Add button now tells the person once, too.
- Two-way: an Add is the event that already exists, and the unread is a
  reading rule. Undoing it rewrites no event.
