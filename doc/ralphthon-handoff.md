# Ralphthon Handoff

This repository is prepared for tomorrow's Ralphthon.

## How To Resume

Use a fresh agent session and say:

```text
This repo is a Ralphthon scaffold, not an implementation assignment yet.

First, read doc/ralphthon-playbook.md.
Then read doc/judge-lenses.md and use it as perspective during idea selection.
Then interview me and create doc/interview.md.
Then rewrite product, non-goals, glossary, architecture, and tickets for the actual project.
Create 10 to 20 small tickets, each with Acceptance and Verification.
After that, update doc/ralph-loop.md.
Run only ticket 001 as a dry run.
After the dry run, stop and report whether the loop is ready for the code-touch-ban phase.
```

Do not begin implementation until the actual Ralphthon project has been clarified and ticketed.

## Current State

- The repository is intentionally project-neutral.
- The important artifact for tomorrow is the Ralphthon workflow.
- Judge-oriented planning notes live in `doc/judge-lenses.md`.
- Verification commands must be chosen after the actual stack is selected.

## Why This Structure Exists

The Ralph loop should work even when the agent starts with fresh context. The project therefore stores product intent, non-goals, glossary, architecture, tickets, and loop rules inside the repository.

Tomorrow, those documents should be rewritten for the real project before the loop starts.

## Ralphthon Plan

1. Spend 30 minutes writing an Interview document with a human and/or LLM.
2. Read `doc/judge-lenses.md` and use it to pressure-test the idea.
3. Create or rewrite `product.md`, `non-goals.md`, `glossary.md`, and `architecture.md`.
4. Generate 10 to 20 tickets.
5. Put `Acceptance` and `Verification` in every ticket.
6. Create or update the Ralph loop prompt.
7. Run a dry run with ticket 001 only.
8. During the code-touch-ban phase, only run the loop.

## Ouroboros Decision

We discussed Ouroboros as a stronger, spec-first version of the Ralph loop. The practical recommendation for this repo is:

- Do not depend on a new tool the night before Ralphthon unless it has already been tested.
- Borrow the useful Ouroboros ideas: interview, seed spec, evaluation, convergence.
- Keep the actual workflow simple: documents, tickets, tests, commits.

## Clarification Methods Borrowed For The Loop

- Socratic questioning: define what the project is and is not.
- Aristotle's four causes: clarify purpose, final shape, materials, and mechanism.
- Aquinas-style distinctions: separate similar terms such as `done`, `stopped`, and `logged`.
- Buddhist right view: identify assumptions before they become bugs.
- Ignatian discernment: prefer core, stabilizing features over impressive distractions.

## Pre-Loop Checklist

- `doc/interview.md` has been rewritten for the actual project.
- `doc/judge-lenses.md` has been read during idea selection.
- Product goal is documented.
- Non-goals are documented.
- Terms are defined in the glossary.
- Architecture and verification command are documented.
- Tickets are small, numbered, and verifiable.
- The loop prompt lives in `doc/ralph-loop.md`.
- Ticket 001 has passed as a dry run.
