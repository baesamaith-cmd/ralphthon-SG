---
id: 009
status: todo
title: "Group links into memory clusters"
---

## Problem

Users save links without categories. LinkTrace should group similar saved links automatically using recall cues and summaries so users can rediscover patterns later.

## Acceptance

- Implement similarity scoring based on overlapping recall cues, tags, title terms, and summary terms.
- Sources above a similarity threshold are grouped into clusters.
- Sources without enough similarity appear in an `Unclustered` group.
- Each cluster has:
  - generated label
  - shared cues
  - source count
  - list of source IDs
- Cluster labels are memory-like, not broad technical categories.
- The demo dataset produces at least three plausible clusters.
- The ticket is complete only if clusters feel plausible at a glance and would likely average above 90/100 for usefulness and believability.

## Quantitative Review Criteria

- Build exits 0.
- Demo dataset produces at least 3 named clusters.
- Each named cluster has at least 2 shared cues.
- No cluster contains more than 60% of all demo sources.
- At least 1 source can remain unclustered.
- Similarity scoring is deterministic for the same input.
- Cluster labels are 1 to 4 words.

## Retry Budget and Stop Rule

- Critical demo path: hard-critical.
- Maximum implementation passes: 3.
- Target judge score: 90/100 average.
- Minimum acceptable score: 85/100 only if clusters are deterministic and plausible.
- If still below 85/100 after 3 passes, apply the Demo Fallback before considering `blocked`.
- Do not force unrelated sources into clusters to meet the count.

## Demo Fallback

- If automatic clustering is weak, use deterministic demo fixture cues to produce stable clusters for the demo dataset.
- If only 2 clusters are plausible, show those plus Unclustered and mark `done-with-follow-up`.
- Use `blocked` only if Memory Clusters cannot receive any grouped or unclustered source data.

## Verification

```bash
npm run build
```

## Constraints

- Do not force every source into a cluster.
- Do not use relationship lines.
- Do not expose technical similarity scores in the default user UI.

## Hints

- Start with deterministic overlap scoring. Embeddings can be a later improvement.
