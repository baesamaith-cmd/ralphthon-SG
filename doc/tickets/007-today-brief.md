---
id: 007
status: done
title: "Build Today Brief"
---

## Problem

Users return to LinkTrace to quickly understand what they saved today. The brief should make random links skimmable and searchable without asking users to organize them.

## Acceptance

- Home screen includes a `Today Brief` section.
- The brief shows sources saved today.
- Each brief card includes:
  - title
  - source/domain
  - one-line summary
  - recall cues
  - capture quality badge
- Cards are compact and mobile-readable.
- Empty state invites the user to save or load demo links.
- Brief ordering is stable and easy to skim.
- Brief card layout follows the mobile digest/card decisions from `doc/ux-research.md` if that file exists.
- The ticket is complete only if judges could understand the value of the product from Today Brief alone and likely score clarity above 90/100.

## Quantitative Review Criteria

- Build exits 0.
- Mobile viewport width `390px` has no horizontal scrolling.
- At least 8 demo sources render as brief cards.
- Each card shows title, one-line summary, at least 3 recall cues, and capture quality.
- Default card text fits within 2 visible text rows for summary.
- A user can scan the first 5 cards in under 20 seconds.
- At least 2 UI principles from `doc/ux-research.md` are visible in the brief design.

## Retry Budget and Stop Rule

- Critical demo path: hard-critical.
- Maximum implementation passes: 3.
- Target judge score: 90/100 average.
- Minimum acceptable score: 85/100 only if the brief renders all demo sources and remains mobile-readable.
- If still below 85/100 after 3 passes, apply the Demo Fallback before considering `blocked`.
- Do not replace the brief with chat or a dense report.

## Demo Fallback

- If full card detail is cramped, show title, one-line summary, and two recall cues by default, with the rest in detail view.
- If some metadata is missing, render available demo fields and capture quality badges.
- Use `blocked` only if Today Brief cannot render demo sources.

## Verification

```bash
npm run build
```

## Constraints

- Do not bury recall cues behind a secondary page.
- Do not show dense multi-paragraph summaries in the default brief.
- Do not replace Today Brief with a chat interface.

## Hints

- Use a bottom sheet or detail view for expanded summaries.

## Completion Notes

- Files changed: `src/App.tsx`, `src/styles.css`, `doc/tickets/007-today-brief.md`.
- Checks run: `npm run build`; `rg -n "Today Brief|saved today|todaySources|summary-line|quality-badge|Find later by|Load demo memory|Shared links will appear here|toLocaleTimeString" src/App.tsx src/styles.css`.
- Today Brief now filters to sources saved on the current day, sorts them newest first, shows the saved count, renders compact cards with title, domain/time, one-line/two-row-clamped summary, `Find later by` recall cues, and capture quality badges, and keeps an empty state inviting users to paste a link or load demo memory.
