---
id: 005
status: todo
title: "Capture URL metadata with graceful fallback"
---

## Problem

Users will share links from messy places. LinkTrace should try to fetch useful metadata, but the app must still work when a link is blocked, private, paywalled, or JavaScript-heavy.

## Acceptance

- Add a capture route or service that accepts a URL.
- Implement a capture pipeline with these ordered stages:
  1. normalize and validate URL
  2. fetch with timeout and clear user-agent
  3. inspect response status, redirects, final URL, content type, and content length
  4. extract Open Graph / Twitter Card / basic HTML metadata
  5. attempt article text extraction when HTML content is available
  6. apply platform-specific metadata when obvious and low-risk, especially YouTube/oEmbed-style metadata
  7. classify the capture result and failure reason
  8. save fallback source data even when parsing fails
- The app attempts best-effort metadata extraction:
  - title
  - description
  - image when available
  - domain
- When parsing fails, the implementation investigates and records the likely reason:
  - network/DNS/CORS/server rejection
  - unsupported content type
  - bot protection or login wall
  - JavaScript-rendered page
  - malformed metadata
  - timeout
- If parsing failures are caused by missing extraction capability, search for suitable maintained packages, install the best fit, and use it in the capture path.
- Package choices and the reason for choosing them are recorded in `## Completion Notes` or `## Follow-up Notes`.
- The capture result exposes both user-facing and developer-facing fields:
  - `captureStatus`
  - `captureMethod`
  - `failureReason`
  - `fallbackAvailable`
  - `parserUsed`
  - `finalUrl`
  - `contentType`
- If metadata extraction fails, the source is still saved as `link_only` or `failed`.
- Capture quality is shown on the source card.
- The user sees a helpful fallback message, not a hard error.
- The UI clearly says LinkTrace uses a capture fallback ladder.
- The UI exposes a plain-English reason when capture is partial, such as `This page looks login-gated` or `LinkTrace saved the link because the page did not expose readable metadata`.
- The ticket is complete only if a judge would see blocked links as a handled product case, not a bug, and likely score robustness above 90/100.

## Quantitative Review Criteria

- Build exits 0.
- Capture service returns a structured result for at least 5 tested URLs:
  - regular article/blog page
  - YouTube or video URL
  - social URL likely to block or limit parsing
  - invalid or malformed URL
  - demo metadata/fallback fixture
- Platform smoke tests are run with one representative URL each for:
  - X/Twitter
  - Reddit
  - GitHub
  - YouTube
  - news article
  - personal/company blog
- At least 4 capture statuses are represented in code or demo states.
- Failed fetch still creates a saved source within 2 seconds of failure handling.
- Every saved source displays a capture quality badge.
- At least 1 blocked/failure case is visible in the demo dataset or manual test path.
- At least 3 parsing failure reasons are represented in code, tests, or demo fixtures.
- At least 2 parser/package candidates are evaluated in notes before installing a new package.
- After installing or changing a parsing package, rerun all 6 platform smoke tests.
- If a new parsing package is installed, `package.json` and lockfile changes are included and `npm run build` still exits 0.
- Package evaluation notes include maintenance signal, TypeScript compatibility, bundle/runtime risk, and what failure mode the package solves.

## Retry Budget and Stop Rule

- Critical demo path: soft-critical.
- Maximum implementation passes: 6, because URL capture quality is central and package experiments may need several cycles.
- Target judge score: 90/100 average.
- Minimum acceptable score: 80/100 if graceful fallback works even when live fetching is partial.
- Minimum platform result: all 6 platform smoke tests must produce either useful metadata or an explicit, user-safe fallback reason.
- If still below 80/100 after 6 passes, apply the Demo Fallback before considering `blocked`.
- Do not make live fetch success mandatory to pass the demo.

## Demo Fallback

- If live URL fetching is unreliable, keep manual paste, domain extraction, demo metadata, and link-only capture.
- If package research or installation cannot be completed inside the retry budget, keep a manual/demo fallback and document the attempted packages in `## Follow-up Notes`.
- If only demo metadata works, mark `done-with-follow-up` and document live-fetch gaps.
- Use `blocked` only if capture failures break source saving or the app build.

## Parsing Failure Playbook

Use this playbook before deciding a URL is simply unsupported:

1. Reproduce with at least one known good URL and one failing URL.
2. Record status code, redirect chain/final URL, content type, response size, timeout, and any parser exception.
3. Classify the failure:
   - `invalid_url`
   - `network_error`
   - `timeout`
   - `http_error`
   - `blocked_or_login_required`
   - `unsupported_content_type`
   - `js_rendered`
   - `metadata_missing`
   - `parser_error`
4. Decide the next action:
   - metadata parser package for missing OG/Twitter/HTML parsing
   - article extractor for readable article body
   - oEmbed helper for video/social embed metadata
   - HTML parser utility for malformed DOM extraction
   - no package when the issue is bot protection, login, paywall, or JavaScript rendering beyond MVP scope
