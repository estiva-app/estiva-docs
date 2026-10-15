# Another app's file is labelled by its type ("Topic", "Issue"), and the app's name only says where it opens

- Date: 2026-10-02
- Status: Accepted
- Decided by: Miky, on PRO-24
- Area: Links & widgets

## Who it affects

Miky and Katerina see a Peek topic in Ship labelled "Topic", and a Ship issue
in Peek labelled "Issue", on its chip and its row. The app's name appears only
where it tells them where a link goes: "Open in Peek". An outside company's
conversation app names its own files, so a reader shows its word, not ours.

The moment: Ship labelled a Peek topic "File" or "Peek" (PRO-24, 1 Oct). Both
told a person the wrong thing.

## Context

A chip or Related row for another app's object needs one word saying what the
object is. Files that an app owns have a type name in their manifest (a
projection's `noun`). A bare file, `kind:30840`, belongs to no app, so nothing
said what to call it. Hardcoding "topic" in the protocol would have named it
for every app.

## Decision

Miky, 2 Oct: "In general it should be called by the file type name, so in
Peek's case it's Topic."

- A chip or row labelling another app's object shows its type: the owning
  manifest's `noun`, capitalised, falling back to the app's name only when no
  noun is declared.
- A bare file is named by the app that opens it: an optional manifest field
  `fileNoun` next to `aspect` (Peek's is "topic"), read from the same manifest
  interop takes the link from (SPEC §7.8).
- The app name stays where it says where a link goes ("Open in Peek").

## Rejected alternatives

- **Label by the app's name.** It told a person which app, not what the thing
  is.
- **"File" for everything.** True and useless.
- **Hardcode "topic" in the protocol for bare files.** Miky rejected it, so
  another company's conversation app can call these something else.

## Consequences

- Every new surface that labels a foreign object uses its noun, in every app.
- A bare file's word changes with the app that opens it, so two workspaces can
  call the same kind of file differently.
- A manifest without `fileNoun` or `noun` shows the app's name.
