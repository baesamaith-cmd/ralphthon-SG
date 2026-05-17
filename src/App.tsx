import { FormEvent, useEffect, useMemo, useState } from "react";
import { buildFallbackSource, captureUrl, mergeCaptureResult } from "./capture";
import type { SourceItem } from "./types";

const STORAGE_KEY = "linktrace.sources";

const DEMO_SOURCES: SourceItem[] = [
  {
    id: "demo-ai-briefing",
    url: "https://openai.com/index/introducing-codex/",
    title: "Codex agent workflow notes",
    domain: "openai.com",
    description: "A product note about coding agents and repo-local workflows.",
    summary: "Agent workflows work best when the repo carries specs, tickets, and verification.",
    recallCues: ["codex loop", "agent workflow", "repo memory"],
    tags: ["ai", "agent", "workflow"],
    captureStatus: "metadata",
    captureMethod: "demo",
    createdAt: "2026-05-17T09:00:00.000Z",
  },
  {
    id: "demo-ai-video",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    title: "YouTube walkthrough on AI note taking",
    domain: "youtube.com",
    description: "A video link saved from chat for later review.",
    summary: "A saved video can still become searchable through title, provider, and user cues.",
    recallCues: ["video notes", "ai workflow", "watch later"],
    tags: ["ai", "video", "learning"],
    captureStatus: "partial",
    captureMethod: "demo",
    createdAt: "2026-05-17T09:10:00.000Z",
  },
  {
    id: "demo-open-source",
    url: "https://github.com/Q00/ouroboros",
    title: "Ouroboros spec loop repo",
    domain: "github.com",
    description: "An open-source repository about iterative agent loops.",
    summary: "A GitHub repo can be remembered later by its role in spec-first loop design.",
    recallCues: ["spec loop", "github repo", "ouroboros"],
    tags: ["open-source", "agent", "workflow"],
    captureStatus: "metadata",
    captureMethod: "demo",
    createdAt: "2026-05-17T09:20:00.000Z",
  },
  {
    id: "demo-community",
    url: "https://luma.com/4hx7p0vs",
    title: "Ralphthon event page",
    domain: "luma.com",
    description: "Event information and judge context saved before building.",
    summary: "Event pages become useful memory anchors when connected to judge lenses and demo goals.",
    recallCues: ["judge context", "ralphthon", "event page"],
    tags: ["community", "event", "planning"],
    captureStatus: "metadata",
    captureMethod: "demo",
    createdAt: "2026-05-17T09:30:00.000Z",
  },
  {
    id: "demo-health",
    url: "https://www.sleepfoundation.org/sleep-hygiene",
    title: "Sleep hygiene checklist",
    domain: "sleepfoundation.org",
    description: "A practical article about sleep routines.",
    summary: "A normal life-improvement article should be easy to find later from vague cues.",
    recallCues: ["sleep routine", "health checklist", "better rest"],
    tags: ["health", "sleep", "personal"],
    captureStatus: "metadata",
    captureMethod: "demo",
    createdAt: "2026-05-17T09:40:00.000Z",
  },
  {
    id: "demo-career",
    url: "https://newsletter.pragmaticengineer.com/",
    title: "Engineering career essay",
    domain: "pragmaticengineer.com",
    description: "A career-learning link shared by a friend.",
    summary: "Career links are remembered by the decision they support, not by exact URL.",
    recallCues: ["career growth", "engineering essay", "promotion"],
    tags: ["career", "learning", "personal"],
    captureStatus: "metadata",
    captureMethod: "demo",
    createdAt: "2026-05-17T09:50:00.000Z",
  },
  {
    id: "demo-news",
    url: "https://www.reuters.com/technology/",
    title: "Technology news to revisit",
    domain: "reuters.com",
    description: "A news link saved during a busy morning.",
    summary: "News links need a brief and source label so they are not lost in the feed.",
    recallCues: ["tech news", "morning read", "industry"],
    tags: ["news", "technology", "brief"],
    captureStatus: "partial",
    captureMethod: "demo",
    createdAt: "2026-05-17T10:00:00.000Z",
  },
  {
    id: "demo-social-blocked",
    url: "https://x.com/example/status/123",
    title: "Social post with limited metadata",
    domain: "x.com",
    description: "A social link that may be blocked or login-gated.",
    summary: "When a social page is hard to parse, LinkTrace still saves the source and fallback reason.",
    recallCues: ["social post", "login gated", "fallback"],
    tags: ["social", "fallback", "community"],
    captureStatus: "link_only",
    captureMethod: "demo",
    createdAt: "2026-05-17T10:10:00.000Z",
  },
  {
    id: "demo-unclustered-recipe",
    url: "https://www.seriouseats.com/",
    title: "Weekend noodle recipe",
    domain: "seriouseats.com",
    description: "A food link that does not strongly match the main work clusters.",
    summary: "Not every saved link belongs in a strong group, and that should be visible.",
    recallCues: ["noodle recipe", "weekend cooking", "weak cluster"],
    tags: ["unclustered", "food", "personal"],
    captureStatus: "metadata",
    captureMethod: "demo",
    createdAt: "2026-05-17T10:20:00.000Z",
  },
];

