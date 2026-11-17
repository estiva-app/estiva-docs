# Every app reads an Insight's category, a Risk's severity, a Blocker, who decides a Question with its options, and who a Blocker waits on; each company names the categories and the severity scale

- Date: 2026-11-17
- Status: Accepted
- Decided by: Miky, in the prototype session of 17 November 2026 for the issue "Prototype Insights, Journal and Risks in Ship, Leaf and Peek", asked "Which item fields should every app share, and which stay each company's own?": "Share the fields".
- Area: Files

## Who it affects

Miky, going through a project's Open & Risks in Ship, sees a Blocker
"Waiting on Miky · 5 days" and a Question "Ready for you to decide" with its
options A, B and C. Peek and Leaf show the same item the same way, and so does
an outside company's app reading Osnova: its own tool can say "this waits on
you" or "this blocks us" without knowing Estiva. A company still calls its
insight categories what it likes (Estiva's are Technical, Customer, Product
and Process) and grades severity on its own scale.

It came up on the prototype of the project "Insights, Journal and Risks"
(16–17 November 2026), where every one of these fields was drawn and none was
in the list every app reads.

## Context

- The core fields every app reads and writes are the 13 November list: title,
  summary, details, sources, team, about, status with its stage, the kind of
  entry (Decision or Update; Concern or Question), and a Journal entry's
  decided by. Everything else is a company's or an app's own
  ([every-app-relies-on-an-items-stage-and-core-fields-and-each-company-adds-its-own-on-top](every-app-relies-on-an-items-stage-and-core-fields-and-each-company-adds-its-own-on-top.md)).
  That record names severity as a company's own ("add a Severity to its
  Risks, in its own layer").
- The prototype draws five more: an Insight's category, a Concern's or a
  Question's severity, Blocker as a third kind of Risk, a Question's decider
  and its options, and who a Blocker waits on.
- Moving a field from a company's own to shared, once items carry it on the
  relay, means rewriting those items. Moving it the other way only means apps
  stop reading it.

## Decision

Asked on 17 November 2026 as "Which item fields should every app share, and
which stay each company's own?", with the recommended option "Share the
fields".

- **These join the core fields every app reads and writes:**
  - an Insight's **category**;
  - a Concern's or a Question's **severity**;
  - **Blocker**, as a third kind of Risk beside Concern and Question;
  - a Question's **decider** and its **options** (each option a label and one
    line; which one is leaned to);
  - who a Blocker is **waiting on**.
- **The field is shared; its values are each company's own.** A company
  names its categories and its severity steps, in its own layer, as it names
  its statuses. Every app can group, filter and sort by the field without
  knowing the words; an app shows the company's words.
- Severity sorts: a company's scale is ordered, most severe first, so any app
  can put the worst on top.
- A Blocker has no severity: it is urgent by being a Blocker.

This extends the 16 November record: its list of core fields grows by these,
and its line that severity is a company's own now applies to severity's
values, not to the field. The SPEC section on the three types carries it
when the build writes the kinds.

## Rejected alternatives

- **Keep them each company's own (no change to the core fields).** Outside
  apps would see only Concern and Question, with no decider and no "waiting
  on", so the one thing Risks are for across apps, who has to act, would be
  invisible outside Estiva. Blocker would have had to be a company's own
  status. And making them shared later would mean rewriting every item
  already on the relay.
- **Share the fields and their values** (one category list and one severity
  scale for everyone). Filters would match across companies, but a company
  could not name its own categories, which is the flexibility the 16 November
  record keeps for each company.

## Consequences

- Every app that shows Insights or Risks reads these fields, and an outside
  company gets "who decides" and "who it waits on" for free.
- A company's category list and severity scale need a home in its layer, as
  its statuses have.
- Adding a field later stays cheap; taking one of these out of the shared
  list later is cheap too (apps stop reading it). Turning a value list into a
  shared one later would not be.
