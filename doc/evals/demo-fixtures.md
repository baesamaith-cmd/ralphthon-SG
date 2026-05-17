# LinkTrace Eval Fixtures

Date: 17 May 2026

Use these fixtures to verify that LinkTrace is demo-ready before judging. They are intentionally ordinary and messy: the point is to show that random links from daily life can become summaries, recall cues, search handles, and plausible memory clusters.

## Fixture Set

| ID | Link type | Representative link | Expected capture result | Demo purpose |
| --- | --- | --- | --- | --- |
| F1 | AI/product article | `https://openai.com/index/introducing-codex/` | metadata summary with `codex loop`, `agent workflow`, `repo memory` cues | Shows spec/agent workflow memory. |
| F2 | YouTube | `https://www.youtube.com/watch?v=dQw4w9WgXcQ` | oEmbed/partial metadata fallback with `video notes`, `ai workflow`, `watch later` cues | Shows video links can still become searchable. |
| F3 | GitHub repo | `https://github.com/Q00/ouroboros` | metadata or link-only fallback with repo/domain cues | Shows developer links and loop-related memory. |
| F4 | Event page | `https://luma.com/4hx7p0vs` | metadata summary with `judge context`, `ralphthon`, `event page` cues | Shows event context can guide later decisions. |
| F5 | Health article | `https://www.sleepfoundation.org/sleep-hygiene` | metadata summary with `sleep routine`, `health checklist`, `better rest` cues | Shows ordinary personal-use recall. |
| F6 | Career/blog link | `https://newsletter.pragmaticengineer.com/` | metadata or partial metadata with `career growth`, `engineering essay`, `promotion` cues | Shows non-crypto, non-agent life/work links. |
| F7 | News page | `https://www.reuters.com/technology/` | partial metadata or readable fallback with `tech news`, `morning read`, `industry` cues | Shows rapidly changing news can be remembered by source and topic. |
| F8 | Blocked social link | `https://x.com/example/status/123` | `link_only` with a login/block fallback reason | Shows graceful degradation instead of a broken demo. |
| F9 | Screenshot fallback | any blocked/private page plus an uploaded image | `screenshot` status with local image preview | Shows the last-resort capture path when parsing fails. |
| F10 | Unrelated personal link | `https://www.seriouseats.com/` | metadata summary with `noodle recipe`, `weekend cooking`, `weak cluster` cues | Shows weakly related links do not force bad clusters. |

## Vague-Memory Queries

| Query | Expected useful result |
| --- | --- |
| `agent memory` | Codex agent workflow notes or Ouroboros spec loop repo |
| `watch later` | YouTube walkthrough on AI note taking |
| `sleep timing` | Sleep hygiene checklist |
| `career growth` | Engineering career essay |
| `login gated` | Social post with limited metadata |
| `morning tech` | Technology news to revisit |
| `judge event` | Ralphthon event page |

## Cluster Expectations

| Cluster expectation | Sources that should feel related | Why it should feel plausible |
| --- | --- | --- |
| Agent workflow cluster | Codex agent workflow notes, Ouroboros spec loop repo, YouTube AI note-taking walkthrough | Shared AI/workflow/repo-loop vocabulary. |
| Learning and career cluster | YouTube AI note-taking walkthrough, Engineering career essay | Shared learning and future-work value. |
| Community/event cluster | Ralphthon event page, Social post with limited metadata | Shared public/community context and event discussion. |
| Weak or unclustered area | Sleep hygiene, technology news, recipe | The app should avoid pretending every saved link is strongly related. |

## Pass Criteria

- Load demo memory in under 5 seconds.
- Search returns a useful result for at least 5 of the vague-memory queries above.
- Memory Clusters shows at least 3 plausible groups or an explicit weak-signal grouping.
- Capture quality is visible for metadata, partial, link-only, and screenshot states.
- If live parsing fails, the fallback reason remains visible and the demo keeps moving.
