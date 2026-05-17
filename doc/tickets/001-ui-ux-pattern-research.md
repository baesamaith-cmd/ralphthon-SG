---
id: 001-ui
status: todo
title: "Research and choose mobile UI/UX patterns"
---

## Problem

Trace needs a mobile demo that feels immediately usable. Before building the interface, the loop should explore proven UI/UX patterns for mobile read-later apps, recall/search surfaces, cue chips, bottom sheets, and zoomable clustered canvases, then apply the best patterns intentionally.

## Acceptance

- Add a short UI/UX research note to `doc/ux-research.md`.
- Research note covers at least these pattern areas:
  - mobile read-later or saved-link inbox
  - daily brief or digest cards
  - recall/search by vague memory
  - cue chips or tag chips
  - bottom sheet detail interaction
  - mobile zoom/pan or clustered map interaction
- For each pattern area, record:
  - observed pattern
  - why it helps Trace
  - risk or reason not to overuse it
  - concrete decision for the MVP
- Add a final `Chosen UI Principles` section with 5 to 8 rules the implementation tickets must follow.
- The chosen principles must include:
  - mobile first
  - short cue labels
  - detail in bottom sheets, not inside the canvas
  - no relationship lines in Memory Clusters
  - touch targets at least 44px
  - demo clarity over visual complexity
- The ticket should be complete only if the UI/UX decisions make the first implementation pass more likely to score above 90/100 for demo clarity.

## Quantitative Review Criteria

- At least 6 pattern areas are reviewed.
- At least 5 chosen UI principles are documented.
- At least 3 concrete implementation decisions are referenced by later tickets.
- Research note is under 1,200 words so future agents can read it quickly.
- No implementation code is changed in this ticket.

## Retry Budget and Stop Rule

- Critical demo path: hard-critical.
- Maximum passes: 2, because this is research/documentation work.
- Target judge score: 90/100 average for UI direction clarity.
- If the research is incomplete after 2 passes, apply the Demo Fallback before considering `blocked`.
- Do not spend more than 30 minutes researching; choose good-enough patterns and move to implementation.

## Demo Fallback

- If live web research is unavailable, use known mobile UX patterns and clearly label them as design assumptions.
- If references are thin, still write `Chosen UI Principles` and mark `done-with-follow-up`.
- Use `blocked` only if no usable mobile UI direction can be chosen.

## Verification

```bash
rg -n "Chosen UI Principles|bottom sheet|cue chips|44px|no relationship lines" doc/ux-research.md
```

## Constraints

- Do not implement UI in this ticket.
- Do not create a landing page concept.
- Do not choose desktop-first graph patterns.

## Hints

- Favor patterns that work with thumbs: chips, cards, bottom sheets, sticky search, and simple pan/zoom controls.
- Treat this as pattern selection for a demo, not an exhaustive design audit.

