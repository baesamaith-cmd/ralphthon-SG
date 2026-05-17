import type { SourceItem } from "./types";

export type MemoryCluster = {
  id: string;
  label: string;
  sharedCues: string[];
  sourceCount: number;
  sourceIds: string[];
  isUnclustered?: boolean;
};

const GENERIC_TERMS = new Set([
  "link",
  "links",
  "saved",
  "source",
  "later",
  "personal",
  "manual",
  "local",
  "metadata",
  "demo",
  "page",
  "notes",
]);

const LABELS: Record<string, string> = {
  agent: "agent workflow",
  workflow: "agent workflow",
  ai: "AI memory",
  learning: "learning trail",
  community: "community signals",
  event: "community signals",
  fallback: "fallback cases",
  social: "social context",
  career: "career growth",
};

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !GENERIC_TERMS.has(token));
}

function sourceTerms(source: SourceItem) {
  return Array.from(
    new Set([
      ...source.tags.flatMap(tokenize),
      ...source.recallCues.flatMap(tokenize),
      ...tokenize(source.title),
      ...tokenize(source.summary),
    ]),
  );
}

function labelFor(term: string) {
  return LABELS[term] ?? `${term} links`;
}

export function similarityScore(a: SourceItem, b: SourceItem) {
  const aTerms = new Set(sourceTerms(a));
  const bTerms = new Set(sourceTerms(b));
  let overlap = 0;

  for (const term of aTerms) {
    if (bTerms.has(term)) overlap += 1;
  }

  return overlap;
}

export function buildMemoryClusters(sources: SourceItem[]): MemoryCluster[] {
  if (sources.length === 0) return [];

  const termToSourceIds = new Map<string, Set<string>>();
  const sourceTermMap = new Map<string, string[]>();

  for (const source of sources) {
    const terms = sourceTerms(source);
    sourceTermMap.set(source.id, terms);
    for (const term of terms) {
      if (!termToSourceIds.has(term)) termToSourceIds.set(term, new Set());
      termToSourceIds.get(term)?.add(source.id);
    }
  }

  const namedClusters = Array.from(termToSourceIds.entries())
    .filter(([, sourceIds]) => sourceIds.size >= 2)
    .map(([term, sourceIds]) => {
      const ids = Array.from(sourceIds).sort();
      const sharedCues = Array.from(
        new Set(ids.flatMap((id) => sourceTermMap.get(id) ?? []).filter((cue) => termToSourceIds.get(cue)?.size)),
      )
        .filter((cue) => (termToSourceIds.get(cue)?.size ?? 0) >= 2)
        .slice(0, 4);

      return {
        id: `cluster-${term}`,
        label: labelFor(term),
        sharedCues: sharedCues.length >= 2 ? sharedCues : [term, labelFor(term)],
        sourceCount: ids.length,
        sourceIds: ids,
      };
    })
    .sort((a, b) => b.sourceCount - a.sourceCount || a.label.localeCompare(b.label));

  const deduped: MemoryCluster[] = [];
  const seenLabels = new Set<string>();

  for (const cluster of namedClusters) {
    if (seenLabels.has(cluster.label)) continue;
    if (cluster.label.split(/\s+/).length > 4) continue;
    seenLabels.add(cluster.label);
    deduped.push(cluster);
  }

  const clusteredIds = new Set(deduped.flatMap((cluster) => cluster.sourceIds));
  const unclusteredIds = sources
    .filter((source) => !clusteredIds.has(source.id))
    .map((source) => source.id)
    .sort();

  const clusters = deduped.slice(0, 5);

  if (unclusteredIds.length > 0) {
    clusters.push({
      id: "cluster-unclustered",
      label: "Unclustered",
      sharedCues: ["weak signal", "saved for later"],
      sourceCount: unclusteredIds.length,
      sourceIds: unclusteredIds,
      isUnclustered: true,
    });
  }

  return clusters;
}
