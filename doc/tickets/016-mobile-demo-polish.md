---
id: 016
status: todo
title: "Polish mobile demo flow"
---

## Problem

The final evaluation depends on a reliable, legible demo. The app should guide judges through the story without needing explanation.

## Acceptance

- The demo can be completed in under three minutes on a mobile viewport.
- The happy path is:
  1. Load demo memory or share/paste a link.
  2. See Today Brief with summaries and recall cues.
  3. Search by a vague memory and find a saved source.
  4. Open Memory Clusters.
  5. Pinch/zoom or use controls.
  6. Tap a cue node and see related summaries.
  7. Show capture quality/fallback handling.
- Add helpful empty, loading, and error states.
- Add concise demo copy only where it helps users act.
- No text overlaps or cramped controls on mobile.
- Final polish checks the implemented UI against `doc/ux-research.md`.
- The ticket is complete only if a self-review against the judge lenses estimates an average score above 90/100.

## Quantitative Review Criteria

- Build exits 0.
- Full happy-path demo can be completed in under 3 minutes.
- Load demo memory reaches a meaningful state in under 5 seconds.
- Mobile viewport width `390px` has no horizontal scrolling.
- At least 7 happy-path steps are demonstrable from visible UI.
- All key controls are at least 44px.
- Self-score averages at least 90/100 across the judge criteria.
- At least 5 chosen UI principles from `doc/ux-research.md` are satisfied or explicitly waived in `## Follow-up Notes`.

## Retry Budget and Stop Rule

- Critical demo path: hard-critical.
- Maximum implementation passes: 4, because final demo polish can need one extra iteration.
- Target judge score: 90/100 average.
- Minimum demo viability: build passes and the 3-minute happy path works.
- If still below 90/100 after 4 passes, apply the Demo Fallback and mark `done-with-follow-up` unless minimum demo viability fails.
- Do not add new core features during polish; cut or simplify unstable pieces instead.

## Demo Fallback

- Cut or simplify unstable non-core features before judging.
- If a high-score add-on is unreliable, hide it from the primary demo path and document it in `## Follow-up Notes`.
- Use `blocked` only if the build fails or the 3-minute happy path cannot be completed.

## Verification

```bash
npm run build
```

## Constraints

- Do not add new core features in this ticket.
- Do not turn the app into a landing page.
- Keep interactions touch-friendly.

## Hints

- Test with a narrow mobile viewport.
- Prefer fewer, more reliable controls over extra cleverness.
