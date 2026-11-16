# An Insight, Journal entry or Risk shows its source as it read when it was marked, and never keeps a copy of it; the relay refuses an item whose source some of its readers cannot read

- Date: 2026-11-16
- Status: Accepted
- Decided by: Miky, in the shaping session of 16 November 2026 for the project "Insights, Journal and Risks", on the brief "What an item keeps" ([page](briefs/what-an-item-keeps-of-its-source.html)): "Yes, pinned + relay", taking the brief's recommendation, option D checked by the relay (R). The title starting filled, with a hint that it is kept, was part of that recommendation and came with it. Lines marked as Claude's are the brief's reading, not his words; his merge of this record accepts them
- Area: Files

> Supersedes in part
> [an-items-readers-are-fixed-when-it-is-made-and-a-move-changes-only-where-it-is-listed](an-items-readers-are-fixed-when-it-is-made-and-a-move-changes-only-where-it-is-listed.md):
> its "not decided here, and not built before it is" line. Whether an item
> copies its source's words is answered (it does not; it points at the
> version that was marked), and an item whose source is read by other people
> than its team gets a rule instead of a wait (the relay accepts it only when
> everyone who reads the item can read the source). Everything else in that
> record stands. It also narrows the marking rule of
> [anyone-who-can-read-a-message-or-block-marks-it-and-anyone-confirms-a-proposed-item](anyone-who-can-read-a-message-or-block-marks-it-and-anyone-confirms-a-proposed-item.md):
> reading a message is still what lets you mark it, but only into a team
> whose readers can all read it, so a direct message cannot be marked today.

## Who it affects

Miky's real example: Katerina's 18 August message in Universal Navigation,
"one search, an All topics switch", marked as an Insight. He marks it; she
later edits the message; later still, private teams exist and her team turns
private. The Insight must say exactly what was marked and accepted, even after
she edits it, and must never be what carries her words to people who could
not read where she wrote them.

The same holds for his own 8 September Decision, "ditch that idea completely":
if he edits that message later, its Journal entry still shows what was
decided, with a line saying it has been edited since.

For an outside company, and for an agent that reads a project's Journal as
its memory, an item is a fixed record of what was marked, read from its
source, like a link to a file at a given commit. Any app gets the same answer
from the relay about which sources an item may name.

## Context

- An item names its sources, the messages and blocks it came from, and has its
  own title, summary and details
  ([what-a-project-learns-decides-and-worries-about-are-insights-journal-entries-and-risks](what-a-project-learns-decides-and-worries-about-are-insights-journal-entries-and-risks.md)).
  It is filed in one team, whose people read it
  ([an-item-is-filed-in-a-team-and-is-about-an-issue-a-project-or-an-initiative](an-item-is-filed-in-a-team-and-is-about-an-issue-a-project-or-an-initiative.md)),
  and its readers are fixed when it is made
  ([an-items-readers-are-fixed-when-it-is-made-and-a-move-changes-only-where-it-is-listed](an-items-readers-are-fixed-when-it-is-made-and-a-move-changes-only-where-it-is-listed.md)).
  That last record left open whether an item copies its source's words, and
  an item whose source has other readers than its team.
