# UI/UX Research

These are fast Ralphthon design decisions for LinkTrace. They use known mobile product patterns rather than exhaustive live research, because the demo needs clear implementation guidance more than a long audit.

## Pattern Review

### Mobile Saved-Link Inbox

- Observed pattern: read-later apps use a simple reverse-chronological inbox with title, domain, thumbnail or icon, and quick status.
- Why it helps LinkTrace: users can trust that a pasted link was saved even if parsing is partial.
- Risk: a plain list can feel like a bookmark manager.
- MVP decision: source cards should show summary and recall cues, not folders or manual categories.

### Daily Brief Or Digest Cards

- Observed pattern: digest apps group recent items into compact cards with the most useful sentence first.
- Why it helps LinkTrace: the product value is visible in seconds during the demo.
- Risk: too much text makes the first screen feel heavy.
- MVP decision: Today Brief cards show title, one-line summary, two to three cues, and capture quality.

### Recall Search By Vague Memory

- Observed pattern: modern mobile search uses a sticky input plus chips for recent or suggested queries.
- Why it helps LinkTrace: users often remember "sleep article" or "that YouTube AI tool", not exact URLs.
- Risk: search can look weak if empty states are vague.
- MVP decision: search placeholder should say `Search by what you remember...`; empty states should suggest cue examples.

### Cue Chips

- Observed pattern: chips work well for small semantic handles because they are tappable and scannable.
- Why it helps LinkTrace: recall cues become visible proof that the app transformed raw links into memory.
- Risk: long chips wrap badly and crowd cards.
- MVP decision: cue chips must be one to five words, with short labels preferred and no dense chip clouds.

### Bottom Sheet Detail

- Observed pattern: mobile apps use bottom sheets for focused detail without losing the current context.
- Why it helps LinkTrace: users can inspect a source or cluster without navigating away from the memory surface.
- Risk: deep nested sheets can feel cramped.
- MVP decision: source detail and selected cluster detail use a bottom sheet; the canvas stays summary-only.

### Mobile Cluster Canvas

- Observed pattern: clustered map views work best on mobile when they communicate grouping at a glance, not exact graph structure.
- Why it helps LinkTrace: users should feel random links form plausible memory groups.
- Risk: relationship lines and tiny labels create visual noise.
- MVP decision: Memory Clusters use grouped bubbles/cards with no relationship lines; support pan/zoom or `+`, `-`, `Reset` fallback controls.

### Capture Quality Feedback

- Observed pattern: resilient capture tools show partial success rather than treating blocked pages as total failure.
- Why it helps LinkTrace: hard-to-parse social links become a product moment instead of a bug.
- Risk: technical error language can scare normal users.
- MVP decision: show a friendly capture quality badge and plain-English fallback reason on cards and detail views.

## Chosen UI Principles

1. Mobile first: design for a 390px viewport before desktop.
2. Use short cue labels: recall cues should scan as chips, not sentences.
3. Keep detail in bottom sheets, not inside the canvas.
4. Use no relationship lines in Memory Clusters.
5. Make primary touch targets at least 44px.
6. Prefer demo clarity over visual complexity.
7. Show capture quality as calm status, not as an error.
8. Keep the first screen as the product workspace, not a landing page.

## Implementation Decisions

- Ticket `002` should build the first screen as a workspace with search, Today's Cues, Today Brief, and Memory Clusters visible without marketing hero copy.
- Ticket `007` should use compact digest cards with title, summary, cue chips, and capture quality.
- Ticket `010` should make Memory Clusters feel plausible through grouped bubbles/cards and omit relationship lines.
- Ticket `011` and ticket `014` should use bottom sheets for selected cluster and source detail.
- Ticket `016` should judge polish by mobile clarity, touch target size, and whether the 3-minute demo path stays obvious.
