# What a project learns, decides and worries about is kept as Insights, Journal entries and Risks, each its own file of a type Estiva shares, and marking a message or a block makes one

- Date: 2026-11-13
- Status: Accepted
- Decided by: Miky, in the brainstorm session of 13 November 2026 and in his comments that day on the Leaf page "Highlights and the intelligence layer": "each item is its own file type"; shared types Estiva curates, like Issue, with companies adding properties and statuses on top; Peek's highlight types fold into the three; statuses "shared start, own end"; the name Journal, not Log; written up as the brief "What a project knows" ([page](briefs/highlights-and-what-a-project-knows.html)), and his merge of this record accepts the fields it lists
- Area: Files

## Who it affects

Miky and Katerina keep a project's knowledge by hand today, in four places that
no app reads as one:

- what Claude learned is a folder of notes on Miky's disk, one lesson each with
  its "Why" line, and Katerina's Claude sees none of it;
- decisions are these records and the Decided lines on issues;
- worries are Warning callouts and each project's Later list;
- the sweep gathers what people reported in Peek and checks the projects by
  hand.

With this call each of those is a file a person or an agent can open, comment
on and share: an **Insight** (what we learned), a **Journal entry** (what we
decided or what happened) and a **Risk** (what needs our oversight). Miky's own
example: "Katerina's message is really great insight, and she is shy to mark
it. I will do it for her." He marks her message in Peek, and an Insight appears
on the project, pointing back at what she wrote.

An outside company's app reads and writes the same three types, as it does an
Issue, and adds its own fields, such as a Severity on a Risk.

## Context

- Peek has five highlight types in its code, Insight, Concern, Conclusion,
  Question and Summary, and no screen offers them (Peek `src/data/topicData.ts`
  `HIGHLIGHT_META`, origin/main, checked 13 Nov).
- [anyone-who-may-comment-resolves-or-reopens-a-thread-and-the-newest-counts](anyone-who-may-comment-resolves-or-reopens-a-thread-and-the-newest-counts.md)
  (Accepted 28 Oct) offers no Highlights "in this stage" and decides their shape
  on the relay "together with what reads them". These three types are what
  reads them. That record stands: this one answers what it left for later.
- A type is a shared meaning any app extends
  ([a-files-type-is-a-shared-meaning-any-app-extends](a-files-type-is-a-shared-meaning-any-app-extends.md)),
  Estiva lists the shared ones in a public directory
  ([estiva-curates-shared-types-in-a-public-directory](estiva-curates-shared-types-in-a-public-directory.md)),
  and every new type starts with one named first record
  ([osnovas-base-types-keep-their-records-and-every-new-type-starts-named](osnovas-base-types-keep-their-records-and-every-new-type-starts-named.md)).
- A type's properties have one schema shape, in an app's listing or in a
  person's database, app types first
  ([an-apps-listing-or-a-persons-database-defines-a-type](an-apps-listing-or-a-persons-database-defines-a-type.md)).
- Each company names its own statuses, and what they mean, the stage, is shared
  ([each-company-defines-its-own-statuses](each-company-defines-its-own-statuses.md),
  [a-companys-statuses-are-its-own-layer-of-a-types-properties](a-companys-statuses-are-its-own-layer-of-a-types-properties.md)).
  The stages SPEC §7.4 has today are one set of four for every type.
- A file's summary is its own field
  ([a-files-summary-is-its-own-field](a-files-summary-is-its-own-field.md)),
  Leaf writes the title, summary and text of any file whose app shares them
  ([a-card-changes-what-a-files-app-shares](a-card-changes-what-a-files-app-shares.md)),
  and a conversation is the same in Peek, Ship and Leaf
  ([a-conversation-is-one-shared-thing-and-only-its-colours-are-the-apps](a-conversation-is-one-shared-thing-and-only-its-colours-are-the-apps.md)).
