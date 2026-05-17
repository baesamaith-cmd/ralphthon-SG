---
id: 006
status: done
title: "Generate summaries and recall cues"
---

## Problem

LinkTrace's core value is turning random saved links into cues the user can remember later. Every source should get a short summary and `Find later by` cues.

## Acceptance

- Each source can display a one-line summary.
- Each source displays `Find later by` recall cues.
- Recall cues are short phrases a normal user might type later, not only technical tags.
- The app can generate cues from:
  - title
  - description
  - pasted note
  - demo source content
- If AI/API generation is unavailable, rule-based fallback still produces cues from title/description/domain.
- Today Brief shows summary plus recall cues for each source.
- The ticket is complete only if the recall cues feel natural enough that a judge would likely score usefulness above 90/100.

## Quantitative Review Criteria

- Build exits 0.
- Every source has a one-line summary of no more than 160 characters.
- Every source has between 3 and 5 recall cues.
- Each recall cue is 1 to 5 words.
- At least 5 demo cues sound like vague human memory, not formal categories.
- Cue fallback works when only title/domain are available.

## Retry Budget and Stop Rule

- Critical demo path: hard-critical.
- Maximum implementation passes: 3.
- Target judge score: 90/100 average.
- Minimum acceptable score: 85/100 only if every demo source has summary and cues.
- If still below 85/100 after 3 passes, apply the Demo Fallback before considering `blocked`.
- Do not require a network AI API for demo-critical cue generation.

## Demo Fallback

- If AI/API cue generation fails, use deterministic cues from title, domain, description, and demo fixture fields.
- If cue quality is below target but every demo source has usable cues, mark `done-with-follow-up`.
- Use `blocked` only if demo sources cannot display summaries and cues.

## Verification

```bash
npm run build
```

## Constraints

- Do not require AI API availability for the demo to work.
- Do not show long paragraphs in the mobile list view.
- Do not call recall cues only `tags` in user-facing UI.

## Hints

- Good cues sound like vague memory: `that grant thing`, `agent memory`, `sleep timing`, `LinkedIn hiring post`.

## Completion Notes

- Files changed: `src/capture.ts`, `src/App.tsx`, `src/styles.css`, `doc/tickets/006-recall-cue-generation.md`.
- Checks run: `npm run build`; summary-length check with `node -e`; cue-count and cue-length check with `node -e`; `rg -n "Find later by|clampSummary|STOP_WORDS|fallbackCues|sleep timing|career growth|agent memory|watch later|recallCues" src/App.tsx src/capture.ts`.
- Added deterministic rule-based summary clamping and recall cue generation from title, description, pasted note, and domain. Every fallback source gets 3 to 5 short human-memory cues, and Today Brief now labels cues as `Find later by` instead of presenting them as tags.
