# The block editor is shared: its translation lives in @estiva-app/protocol and its editor nodes in @estiva-app/ui/editor

- Date: 2026-09-30
- Status: Accepted
- Decided by: Miky, in the MAN-9 ticket session
- Area: Infrastructure

## Who it affects

Miky or Katerina can edit a Ship issue's description from Peek, and a comment
anchored to one of its paragraphs stays on that paragraph. An outside company
writing its own app gets the same editor from two public packages, and its
edits keep block ids the same way Ship's and Peek's do, instead of each app
writing its own and detaching comments.

## Context

A rich description is a block document (SPEC §13.3), and every block carries an
id that comments anchor to (§13.6). Ship's editor kept those ids since RIC-14;
Peek's plain text field could not, so re-saving a description from Peek would
have minted new ids and detached every anchored comment. MAN-9 needed Peek to
edit the same document. The kit that does it lived inside Ship: a translation
between the block document and the editor's document, and four editor nodes.
Ship was the first implementation and Peek the second consumer, which is the
point at which [ADR 0002](0002-foundation-packages.md) §10 says to extract.
RIC-17 had left this kit out of the composer extraction on purpose.

## Decision

Asked where the kit goes, Miky chose:

- the pure translation between the block document and the editor's document
  (`toEditorDocument`, `fromEditorDocument`, `documentForEditing`,
  `publishableFromEditor`, `EDITOR_BLOCK_TYPES`) goes to `@estiva-app/protocol`
  (0.26.0), next to `toRenderTree`;
- the editor nodes (`BlockId`, `UnknownBlock`, `ReferenceNode`,
  `AttachmentNode`, their views injected with `configure({ view })`) go to
  `@estiva-app/ui/editor` (0.47.0). `@estiva-app/ui` still does not depend on
  `@estiva-app/protocol`: `UnknownBlock` draws the text the translation computes;
- Ship imports both and deletes its own copies in MAN-9 itself, not in a
  follow-up.

## Rejected alternatives

None is on record: the call was made without written alternatives.

## Consequences

- Any editor of a block document is built from StarterKit, TableKit and these
  four nodes; an app does not copy the kit. Without TableKit a save drops
  tables.
- A change to how a block document maps into the editor is a protocol package
  release, and a change to how a block is drawn or edited is a ui release; the
  two are versioned apart.
- Later fixes to block ids landed once for every app: when a line is split,
  the original keeps its id and the new half gets a fresh one (ui 0.50.1,
  protocol 0.26.1, MAN-10).