const fallbackClusters = [
  { name: "AI tools", count: 3 },
  { name: "Personal systems", count: 2 },
  { name: "Community links", count: 2 },
];

type SearchResult = {
  source: SourceItem;
  score: number;
  reasons: string[];
};

function readStoredSources(): SourceItem[] {
  if (typeof window === "undefined") return [];

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) return [];
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function includesAny(value: string, query: string, tokens: string[]) {
  const normalized = value.toLowerCase();
  return normalized.includes(query) || tokens.some((token) => normalized.includes(token));
}

function searchSources(sources: SourceItem[], query: string): SearchResult[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [];

  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);

  return sources
    .map((source) => {
      let score = 0;
      const reasons: string[] = [];
      const cueMatch = source.recallCues.find((cue) => includesAny(cue, normalizedQuery, tokens));

      if (cueMatch) {
        score += 8;
        reasons.push(`cue: ${cueMatch}`);
      }

      if (includesAny(source.title, normalizedQuery, tokens)) {
        score += 5;
        reasons.push("title");
      }

      if (includesAny(source.summary, normalizedQuery, tokens)) {
        score += 3;
        reasons.push("summary");
      }

      const tagMatch = source.tags.find((tag) => includesAny(tag, normalizedQuery, tokens));
      if (tagMatch) {
        score += 3;
        reasons.push(`tag: ${tagMatch}`);
      }

      if (includesAny(source.domain, normalizedQuery, tokens)) {
        score += 2;
        reasons.push(`domain: ${source.domain}`);
      }

      return { source, score, reasons };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || Date.parse(b.source.createdAt) - Date.parse(a.source.createdAt))
    .slice(0, 5);
}

