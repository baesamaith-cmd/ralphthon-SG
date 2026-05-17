---
id: 008
status: done
title: "Search saved links by memory"
---

## Problem

Users often remember a clue, not an exact title or URL. LinkTrace should help them find saved summaries from vague phrases.

## Acceptance

- Search field placeholder says `Search by what you remember...`.
- Search matches against:
  - title
  - summary
  - recall cues
  - tags
  - domain
- Results show top matching sources.
- Each result explains `Why this matched` using matched cues or text.
- Search works with demo data without network access.
- Tapping a result opens source detail.
- The ticket is complete only if a judge can successfully find a demo item from a vague memory and would likely score utility above 90/100.

## Quantitative Review Criteria

- Build exits 0.
- Search returns results in under 300ms for the demo dataset.
- At least 5 predefined vague-memory queries are documented or encoded in demo fixtures.
- At least 4 of those 5 queries return the intended source in the top 3 results.
- Every search result shows at least 1 matched cue or matched text reason.
- Search works with no network access.

## Retry Budget and Stop Rule

- Critical demo path: hard-critical.
- Maximum implementation passes: 3.
- Target judge score: 90/100 average.
- Minimum acceptable score: 85/100 only if at least 4 of 5 vague-memory queries pass.
- If still below 85/100 after 3 passes, apply the Demo Fallback before considering `blocked`.
- Do not add heavyweight search infrastructure unless the simple cue-based search cannot meet the criteria.

## Demo Fallback

- If 4 of 5 vague queries cannot pass, keep at least 3 curated demo queries that reliably find useful sources.
- If ranking is imperfect, show matched cues and mark `done-with-follow-up`.
- Use `blocked` only if search cannot return any demo results.

## Verification

```bash
npm run build
```

## Constraints

- Do not require vector search for MVP.
- Do not hide why a result matched.
- Keep search responsive on mobile.

## Hints

- Simple weighted keyword matching is acceptable if recall cues are good.

## Completion Notes

- Files changed: `src/App.tsx`, `src/styles.css`, `doc/search-fixtures.md`, `doc/tickets/008-memory-search.md`.
- Checks run: `npm run build`; `rg -n "Search by what you remember|searchSources|Why this matched|Source Detail|agent memory|watch later|sleep timing|career growth|login gated|title|summary|recallCues|tags|domain" src/App.tsx doc/search-fixtures.md`.
- Added responsive cue-weighted memory search over title, summary, recall cues, tags, and domain. Results show `Why this matched`, stay local/offline for demo data, and open a source detail panel when tapped. Documented five vague-memory search fixtures covering agent memory, watch-later video, sleep timing, career growth, and login-gated social fallback.
