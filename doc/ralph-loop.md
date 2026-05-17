# Ralph Loop

You are running this repository's Ralph loop.

This file should be updated after the real project, stack, and verification commands are chosen.

## Before Every Ticket

1. Read `doc/product.md`.
2. Read `doc/non-goals.md`.
3. Read `doc/glossary.md`.
4. Read `doc/architecture.md`.
5. Read `doc/judge-lenses.md`.
6. Inspect current git status.
7. Find the lowest-numbered file in `doc/tickets/` with `status: todo`.

## Ticket Execution

1. Read the selected ticket fully.
2. Implement exactly that ticket.
3. Add or update tests and verification artifacts required by the ticket.
4. Run the verification command from the ticket.
5. If verification fails, fix the implementation and tests within the ticket's retry budget.
6. Do not implement future tickets early.
7. Do not add features outside the ticket.

## Demo Survival Mode

The hackathon priority is a working demo, not perfect completion of every advanced feature.

- The loop must not stop permanently because one ticket misses aspirational quality criteria.
- `npm run build` failure is the main hard stop for implementation tickets.
- If a feature cannot meet its quantitative criteria within the retry budget, preserve a demoable fallback instead of removing the feature.
- If the fallback works and the app remains demoable, mark the ticket `done-with-follow-up`, add `## Follow-up Notes`, and continue.
- Use `blocked` only when build fails, the app becomes unusable, demo data cannot load, localStorage save/restore is broken, or a core screen cannot render at all.
- Treat `90/100` as the target quality score, not an automatic stopping condition.
- Minimum demo viability is the continue/stop gate: the user must still be able to load demo data, see Today Brief, search by memory, and open Memory Clusters.

## Demo Fallback Rules

- URL fetch unstable: diagnose the failure reason, search for maintained extraction packages when the failure is capability-related, install/apply a suitable package when it fits the stack, and keep demo metadata, domain extraction, manual paste, and link-only fallback if parsing remains unreliable.
- AI/API unavailable: use rule-based summaries, tags, and recall cues.
- PWA share target unsupported: keep paste/manual capture and a share-to-LinkTrace simulation.
- Pinch zoom unreliable: keep `+`, `-`, and `Reset` controls as the demo path.
- Screenshot OCR unavailable: preserve and preview screenshots, but label them as preserved context only.
- Search quality below target: keep the best cue-based search, document failed queries, and continue if demo queries still show value.

## URL Capture Investigation Rule

URL parsing is a core product risk. Do not treat parse failure as a generic error.

- Always classify the likely failure reason before choosing fallback.
- Capture status should distinguish invalid URL, network/timeout, HTTP error, unsupported content type, blocked/login-gated page, JavaScript-rendered page, missing metadata, and parser error.
- If the failure is caused by missing extraction capability, evaluate maintained packages before settling for link-only fallback.
- Install a package only when it solves a specific failure mode, fits the app runtime, and keeps `npm run build` passing.
- For URL capture work, run platform smoke tests across X/Twitter, Reddit, GitHub, YouTube, news, and blog examples after each parser/package change.
- URL capture tickets may use a larger retry budget because parsing quality is core to the demo.
- Never bypass authentication, paywalls, bot protection, or robots restrictions for the MVP.
- Browser automation is not a default solution; use it only if scope is explicitly changed.
- If investigation exceeds the retry budget, keep the demo fallback and record attempted packages in `## Follow-up Notes`.

## Completion

1. Change the ticket frontmatter from `status: todo` to one of:
   - `done`: acceptance and main quantitative criteria pass.
   - `done-with-follow-up`: build and demo fallback pass, but some quality criteria remain below target.
   - `blocked`: build or minimum demo viability fails.
2. Add a short `## Completion Notes` section with:
   - files changed
   - tests or checks run
   - important behavior added
3. If status is `done-with-follow-up`, add `## Follow-up Notes` with unmet criteria, fallback used, and the next improvement.
4. Commit with message: `Complete ticket NNN: <title>`.
5. Push the commit to GitHub after the ticket passes.
6. Continue to the next todo ticket when explicitly instructed to keep looping.

## Final Demo Handoff

When all development tickets are complete or the user says the project is ready for final demo:

1. Run the final verification gate:
   - `npm run build`
   - mobile viewport check around 390px wide
   - 3-minute happy path: load demo data, open Today Brief, search by memory, open Memory Clusters, and show a selected cluster or fallback state
2. Start the local app server if one is not already running.
3. Open the final product in the browser so the user can see the working screen, not only a text report.
4. Keep the server running long enough for the user to inspect the demo.
5. Report the local URL, verification result, final commit hash, and any `done-with-follow-up` items.
6. Commit and push the final state to GitHub after the final verification passes.

## Failure Handling

If blocked:

1. Change the ticket frontmatter from `status: todo` to `status: blocked`.
2. Add a `## Blocked Notes` section explaining:
   - what failed
   - what was tried
   - what information is needed
3. Explain why no demo fallback is available.
4. Do not guess around unclear product behavior.

## Operating Principles

- The repository is the memory.
- The ticket is the scope.
- The verification command is the judge.
- One ticket should produce one focused commit.
- Prefer a simple implementation that passes explicit acceptance criteria over an impressive implementation that expands the product.
