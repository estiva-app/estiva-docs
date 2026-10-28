# Removing an agent from a Folder keeps it out, even while the person it works for is in

- Date: 2026-10-27
- Status: Accepted
- Decided by: Miky, in the session landing Ship issue fd9fd483 on 2026-10-27, on the brief "Agents, Folders, deletes"
- Area: Apps & agents

## Who it affects

Katerina is in the Folder Launch and so is her Claude. When Miky removes her
Claude from Launch, it is out: it no longer reads or posts there, although
Katerina still works in Launch. It stays out until someone adds it again.
Removing works the same whether the agent was added to the Folder itself or
reached it only through Katerina.

For an outside company running the protocol, the rule is the plain one:
removed means removed, for an agent as for a person.

## Context

On 27 Oct Miky decided that an agent reaches every Folder its owner is in,
with its owner's role, so Katerina's Claude can work wherever she works. That
rule meets [Someone you remove loses access the moment the removal
lands](someone-you-remove-loses-access-at-once.md) when someone removes an
agent from a Folder its owner is still in, and one of the two has to win. The
question came out of the security review of the relay catch-up and was asked
as a brief with three options.

## Decision

A removal beats inheritance. The relay remembers, per Folder, that an agent
was removed, and an agent removed from a Folder does not reach it through its
owner until someone adds it back. Removing an agent that only reached the
Folder through its owner is accepted and remembered the same way.

It is carried out by the Ship issue
[Our relay runs current upstream Buzz](https://ship.estiva.app/issue/fd9fd483-08f8-4ede-ad4c-790189f4160b).

## Rejected alternatives

- **The relay refuses the removal, with the reason** ("it is here because
  Katerina is"). Honest, but nobody could keep one person's agent out of a
  Folder that person is in; for a sensitive Folder you would choose between
  Katerina and her agent.
- **Accept the removal and let inheritance keep the agent in.** The members
  list would no longer show the agent while it still read and posted: a Remove
  button that does nothing, against the removal record.

## Consequences

- The person who manages a Folder decides who is in it; inheritance is a
  convenience for the owner and never outranks a deliberate removal.
- An agent can be refused in a Folder its owner works in. Apps should say why
  ("removed from this Folder by Miky") rather than leave the owner guessing.
- It is a relay rule, not something stored in events, so it can be changed
  later at the cost of telling apps.
