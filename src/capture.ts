import type { CaptureMethod, CaptureStatus, FailureReason, SourceItem } from "./types";

export type CaptureResult = {
  captureStatus: CaptureStatus;
  captureMethod: CaptureMethod;
  failureReason?: FailureReason;
  fallbackAvailable: boolean;
  parserUsed: string;
  finalUrl: string;
  contentType?: string;
  title: string;
  description: string;
  imageUrl?: string;
  domain: string;
  userMessage: string;
};

const FETCH_TIMEOUT_MS = 1800;
const URL_IN_TEXT_PATTERN = /https?:\/\/[^\s<>"']+|(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:\/[^\s<>"']*)?/i;

export function normalizeUrl(input: string) {
  const match = input.trim().match(URL_IN_TEXT_PATTERN);
  const trimmed = (match?.[0] ?? input).trim().replace(/[),.;!?]+$/, "");
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "manual source";
  }
}

function validateUrl(input: string) {
  const normalized = normalizeUrl(input);

  try {
    const parsed = new URL(normalized);
    if (!["http:", "https:"].includes(parsed.protocol)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function makeId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

const STOP_WORDS = new Set([
  "the",
  "and",
  "with",
  "this",
  "that",
  "from",
  "into",
  "link",
  "page",
  "saved",
  "metadata",
]);

function clampSummary(text: string, fallback: string) {
  const normalized = (text || fallback).replace(/\s+/g, " ").trim();
  if (normalized.length <= 160) return normalized;
  return `${normalized.slice(0, 157).trim()}...`;
}

function cuesFromText(text: string, domain: string) {
  const words = `${text} ${domain.replace(/\./g, " ")}`
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));

  const uniqueWords = Array.from(new Set(words));
  const domainCue = domain.split(".")[0]?.replace(/-/g, " ");
  const phraseCues = [
    uniqueWords.slice(0, 2).join(" "),
    uniqueWords.slice(2, 4).join(" "),
    domainCue ? `${domainCue} note` : "",
    uniqueWords.includes("sleep") ? "sleep timing" : "",
    uniqueWords.includes("career") ? "career growth" : "",
    uniqueWords.includes("agent") ? "agent memory" : "",
    uniqueWords.includes("video") ? "watch later" : "",
  ].filter(Boolean);

  const cues = Array.from(new Set(phraseCues))
    .filter((cue) => cue.split(/\s+/).length <= 5)
    .slice(0, 5);
  const fallbackCues = ["find later", "saved source", "manual note"];

  for (const cue of fallbackCues) {
    if (cues.length >= 3) break;
    if (!cues.includes(cue)) cues.push(cue);
  }

  return cues;
}

function titleFromUrl(url: string) {
  const domain = getDomain(url);
  return domain === "manual source" ? "Saved link" : domain;
}

function getMeta(document: Document, selector: string) {
  return document.querySelector(selector)?.getAttribute("content")?.trim() ?? "";
}

function extractMetadata(html: string) {
  const document = new DOMParser().parseFromString(html, "text/html");
  const title =
    getMeta(document, 'meta[property="og:title"]') ||
    getMeta(document, 'meta[name="twitter:title"]') ||
    document.querySelector("title")?.textContent?.trim() ||
    "";
  const description =
    getMeta(document, 'meta[property="og:description"]') ||
    getMeta(document, 'meta[name="description"]') ||
    getMeta(document, 'meta[name="twitter:description"]') ||
    "";
  const imageUrl =
    getMeta(document, 'meta[property="og:image"]') || getMeta(document, 'meta[name="twitter:image"]');
  const articleText =
    document.querySelector("article")?.textContent?.replace(/\s+/g, " ").trim().slice(0, 220) ?? "";

  return { title, description, imageUrl, articleText };
}

function classifyFetchError(error: unknown): FailureReason {
  if (error instanceof DOMException && error.name === "AbortError") return "timeout";
  if (error instanceof TypeError) return "network_error";
  return "parser_error";
}

function platformFallback(url: URL): CaptureResult | null {
  const domain = url.hostname.replace(/^www\./, "");
  const pathLabel = url.pathname.split("/").filter(Boolean).slice(0, 2).join(" / ");

  if (domain.includes("x.com") || domain.includes("twitter.com")) {
    return {
      captureStatus: "link_only",
      captureMethod: "fallback",
      failureReason: "blocked_or_login_required",
      fallbackAvailable: true,
      parserUsed: "platform-fallback",
      finalUrl: url.href,
      title: "Social post saved with fallback",
      description: "This page may require login or block metadata capture.",
      domain,
      userMessage: "This social page may be login-gated, so LinkTrace saved the link and context.",
    };
  }

  if (domain.includes("reddit.com")) {
    return {
      captureStatus: "partial",
      captureMethod: "fallback",
      failureReason: "metadata_missing",
      fallbackAvailable: true,
      parserUsed: "platform-fallback",
      finalUrl: url.href,
      title: pathLabel || "Reddit link saved",
      description: "Reddit metadata can be limited, but the source remains searchable by domain.",
      domain,
      userMessage: "LinkTrace saved this Reddit link with partial context.",
    };
  }

  return null;
}

async function tryOembed(url: URL): Promise<CaptureResult | null> {
  const domain = url.hostname.replace(/^www\./, "");
  if (!domain.includes("youtube.com") && !domain.includes("youtu.be")) return null;

  const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(url.href)}&format=json`;
  const response = await fetch(endpoint, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  if (!response.ok) return null;
  const data = (await response.json()) as { title?: string; author_name?: string; thumbnail_url?: string };

  return {
    captureStatus: "metadata",
    captureMethod: "oembed",
    fallbackAvailable: true,
    parserUsed: "youtube-oembed",
    finalUrl: url.href,
    contentType: "application/json",
    title: data.title || "YouTube video",
    description: data.author_name ? `Video by ${data.author_name}` : "YouTube video metadata captured.",
    imageUrl: data.thumbnail_url,
    domain,
    userMessage: "YouTube oEmbed metadata captured.",
  };
}

export function buildFallbackSource(urlInput: string, noteInput: string): SourceItem {
  const url = normalizeUrl(urlInput);
  const domain = getDomain(url);
  const note = noteInput.trim();
  const fallbackTitle = note || titleFromUrl(url);
  const fallbackSummary = note
    ? `Saved note: ${note}`
    : "Saved locally. LinkTrace will keep the link even if metadata is unavailable.";

  return {
    id: makeId(),
    url,
    title: fallbackTitle.slice(0, 80),
    domain,
    description: note || "Saved locally while LinkTrace checks capture quality.",
    summary: clampSummary(fallbackSummary, "Saved locally for later review."),
    recallCues: cuesFromText(note || domain, domain),
    tags: ["manual", "local"],
    captureStatus: "pending",
    captureMethod: "manual",
    createdAt: new Date().toISOString(),
    note: note || undefined,
    fallbackAvailable: true,
    parserUsed: "manual-fallback",
    finalUrl: url,
  };
}

export async function captureUrl(urlInput: string): Promise<CaptureResult> {
  const parsed = validateUrl(urlInput);
  const normalized = normalizeUrl(urlInput);
  const fallbackDomain = getDomain(normalized);

  if (!parsed) {
    return {
      captureStatus: "failed",
      captureMethod: "fallback",
      failureReason: "invalid_url",
      fallbackAvailable: true,
      parserUsed: "url-validator",
      finalUrl: normalized,
      title: "Invalid link saved",
      description: "The link format could not be parsed.",
      domain: fallbackDomain,
      userMessage: "This does not look like a valid URL, but LinkTrace kept your note.",
    };
  }

  const platformResult = platformFallback(parsed);
  if (platformResult) return platformResult;

  try {
    const oembedResult = await tryOembed(parsed);
    if (oembedResult) return oembedResult;
  } catch {
    // Fall through to normal metadata capture; oEmbed is an enhancement, not a hard dependency.
  }

  try {
    const response = await fetch(parsed.href, {
      headers: { Accept: "text/html,application/xhtml+xml" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    const contentType = response.headers.get("content-type") ?? "";
    if (!response.ok) {
      return {
        captureStatus: "link_only",
        captureMethod: "fallback",
        failureReason: response.status === 401 || response.status === 403 ? "blocked_or_login_required" : "http_error",
        fallbackAvailable: true,
        parserUsed: "fetch-status",
        finalUrl: response.url || parsed.href,
        contentType,
        title: titleFromUrl(parsed.href),
        description: `HTTP ${response.status} while reading metadata.`,
        domain: getDomain(response.url || parsed.href),
        userMessage: "LinkTrace saved the link because the page did not allow metadata capture.",
      };
    }

    if (!contentType.includes("text/html")) {
      return {
        captureStatus: "link_only",
        captureMethod: "fallback",
        failureReason: "unsupported_content_type",
        fallbackAvailable: true,
        parserUsed: "content-type-check",
        finalUrl: response.url || parsed.href,
        contentType,
        title: titleFromUrl(parsed.href),
        description: "The response was not readable HTML metadata.",
        domain: getDomain(response.url || parsed.href),
        userMessage: "LinkTrace saved the link because this content type is not readable as a page.",
      };
    }

    const html = await response.text();
    const metadata = extractMetadata(html);
    const title = metadata.title || titleFromUrl(response.url || parsed.href);
    const description = metadata.description || metadata.articleText;

    return {
      captureStatus: description ? "metadata" : "partial",
      captureMethod: "fetch",
      failureReason: description ? undefined : "metadata_missing",
      fallbackAvailable: true,
      parserUsed: "native-fetch-domparser",
      finalUrl: response.url || parsed.href,
      contentType,
      title,
      description: description || "The page loaded but did not expose readable metadata.",
      imageUrl: metadata.imageUrl,
      domain: getDomain(response.url || parsed.href),
      userMessage: description
        ? "Metadata captured."
        : "LinkTrace saved the link because the page did not expose readable metadata.",
    };
  } catch (error) {
    const failureReason = classifyFetchError(error);
    return {
      captureStatus: "link_only",
      captureMethod: "fallback",
      failureReason,
      fallbackAvailable: true,
      parserUsed: "fetch-fallback",
      finalUrl: parsed.href,
      title: titleFromUrl(parsed.href),
      description:
        failureReason === "timeout"
          ? "The page took too long to respond."
          : "The browser could not read this page directly, often because of CORS or network limits.",
      domain: getDomain(parsed.href),
      userMessage:
        failureReason === "timeout"
          ? "This page timed out, so LinkTrace saved the link-only fallback."
          : "LinkTrace saved the link because the page could not be read directly.",
    };
  }
}

export function mergeCaptureResult(source: SourceItem, result: CaptureResult): SourceItem {
  const cueText = `${result.title} ${result.description}`;

  return {
    ...source,
    title: result.title || source.title,
    domain: result.domain || source.domain,
    description: result.description || source.description,
    summary: clampSummary(result.description, source.summary),
    recallCues: cuesFromText(cueText, result.domain || source.domain),
    tags: Array.from(new Set([...source.tags, result.captureMethod, result.domain])),
    captureStatus: result.captureStatus,
    captureMethod: result.captureMethod,
    failureReason: result.failureReason,
    fallbackAvailable: result.fallbackAvailable,
    parserUsed: result.parserUsed,
    finalUrl: result.finalUrl,
    contentType: result.contentType,
    imageUrl: result.imageUrl,
  };
}
