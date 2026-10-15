# A file's Activity lists only the places that mention it, never the conversations of the files under it

- Date: 2026-09-20
- Status: Accepted
- Decided by: Miky, in PEE-26's conversation
- Area: Messages

## Who it affects

Miky and Katerina open a project in Ship, or a file in Peek, and its Activity
shows where else the file was mentioned: a message in another topic, another
issue's comment. Comments on an issue under that project are read on the
issue's own page, and stay out of the project's Activity and out of its
conversation. An outside company's app that draws Activity lists the same
thing.

## Context

CON-9 built Activity as one surface for a file's related conversations, and as
an experiment it rolled a child's threads up onto its parent: every issue's
comments appeared on the project (the `sub-file` relation). Katerina filed
PEE-26 on 8 Sep about Activity loading in the wrong order and the noise it
brought. On 20 Sep Miky answered there: "the activity should simply remove the
replies from child files. It was experiment, and I don't think it make much
sense."

## Decision

- Activity lists only mentions of the file from elsewhere.
- A child file's comments are read on the child's own page. They are not rolled
  up onto the parent's Activity or into its stream.
- Activity itself stays.

Shipped in Ship by estiva-app/ship#171 (23 Sep, checked by Miky on a project
page on production).

## Rejected alternatives

- **Roll a child's conversation up onto its parent** (CON-9's `sub-file`
  relation). Miky: an experiment that did not make much sense. No further
  reason is on record.

## Consequences

- A project's Activity stays short enough to read, and each conversation has
  one home: the file it is about, as
  [a conversation belongs to the file it is about](a-thread-belongs-to-what-it-is-about.md)
  says for Folders.
- Following a busy project's issues means opening them; nothing summarises
  them on the project.
- Code that still knows the `sub-file` relation is a leftover, not intended
  behaviour. A new Activity surface is built with mentions only.
