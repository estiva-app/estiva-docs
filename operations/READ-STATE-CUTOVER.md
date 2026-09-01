# Read state moves to the relay — the cutover

**CRO-12.** What people are told, what "correct" looks like on the day, and the
way back. The cutover itself is CRO-7 step 2; this is everything around it.

Written 2026-09-01, before the cutover. The dual-run is collecting data.

---

## Why this needs a runbook at all

Unread is the most-noticed thing in the product. Two properties make a quiet
mistake likely and expensive:

**Absence means unread** (SPEC §11.6). A context nobody has a marker for reads as
new. Cut over before the horizon cache is filled and every quiet container lights
up at once — and a person seeing that does not think *"the read-state migration
has a horizon problem"*, they think the app is broken.

**The failure is asymmetric.** Unread that stays unread is annoying and visible,
so somebody reports it. Unread that is wrongly marked **read** is invisible, and
it costs somebody a message. Every judgement call below leans towards the first.

---

## The note to send

Short, and sent **before** the cutover, not after.

> **Unread is about to follow you around.**
>
> Read a conversation in Peek and it stops being unread in Ship, and on your
> other devices. Same the other way. It has been per-app until now, which is why
> the same thing could look unread in one place and read in another.
>
> Two things worth knowing:
>
> - **There is no "mark as unread."** The protocol cannot express it — a read
>   marker only ever moves forward. If you want to come back to something, star
>   it or leave yourself a note.
> - **Reading a thread is not reading the conversation.** Opening one reply
>   thread clears that thread. The conversation stays unread until you have been
>   in it. That is deliberate.
>
> If something looks wrong — particularly anything that shows as **read when you
> have not read it** — say so straight away, and say which app and roughly when.
> That direction is the one we cannot see from here.

The last line is the point of the note. Everything else is context.

---

## Day one

Run these once the cutover lands, in this order. The first is the one the
ordering constraint on CRO-6 exists for.

| # | Check | Correct |
| --- | --- | --- |
| 1 | A container **read a long time ago** and quiet since | stays read — the cache is covering it |
| 2 | A container **never read** | still unread |
| 3 | A busy container with several threads | reading one thread clears that thread only; the container stays unread |
| 4 | Second device, same identity | agrees with the first within ~30s |
| 5 | Read in Ship | clears in Peek without a reload |
| 6 | Read in Peek | clears in Ship without a reload |

Checks 3, 5 and 6 have already passed against production ahead of the cutover
(CRO-9), so a failure there on the day means the cutover changed something rather
than that it was never true.

**Verify 5 and 6 from the relay, not only the UI.** `window.__readState()` in
Ship reports this tab's queue and why a publish did or did not happen; the merged
frontier can be read from either app. A cleared indicator is not proof a marker
moved — three attempts at CRO-9 cleared an indicator for the wrong reason.

---

## Rollback

**The way back is a code revert, with no data migration.** That is worth stating
plainly because it is the thing that makes the cutover safe to attempt:

- Convex `readState` keeps its job as the horizon cache, written from the merged
  relay state on every fetch.
- `useMarkRead` keeps writing Convex directly. That never stopped.
- So the rows the pre-cutover UI reads from are still current at all times.
  Reverting the render source is a deploy, not a restore.

**Do not drop the `readState` table or any of its fields** to tidy up after the
cutover. Removing a field from a Convex validator fails the *entire* push for
every row that still carries it, at deploy time — not at `tsc -b`, not in the
suite. If anything must go: ship a sweep, run it, confirm zero, then remove.

**The window has to be a date, not "for a while."** Proposed: the revert stays
available for **30 days** after the cutover deploys, after which the pre-cutover
render path is deleted and the table is cache-only. Needs a decision — a date
nobody has agreed is the same as no rollback plan.

---

## What proves it worked

Not "nobody complained." A month of silence is also what a subtly-wrong read
state looks like, because its failure direction is invisible.

- The CRO-7 dual-run diff quiet apart from its two benign classes, across a
  multi-day window including a weekend.
- Day-one checks 1–6 above, recorded with their numbers.
- No `local-ahead-persistent` divergences, which would mean a publish is being
  lost, and no regressions, which would mean the merge went backwards.

---

## Known-and-accepted, so nobody re-litigates it

- **No mark-as-unread.** SPEC §11.4 — the merge is a maximum, so a lower value
  cannot be expressed. Not a gap to fill by writing a smaller number.
- **A container quieter than the horizon depends on the cache**, not on the
  protocol. Peek has one (CRO-6); Ship deliberately does not, because `since`
  bounds an event's `created_at` rather than the age of the markers inside it —
  a live slot carries markers of any age, measured at 1022 days.
- **Ship shows unread only inside a conversation feed**, as a divider. No dots in
  lists, and a container with no marker shows nothing — so Ship's history does
  not light up on day one (CRO-13).
