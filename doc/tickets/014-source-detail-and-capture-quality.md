---
id: 014
status: todo
title: "Build source detail with capture quality"
---

## Problem

Users need to trust what Trace captured. Every saved source should show where its summary and cues came from and how complete the capture was.

## Acceptance

- Tapping a brief card or cluster result opens source detail.
- Source detail shows:
  - title
  - URL/domain
  - capture quality
  - capture method
  - summary
  - recall cues
  - tags
  - screenshot preview when available
  - original link action
- Capture quality labels are understandable to normal users.
- If only metadata or link-only information exists, the detail view clearly says so.
- The ticket is complete only if source trust and transparency would likely score above 90/100 with judges.

## Quantitative Review Criteria

- Build exits 0.
- Detail view opens from Today Brief and Memory Cluster result paths.
- Detail view shows at least 8 source fields or states.
- Every source displays one of the approved capture quality labels.
- Link-only and metadata-only demo cases have distinct explanatory text.
- External link action is visible and opens outside the app context.
- No unsupported claim is shown for screenshot-only or link-only sources.

## Retry Budget and Stop Rule

- Critical demo path: soft-critical.
- Maximum implementation passes: 3.
- Target judge score: 90/100 average.
- Minimum acceptable score: 85/100 only if capture quality is transparent for all source types.
- If still below 85/100 after 3 passes, apply the Demo Fallback before considering `blocked`.
- Do not hide partial or failed capture states to make the demo look cleaner.

## Demo Fallback

- If full detail view is too much, show a compact source detail sheet with title, domain, capture quality, summary, cues, and original link.
- If some capture states lack detail copy, mark `done-with-follow-up` and list them.
- Use `blocked` only if source detail crashes or hides all capture quality information.

## Verification

```bash
npm run build
```

## Constraints

- Do not overstate analysis quality.
- Do not hide failed or partial captures.
- External links should open safely in a new tab/window.

## Hints

- Use labels like `Full text`, `Metadata only`, `Screenshot saved`, `Link only`.
