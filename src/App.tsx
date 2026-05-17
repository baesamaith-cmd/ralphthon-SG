import { FormEvent, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "linktrace.sources";

type CaptureStatus = "manual" | "metadata" | "partial" | "link_only" | "screenshot";

export type SourceItem = {
  id: string;
  url: string;
  title: string;
  domain: string;
  description: string;
  summary: string;
  recallCues: string[];
  tags: string[];
  captureStatus: CaptureStatus;
  captureMethod: "manual";
  createdAt: string;
  note?: string;
  screenshotDataUrl?: string;
};

const clusters = [
  { name: "AI tools", count: 3 },
  { name: "Personal systems", count: 2 },
  { name: "Community links", count: 2 },
];

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "manual source";
  }
}

function normalizeUrl(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function buildSource(urlInput: string, noteInput: string): SourceItem {
  const url = normalizeUrl(urlInput);
  const domain = getDomain(url);
  const note = noteInput.trim();
  const fallbackTitle = domain === "manual source" ? "Saved manual link" : domain;
  const cueBase = note || domain.replace(/\./g, " ");

  return {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
    url,
    title: note ? note.slice(0, 64) : fallbackTitle,
    domain,
    description: note || "Saved locally before metadata capture runs.",
    summary: note
      ? `Saved note: ${note}`
      : "Saved locally. Metadata and richer summary will be added by a later ticket.",
    recallCues: cueBase
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 3)
      .map((cue) => cue.toLowerCase()),
    tags: ["manual", "local"],
    captureStatus: "manual",
    captureMethod: "manual",
    createdAt: new Date().toISOString(),
    note: note || undefined,
  };
}

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

function App() {
  const [sources, setSources] = useState<SourceItem[]>(readStoredSources);
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sources));
  }, [sources]);

  const cueItems = useMemo(() => {
    const cues = sources.flatMap((source) => source.recallCues).slice(0, 3);
    return cues.length > 0 ? cues : ["AI summaries", "sleep habit", "open-source notes"];
  }, [sources]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!url.trim()) return;
    setSources((current) => [buildSource(url, note), ...current]);
    setUrl("");
    setNote("");
  }

  function clearSources() {
    setSources([]);
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
          />
        </label>

        <p className="local-note">Demo data is stored locally in this browser.</p>

        <form className="capture-form" onSubmit={handleSubmit}>
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
            <h2 id="brief-title">Today Brief</h2>
            <button>Load demo</button>
          </div>
          {sources.length === 0 ? (
            <div className="empty-state">
              <h3>Shared links will appear here.</h3>
              <p>Paste a link above to save it locally before metadata capture runs.</p>
            </div>
          ) : (
            <div className="brief-list">
              {sources.map((item) => (
                <article className="source-card" key={item.id}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                    <small>{item.domain}</small>
                  </div>
                  <span>{item.captureStatus}</span>
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
            {clusters.map((cluster, index) => (
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
