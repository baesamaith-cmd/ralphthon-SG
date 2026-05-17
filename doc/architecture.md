# Architecture

This document describes the planned LinkTrace demo architecture for Ralphthon.

## Current Shape

- LinkTrace is planned as a mobile-first web app.
- The repo currently stores product definition, loop rules, and ticketed implementation steps.
- Implementation should start from the next `todo` ticket and keep the app demoable after every step.

## Stack

- Prefer a lightweight React/Vite or Next.js web app unless the selected starter already dictates otherwise.
- Use local browser storage first; no account system is required for the demo.
- Use deterministic demo data so the presentation does not depend on external websites.
- URL capture should use a layered parser pipeline: normalize URL, fetch metadata, extract Open Graph/Twitter/basic HTML, try article/oEmbed helpers when useful, classify failure, then save fallback metadata.
- External packages are allowed when a ticket explicitly justifies them, especially for metadata extraction, readability parsing, HTML parsing, oEmbed, and safe fetch/timeout handling.

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
