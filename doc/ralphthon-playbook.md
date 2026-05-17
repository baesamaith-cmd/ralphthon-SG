# Ralphthon Playbook

This is the operating plan for Ralphthon.

The goal is to use this repository as a project-neutral Ralph loop scaffold that can be rewritten for the actual project tomorrow.

## The Seven-Step Plan

1. Spend 30 minutes writing an Interview document with a human and/or LLM.
2. Read `doc/judge-lenses.md` and use it to pressure-test the idea from the judges' likely perspectives.
3. From the interview, create or rewrite:
   - `doc/product.md`
   - `doc/non-goals.md`
   - `doc/glossary.md`
   - `doc/architecture.md`
4. Generate 10 to 20 tickets in `doc/tickets/`.
5. Make sure every ticket includes:
   - `Acceptance`
   - `Verification`
   - constraints or non-goals where needed
6. Create or update the Ralph loop prompt in `doc/ralph-loop.md`.
7. Run one dry-run ticket only, usually `001`, to prove the loop works.
8. Once the code-touch-ban phase begins, only run the loop. Do not manually edit code.

## Phase 1: Interview

Before writing tickets, create `doc/interview.md`.

Also read `doc/judge-lenses.md` before and during the interview. Use it as a set of perspectives to test the project idea, not as a rigid checklist.

Answer these questions clearly:

- What are we building?
- Who is the primary user?
- What problem does it solve?
- What is the smallest useful version?
- What is explicitly out of scope?
- What are the risky assumptions?
- What must be true for the project to count as done?
- What should the agent never do without an explicit ticket?
- What verification commands can judge the work?

Then pressure-test the answers through the combined judge lens:

- Does this have obvious impact?
- Is there enough technical depth?
- Is the demo legible in three minutes?
- Does it show agent/harness craft?
- Is there a credible distribution or community angle?
- Are trust, safety, and operational risk handled?

Use the interview to remove ambiguity before the loop starts.

## Phase 2: Project Documents

Rewrite the project documents for the real Ralphthon project:

- `doc/product.md`: product goal, user, promise, success criteria.
- `doc/non-goals.md`: what must not be built.
- `doc/glossary.md`: terms that the agent must not confuse.
- `doc/architecture.md`: stack, file layout, conventions, verification commands.

If these files still describe a generic scaffold after the project is chosen, they are not ready.

## Phase 3: Tickets

Create 10 to 20 small tickets.

Good tickets are:

- numbered
- independent where possible
- testable
- small enough for one loop iteration
- explicit about expected output and error behavior

Use this shape:

```md
---
id: 001
status: todo
title: "short imperative title"
---

## Problem

What user pain or missing behavior this solves.

## Acceptance

- Concrete observable behavior.
- Include exact command/output/UI state when possible.
- Include error behavior.

## Verification

```bash
test command here
```

## Constraints

- What not to change.
- Dependencies allowed or forbidden.
- Compatibility requirements.

## Hints

- Optional implementation hints.
```

## Phase 4: Ralph Loop Prompt

`doc/ralph-loop.md` should tell the agent how to operate after the setup phase.

It should include:

- what documents to read first
- how to pick the next ticket
- how to verify work
- when to mark a ticket done
- when to mark a ticket done-with-follow-up
- when to mark a ticket blocked
- how to preserve a demo fallback
- whether to stop after one ticket or continue

## Phase 5: Dry Run

Before the code-touch-ban phase, run exactly one dry-run ticket.

The dry run is successful if:

- the agent can find the right ticket
- the implementation stays inside scope
- verification passes
- the ticket status is updated
- the result is committed

If the dry run fails, fix the documents and tickets, not just the code.

The dry run should also prove that Demo Survival Mode is clear: if a ticket misses aspirational quality criteria but still preserves a demoable fallback, the loop should record follow-up notes and keep moving.

## Phase 6: Code-Touch-Ban Operation

Once the ban starts:

- Humans do not edit code manually.
- Humans may decide whether to continue, stop, or inspect results.
- The agent works only from repository documents, tickets, tests, and command output.
- If the agent misses a quality target but preserves a demoable fallback, it records `done-with-follow-up` and keeps moving.
- If the agent is blocked because build or minimum demo viability fails, it records the blocker in the ticket instead of guessing.

## Recommended Start Prompt For Tomorrow

```text
This repo is a Ralphthon scaffold, not an implementation assignment yet.

First, interview me and create doc/interview.md.
Then read doc/judge-lenses.md and use it as perspective during idea selection.
Then rewrite product, non-goals, glossary, architecture, and tickets for the actual project.
Create 10 to 20 small tickets, each with Acceptance and Verification.
After that, update doc/ralph-loop.md.
Run only ticket 001 as a dry run.
After the dry run, stop and report whether the loop is ready for the code-touch-ban phase.
```
