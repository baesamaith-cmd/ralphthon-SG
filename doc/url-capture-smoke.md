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

Evaluated candidates:

| Package | Current version checked | Fit | Decision |
| --- | --- | --- | --- |
| `link-preview-js` | 4.0.3 | Has TypeScript types and link preview scope, but is more useful in a server/runtime fetch path than this browser-only MVP. | Do not install yet; native DOMParser is enough for current client path. |
| `@mozilla/readability` | 0.6.0 | Good article extraction library with types, but needs available HTML and usually pairs with a DOM implementation in non-browser environments. | Do not install yet; current blocker is fetch access/CORS, not article extraction quality. |
| `@extractus/oembed-extractor` | 4.1.0 | Relevant to YouTube/video metadata, but direct YouTube oEmbed endpoint is simpler for this MVP and avoids an extra dependency. | Do not install yet; use direct oEmbed attempt first. |

No package was installed because the highest-risk failures are platform access, CORS, login walls, and bot protection. A package would not safely solve those in a client-only demo.

## Platform Smoke Matrix

| Platform | Representative URL | Capture path | Expected result |
| --- | --- | --- | --- |
| X/Twitter | `https://x.com/example/status/123` | server capture, blocked-page detection, platform fallback | `link_only`, `js_rendered` or `blocked_or_login_required`, saved source with fallback copy |
| Reddit | `https://www.reddit.com/r/programming/` | platform fallback | `partial`, `metadata_missing`, saved source with community/domain cue |
| GitHub | `https://github.com/Q00/ouroboros` | server capture, then browser fallback | `metadata` with repo title/description |
| YouTube | `https://www.youtube.com/watch?v=dQw4w9WgXcQ` | direct oEmbed, then fallback | metadata via oEmbed or explicit timeout/network fallback |
| News | `https://www.reuters.com/technology/` | server capture, then browser fallback | metadata when public, otherwise `blocked_or_login_required` |
| Blog | `https://newsletter.pragmaticengineer.com/` | server capture, then browser fallback | `metadata` with blog title/description |

## Follow-Up

- Re-evaluate `link-preview-js`, `@mozilla/readability`, and `@extractus/oembed-extractor` if the server route needs deeper article extraction than Open Graph/Twitter Card/basic text.
- Keep the current client fallback ladder even if a server route is added, because links can still be blocked, private, paywalled, or JavaScript-heavy.