5. Install a package only if it solves a concrete classified failure and does not threaten demo reliability.
6. If package installation or integration fails, keep the fallback path and document the attempted package.

## Platform Smoke Test Matrix

Run this matrix during the ticket and after every parser/package change:

| Platform | Expected best outcome | Acceptable fallback |
| --- | --- | --- |
| X/Twitter | title/author-ish label, domain, source type, visible fallback note if content is blocked | `blocked_or_login_required` or `metadata_missing` with saved URL/domain and manual/screenshot prompt |
| Reddit | post title, subreddit/community cue, domain, description when available | `metadata_missing` with saved URL/domain and manual/screenshot prompt |
| GitHub | repo/page title, description/readme-ish metadata when available, domain | `metadata` or `link_only` with clear GitHub source label |
| YouTube | video title, thumbnail/image when available, provider/domain, oEmbed-style metadata | `metadata_missing` with saved URL/domain and screenshot/manual prompt |
| News | article title, description, domain, article text when readable | `metadata` with title/description only |
| Blog | post title, description or readable text, domain | `metadata` with title/domain only |

For each platform, record:

- input URL
- parser/package used
- capture status
- failure reason if partial
- whether summary/cues can be generated from captured data
- whether a user-safe fallback message is shown

The goal is not perfect scraping. The goal is that every platform produces either useful metadata or a trustworthy explanation plus a next action.

## Package Experiment Loop

Use a generous loop for this ticket:

1. Run all 6 platform smoke tests with the current implementation.
2. Group failures by reason.
3. Pick the highest-impact failure category.
4. Search for maintained packages that solve that category.
5. Evaluate at least 2 candidates when possible.
6. Install the best candidate only if it fits the Package Evaluation Guidance.
7. Integrate it behind the capture pipeline, not as a separate UI path.
8. Rerun all 6 platform smoke tests.
9. Keep the package only if it improves at least 2 platform outcomes or materially improves one hard platform such as YouTube, Reddit, X/Twitter, or GitHub without breaking build.
10. Repeat until the 6-pass retry budget is exhausted or the minimum platform result is met.

If a package worsens build reliability, source saving, or demo fallback behavior, remove it before completing the ticket.

## Package Evaluation Guidance

Evaluate packages in this order of preference:

1. Metadata extraction:
   - candidates: `url-metadata`, `linkpeek`, or similar Open Graph/Twitter Card parsers
   - use when title/description/image extraction is missing or brittle
2. Article/readability extraction:
   - candidates: `@mozilla/readability` with `jsdom`
   - use when HTML is available but useful article text is buried in page chrome
3. oEmbed/video metadata:
   - candidates: `@extractus/oembed-extractor`, `oembed-spec`, or direct provider oEmbed endpoints
   - use for YouTube/video URLs where embed metadata is enough for LinkTrace
4. HTML parsing:
   - candidates: `cheerio` or similar server-compatible HTML parsers
   - use for predictable metadata selectors or malformed simple pages
5. Fetch safety:
   - candidates: small timeout/retry helpers, or native `AbortController`
   - use when the main issue is slow or hanging requests

Before installing, check:

- recent maintenance or activity
- install size and dependency risk
- server-side compatibility with the chosen framework
- TypeScript support or available types
- whether the package requires paid APIs or browser-only globals
- whether the package works without storing fetched content remotely

Prefer native fetch plus small parsing libraries over large scraping/browser automation dependencies. Do not add Playwright/Puppeteer-style rendering for MVP unless the user explicitly changes scope.

## Verification

```bash
npm run build
```

## Constraints

- Do not make URL fetch success mandatory for the app to function.
- Do not store fetched content on a server database.
- Do not block the source save flow while metadata is loading.
- Do not add an unmaintained, overly broad, or server-only package unless it is clearly necessary and build-compatible.
- Do not install packages speculatively; install only after identifying a concrete parsing failure it solves.
- Do not bypass robots, paywalls, authentication, or bot protection.
- Do not add browser automation/rendering as the default path for MVP.
- Do not store raw fetched page bodies in persistent storage; save only metadata, summaries, cues, and explicit user-provided content.

## Hints

- Show statuses such as `Full`, `Metadata`, `Screenshot`, `Link only`, and `Failed`.
- Use domain extraction even when title/description are unavailable.
- Consider package categories such as Open Graph metadata parsers, readability/article extractors, HTML parsers, YouTube metadata helpers, or safe fetch/timeout utilities.
- Prefer packages with recent maintenance, TypeScript compatibility or clear types, small API surface, and no heavy browser-only assumptions for server routes.
- Good user-facing failure copy matters: users should understand what happened and what to do next, not see parser jargon.
- Treat X/Twitter and LinkedIn-style social pages as likely partial captures; do not spend the whole ticket trying to bypass access limits.
- Treat GitHub and YouTube as high-value smoke-test platforms because they are common shared links and often have useful metadata paths.
