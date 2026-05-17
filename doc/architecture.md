# Architecture

This document describes the planned LinkTrace demo architecture for Ralphthon.

## Current Shape

- LinkTrace is planned as a mobile-first web app.
- The repo currently stores product definition, loop rules, and ticketed implementation steps.
- Implementation should start from the next `todo` ticket and keep the app demoable after every step.

## Stack

- Default stack: React + TypeScript + Vite, using `npm` scripts.
- If an existing starter is introduced before ticket `002`, it may replace Vite only if it still supports a fast mobile web demo and `npm run build`.
- Use local browser storage first; no account system is required for the demo.
- Use deterministic demo data so the presentation does not depend on external websites.
- URL capture should use a layered parser pipeline: normalize URL, fetch metadata, extract Open Graph/Twitter/basic HTML, try article/oEmbed helpers when useful, classify failure, then save fallback metadata.
- External packages are allowed when a ticket explicitly justifies them, especially for metadata extraction, readability parsing, HTML parsing, oEmbed, and safe fetch/timeout handling.

## Expected App Shape

- App entry: `src/main.tsx` and `src/App.tsx` after ticket `002`.
- State persistence: localStorage under `linktrace.sources`.
- Primary UI surface: mobile-first workspace, not a landing page.
- PWA/share direction: paste/manual capture first, share-target simulation or manifest support later.
- Design source of truth: `doc/ux-research.md`, created by ticket `001-ui`.

## Verification

Every implementation ticket should at minimum keep:

- `npm run build` passing.
- A 390px-wide mobile viewport usable.
- Demo dataset loadable.
- Core screens reachable: Today Brief, search, Memory Clusters, and source detail/fallback states.

## Demo Survival Preferences

- Keep implementation scoped to the current ticket.
- Prefer boring, readable code over clever abstractions.
- Preserve existing behavior unless the ticket says otherwise.
- Add verification artifacts for every new behavior.
- Do not refactor unrelated code.
- Make the harness, specs, parsing failures, and fallbacks visible enough to demo.
- If a feature misses quality criteria but a fallback works and build passes, mark `done-with-follow-up` instead of `blocked`.
