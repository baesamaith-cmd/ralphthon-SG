# Tickets

This directory contains the LinkTrace Ralphthon ticket queue.

Execute tickets in numbered order unless demo survival requires a small dependency adjustment.

When a ticket passes, commit and push it before moving to the next ticket. When all development tickets are complete, run the final demo gate and open the finished LinkTrace screen in the browser for the user.

## Execution Order

Run tickets in this order:

1. `001-project-decision-docs.md`
2. `001-ui-ux-pattern-research.md`
3. `002-app-shell-mobile-first.md`
4. Then continue by ascending numeric ID from `003` through `017`.

Ticket `001-ui` creates `doc/ux-research.md`. UI tickets after that should follow its `Chosen UI Principles`; if the file is missing before `001-ui` runs, do not block and use the ticket's fallback rules.

Use this shape:

```md
---
id: 001
status: todo
title: "short imperative title"
---

## Problem

What user pain or missing behavior this solves.

## UI/UX Research Dependency

- For UI tickets, check `doc/ux-research.md` first.
- Apply the chosen UI principles unless the ticket explicitly says otherwise.
- If a principle cannot be applied, record the reason in `## Follow-up Notes`.

## Acceptance

- Concrete observable behavior.
- Include exact command, output, UI state, or API response when possible.
- Include error behavior.

## Verification

```bash
test command here
```

## Demo Fallback

- Minimum demoable behavior to preserve if the full feature misses target criteria.
- When fallback works and build passes, mark `done-with-follow-up` instead of `blocked`.

## Retry Budget and Stop Rule

- Critical demo path: hard-critical, soft-critical, or optional.
- Maximum implementation passes: 2 to 4, depending on complexity.
- Target judge score: 90/100 average.
- Use `blocked` only when build or minimum demo viability fails.

## Constraints

- What not to change.
- Dependencies allowed or forbidden.
- Compatibility requirements.

## Hints

- Optional implementation hints.
```
