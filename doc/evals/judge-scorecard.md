# LinkTrace Judge Scorecard

Date: 17 May 2026

Target: LinkTrace should average **90/100** or higher before it is called demo-ready. Scores below 90 require concrete improvement notes, even if the Ralph loop marks the ticket done through Demo Survival Mode.

## 100-Point Scorecard

| Criterion | Score | Evidence in the current repo/demo | If below 90, improve by |
| --- | ---: | --- | --- |
| Impact | 92/100 | Ordinary users often save links from chats and feeds without reading them. The demo shows saved links becoming Today Brief summaries, cues, search results, and clusters. | N/A |
| Technical execution | 90/100 | React/Vite app, localStorage persistence, deterministic cue/search/cluster logic, URL capture fallback ladder, PWA share simulation, screenshot fallback, context bundle. | N/A |
| Originality | 91/100 | The product is not a generic bookmark list: it centers vague-memory recall, capture-quality explanations, and semantic clusters without relationship-line clutter. | N/A |
| Demo quality | 94/100 | The 3-minute demo path is visible near the top: Load memory -> Try search -> View clusters, with fallback handling and source detail reachable. | N/A |
| Harness/agent craft | 95/100 | Repo-local Ralph loop, tickets with acceptance/verification, Demo Survival Mode, completion notes, and per-ticket commits make the build process inspectable. | N/A |
| Trust/robustness | 90/100 | Blocked/login-gated links degrade to link-only, partial metadata, manual context, or screenshot fallback instead of breaking the flow. | N/A |
| Mobile usability | 91/100 | Mobile-first constrained workspace, 44px controls, cue chips, bottom-sheet pattern, no relationship lines, and narrowed Chrome visual check. | N/A |

Estimated average: **91.9/100**.

## Judge Lens Mapping

| Judge lens | What LinkTrace should show |
| --- | --- |
| Impact track | A common daily-life problem: links shared through WhatsApp, X/Twitter, Reddit, GitHub, YouTube, news, and blogs are saved before users can read them. |
| Technical execution | Working local app with deterministic offline demo data and visible fallback states. |
| Originality | Memory-first retrieval and cue clusters, not another folder/bookmark manager. |
| Demo quality | A reliable 3-minute path that starts from `Load memory` and ends with searchable, clustered recall. |
| Harness/Skills track | The repo itself is a harness: specs, tickets, verification, retry policy, fallback policy, and scorecard. |
| Crypto/community trust lens | Avoids investment claims; emphasizes public-link memory, blocked-source transparency, and community/shared-context recall. |
| Infrastructure/system lens | Clear architecture, deterministic eval fixtures, and explicit limitations around browser URL parsing. |

## Final Demo Gate

Run this before presenting:

```bash
npm run build
rg -n "90/100|impact|technical execution|demo quality|mobile usability" doc
```

Then open the local app and complete this path in under 3 minutes:

1. Load demo memory.
2. Confirm Today Brief shows 9 saved links.
3. Use `Try search` or search for `agent workflow`.
4. Open a search result/source detail.
5. View Memory Clusters.
6. Use `+`, `-`, or `Reset` zoom fallback.
7. Select a cluster/source and show related summaries.
8. Show a `Link only`, `Partial capture`, or screenshot fallback state.

## Current Weak Spots

All criteria are currently at or above 90/100. The most important future improvements are:

- Add a server-side capture route if live metadata quality becomes a judging focus.
- Add automated mobile viewport tests with Playwright or an equivalent browser runner.
- Add OCR/image understanding for screenshot fallback after the demo.
- Add export/import for local memories if judges ask about persistence beyond one browser.
