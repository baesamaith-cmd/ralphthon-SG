---
id: 004
status: todo
title: "Add one-tap demo memory dataset"
---

## Problem

The live demo must not depend on unreliable external links. LinkTrace needs a one-tap dataset that instantly shows summaries, recall cues, and clusters.

## Acceptance

- Add a `Load demo memory` action.
- The demo dataset includes 8 to 10 diverse saved sources.
- Sources cover multiple unrelated everyday topics, such as:
  - AI tools
  - community links
  - open-source or community project links
  - health or sleep
  - career or learning
  - YouTube/video
- Each demo source has:
  - title
  - URL or source label
  - one-line summary
  - recall cues
  - tags
  - capture status
- Loading the dataset populates Today Brief and Memory Clusters immediately.
- The dataset contains enough overlap for at least three clusters plus an unclustered group.
- The ticket should be complete only if the demo dataset makes the app understandable in under 30 seconds and would likely score above 90/100 for demo readiness.

## Quantitative Review Criteria

- Build exits 0.
- Demo dataset contains between 8 and 10 sources.
- At least 5 different source/topic types are represented.
- Every demo source has at least 3 recall cues.
- Demo data produces at least 3 clusters.
- Demo data includes at least 1 unclustered or weakly clustered source.
- Loading demo memory completes in under 5 seconds on a local dev build.

## Retry Budget and Stop Rule

- Critical demo path: hard-critical.
- Maximum implementation passes: 3.
- Target judge score: 90/100 average.
- Minimum acceptable score: 85/100 only if demo data loads and produces usable brief/cluster content.
- If still below 85/100 after 3 passes, apply the Demo Fallback before considering `blocked`.
- Do not depend on live external URLs to make the dataset look better.

## Demo Fallback

- If 8 to 10 sources are too many to make reliable, keep at least 6 high-quality demo sources that show brief, search, and clusters.
- If clustering is weak, include explicit demo cues that create at least 2 visible clusters and mark `done-with-follow-up`.
- Use `blocked` only if demo data cannot load at all.

## Verification

```bash
npm run build
```

## Constraints

- Do not rely on live URL fetching for the demo dataset.
- Do not make all demo links about one topic.
- Do not require login or setup.

## Hints

- Include examples that look like links a normal person might receive in WhatsApp or social feeds.
