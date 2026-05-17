const cueItems = ["AI summaries", "sleep habit", "open-source notes"];

const briefItems = [
  {
    title: "What you saved today",
    summary: "Three links are ready to review, each with short cues for later search.",
    quality: "Demo data",
  },
  {
    title: "Hard-to-parse links stay useful",
    summary: "LinkTrace keeps the source, domain, and fallback reason instead of failing silently.",
    quality: "Fallback ready",
  },
];

const clusters = [
  { name: "AI tools", count: 3 },
  { name: "Personal systems", count: 2 },
  { name: "Community links", count: 2 },
];

function App() {
  return (
    <main className="app-shell" aria-label="LinkTrace workspace">
      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Local demo workspace</p>
            <h1>LinkTrace</h1>
            <p className="tagline">Save messy links. Find them by memory.</p>
          </div>
          <button className="icon-button" aria-label="Open source capture">
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
          <div className="brief-list">
            {briefItems.map((item) => (
              <article className="source-card" key={item.title}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                </div>
                <span>{item.quality}</span>
              </article>
            ))}
          </div>
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
