---
id: 011
status: done
title: "Focus a selected memory cluster"
---

## Problem

The cluster canvas should help users move from a vague cue to the saved summaries behind it. Selecting a cue should focus the relevant group without overwhelming the mobile screen.

## Acceptance

- Tapping a node selects it.
- When selected, the chosen node and similar nodes are emphasized.
- Unrelated nodes are hidden or dimmed.
- A mobile bottom sheet opens with:
  - selected cue label
  - related source count
  - shared cues
  - related source summaries
  - `Find later by` cues for each related source
- The bottom sheet can be dismissed.
- Reset returns to the full cluster view.
- The detail interaction follows the bottom sheet decision from `doc/ux-research.md` if that file exists.
- The ticket is complete only if selecting a cue clearly helps users find saved summaries and would likely score above 90/100 for mobile usability.

## Quantitative Review Criteria

- Build exits 0.
- Tapping a node opens a bottom sheet in one interaction.
- Bottom sheet shows at least 2 related sources when the selected cluster has them.
- Bottom sheet shows at least 2 shared cues.
- Unrelated nodes are dimmed to 40% opacity or less, or hidden.
- Bottom sheet can be dismissed in one gesture or one tap.
- All bottom sheet controls are at least 44px tall.
- Bottom sheet uses short cue-first content before longer summary text.

## Retry Budget and Stop Rule

- Critical demo path: soft-critical.
- Maximum implementation passes: 3.
- Target judge score: 90/100 average.
- Minimum acceptable score: 85/100 only if tap-to-focus and dismiss both work reliably on mobile.
- If still below 85/100 after 3 passes, apply the Demo Fallback before considering `blocked`.
- Do not move detail into a desktop-style side panel.

## Demo Fallback

- If bottom sheet interaction is unstable, open a simple inline selected-cluster panel below the canvas.
- If dimming unrelated nodes is unreliable, show selected related summaries in the panel and mark `done-with-follow-up`.
- Use `blocked` only if selecting a cue breaks the cluster view.

## Verification

```bash
npm run build
```

## Constraints

- Do not navigate away from the cluster canvas for selection.
- Do not show long detail text until the user taps a related source.
- Keep touch interactions reliable on mobile.

## Hints

- Treat the bottom sheet as the place for detail; keep the canvas lightweight.

## Completion Notes

- Files changed: `src/App.tsx`, `src/styles.css`, `doc/tickets/011-cluster-focus-bottom-sheet.md`.
- Checks run: `npm run build`; `rg -n "selectedCluster|bottom-sheet|Selected cue|related sources|sharedCues|is-dimmed|opacity: 0\\.32|sheet-source|Close|selectClusterForSource|Reset" src/App.tsx src/styles.css`.
- Added cluster focus state, node-to-cluster selection, selected-node emphasis, unrelated-node dimming to 32% opacity, tappable cluster labels, a mobile bottom sheet with selected cue label, source count, shared cues, related summaries, `Find later by` cues, one-tap close, and reset behavior that returns to the full cluster view.