- No app offers Mark yet, and SPEC has no item kind yet.
- No team can be private yet (SPEC §3: "until it ships, a team is not offered
  as private"). So today the only source with other readers than a team is a
  direct message, which is its own channel with its own members (SPEC §6.1).
  A person's notes come later.
- A message that shows a block of a page shows it live and must never store
  its words, because a copy goes stale and keeps showing text to someone who
  has since lost access; someone who cannot read it sees "not available to
  you" (SPEC §13.6.1, decided 7 October).
- Nothing is rewritten: an edit to a message is a new event (SPEC §6.8), and
  every save of a page is kept, which is what its History panel opens
  ([a-file-keeps-every-change-for-good](a-file-keeps-every-change-for-good.md)),
  which also has "delete this version".
- The relay already looks up a target's team when it checks an edit, and
  refuses one whose team is not the target's (SPEC §6.8).
- Upstream Nostr highlights (NIP-84, kind:9802) copy the highlighted text into
  the highlight. That suits public notes; on a company relay with private
  places it carries words past their readers.
- Earlier in the same session Miky decided that the project offers Mark only
  where the source's readers are the item's team's readers. *That call is in
  no record yet; it was taken from the session, as the brief says.*

## Decision

**What an item keeps (D): it points at its source as it read when it was
marked, and keeps none of its words.**

- An item shows each source as it read when it was marked. If the source has
  been edited since, a line says "edited since marked", and its current words
  are one tap away ("see it now").
- A block of a Leaf or Ship page shows as it was in the save of the page it
  was marked on.
- Anyone who cannot read the source, or that save of the page, sees "not
  available to you", as for a shown block.
- If the source is deleted, or that version of a page is deleted, the item
  shows that it was deleted.
- An item points, never copies. Copying could still be added later, since
  nothing has been copied.
- *Claude's, the brief's reading, not yet written anywhere:* a message is
  pinned to its newest edit at the time of marking, or to the message itself
  when it was never edited; a block is pinned to the page's text save it was
  marked on.

**The title is the one part that is kept.** When marking, the title starts
filled with a short suggestion from the source's words, which the person
edits, and a hint says plainly that the title is kept in the item. Whatever
the title says is stored in the item under the name of the person who marked
it, and readable by its team for good. (Part of the recommendation Miky took.)

**Who checks it (R): the relay.** The relay refuses an item whose source lives
where not everyone who reads the item can read it.

- Today that means a direct message cannot be marked, by any app.
- The direction matters: a later private team may mark an open team's
  message, never the other way round.
- The check is made when the item is written. An item whose source's team
  turns private later is not checked again; its source then shows "not
  available to you".
- "Readers match" is therefore a protocol rule every app and agent meets, not
  only our apps' promise.

The SPEC work is carried out by the build of the project "Insights, Journal
and Risks".

## Rejected alternatives

- **A · Copy the words into the item** (upstream's way). The simplest thing to
  read, which any Nostr client draws. Turned down: the copy is one-way, since
  every save of a file is kept and the words stay in every item's history for
  good; once her team turns private, everyone in the Insight's team still reads
  them, and undoing that means deleting a version in every item. It
  contradicts the protocol's own "pointer, never copy" rule for a shown block,
  and an agent keeps quoting words their author corrected.
- **B · Show the words live, copy nothing.** Two-way and small to build.
  Turned down: an accepted item's words can change after it was accepted, with
  nothing on the item to say so; Miky's own 8 September Decision would read
  otherwise if he edited that message. A deleted source leaves the item with
  no words.
- **C · Copy only the title, body live.** Turned down: it has both problems
  at once, smaller: the title still repeats the source's words to whoever reads
  the item, and the body still drifts with every edit. (D keeps a title too,
  but its body is fixed to what was marked, and Mark is offered, and accepted
  by the relay, only where the item's readers can all read the source.)
- **The title starts empty and the person writes it.** Nothing of the source
  is copied unless they choose to; one more thing to type each time, and Mark
  stops being as quick as "I will do it for her". Turned down with the
  recommendation: since readers match when marking, a suggested title tells
  nobody anything they could not already read.
- **P · Our apps only check.** Peek, Ship and Leaf never offer Mark where
  readers differ, with no rule on the wire. No build cost, and two-way.
  Turned down: any other client, or an agent, could write an item in a team
  that points at a direct message and repeats its words, and the source would
  then show "not available" while the title showed to the whole team. An
  outside company would have to know and keep our rule. A relay check is
  cheapest now, while no item is on the relay; added later, it cannot touch the
  items already written.

## Consequences

- An item is a fixed record of what was marked and accepted, and copies no
  one's words except its title. A later "copy" option stays possible.
- **SPEC work for the build** (*Claude's, from the brief's "For the record"*):
  - a source names its message (a reference by id, §13.1) or its run of blocks
    (§13.3, as §13.6.1's part), with an optional pin to a version, such as
    `["v", <change id>]`: the page's text save (kind:1851) for a block, the
    message's newest edit (kind:40003) at marking for a message, and none for
    a message never edited;
  - reading an item reads each source and the one version it names, and shows
    "edited since marked" when a newer one exists;
  - a relay refusal with its own reason code, such as `source-readers`, for an
    item whose team has readers the source's channel lacks; the relay looks up
    each source's team, as it does for an edit;
  - a test with a negative control, so a refusal is told apart from the rule
    being missing.
- A direct message cannot be marked by any app until a later decision changes
  the rule. Loosening it is two-way; adding it later would have missed items
  already written, which is why it comes now.
- A list of items costs a read of their sources and of each pinned version.
  Neither that read nor the relay's lookup for an item with several sources
  is measured on Miky's workspace yet; the build's kickoff measures it.
- If a source, or the pinned version of a page, is deleted (as for a pasted
  password), the item shows that it was deleted, and a Decision loses its
  words.
- Private teams and notes still bring their own questions: what happens to
  titles already kept when a team turns private; a person's notes as a source;
  and the questions the readers and team records left for them, such as an
  item in an open team about a private team's work.