- RFC 0.5 already said a highlight is addressed at what it came from, the way a
  comment is, and that its kind was still open.

## Decision

- **Three shared types**, curated by Estiva in public like Issue: **Insight**,
  **Journal entry** and **Risk**. Each item is a file of its own.
- **Every item has**: a title, a summary, details (a document Leaf edits like
  any file's text), its **sources** (one or more messages or blocks it came
  from), its **home** (where it lives, the record below), a **status**, and a
  conversation, so questioning a decision means starting a conversation on its
  Journal entry and mentioning whoever made it.
- **A Journal entry** has a kind, **Decision** or **Update**, and a **Decided
  by** kept apart from who wrote the entry. **A Risk** has a kind, **Concern**
  or **Question**.
- **Statuses: a shared start, each type's own end.** These are stages, and each
  company names its own statuses under them, as for any type:

  | Type | Every type starts | Then | Finally |
  | --- | --- | --- | --- |
  | Insight | Proposed, or Rejected | Accepted | Outdated |
  | Journal entry | Proposed, or Rejected | Accepted | Superseded |
  | Risk | Proposed, or Rejected | Open | Resolved |

- **A Risk that is resolved usually leads to** a Journal entry ("we decided X")
  or an Insight ("it turned out Y"), which names it among its sources.
- **Marking makes an item.** Marking a message in Peek or a block in Leaf as a
  highlight creates an Insight, a Journal entry or a Risk whose source is that
  message or block. In Leaf any block can be marked, tables included, and a
  marked block draws with a border; it is not a new kind of block. Peek and
  Leaf may also suggest one while you write, and an agent may suggest one; a
  suggestion is an item at Proposed.
- **Peek's highlight types fold in**: Insight becomes an Insight; Conclusion
  a Journal entry; Concern and Question a Risk of that kind. Summary is
  dropped, because every file has its own summary.
- Companies add their own properties and statuses on top, in the one schema
  shape. The shape on the relay, the SPEC and the directory entries are written
  in the project that builds this.

## Rejected alternatives

- **A mark on the source only**: a highlight is a flag on the message or block,
  with no file of its own. The smallest build, and how upstream Nostr
  highlights work. Turned down: a mark has no title, summary, details, status
  or conversation, so nobody can question a decision, refine an insight or
  close a risk, and one insight drawn from three messages is three marks.
- **Text in the project's description**: the Overview keeps sections for what
  we learned, decided and worry about, as our Progress and Decided lines do
  today. Turned down: no app or agent can list, filter or confirm one entry,
  each edit rewrites the whole description, and what is in Leaf or Peek does
  not reach it.
- **Template databases each company reshapes**: Estiva ships Insight, Journal
  and Risk as starting databases a company copies and changes freely. Turned
  down: two companies' Risks would no longer mean the same thing, so an outside
  app or agent cannot rely on them; people's databases come later, with the
  Notion-like app.
- **One status set for all three types** (Proposed, Accepted, Rejected, Miky's
  first draft). Turned down: an Insight goes out of date, a decision is
  replaced and a risk is resolved, and one set cannot say those apart.
- **Two status fields**, one for triage and one for the item's life. Turned
  down: two fields drift apart, and every app must show and set both.

## Consequences

- A project's knowledge is files every app and agent shares, on the company's
  relay, not a private memory inside one app or one vendor's AI.
- Three new shared types are one-way once items are on the relay: what they
  mean can change only compatibly, and a breaking change is a new type.
- SPEC §7.4's stages stop being one set for every type: each type has its own,
  and these three share Proposed and Rejected.
- Our own habits move: Claude's memory, decision records, Decided lines, Later
  lists and Warning callouts become candidates to be these items, when the
  build is shaped.
- A highlight from a private conversation into a project the whole team reads
  is not decided here; it is brainstormed with private teams and notes.
- Whether a person's own mark starts at Proposed or is already confirmed is
  shaped with the build.
