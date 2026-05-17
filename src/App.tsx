import { ChangeEvent, FormEvent, TouchEvent, useEffect, useMemo, useRef, useState } from "react";
import { buildFallbackSource, captureUrl, mergeCaptureResult } from "./capture";
import { buildMemoryClusters } from "./clusters";
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

type SearchResult = {
  source: SourceItem;
  score: number;
  reasons: string[];
};

type ClusterNode = {
  id: string;
  label: string;
  x: number;
  y: number;
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

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function captureQuality(source: SourceItem) {
  switch (source.captureStatus) {
    case "metadata":
      return {
        label: "Metadata only",
        text: "LinkTrace captured page metadata and generated cues from the readable fields.",
      };
    case "partial":
      return {
        label: "Partial capture",
        text: "Some metadata was available, but LinkTrace is keeping fallback context visible.",
      };
    case "link_only":
      return {
        label: "Link only",
        text: "The page was blocked or unreadable, so LinkTrace saved the original link and reason.",
      };
    case "screenshot":
      return {
        label: "Screenshot saved",
        text: "A screenshot is preserved locally as visual context. OCR is not enabled.",
      };
    case "failed":
      return {
        label: "Failed safely",
        text: "The URL could not be parsed, but LinkTrace kept the manual context.",
      };
    case "pending":
      return {
        label: "Checking",
        text: "LinkTrace saved the source first and is checking capture quality.",
      };
    case "manual":
    default:
      return {
        label: "Manual save",
        text: "This source was saved from user-provided link and note text.",
      };
  }
}

function App() {
  const [sources, setSources] = useState<SourceItem[]>(readStoredSources);
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSource, setSelectedSource] = useState<SourceItem | null>(null);
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);
  const [clusterZoom, setClusterZoom] = useState(1);
  const [clusterPan, setClusterPan] = useState({ x: 0, y: 0 });
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const pinchDistanceRef = useRef<number | null>(null);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sources));
  }, [sources]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedUrl = params.get("url") || params.get("text") || "";
    const sharedTitle = params.get("title") || "Shared to LinkTrace";

    if (window.location.pathname === "/share" && sharedUrl) {
      saveSharedSource(sharedUrl, sharedTitle);
      window.history.replaceState({}, "", "/");
    }
    // Run only once on startup so URL share params do not duplicate sources.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (sources.length === 0) {
      return [
        {
          id: "preview-ai",
          label: "AI memory",
          sharedCues: ["ai", "workflow"],
          sourceCount: 3,
          sourceIds: [],
        },
        {
          id: "preview-learning",
          label: "learning trail",
          sharedCues: ["learning", "career"],
          sourceCount: 2,
          sourceIds: [],
        },
        {
          id: "preview-community",
          label: "community signals",
          sharedCues: ["community", "event"],
          sourceCount: 2,
          sourceIds: [],
        },
      ];
    }

    return buildMemoryClusters(sources);
  }, [sources]);

  const searchResults = useMemo(() => searchSources(sources, searchQuery), [sources, searchQuery]);
  const selectedCluster = useMemo(
    () => clusters.find((cluster) => cluster.id === selectedClusterId) ?? null,
    [clusters, selectedClusterId],
  );
  const selectedClusterSources = useMemo(() => {
    if (!selectedCluster) return [];
    const selectedIds = new Set(selectedCluster.sourceIds);
    return sources.filter((source) => selectedIds.has(source.id));
  }, [selectedCluster, sources]);

  const clusterNodes = useMemo<ClusterNode[]>(() => {
    const sourceById = new Map(sources.map((source) => [source.id, source]));
    const seen = new Set<string>();
    const centers = [
      { x: 24, y: 24 },
      { x: 68, y: 28 },
      { x: 36, y: 66 },
      { x: 72, y: 68 },
      { x: 50, y: 48 },
    ];
    const offsets = [
      { x: -8, y: 0 },
      { x: 8, y: -6 },
      { x: 0, y: 10 },
      { x: 10, y: 9 },
      { x: -10, y: -9 },
    ];

    return clusters.flatMap((cluster, clusterIndex) => {
      const center = centers[clusterIndex % centers.length];
      return cluster.sourceIds
        .filter((id) => {
          if (seen.has(id)) return false;
          seen.add(id);
          return true;
        })
        .map((id, nodeIndex) => {
          const source = sourceById.get(id);
          const offset = offsets[nodeIndex % offsets.length];
          return {
            id,
            label: (source?.recallCues[0] ?? cluster.sharedCues[0] ?? cluster.label).slice(0, 24),
            x: clamp(center.x + offset.x, 10, 84),
            y: clamp(center.y + offset.y, 12, 82),
          };
        });
    });
  }, [clusters, sources]);

  function saveSharedSource(nextUrl: string, nextNote: string) {
    const fallbackSource = buildFallbackSource(nextUrl, nextNote);
    setSources((current) => [fallbackSource, ...current]);
    void captureUrl(nextUrl).then((result) => {
      setSources((current) =>
        current.map((source) =>
          source.id === fallbackSource.id ? mergeCaptureResult(source, result) : source,
        ),
      );
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!url.trim()) return;
    saveSharedSource(url, note);
    setUrl("");
    setNote("");
  }

  function clearSources() {
    setSources([]);
  }

  function loadDemoMemory() {
    setSources(DEMO_SOURCES);
  }

  function simulateShareToLinkTrace() {
    saveSharedSource(
      "https://github.com/Q00/ouroboros",
      "Shared from mobile sheet: spec loop repo to review later",
    );
  }

  function changeClusterZoom(delta: number) {
    setClusterZoom((current) => clamp(Number((current + delta).toFixed(2)), 0.5, 2));
  }

  function resetClusterView() {
    setClusterZoom(1);
    setClusterPan({ x: 0, y: 0 });
    setSelectedClusterId(null);
    pinchDistanceRef.current = null;
  }

  function selectClusterForSource(sourceId: string) {
    const cluster = clusters.find((candidate) => candidate.sourceIds.includes(sourceId));
    if (cluster) setSelectedClusterId(cluster.id);
  }

  function handleClusterPointerDown(clientX: number, clientY: number) {
    dragStartRef.current = { x: clientX, y: clientY, panX: clusterPan.x, panY: clusterPan.y };
  }

  function handleClusterPointerMove(clientX: number, clientY: number) {
    if (!dragStartRef.current) return;
    const nextX = dragStartRef.current.panX + clientX - dragStartRef.current.x;
    const nextY = dragStartRef.current.panY + clientY - dragStartRef.current.y;
    setClusterPan({ x: clamp(nextX, -120, 120), y: clamp(nextY, -80, 80) });
  }

  function endClusterPointer() {
    dragStartRef.current = null;
  }

  function handleClusterTouchMove(event: TouchEvent<HTMLDivElement>) {
    if (event.touches.length !== 2) return;
    const [first, second] = Array.from(event.touches);
    const distance = Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);

    if (pinchDistanceRef.current) {
      const delta = (distance - pinchDistanceRef.current) / 240;
      setClusterZoom((current) => clamp(Number((current + delta).toFixed(2)), 0.5, 2));
    }

    pinchDistanceRef.current = distance;
  }

  function updateSourceWithScreenshot(sourceId: string, screenshotDataUrl: string) {
    setSources((current) =>
      current.map((source) =>
        source.id === sourceId
          ? {
              ...source,
              screenshotDataUrl,
              captureStatus: "screenshot",
              captureMethod: "fallback",
              summary: source.summary || "Screenshot preserved as local context.",
            }
          : source,
      ),
    );
    setSelectedSource((current) =>
      current?.id === sourceId
        ? {
            ...current,
            screenshotDataUrl,
            captureStatus: "screenshot",
            captureMethod: "fallback",
            summary: current.summary || "Screenshot preserved as local context.",
          }
        : current,
    );
  }

  function handleScreenshotUpload(sourceId: string, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") updateSourceWithScreenshot(sourceId, reader.result);
    };
    reader.readAsDataURL(file);
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
              <span className="quality-badge">{captureQuality(selectedSource).label}</span>
              <dl className="detail-grid">
                <div>
                  <dt>Capture quality</dt>
                  <dd>{captureQuality(selectedSource).label}</dd>
                </div>
                <div>
                  <dt>Capture method</dt>
                  <dd>{selectedSource.captureMethod}</dd>
                </div>
                <div>
                  <dt>Original URL</dt>
                  <dd>{selectedSource.finalUrl || selectedSource.url}</dd>
                </div>
                <div>
                  <dt>Tags</dt>
                  <dd>{selectedSource.tags.join(", ")}</dd>
                </div>
                {selectedSource.contentType ? (
                  <div>
                    <dt>Content type</dt>
                    <dd>{selectedSource.contentType}</dd>
                  </div>
                ) : null}
                {selectedSource.failureReason ? (
                  <div>
                    <dt>Fallback reason</dt>
                    <dd>{selectedSource.failureReason}</dd>
                  </div>
                ) : null}
              </dl>
              <p className="capture-explainer">{captureQuality(selectedSource).text}</p>
              <a
                className="external-link"
                href={selectedSource.finalUrl || selectedSource.url}
                rel="noreferrer"
                target="_blank"
              >
                Open original link
              </a>
              <label className="screenshot-upload" htmlFor={`screenshot-${selectedSource.id}`}>
                <span>Add screenshot</span>
                <input
                  accept="image/*"
                  id={`screenshot-${selectedSource.id}`}
                  type="file"
                  onChange={(event) => handleScreenshotUpload(selectedSource.id, event)}
                />
              </label>
              <p className="screenshot-note">
                Screenshot fallback preserves visual context locally. OCR/image understanding is not enabled.
              </p>
              {selectedSource.screenshotDataUrl ? (
                <img
                  alt={`Screenshot fallback for ${selectedSource.title}`}
                  className="screenshot-preview"
                  src={selectedSource.screenshotDataUrl}
                />
              ) : null}
            </article>
          </section>
        ) : null}

        <p className="local-note">Demo data is stored locally in this browser.</p>

        <section className="share-simulation" aria-label="Share to LinkTrace demo">
          <div>
            <h2>Share to LinkTrace</h2>
            <p>Receive a link, save immediately, then review later in Today Brief and Memory Clusters.</p>
          </div>
          <button type="button" onClick={simulateShareToLinkTrace}>
            Simulate share
          </button>
        </section>

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
                <button
                  className="source-card brief-card"
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedSource(item)}
                >
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
                  <span className="quality-badge">{captureQuality(item).label}</span>
                  {item.failureReason ? (
                    <p className="fallback-reason">
                      LinkTrace saved this with the capture fallback ladder.
                    </p>
                  ) : null}
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="panel clusters-panel" aria-labelledby="clusters-title">
          <div className="section-heading">
            <div>
              <h2 id="clusters-title">Memory Clusters</h2>
              <p className="section-subtitle">{clusterNodes.length || "Demo"} cue nodes</p>
            </div>
            <div className="zoom-controls" aria-label="Cluster zoom controls">
              <button type="button" onClick={() => changeClusterZoom(-0.25)}>
                -
              </button>
              <button type="button" onClick={() => changeClusterZoom(0.25)}>
                +
              </button>
              <button type="button" onClick={resetClusterView}>
                Reset
              </button>
            </div>
          </div>
          <div
            className="cluster-map"
            aria-label="Zoomable Memory Clusters canvas without relationship lines"
            onMouseDown={(event) => handleClusterPointerDown(event.clientX, event.clientY)}
            onMouseMove={(event) => handleClusterPointerMove(event.clientX, event.clientY)}
            onMouseLeave={endClusterPointer}
            onMouseUp={endClusterPointer}
            onTouchStart={(event) => {
              if (event.touches.length === 1) {
                handleClusterPointerDown(event.touches[0].clientX, event.touches[0].clientY);
              }
            }}
            onTouchMove={(event) => {
              if (event.touches.length === 1) {
                handleClusterPointerMove(event.touches[0].clientX, event.touches[0].clientY);
              }
              handleClusterTouchMove(event);
            }}
            onTouchEnd={() => {
              endClusterPointer();
              pinchDistanceRef.current = null;
            }}
          >
            <div
              className="cluster-space"
              style={{
                transform: `translate(${clusterPan.x}px, ${clusterPan.y}px) scale(${clusterZoom})`,
              }}
            >
              {clusters.map((cluster, index) => (
                <button
                  className={`cluster-label cluster-label-${index + 1}`}
                  key={cluster.id}
                  type="button"
                  onClick={() => setSelectedClusterId(cluster.id)}
                >
                  <strong>{cluster.label}</strong>
                  <span>{cluster.sourceCount} links</span>
                </button>
              ))}
              {clusterNodes.map((node) => (
                <button
                  className={`cluster-node ${
                    selectedCluster && !selectedCluster.sourceIds.includes(node.id) ? "is-dimmed" : ""
                  } ${selectedCluster?.sourceIds.includes(node.id) ? "is-selected" : ""}`}
                  key={node.id}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  type="button"
                  onClick={() => selectClusterForSource(node.id)}
                >
                  {node.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {selectedCluster ? (
          <section className="bottom-sheet" aria-label="Selected memory cluster">
            <div className="sheet-handle" aria-hidden="true" />
            <div className="section-heading">
              <div>
                <p className="cue-label">Selected cue</p>
                <h2>{selectedCluster.label}</h2>
                <p className="section-subtitle">{selectedCluster.sourceCount} related sources</p>
              </div>
              <button type="button" onClick={() => setSelectedClusterId(null)}>
                Close
              </button>
            </div>
            <div className="mini-chip-row" aria-label="Shared cues">
              {selectedCluster.sharedCues.slice(0, 4).map((cue) => (
                <span className="mini-chip" key={cue}>
                  {cue}
                </span>
              ))}
            </div>
            <div className="sheet-source-list">
              {selectedClusterSources.map((source) => (
                <button
                  className="sheet-source"
                  key={source.id}
                  type="button"
                  onClick={() => setSelectedSource(source)}
                >
                  <h3>{source.title}</h3>
                  <p>{source.summary}</p>
                  <p className="cue-label">Find later by</p>
                  <div className="mini-chip-row">
                    {source.recallCues.map((cue) => (
                      <span className="mini-chip" key={cue}>
                        {cue}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}

export default App;
