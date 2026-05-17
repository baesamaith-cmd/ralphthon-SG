---
id: 003
status: todo
title: "Store saved sources locally"
---

## Problem

LinkTrace needs to save random links without requiring login. The MVP should use anonymous local browser storage so demo flow is fast and reliable.

## Acceptance

- Define a `SourceItem` model with at least:
  - `id`
  - `url`
  - `title`
  - `domain`
  - `description`
  - `summary`
  - `recallCues`
  - `tags`
  - `captureStatus`
  - `captureMethod`
  - `createdAt`
  - optional `screenshotDataUrl`
- Sources persist in localStorage.
- The user can add a source with a URL and optional note.
- The source list survives page refresh.
- The user can clear demo data.
- Empty state explains that shared links will appear here.
- The ticket should be treated as complete only if the flow would plausibly score above 90/100 for demo reliability.

## Quantitative Review Criteria

- Build exits 0.
- `SourceItem` contains at least 10 fields.
- Saving 3 sources creates 3 persisted records.
- Refreshing the page preserves all saved records.
- Clearing data removes all saved records in one action.
- Saving a source works with no network access.

## Retry Budget and Stop Rule

- Critical demo path: hard-critical.
- Maximum implementation passes: 3.
- Target judge score: 90/100 average.
- Minimum acceptable score: 85/100 only if save, refresh persistence, and clear-data criteria pass.
- If still below 85/100 after 3 passes, apply the Demo Fallback before considering `blocked`.
- Do not introduce server storage or login to improve this ticket.

## Demo Fallback

- If full persistence is unstable, keep demo data and manual source entries in localStorage with a simple replace-all save path.
- If clear-data is imperfect but save/refresh works, mark `done-with-follow-up`.
- Use `blocked` only if sources cannot be saved and restored at all.

## Verification

```bash
npm run build
```

## Constraints

- No server database.
- No login.
- No required network call to save a source.
- Preserve existing app shell behavior.

## Hints

- Use a stable localStorage key such as `linktrace.sources`.
- Generate IDs client-side.
