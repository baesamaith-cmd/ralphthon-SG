---
id: 015
status: todo
title: "Generate context bundle from saved links"
---

## Problem

Trace should connect personal memory to future AI work. Users should be able to export saved summaries and cues as a context bundle for an AI agent.

## Acceptance

- Add `Generate context bundle` action.
- Bundle includes:
  - top themes
  - saved source summaries
  - recall cues
  - important links
  - open questions
  - suggested next prompts
- Bundle is source-backed and does not invent unsupported claims.
- Bundle can be copied as Markdown.
- The feature is discoverable but not the main home-screen focus.
- The ticket is complete only if the feature strengthens harness/agent-craft scoring and would likely help the average judge score exceed 90/100.

## Quantitative Review Criteria

- Build exits 0.
- Bundle contains at least 5 sections.
- Bundle includes at least 5 source-backed summaries when demo data is loaded.
- Bundle includes at least 5 recall cues.
- Bundle includes at least 3 suggested next prompts.
- Copy-as-Markdown action produces non-empty Markdown.
- Bundle generation works with no network access for demo data.

## Retry Budget and Stop Rule

- Critical demo path: optional; this supports harness/agent-craft scoring.
- Maximum implementation passes: 2.
- Target judge score: 90/100 average.
- Minimum acceptable score: 80/100 if the bundle is source-backed and copyable.
- If still below 80/100 after 2 passes, apply the Demo Fallback before considering `blocked`.
- Do not let this feature distract from ordinary-user link memory flows.

## Demo Fallback

- If generated bundle quality is weak, provide a deterministic Markdown export of demo summaries, cues, and links.
- If copy interaction is unstable, render selectable Markdown and mark `done-with-follow-up`.
- Use `blocked` only if this feature breaks the primary user flow.

## Verification

```bash
npm run build
```

## Constraints

- Keep primary UX for ordinary users.
- Do not require login or remote storage.
- Do not make the bundle a generic chatbot transcript.

## Hints

- This feature helps explain Trace as memory for future-you and future-agents.
