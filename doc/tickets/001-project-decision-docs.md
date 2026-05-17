---
id: 001
status: done
title: "Define LinkTrace product documents"
---

## Problem

The loop needs a clear product definition before implementation. LinkTrace must be framed as a mobile-first link memory for ordinary users, not a generic bookmark app or technical graph demo.

## Acceptance

- `doc/interview.md` is rewritten for LinkTrace.
- `doc/product.md` defines LinkTrace in one sentence: save messy links now, find them later by memory.
- `doc/non-goals.md` explicitly excludes folders-first organization, investment advice, dense desktop graph UI, account systems, and mandatory login.
- `doc/glossary.md` defines `recall cue`, `Today Brief`, `Memory Cluster`, `capture quality`, `fallback ladder`, and `source card`.
- `doc/architecture.md` records the chosen stack, localStorage persistence, mobile-first UI, PWA/share-target direction, and verification commands.
- The documents say the demo target is a mobile viewport.
- The documents say each completed ticket should be judged against the event rubric and should aim for an average judge score above 90/100.

## Quantitative Review Criteria

- At least 5 project documents are rewritten for LinkTrace.
- Each rewritten document contains the word `LinkTrace`.
- At least 6 glossary terms are LinkTrace-specific.
- At least 3 non-goals protect the product from scope creep.
- The expected judge score target is stated as `90/100` or higher.

## Retry Budget and Stop Rule

- Critical demo path: hard-critical.
- Maximum passes: 2, because this ticket is documentation-only.
- Target judge score: 90/100 average.
- Minimum acceptable score: 85/100 if all required documents are complete.
- If still below 85/100 after 2 passes, apply the Demo Fallback before considering `blocked`.
- Do not expand scope into implementation while trying to improve this ticket.

## Demo Fallback

- If some product details remain uncertain, write explicit assumptions in the docs and proceed.
- If a document is weaker than desired but usable, mark the ticket `done-with-follow-up` and add `## Follow-up Notes` with missing decisions.
- Use `blocked` only if the project definition is too unclear to create implementation tickets.

## Verification

```bash
rg -n "LinkTrace|recall cue|Today Brief|Memory Cluster|90/100" doc
```

## Constraints

- Do not write product code in this ticket.
- Do not mention old sample apps or unrelated scaffolding.
- Keep the documents concise enough for a fresh-context agent to read quickly.

## Hints

- Use the judge lenses to phrase LinkTrace as useful to ordinary people while still showing strong agent/harness craft.
- Include the scoring clue: a ticket is not truly complete unless the expected average judge evaluation is above 90/100.

## Completion Notes

- Files changed: `doc/tickets/001-project-decision-docs.md`.
- Checks run: `rg -n "LinkTrace|recall cue|Today Brief|Memory Cluster|90/100" doc`; expanded consistency check for `capture quality`, `fallback ladder`, `source card`, `React + TypeScript + Vite`, `localStorage`, `PWA`, and `npm run build`.
- Product documents already define LinkTrace as a mobile-first link memory app, record React + TypeScript + Vite as the default stack, include localStorage/PWA direction, define the required glossary terms, and preserve the 90/100 judge-score target.
