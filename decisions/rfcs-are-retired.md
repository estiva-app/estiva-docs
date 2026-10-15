# RFCs are no longer a kind of document: what is still true moves into the Specification and a builder's guide

- Date: 2026-10-02
- Status: Accepted
- Decided by: Miky, in the SHA-29 kickoff session, confirmed in the SHA-29 shaping session
- Area: Protocol

## Who it affects

A builder or a grant reviewer reads two documents: a Specification of the
protocol, and a builder's guide to the packages. They never have to read a
series of numbered drafts to find out which parts still hold. An agent
answering a protocol question reads the Specification, not the Specification
plus four RFCs.

## Context

On 2026-10-02 the protocol pre-reviewer had to read the SPEC and four RFCs,
about 340K characters, to answer one ticket, and Miky said "I feel we should
prune this docs to make it better." The SPEC cited the RFCs about 22 times and
linked to RFC pages that are not published, and "RFC 0.2 reconciliation" sat
on the site as a document of its own.

## Decision

- Miky: "there shouldn't be RFC 0.2. RFC is no longer a thing, it should be
  brought right into the docs in a structure that makes sense from a SaaS
  builder who is checking the docs to build his app." RFCs stop being a
  document type: their still-true parts are folded in, and the RFCs stop being
  published or referred to as documents.
- The docs are two documents: a specification and a builder's guide ("probably
  two" in the kickoff, confirmed as two in shaping).
- The work is a restructure of docs.estiva.app as a whole for a SaaS builder,
  not only a prune of the SPEC.

The project "docs.estiva.app 1: the Specification says what runs" carries it
out (DOC-3, DOC-7 and their siblings).

## Rejected alternatives

- **Only prune the SPEC.** Rejected in the kickoff in favour of restructuring
  the docs as a whole for a builder.
- **One document.** The alternative to two; the reason two was chosen is not
  on record beyond "probably two".

## Consequences

- A change to the protocol is a change to the Specification, not a new RFC.
- Until the fold is done, the RFC files and the SPEC's citations of them are
  still in the repository; a later reader treats them as history, not as
  rules.
- Older records and documents that cite an RFC section, such as
  [ADR 0002](0002-foundation-packages.md), keep their citations; the rule they
  cite now lives in the Specification once folded.
