---
id: 002
status: todo
title: "Build mobile-first Trace app shell"
---

## Problem

The demo needs a polished mobile-first surface before features are added. Users should immediately understand that Trace saves random links and helps find them later from memory.

## Acceptance

- The app opens directly to the Trace workspace, not a landing page.
- The default viewport is designed for mobile first.
- The home screen includes:
  - app name `Trace`
  - tagline `Save messy links. Find them by memory.`
  - primary search field with placeholder `Search by what you remember...`
  - sections for `Today's Cues`, `Today Brief`, and `Memory Clusters`
- Touch targets for major controls are at least 44px.
- The UI uses restrained, legible styling and avoids dense text.
- A visible note says data is stored locally in this browser for the demo.
- The shell applies the `Chosen UI Principles` from `doc/ux-research.md` if that file exists.
- The ticket should be considered complete only if a judge seeing the first screen would likely score demo clarity and product polish above 90/100 on average.

## Quantitative Review Criteria

- Build exits 0.
- Mobile viewport width `390px` has no horizontal scrolling.
- At least 4 primary touch targets are `44px` or larger.
- First screen includes exactly the 3 core sections: `Today's Cues`, `Today Brief`, and `Memory Clusters`.
- First screen can be understood in under 10 seconds by reading visible UI text.
- At least 3 choices from `doc/ux-research.md` are reflected in the shell UI.

## Retry Budget and Stop Rule

- Critical demo path: hard-critical.
- Maximum implementation passes: 3.
- Target judge score: 90/100 average.
- Minimum acceptable score: 85/100 only if build, mobile viewport, and touch target criteria pass.
- If still below 85/100 after 3 passes, apply the Demo Fallback before considering `blocked`.
- Do not add non-shell features to chase the score.

## Demo Fallback

- Keep a static mobile app shell with placeholder cards for Today's Cues, Today Brief, and Memory Clusters.
- If polish is below target, mark `done-with-follow-up` and list visual issues in `## Follow-up Notes`.
- Use `blocked` only if the app cannot build or the first screen cannot render.

## Verification

```bash
npm run build
```

## Constraints

- Do not implement URL fetching yet.
- Do not implement account/login flows.
- Do not create a marketing landing page.
- Keep the first screen usable on a mobile viewport.

## Hints

- If the stack is not initialized yet, choose a fast web stack suitable for a mobile PWA demo.
- Favor a real app screen over explanatory copy.
- Use the UI/UX research ticket as the design source of truth.
