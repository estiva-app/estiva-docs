# A file keeps every change and every text save for good, and has a History panel that shows them

- Date: 2026-10-26
- Status: Accepted
- Decided by: Miky, in the brief session of 26 October, on the brief "Files, Types, History" ([page](briefs/files-properties-schemas.html)), call 4: "everything, for good"
- Area: Files

## Who it affects

Miky or Katerina opens a file's History and sees every property change as a
list ("Katerina set Stage to Offer") and every text save as a version they can
open. Restore writes a new save under the name of whoever restores it. Nothing
in the list was deleted to keep the file fast.

Today every change is kept, but no app shows a history.

## Context

- The relay keeps each file's current state, so lists read one summary per
  file and never read history
  ([a-files-type-is-a-shared-meaning-any-app-extends](a-files-type-is-a-shared-meaning-any-app-extends.md)).
  Without that summary, a list reads every change, and history would have to be
  cut to keep lists fast.
- Measured on production on 26 October: 2,286 text saves since 7 August,
  33.2 MB.
- On 25 October, before the summary was on the table, Miky chose to keep text
  saves only from switch day.
- Notion keeps history by plan and thins old text versions.

## Decision

- **Everything, for good**: every change and every text save, the 2,286 old
  saves included. It costs only disk.
- **Every file gets a History panel.** Property changes are a list. Text saves
  are versions you can open, and Restore writes a new save under your name. A
  database's schema changes appear in its own history.
- **A text that must truly be gone**, such as a pasted password, is removed
  with "delete this version". Deleting a file is to remove every save, which
  it does not do today (SPEC §6.5).

## Rejected alternatives

- **From switch day** (Miky's 25 October call): each file's newest old text is
  kept and the older ones are deleted, for good. Needed under the options
  without a relay summary to keep lists fast; with it, it only loses history.
- **Thinned**, as in Notion: one text version per 10 minutes of editing, older
  ones thinned. Less to store; some steps are lost.

## Consequences

- History is complete, and reading it never slows a list.
- Disk grows with every save, for good.
- The old saves stay, as history. Whether a file's newest old save is also
  read as its current text until someone saves again is not decided here; it
  is asked when the text moves out
  ([a-files-type-is-a-shared-meaning-any-app-extends](a-files-type-is-a-shared-meaning-any-app-extends.md)).
- The History panel is built later, in stages. "Delete this version" and
  deleting a file need their rules on the wire then, and must reach the
  relay's summary of the file too.
- Two-way: what is kept can still be thinned later, while a save deleted under
  either turned-down option could never come back.
