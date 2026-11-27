# Memory has two layers: a place's shared memory, which its loops read and the relay holds to that place's readers, and your personal memory, which only your own agent reads; what your agent writes from it is yours to answer for, as your own writing is

- Date: 2026-11-27
- Status: Accepted
- Decided by: Miky, in the agent-memory research session of 27 November 2026, on the brainstorm page "When an agent can read more than the room it writes in" (`decision-briefs/agent-access-brainstorm.html`): "the team memories are maybe not that rich because they are limited with the access, but they are available to all - it's the shared meaning and it could be enforce by relay. Then there is second layer with your personal memories … available just to you", and "the app loops or specific team loops use the shared memories. If you leak some private stuff through agent, it's on you same way as you can leak private information by you simply writing and sharing something that you shouldn't." Lines marked as Claude's are the session's reading, not his words; his merge of this record accepts them
- Area: Apps & agents

## Who it affects

Miky's Claude works across every team he is in, and soon across his private
notes too. When it writes the Friday update in an open team, it may know a
worry from a private team. Something has to decide whether it may use that
worry, and who answers for it if it does.

- **A loop belongs to an app or a team**, such as Ship's loop on a project,
  or an accounting app's loop that watches new rules. It reads only the
  shared memory of the place it looks after. Whatever it writes, the people
  of that place could already read.
- **Your own agent** (your Claude, in any app) reads the shared memory of
  where it works, plus your personal memory. It writes as you do. If it
  carries a private team's words into an open one, that is your leak, as if
  you had typed it.

For an outside company: a relay holds the shared layer by the readers it
already knows, and a loop's reach is the place it looks after. Nothing checks
a person's own agent beyond what the person may do.

## Context

- Your agent reaches every team you are in, with your role, unless it is
  removed from one
  ([removing-an-agent-from-a-folder-keeps-it-out](removing-an-agent-from-a-folder-keeps-it-out.md)).
  A message by your own agent counts as your own for what you are told
  ([an-agents-profile-says-whose-it-is](an-agents-profile-says-whose-it-is.md)).
- An item can be read only by people who can read every one of its sources,
  and the relay refuses any other
  ([an-item-shows-its-source-as-marked-and-the-relay-refuses-one-its-readers-cannot-read](an-item-shows-its-source-as-marked-and-the-relay-refuses-one-its-readers-cannot-read.md)).
  Miky restated it on 27 Nov: a memory made from a company-wide message and a
  top-management message is top-management's alone.
- What agents read as memory is a brief written from the items. Who reads a
  brief was still open
  ([memory-is-a-brief-written-from-the-items-and-the-items-are-its-sources](memory-is-a-brief-written-from-the-items-and-the-items-are-its-sources.md)).
- The brainstorm laid out three ways to keep an agent from carrying words to
  more readers:
  - **the person** answers for it;
  - **the room**: each run works in one place, and the relay limits what it
    reads and where it writes;
  - **the source list**: every agent write lists what it drew on, and the
    relay checks the list.

  Miky combined the first two: the room for loops and shared memory, the
  person for their own agent.

## Decision

- **Memory has two layers.**
  - **Shared memory** belongs to a place: the company, a team, or a project
    or Initiative within it. Its readers are that place's readers, and the
    relay holds it to them by the rule for items.
  - **Personal memory** is yours: your private notes, and what your agent
    learns for you alone. Only you and your own agent read it.
- **A loop of an app or a team reads only the shared memory of the place it
  looks after.** It never reads a person's personal memory, and never reads a
  place its own place's readers cannot all read.
- **Your own agent reads the shared memory of the place it works in, plus
  your personal memory.** What it writes is yours to answer for, as your own
  writing is. Nothing stops it writing in a place with more readers, just as
  nothing stops you.
- **An app may warn you, never stop you.** Before your agent posts, it can
  say that the text may carry something from a place with fewer readers, so
  you can look before it goes. The warning helps the person in charge; it is
  not a protection, and the post goes out when you say so.
- *Claude's reading:* a place's brief is read by that place's readers, and a
  personal brief by you alone. Personal memory points at its sources and
  never copies them, as items do, so leaving a team also takes what your
  personal memory drew from it out of your view.

## Rejected alternatives

- **The room for every agent:** a person's own agent may also write only
  where everyone can read what it read, and drafts for the person to post
  anywhere wider. Turned down: an agent working for you is you, and the same
  responsibility applies to both.
- **The source list:** every agent write lists what it drew on, and the relay
  refuses one whose sources some readers cannot read. Not taken: the relay
  cannot check that the list is honest, and once one private item is in an
  agent's context, everything after it counts as drawing on that item.
- **The person for loops too:** an app's loop reads whatever its installer
  can read. Turned down: a loop that runs on its own has no person present to
  answer for what it writes.

## Consequences

- A loop needs a place, which the relay knows, and a credential that reaches
  only what that place's readers can all read. The build's kickoff checks
  what the relay can limit today.
- Because the owner answers for their agent, the owner must be able to see
  what it was given. Showing the exact context an agent was sent, with what
  came from other people marked as data, comes with it.
- Two-way for loops: their reach can be widened later. For a person's own
  agent, a leak cannot be recalled, and tightening later would change what
  people's agents already do.
