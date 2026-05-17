# Ralphthon Handoff

This repository is prepared for the LinkTrace Ralphthon currently running on **17 May 2026**.

## How To Resume

Use a fresh agent session and say:

```text
This repo is the LinkTrace Ralphthon workspace.

First, read doc/ralphthon-playbook.md.
Then read doc/judge-lenses.md and use it as perspective during tradeoff decisions.
Then read doc/product.md, doc/non-goals.md, doc/glossary.md, doc/architecture.md, and doc/ralph-loop.md.
Execute the next todo ticket in doc/tickets.
Keep the demo alive: if a feature misses quality criteria, preserve a fallback and record follow-up notes instead of blocking, unless build or minimum demo viability fails.
For URL capture work, run platform smoke tests one by one for X/Twitter, Reddit, GitHub, YouTube, news, and blog links, then evaluate parser packages and rerun the matrix when a package changes.
```

Do not begin unrelated implementation outside the ticket queue.

## Current State

- The repository is now aligned around LinkTrace.
- The important artifact for 17 May 2026 is a demo-first Ralph loop that keeps producing a usable result.
- Judge-oriented planning notes live in `doc/judge-lenses.md`.
- Verification commands should include `npm run build` once the app stack exists.

## Why This Structure Exists

The Ralph loop should work even when the agent starts with fresh context. The project therefore stores product intent, non-goals, glossary, architecture, tickets, and loop rules inside the repository.

During Ralphthon on 17 May 2026, those documents can be refined, but the loop should not restart from a blank idea.

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