function App() {
  const [sources, setSources] = useState<SourceItem[]>(readStoredSources);
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState<SourceItem | null>(null);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sources));
  }, [sources]);

  const cueItems = useMemo(() => {
    const cues = sources.flatMap((source) => source.recallCues).slice(0, 3);
    return cues.length > 0 ? cues : ["AI summaries", "sleep habit", "open-source notes"];
  }, [sources]);

  const todaySources = useMemo(() => {
    const today = new Date().toDateString();
    return sources
      .filter((source) => new Date(source.createdAt).toDateString() === today)
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }, [sources]);

  const clusters = useMemo(() => {
    if (sources.length === 0) return fallbackClusters;

    const groups = [
      { name: "AI + agents", tags: ["ai", "agent", "workflow"] },
      { name: "Learning + career", tags: ["learning", "career"] },
      { name: "Community signals", tags: ["community", "event", "social"] },
      { name: "Weakly clustered", tags: ["unclustered"] },
    ];

    return groups
      .map((group) => ({
        name: group.name,
        count: sources.filter((source) => group.tags.some((tag) => source.tags.includes(tag))).length,
      }))
      .filter((group) => group.count > 0);
  }, [sources]);

  const searchResults = useMemo(() => searchSources(sources, searchQuery), [sources, searchQuery]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!url.trim()) return;
    const fallbackSource = buildFallbackSource(url, note);
    setSources((current) => [fallbackSource, ...current]);
    void captureUrl(url).then((result) => {
      setSources((current) =>
        current.map((source) =>
          source.id === fallbackSource.id ? mergeCaptureResult(source, result) : source,
        ),
      );
    });
    setUrl("");
    setNote("");
  }

  function clearSources() {
    setSources([]);
  }

  function loadDemoMemory() {
    setSources(DEMO_SOURCES);
  }

  return (
    <main className="app-shell" aria-label="LinkTrace workspace">
      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Local demo workspace</p>
            <h1>LinkTrace</h1>
            <p className="tagline">Save messy links. Find them by memory.</p>
          </div>
          <button className="icon-button" aria-label="Focus source capture" type="button">
            +
          </button>
        </header>

        <label className="search-label" htmlFor="memory-search">
          <span>Memory search</span>
          <input
            id="memory-search"
            type="search"
            placeholder="Search by what you remember..."
            aria-label="Search by what you remember"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </label>

        {searchQuery.trim() ? (
          <section className="panel search-panel" aria-label="Memory search results">
            <div className="section-heading">
              <div>
                <h2>Search Results</h2>
                <p className="section-subtitle">{searchResults.length} matches</p>
              </div>
            </div>
            {searchResults.length === 0 ? (
              <div className="empty-state">
                <h3>No memory match yet.</h3>
                <p>Try a cue like `agent memory`, `sleep timing`, or load demo memory first.</p>
              </div>
            ) : (
              <div className="brief-list">
                {searchResults.map((result) => (
                  <button
                    className="result-card"
                    key={result.source.id}
                    type="button"
                    onClick={() => setSelectedSource(result.source)}
                  >
                    <strong>{result.source.title}</strong>
                    <span>{result.source.summary}</span>
                    <small>Why this matched: {result.reasons.join(", ")}</small>
                  </button>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {selectedSource ? (
          <section className="panel detail-panel" aria-label="Source detail">
            <div className="section-heading">
              <h2>Source Detail</h2>
              <button type="button" onClick={() => setSelectedSource(null)}>
                Close
              </button>
            </div>
            <article className="source-card">
              <div>
                <h3>{selectedSource.title}</h3>
                <p>{selectedSource.summary}</p>
                <small>{selectedSource.domain}</small>
                <p className="cue-label">Find later by</p>
                <div className="mini-chip-row">
                  {selectedSource.recallCues.map((cue) => (
                    <span className="mini-chip" key={cue}>
                      {cue}
                    </span>
                  ))}
                </div>
              </div>
              <span className="quality-badge">{selectedSource.captureStatus}</span>
            </article>
          </section>
        ) : null}

        <p className="local-note">Demo data is stored locally in this browser.</p>

        <form className="capture-form" onSubmit={handleSubmit}>
          <p className="capture-note">
            Capture fallback ladder: metadata, partial metadata, link-only save, then manual context.
          </p>
          <label htmlFor="source-url">
            <span>Save a link</span>
            <input
              id="source-url"
              inputMode="url"
              placeholder="Paste a URL..."
              type="text"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
            />
          </label>
          <label htmlFor="source-note">
            <span>Optional note</span>
            <input
              id="source-note"
              placeholder="Why will this matter later?"
              type="text"
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
          </label>
          <div className="form-actions">
            <button type="submit">Save link</button>
            <button type="button" onClick={clearSources}>
              Clear demo data
            </button>
          </div>
        </form>

        <section className="panel" aria-labelledby="cues-title">
          <div className="section-heading">
            <h2 id="cues-title">Today's Cues</h2>
            <button>Review</button>
          </div>
          <p className="cue-label">Find later by</p>
          <div className="chip-row" aria-label="Recall cues">
            {cueItems.map((cue) => (
              <button className="cue-chip" key={cue}>
                {cue}
              </button>
            ))}
          </div>
        </section>

        <section className="panel" aria-labelledby="brief-title">
          <div className="section-heading">
            <div>
              <h2 id="brief-title">Today Brief</h2>
              <p className="section-subtitle">{todaySources.length} saved today</p>
            </div>
            <button type="button" onClick={loadDemoMemory}>
              Load demo memory
            </button>
          </div>
          {todaySources.length === 0 ? (
            <div className="empty-state">
              <h3>Shared links will appear here.</h3>
              <p>Paste a link above or load demo memory to see today's saved links.</p>
            </div>
          ) : (
            <div className="brief-list">
              {todaySources.map((item) => (
                <article className="source-card" key={item.id}>
                  <div>
                    <h3>{item.title}</h3>
                    <p className="summary-line">{item.summary}</p>
                    <small>
                      {item.domain} · {new Date(item.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {item.failureReason ? ` · ${item.failureReason}` : ""}
                    </small>
                    <p className="cue-label">Find later by</p>
                    <div className="mini-chip-row" aria-label={`Recall cues for ${item.title}`}>
                      {item.recallCues.map((cue) => (
                        <span className="mini-chip" key={cue}>
                          {cue}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="quality-badge">{item.captureStatus}</span>
                  {item.failureReason ? (
                    <p className="fallback-reason">
                      LinkTrace saved this with the capture fallback ladder.
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="panel clusters-panel" aria-labelledby="clusters-title">
          <div className="section-heading">
            <h2 id="clusters-title">Memory Clusters</h2>
            <button>Open</button>
          </div>
          <div className="cluster-map" aria-label="Memory cluster preview without relationship lines">
            {clusters.slice(0, 4).map((cluster, index) => (
              <div className={`cluster-bubble cluster-${index + 1}`} key={cluster.name}>
                <strong>{cluster.name}</strong>
                <span>{cluster.count} links</span>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

export default App;
