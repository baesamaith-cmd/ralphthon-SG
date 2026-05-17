---
id: 005
status: todo
title: "Capture URL metadata with graceful fallback"
---

## Problem

Users will share links from messy places. Trace should try to fetch useful metadata, but the app must still work when a link is blocked, private, paywalled, or JavaScript-heavy.

## Acceptance

- Add a capture route or service that accepts a URL.
- The app attempts best-effort metadata extraction:
  - title
  - description
  - image when available
  - domain
- If metadata extraction fails, the source is still saved as `link_only` or `failed`.
- Capture quality is shown on the source card.
- The user sees a helpful fallback message, not a hard error.
- The UI clearly says Trace uses a capture fallback ladder.
- The ticket is complete only if a judge would see blocked links as a handled product case, not a bug, and likely score robustness above 90/100.

## Quantitative Review Criteria

- Build exits 0.
- Capture service returns a structured result for 3 tested URLs.
- At least 4 capture statuses are represented in code or demo states.
- Failed fetch still creates a saved source within 2 seconds of failure handling.
- Every saved source displays a capture quality badge.
- At least 1 blocked/failure case is visible in the demo dataset or manual test path.

## Retry Budget and Stop Rule

- Critical demo path: soft-critical.
- Maximum implementation passes: 3.
- Target judge score: 90/100 average.
- Minimum acceptable score: 80/100 if graceful fallback works even when live fetching is partial.
- If still below 80/100 after 3 passes, apply the Demo Fallback before considering `blocked`.
- Do not make live fetch success mandatory to pass the demo.

## Demo Fallback

- If live URL fetching is unreliable, keep manual paste, domain extraction, demo metadata, and link-only capture.
- If only demo metadata works, mark `done-with-follow-up` and document live-fetch gaps.
- Use `blocked` only if capture failures break source saving or the app build.

## Verification

```bash
npm run build
```

## Constraints

- Do not make URL fetch success mandatory for the app to function.
- Do not store fetched content on a server database.
- Do not block the source save flow while metadata is loading.

## Hints

- Show statuses such as `Full`, `Metadata`, `Screenshot`, `Link only`, and `Failed`.
- Use domain extraction even when title/description are unavailable.
