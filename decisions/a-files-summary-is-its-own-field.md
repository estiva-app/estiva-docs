# A file's summary is its own short field beside the title, not part of its description

- Date: 2026-10-15
- Status: Accepted
- Decided by: Miky, in the shaping session of the project "A short summary on every file", 15 Oct 2026
- Area: Links & widgets

## Who it affects

Miky and Katerina meet files in one line all the time: a card in a message, a
row in Ship's issue list, the `[` link picker, Peek's Desk. Until now a file had
a title and a long description and nothing in between, so those places showed
the title alone or the opening of the description, which is mostly headings and
markup. Reviewing the Widgets 2 prototype on 15 Oct, the detailed card and hover
preview carried a placeholder sentence because no file had a summary, and Miky
asked for one "ASAP". An outside company building on the protocol gets one rule
for how any file reads in one line, in any app.

## Context

- A file's title is a root tag that seeds it and a `kind:1851` change that
  overrides it, with one current value (SPEC §6.1, §6.3). Its text is the
  `description` field, a block document saved whole on every change, up to
  512,000 bytes (§6.10).
- The manifest slot `subtitle` already means a plain-text summary (§7.2), and no
  manifest for issues, projects, topics or documents filled it. Ship's used to
  hold the description's first 120 characters and was removed (PRO-8) because
  it showed raw markup.
- Nostr's long-form articles (NIP-23) and classified listings (NIP-99) carry a
  `summary` tag beside `title`.
- Peek topics (`kind:30840`) have no app manifest, so a rule left to each app
  would still need one in SPEC for them.

## Decision

A summary is its own field on every file, beside the title: a root `summary`
tag seeds it, and a `kind:1851` with `field` `summary` changes it, last write
wins, under the same rules as the title. It is plain text, one or two sentences,
about 240 characters. The author writes it first, and anyone who can edit the
file, Claude included, may write or change it. Apps show it through the
`subtitle` slot. While a file has none, the line is left out. The SPEC section
and the build are carried out by the project "A short summary on every file".

## Rejected alternatives

- **The description's first paragraph is the summary.** It needs nothing new on
  the wire and never drifts from the text. But every list would download each
  file's whole description to draw one line. An outside app would need Estiva's
  block format to read it. And editing the summary would be a description save
  that can overwrite someone else's text.
- **Each app's manifest names the field that is its one-liner.** It's flexible,
  but an outside company gets no single rule, and Peek topics have no app to
  name one.
- **With no summary, show the opening of the description.** This is what Ship
  shipped and removed in PRO-8: it shows headings and markup.

## Consequences

- Lists, pickers and cards stay cheap at any size: one short value per file.
- Readers that do not know the field fold it and ignore it, so older apps show
  no line rather than break.
- A summary can drift from its description; nobody keeps the two in step
  automatically.
- Changing the shape later means rewriting every summary already on the relay.
- A project's record is stored for the whole workspace, so the summary it was
  created with is readable outside its Folder and goes stale there after an
  edit, as its name already does (Miky, same session). Who can read a
  project's record returns as a whole with `folders-are-labels.md`.
