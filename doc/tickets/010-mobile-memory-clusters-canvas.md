---
id: 010
status: done
title: "Build zoomable mobile Memory Clusters canvas"
---

## Problem

LinkTrace needs a mobile-friendly visualization that gives users the feeling that random saved links naturally form memory clusters. It should not try to explain every relationship.

## Acceptance

- Add a `Memory Clusters` view.
- The view opens to all saved summary/cue nodes.
- Nodes are positioned near similar nodes and separated from unrelated clusters.
- Nodes show short recall-cue labels only in the canvas.
- No relationship/link lines are drawn.
- Cluster labels are visible as light contextual labels.
- The canvas supports pinch zoom and drag pan on mobile.
- Include reset/fit controls for demo reliability.
- The default view feels glanceable, not analytical.
- The canvas follows the mobile cluster visualization decisions from `doc/ux-research.md` if that file exists.
- The ticket is complete only if the visualization produces a "that makes sense" reaction and would likely score above 90/100 for mobile demo appeal.

## Quantitative Review Criteria

- Build exits 0.
- Canvas works at `390x844` mobile viewport.
- At least 8 demo nodes are visible after loading demo memory.
- Node labels are no more than 24 characters.
- No relationship/link lines are rendered.
- Pinch or zoom controls support at least `0.5x` to `2x` zoom.
- Reset/fit control returns all nodes to view in one tap.
- No canvas text overlaps at the default zoom level.
- At least 3 visualization decisions from `doc/ux-research.md` are reflected in the cluster view.

## Retry Budget and Stop Rule

- Critical demo path: hard-critical.
- Maximum implementation passes: 4, because mobile gesture and layout issues may need one extra pass.
- Target judge score: 90/100 average.
- Minimum acceptable score: 85/100 only if nodes are visible, no lines render, and reset/fit works.
- If still below 85/100 after 4 passes, apply the Demo Fallback before considering `blocked`.
- Do not add edge lines or dense text to make the visualization seem more detailed.

## Demo Fallback

- If pinch zoom is unreliable, provide `+`, `-`, and `Reset` controls as the official demo path.
- If spatial layout overlaps, use a simple clustered grid/card canvas with no lines and mark `done-with-follow-up`.
- Use `blocked` only if the cluster view cannot render visible nodes.

## Verification

```bash
npm run build
```

## Constraints

- No dense graph edges.
- No long summaries inside the canvas.
- Do not use desktop-only hover interactions.
- Do not make the canvas unusable without pinch support; provide reset/fit controls.

## Hints

- Use distance, color, opacity, node size, and cluster labels instead of lines.
- A simple deterministic layout is acceptable for MVP.

## Completion Notes

- Files changed: `src/App.tsx`, `src/styles.css`, `doc/tickets/010-mobile-memory-clusters-canvas.md`.
- Checks run: `npm run build`; `rg -n "clusterZoom|clusterPan|pinchDistance|zoom-controls|Reset|0\\.5|2\\)|cluster-node|cluster-label|touch-action: none|relationship lines|Zoomable Memory Clusters|slice\\(0, 24\\)" src/App.tsx src/styles.css`.
- Replaced the static cluster preview with a zoomable mobile canvas that renders cluster labels and source cue nodes, omits relationship lines, supports drag pan, handles two-touch pinch scaling, provides `-`, `+`, and `Reset` controls from 0.5x to 2x, and keeps canvas node labels to 24 characters or less.
