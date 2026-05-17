# Cluster Fixtures

The Memory Cluster algorithm is deterministic and based on overlapping tags, recall cues, title terms, and summary terms.

Expected demo groups after `Load demo memory`:

| Cluster label | Shared cues | Expected sources |
| --- | --- | --- |
| `agent workflow` | `agent`, `workflow` | Codex agent workflow notes, Ouroboros spec loop repo, YouTube AI note-taking walkthrough |
| `AI memory` | `ai`, `workflow` | Codex agent workflow notes, YouTube AI note-taking walkthrough |
| `learning trail` | `learning`, `career` | YouTube AI note-taking walkthrough, Engineering career essay |
| `community signals` | `community`, `event` | Ralphthon event page, Social post with limited metadata |
| `Unclustered` | `weak signal`, `saved for later` | Health, news, recipe, or any source without enough overlap |

The default UI shows the first four clusters in the mobile preview and keeps relationship lines out of the visualization.
