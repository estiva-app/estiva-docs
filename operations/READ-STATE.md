# Read state follows the person — what shipped, and what to watch

**CRO-12.** What people are told, what to check, and the way back.

Updated 2026-09-02. **There was no cutover day**, and that is the main thing this
document says differently from its first draft.

---

## What happened, and why there was nothing to switch on

CRO-7 was written expecting two render paths — Convex-native unread, and unread
derived from the merged relay state — with a day when one replaced the other.

That day never came, because CRO-6 did not build a second path. It fed the merge
into the store the UI already read: `applyRelayReadState` writes into
`readState`, and `unread.summary` reads `readState` through `watermarks()`. The
same table. So Peek began rendering merged read state the moment CRO-6 deployed,
with no flag and no switch.

**Do not "finish the cutover" later.** The obvious remaining move — removing the
direct Convex write so the relay is the sole writer — is a regression. It would
cost the instant dot-clears-on-read feedback and gain nothing: the cache is the
union of local writes and the merge, which is what the merged state *is*.

---

## The note to send

Present tense, because it is already true. Send it once; there is no date to
coordinate with.

> **Unread follows you around now.**
>
> Read a conversation in Peek and it stops being unread in Ship, and on your
> other devices. Same the other way. It used to be per-app, which is why the
> same thing could look unread in one place and read in another.
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
> In Ship it shows as a **"new since you last read this"** divider inside a
> conversation, rather than dots in the lists.
>
> If something looks wrong — particularly anything showing as **read when you
> have not read it** — say so, and say which app and roughly when. That
> direction is the one we cannot see from here.

The last line is the point of the note. Everything else is context.

---

## What was actually verified

Against production, not a fixture — CRO-9, and the last row under CRO-13:

| | |
| --- | --- |
| Read in Ship → clears in Peek | ✅ isolated to the `thread:` grain, container provably untouched |
| Read in Peek → clears in Ship | ✅ the divider disappeared without a reload |
| Reading one thread | ✅ clears that thread only; the container stays unread |
| Reading a container | ✅ clears its top-level messages, newer replies stay unread |
| Second browser profile | ✅ converged, and appeared as a distinct slot |
| Monotonicity | ✅ nothing went backwards across repeated runs |
| A container never read | ✅ no divider, and one appears as soon as it has been read |
| Reading one file, in either app | ✅ FOL-16, 2026-09-13: reading an issue in Ship then in Peek moved that issue's address only; a sibling issue (comment from a second identity) stayed `absent` in both, drew its dot in Peek's listing, and the Folder's channel marker did not move |

The FOL-16 row was read with `__readState.marker(<address>)` in both apps,
never by opening the sibling — and the sibling's dot in Peek is drawn under a
project row, so it is only visible once that row is expanded. A `?file=` URL
does not open a child's pane on a fresh load (FOL-17 covers peers only).

One check was **dropped**: no container has a marker older than the 90-day
horizon, so there is nothing to test the aged-out path against. Synthesising one
would be an irreversible write to real read state, and the behaviour is covered
by CRO-6's tests including a control. The premise was also narrower than
believed — see below.

---

## Things that are easy to get wrong later

**The horizon bounds an event's `created_at`, not the age of its markers.** A
live installation republishes its slot on every read, so that slot is fetched and
carries markers of any age — measured at 1022 days. The horizon only drops
installations that have **stopped publishing**. Peek's cache is justified by that
narrower case, not by "a container read three weeks ago reads as unread", which
does not happen.

**Absence means unread** (SPEC §11.6), and Ship deliberately does not honour it:
a container with no marker shows no divider, so Ship's years of history did not
light up. That is a decision, not a bug, and it is the one behaviour here you
cannot see by using the apps normally — everything you have read is read.

To watch it, you need a container whose marker is genuinely absent, which is
rarer than it sounds: **a Peek topic you create yourself will not do**, because
creating it navigates you into it and the dwell fires. Find one with
`__readState.marker('<container-uuid>')` returning `absent`, put a message in
it, and look. Confirmed that way on 2026-09-02 against a Ship project that had
never been opened.

**A slot is what one installation read.** Not the union. Three separate bugs came
from a convenient superset being in scope and getting published — ship#62,
ship#66, peek#103. If a slot's context count looks like "everything this person
has ever read", something is re-absorbing.

**A file's conversation has its own marker, and the channel's does not reach
it** (FOL-16, SPEC §11.1–§11.3). Reading a team's chat in Peek, or a project's
feed in Ship, advances the channel uuid and leaves every topic and issue in that
Folder where it was; reading one topic advances `<its address>` and nothing
else. So the check is `__readState.marker('<kind>:<pubkey>:<d>')` for the file
you read *and* for its sibling — the first moves, the second stays `absent` —
and the sibling's row keeps its dot without anyone opening it. A marker on the
channel uuid moving when only a file was opened is the regression to look for;
it is the one §11.2 was written against, and it was invisible while a channel
held one topic.

---

## The way back

**A code revert, with no data migration.** Convex `readState` is written by
`useMarkRead` on every read and by `applyRelayReadState` on every merge, so its
rows are current at all times. Nothing needs restoring.

**Do not drop the `readState` table or its fields** to tidy up. Removing a field
from a Convex validator fails the *entire* push for every row that still carries
it, at deploy time — not at `tsc -b`, not in the suite. If something must go:
ship a sweep, run it, confirm zero, then remove.

There is no rollback *window* to state, because there was no cutover to roll
back. What would be reverted is CRO-6, and it has been live and verified since
2026-09-01.

---

## How to look at it when something seems wrong

Both apps expose the same diagnostic in the browser console:

```
__readState()                    the queue, the cache, and whether the read path has run
__readState.flush()              publish now instead of waiting on the debounce
__readState.marker('<context>')  one context's merged value, as a date
```

`hasRun: false` means nothing on the read path has executed — that was a real
bug three tickets running. `pending` non-empty with a named `lastAttempt` means a
marker was recorded and has not reached the relay, and the outcome says which
gate stopped it.

**Do not judge this from the UI alone.** A cleared indicator is not proof a
marker moved: opening a topic in Peek to look at one advances the container,
which clears the replies under it. Three attempts at CRO-9 cleared an indicator
for the wrong reason before that was understood.
