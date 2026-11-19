# A company picks the AI models its apps and agents use once, from any provider, and a team cannot narrow that choice

- Date: 2026-11-19
- Status: Accepted
- Decided by: Miky, in the session of 19 November 2026 for issue 009bc509, on the brief "Which models read us" ([page](briefs/which-models-read-a-team.html)): "A: one company switch"; model-agnostic as Buzz is, answering the brief "Memory layer, next level", question 3
- Area: Apps & agents

## Who it affects

An admin sets the company's models once: Anthropic's, the company's own model,
or any OpenAI-compatible endpoint. Every app and agent may send any
conversation it can read to any of them. Miky's Peek ⌘K answers with the same
models as Claude.

## Context

- Two rules disagreed: Peek's rule that a work thread never goes to a cloud
  model (a rule in Peek's repository, not a record), and the Estiva plugin,
  which sends whatever its agent can read to Anthropic.
- Miky, 19 Nov: models are flexible and model-agnostic, as Buzz is (an agent
  attaches over ACP; the provider is a setting). Each company hosts
  everything itself.
- An agent reads only the teams it is in
  ([removing-an-agent-from-a-folder-keeps-it-out](removing-an-agent-from-a-folder-keeps-it-out.md),
  [an-agents-owner-ends-its-access-at-once](an-agents-owner-ends-its-access-at-once.md)).
- On the brief "Which models read us" (open call 1 of the page "The
  intelligence layer: where we are going"), Miky picked A, one switch for the
  company, over the brief's recommendation B.

## Decision

- An admin picks the company's models once, from any provider.
- Every app and agent may send any conversation it can read to any of them.
- A team cannot narrow the choice.
- Peek's on-device-only rule retires.

## Rejected alternatives

- **B. The company sets the models and a team can narrow them** (for example
  HR on the company's own model only). Turned down: one switch is simpler,
  and the need has not come up.
- **C. Each person says which models may read their words.** Turned down: a
  thread goes quiet to AI when one cautious person joins it.

## Consequences

- An outside company with one sensitive team must choose for the whole
  company; adding team narrowing later binds only apps built after it.
- Where personal loops run and which models they use in a person's own AI
  tool were left open (19 Nov), to decide when loops are shaped.
