# URL Capture Smoke Notes

Date: 17 May 2026

## Implementation Summary

LinkTrace now uses a server-assisted capture service with a browser fallback:

1. normalize and validate URL
2. save a fallback source immediately so the UI does not block
3. classify known platform constraints, especially X/Twitter and Reddit
4. try YouTube oEmbed when applicable
5. call local `/api/capture` on the Vite dev/preview server, which fetches with browser-like headers to avoid client CORS limits
6. inspect status, final URL, content type, parser exceptions, login walls, and JavaScript-only shells
7. extract Open Graph, Twitter Card, basic HTML title/description/image, and first article text
8. fall back to direct browser fetch only if the server route is unavailable
9. merge structured capture result into the already-saved source

The server route fixes many CORS failures for public pages such as GitHub repos and blogs. It does not bypass login, bot checks, paywalls, private pages, or JavaScript-only rendered content; those remain explicit fallback cases.

## Package Evaluation

Evaluated and used candidates:

| Package | Current version checked | Fit | Decision |
| --- | --- | --- | --- |
| `cheerio` | 1.2.0 | Server-compatible HTML parser for OG/Twitter/JSON-LD/title/H1/semantic paragraph extraction. | Installed and used in `/api/capture`. |
| `@mozilla/readability` | 0.6.0 | Good article extraction library with types when paired with a DOM implementation. | Installed and used with `jsdom` for readable body/excerpt extraction. |
| `jsdom` | installed | Provides DOM for Readability in the Vite server route. | Installed and used only server-side. |
| `link-preview-js` | 4.0.3 | Link preview scope overlaps with current server route, but it adds less control over failure classification than the explicit pipeline. | Not installed. |
| `@extractus/oembed-extractor` | 4.1.0 | Relevant to oEmbed, but direct YouTube oEmbed is enough for current MVP. | Not installed; direct provider call used. |

Packages are used only after the server fetch returns HTML. They improve card content for public pages, but do not bypass login walls, bot checks, paywalls, private pages, or JavaScript-only rendering.

## Platform Smoke Matrix

| Platform | Representative URL | Capture path | Expected result |
| --- | --- | --- | --- |
| X/Twitter | `https://x.com/example/status/123` | server capture, blocked-page detection, platform fallback | `link_only`, `js_rendered` or `blocked_or_login_required`, saved source with fallback copy |
| Reddit | `https://www.reddit.com/r/programming/` | Reddit JSON attempt, server capture, blocked-page detection | metadata when public JSON works, otherwise `blocked_or_login_required` with saved URL/domain |
| GitHub | `https://github.com/Q00/ouroboros` | server capture, then browser fallback | `metadata` with repo title/description |
| YouTube | `https://www.youtube.com/watch?v=dQw4w9WgXcQ` | direct oEmbed, then fallback | metadata via oEmbed or explicit timeout/network fallback |
| News | `https://www.reuters.com/technology/` | server capture, then browser fallback | metadata when public, otherwise `blocked_or_login_required` |
| Blog | `https://newsletter.pragmaticengineer.com/` | server capture, then browser fallback | `metadata` with blog title/description |

## Latest Smoke Run

Run date: 17 May 2026

| Platform | Status | Parser | Result |
| --- | --- | --- | --- |
| X/Twitter | `link_only` | `server-blocked-page-detection` | Detected verification/error shell and kept fallback reason. |
| Reddit | `link_only` | `server-blocked-page-detection` | Detected verification page and kept fallback reason. |
| GitHub | `metadata` | `server-fetch-cheerio-readability` | Captured repo title and description. |
| YouTube | `metadata` | `server-youtube-oembed` | Captured video title/provider metadata. |
| Reuters news | `link_only` | `server-fetch-status` | HTTP 401 classified as `blocked_or_login_required`. |
| Pragmatic Engineer blog | `metadata` | `server-fetch-cheerio-readability` | Captured blog title and description. |
| Invalid URL | `link_only` | `server-url-validator` | Classified as `invalid_url`. |

## Follow-Up

- Re-evaluate `link-preview-js`, `@mozilla/readability`, and `@extractus/oembed-extractor` if the server route needs deeper article extraction than Open Graph/Twitter Card/basic text.
- Keep the current client fallback ladder even if a server route is added, because links can still be blocked, private, paywalled, or JavaScript-heavy.
