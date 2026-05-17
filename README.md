# LinkTrace Ralphthon SG

This repository contains the Ralphthon plan for **LinkTrace**, a mobile-first link memory app for ordinary users.

LinkTrace lets people paste or share messy links from WhatsApp, X/Twitter, Reddit, GitHub, YouTube, news, and blogs, then turns them into summaries, recall cues, searchable memory, and mobile-friendly clusters. The repo is optimized for a demo-first Ralph loop: keep a working demo alive, degrade gracefully when a feature is shaky, and record follow-ups instead of stopping the whole run.

## Team Name

LinkTrace Loop

## Project Description

LinkTrace is a personal link memory for people who save useful links before they have time to read them. It extracts what it can, explains why capture failed when links are blocked or hard to parse, offers manual and screenshot fallbacks, and later helps users rediscover saved information through Today Brief, vague-memory search, and clustered visual summaries.

## Ralphthon Flow - 17 May 2026

Ralphthon is in progress today, **17 May 2026**. Use this flow during the live event:

1. Spend 30 minutes refining `doc/interview.md` with a human and/or LLM if the scope still feels ambiguous.
2. Read `doc/judge-lenses.md` and use it to pressure-test LinkTrace from the judges' likely perspectives.
3. Keep `doc/product.md`, `doc/non-goals.md`, `doc/glossary.md`, and `doc/architecture.md` aligned with the demo goal.
4. Execute the numbered tickets in `doc/tickets/`.
5. Make sure every completed ticket records `Acceptance`, `Verification`, fallback status, and follow-up notes.
6. Keep `doc/ralph-loop.md` as the operating prompt.
7. Run ticket 001 as the dry run only if the setup needs to be revalidated today.
8. During the code-touch-ban phase, only run the loop.

## Start Prompt

Use this in a fresh agent session:

```text
This repo is the LinkTrace Ralphthon workspace.

First, read doc/ralphthon-playbook.md.
Then read doc/judge-lenses.md and use it as perspective during tradeoff decisions.
Then read doc/product.md, doc/non-goals.md, doc/glossary.md, doc/architecture.md, and doc/ralph-loop.md.
Execute the next todo ticket in doc/tickets.
Preserve the demo-first rule: npm run build failures are hard stops, but feature misses should degrade to a documented fallback when possible.
For URL parsing work, test X/Twitter, Reddit, GitHub, YouTube, news, and blog links one by one, classify failure reasons, evaluate useful packages, install only packages that improve capture, and rerun the smoke matrix after each parser/package change.
```

## Key Files

- `doc/product.md`: LinkTrace product definition.
- `doc/architecture.md`: mobile-first demo architecture and verification plan.
- `doc/ralphthon-playbook.md`: the full seven-step operating plan.
- `doc/judge-lenses.md`: public judge research and idea-generation lenses.
- `doc/interview.md`: questions to answer before ticket generation.
- `doc/ralph-loop.md`: the loop prompt used after setup.
- `doc/tickets/`: ticket queue for loop execution.

## Verification

Verification commands must be chosen during the interview and architecture phase. Examples:

```bash
npm test
```

```bash
python3 -m unittest
```

## Requirements

Python 3.11+. Standard library only.

## License

MIT.
