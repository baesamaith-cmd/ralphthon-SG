---
id: 013
status: todo
title: "Add PWA share target capture path"
---

## Problem

LinkTrace's ideal UX is saving links from mobile share sheets. The MVP should include a PWA/share-target path or a credible share-target simulation.

## Acceptance

- App includes PWA manifest metadata.
- Manifest includes share target configuration if the chosen stack supports it.
- Shared URL/text can route into the capture flow when supported.
- If full browser support is limited, app includes a `Share to LinkTrace` demo simulation.
- The UI explains the intended mobile share flow:
  - receive link
  - save immediately
  - review later in Today Brief and Memory Clusters
- The flow does not require login.
- The ticket is complete only if judges understand the mobile share experience and would likely score execution above 90/100 even if device support varies.

## Quantitative Review Criteria

- Build exits 0.
- Manifest file exists and includes app name, icons or icon placeholders, and start URL.
- Share target route or simulation can create 1 source from URL/text.
- Paste/manual capture remains available if share target is unsupported.
- The demo can show the share-to-save path in under 30 seconds.
- No login or account step appears in the share flow.

## Retry Budget and Stop Rule

- Critical demo path: optional; this is important for product vision but can fall back to simulation.
- Maximum implementation passes: 3.
- Target judge score: 90/100 average.
- Minimum acceptable score: 80/100 if the share-target simulation is credible and paste/manual capture remains reliable.
- If still below 80/100 after 3 passes, apply the Demo Fallback before considering `blocked`.
- Do not break the main capture flow while chasing native/PWA support.

## Demo Fallback

- If browser PWA share target support is unreliable, keep a `Share to LinkTrace` simulation route or button.
- If manifest support is partial, mark `done-with-follow-up` as long as paste/manual capture remains reliable.
- Use `blocked` only if this ticket breaks the main app or capture flow.

## Verification

```bash
npm run build
```

## Constraints

- Do not make PWA support the only way to add a link.
- Do not break paste/manual capture.
- Keep fallback demo path available.

## Hints

- Use a route such as `/share` for incoming share data if supported.
