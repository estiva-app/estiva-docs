# When the last source of an Insight, Journal entry or Risk is deleted, the item goes with it unless a person accepted it; an accepted item stays and says it has no source left

- Date: 2026-11-27
- Status: Accepted
- Decided by: Miky, in the agent-memory research session of 27 November 2026 (page "How others give AI agents memory", `decision-briefs/agent-memory-research.html`), answering the inline question "Which rule should the new record give an item whose source is deleted?" with "Accepted ones stay"
- Area: Files

> Supersedes in part
> [an-item-shows-its-source-as-marked-and-the-relay-refuses-one-its-readers-cannot-read](an-item-shows-its-source-as-marked-and-the-relay-refuses-one-its-readers-cannot-read.md):
> its line "If the source is deleted, or that version of a page is deleted,
> the item shows that it was deleted". That still holds while the item has
> other sources left, and for an item a person accepted. An item no person
> accepted now goes with its last source.

## Who it affects

Miky, 27 Nov: a highlight is memory that lives on what it came from, so when
the original goes, the memory should go with it. He also said an item may
come from several sources, and can then be read only by people who can read
all of them, as the relay already checks. With several sources, the item
cannot sit under any one of them. So the question became what deleting one
source, and then the last one, does to the item. He chose that accepted
items stay.

- **A mark nobody confirmed.** A loop marks a message as an Insight. The
  author deletes the message because it was posted by mistake. The Proposed
  Insight goes with it, and no agent keeps reading a memory whose only
  evidence is gone.
- **A decision someone confirmed.** Miky's 8 September Decision, "ditch that
  idea completely", is a Journal entry he accepted. If that message is later
  deleted while tidying a chat, the entry stays, says its source was deleted,
  and its loop proposes marking it Outdated. A person confirms or rejects
  that.

For an outside company and its agents, a source's delete has one meaning in
every app. What a person confirmed is never erased as a side effect, and a
suggestion nobody confirmed does not outlive its evidence.

## Context

- An item has one or more sources, the messages and blocks it came from. One
  typed by hand may have none
  ([what-a-project-learns-decides-and-worries-about-are-insights-journal-entries-and-risks](what-a-project-learns-decides-and-worries-about-are-insights-journal-entries-and-risks.md),
  [every-app-relies-on-an-items-stage-and-core-fields-and-each-company-adds-its-own-on-top](every-app-relies-on-an-items-stage-and-core-fields-and-each-company-adds-its-own-on-top.md)).
- An item is its own file, filed in one team. It points at each source as
  that source read when it was marked, and keeps none of its words. The relay
  refuses an item whose source some of its readers cannot read
  ([an-item-shows-its-source-as-marked-and-the-relay-refuses-one-its-readers-cannot-read](an-item-shows-its-source-as-marked-and-the-relay-refuses-one-its-readers-cannot-read.md)).
- Until now, a deleted source only showed as deleted on the item, and the item
  always stayed (same record).
- A delete only marks a file, and can always be undone
  ([every-file-type-is-kept-in-order-and-a-delete-only-marks-the-file](every-file-type-is-kept-in-order-and-a-delete-only-marks-the-file.md)).
- Marks are AI memory, and a rejected mark that stays listed is noise an
  agent keeps reading. Anyone who can read a highlight can delete it
  ([anyone-can-delete-a-highlight-and-only-activity-keeps-a-trace](anyone-can-delete-a-highlight-and-only-activity-keeps-a-trace.md)).

## Decision

- **An item depends on its sources and is not stored under any of them.** It
  lives in its home, as before.
- **While at least one source is left**, the item stays, and each deleted
  source shows as deleted, as today. The item's loop checks whether the item
  still holds with the sources left. If it does not, the loop proposes a
  change, as every loop change is proposed: who, what and why, with Undo.
- **When its last source is deleted:**
  - an item **no person has accepted** (Proposed or Rejected) is deleted with
    it;
  - an item **a person accepted** (it reached the accepted stage: an
    accepted Insight or Journal entry, an open Risk, and any later status)
    **stays**. It says it has no source left, and its loop proposes marking
    it Outdated, for a person to confirm or reject.
- **The item's delete is a mark like every delete.** Undoing the source's
  delete brings the item back with it.
- **An item typed by hand, with no sources, is not affected.**

**Not decided here:** whether the person who marked an item that went with its
source is told in Activity, as they are when someone deletes a highlight.

## Rejected alternatives

- **Every item goes with its last source.** This is Miky's first idea, for
  every status. Turned down by his answer: tidying a chat would erase a
  decision the team had confirmed.
- **An item lives under one source and goes with it.** This fits an item with
  one source. With several sources, deleting one of three messages would
  delete the whole Insight.
- **Items never go with their sources** (the rule until now). Turned down:
  a Proposed mark whose only source is gone stays listed and stays in the
  brief agents read, which is the noise the highlight-delete record removes.

## Consequences

- On a source's delete, the relay or the app must find the items that name
  it. The relay already looks up each source's team for the readers check.
  The cost of this lookup on Miky's workspace is not measured, and the build's
  kickoff measures it.
- The status a person reached decides what a delete does, so "who accepted"
  now matters for deletes as well as for reading. Each company still sets who
  may accept
  ([who-accepts-an-item-is-each-companys-own-rule-and-the-protocol-carries-its-status](who-accepts-an-item-is-each-companys-own-rule-and-the-protocol-carries-its-status.md)).
- A source deleted because it held a secret (a pasted password) takes a
  Proposed item with it. An accepted item stays, but it keeps none of the
  source's words. If the item's own title or summary repeats the secret, that
  is an edit of the item, made separately.
- Two-way: before many items exist, either rule can be changed. Once items
  have gone with their sources, changing the rule does not bring them back,
  but undoing each source's delete does.
