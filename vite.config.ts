import type { IncomingMessage, ServerResponse } from "node:http";
import { Readability } from "@mozilla/readability";
import * as cheerio from "cheerio";
import { JSDOM } from "jsdom";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const CAPTURE_TIMEOUT_MS = 3500;
const BLOCKED_PAGE_PATTERNS = [
  /javascript is not available/i,
  /enable javascript/i,
  /log in to/i,
  /login to/i,
  /sign in to/i,
  /unsupported browser/i,
  /access denied/i,
  /something went wrong/i,
  /please wait for verification/i,
  /verify you are human/i,
  /checking if the site connection is secure/i,
];

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "manual source";
  }
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function getMeta(html: string, selector: string) {
  const pattern = new RegExp(
    `<meta[^>]+(?:property|name)=["']${selector}["'][^>]+content=["']([^"']+)["'][^>]*>`,
    "i",
  );
  return decodeHtml(html.match(pattern)?.[1] ?? "");
}

function firstText(...values: Array<string | undefined>) {
  return values.map((value) => decodeHtml(value ?? "")).find(Boolean) ?? "";
}

function firstJsonLdValue(html: string, keys: string[]) {
  const $ = cheerio.load(html);
  for (const element of $('script[type="application/ld+json"]').toArray()) {
    try {
      const raw = $(element).text();
      const parsed = JSON.parse(raw);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      for (const item of items.flatMap((entry) => (Array.isArray(entry?.["@graph"]) ? entry["@graph"] : [entry]))) {
        for (const key of keys) {
          const value = item?.[key];
          if (typeof value === "string" && value.trim()) return decodeHtml(value);
          if (Array.isArray(value) && typeof value[0] === "string") return decodeHtml(value[0]);
          if (value && typeof value.url === "string") return decodeHtml(value.url);
        }
      }
    } catch {
      // Ignore malformed JSON-LD; many pages include partial or tracking script data.
    }
  }
  return "";
}

function extractReadableText(html: string, finalUrl: string) {
  try {
    const dom = new JSDOM(html, { url: finalUrl });
    const article = new Readability(dom.window.document).parse();
    const text = firstText(article?.excerpt ?? "", article?.textContent ?? "");
    if (text) return text.slice(0, 360);
  } catch {
    // Fall back to Cheerio selectors below.
  }

  const $ = cheerio.load(html);
  const semanticText = $("article p, main p, [role='main'] p, .post p, .entry-content p")
    .toArray()
    .map((element) => $(element).text())
    .join(" ");

  return decodeHtml(semanticText || $("body").text()).slice(0, 360);
}

function extractMetadata(html: string, finalUrl: string) {
  const $ = cheerio.load(html);
  const title = firstText(
    $('meta[property="og:title"]').attr("content"),
    $('meta[name="twitter:title"]').attr("content"),
    firstJsonLdValue(html, ["headline", "name"]),
    $("title").first().text(),
    $("h1").first().text(),
    getMeta(html, "og:title"),
    getMeta(html, "twitter:title"),
  );
  const description = firstText(
    $('meta[property="og:description"]').attr("content"),
    $('meta[name="description"]').attr("content"),
    $('meta[name="twitter:description"]').attr("content"),
    firstJsonLdValue(html, ["description"]),
    extractReadableText(html, finalUrl),
  );
  const imageUrl = firstText(
    $('meta[property="og:image"]').attr("content"),
    $('meta[name="twitter:image"]').attr("content"),
    firstJsonLdValue(html, ["image"]),
  );

  return { title, description, imageUrl };
}

async function tryYouTubeOembed(url: URL) {
  const domain = url.hostname.replace(/^www\./, "");
  if (!domain.includes("youtube.com") && !domain.includes("youtu.be")) return null;

  const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(url.href)}&format=json`;
  const response = await fetch(endpoint, { signal: AbortSignal.timeout(CAPTURE_TIMEOUT_MS) });
  if (!response.ok) return null;
  const data = (await response.json()) as { title?: string; author_name?: string; thumbnail_url?: string };

  return {
    captureStatus: "metadata",
    captureMethod: "oembed",
    fallbackAvailable: true,
    parserUsed: "server-youtube-oembed",
    finalUrl: url.href,
    contentType: "application/json",
    title: data.title || "YouTube video",
    description: data.author_name ? `Video by ${data.author_name}` : "YouTube video metadata captured.",
    imageUrl: data.thumbnail_url,
    domain,
    userMessage: "Server oEmbed metadata captured.",
  };
}

async function tryRedditJson(url: URL) {
  const domain = url.hostname.replace(/^www\./, "");
  if (!domain.includes("reddit.com")) return null;

  const endpoint = `https://www.reddit.com${url.pathname.replace(/\/$/, "")}.json?raw_json=1`;
  const response = await fetch(endpoint, {
    headers: {
      Accept: "application/json",
      "User-Agent": "LinkTrace/0.1 metadata capture for local user-saved links",
    },
    signal: AbortSignal.timeout(CAPTURE_TIMEOUT_MS),
  });
  if (!response.ok) return null;
  const data = (await response.json()) as Array<{ data?: { children?: Array<{ data?: Record<string, unknown> }> } }>;
  const post = data[0]?.data?.children?.[0]?.data;
  if (!post) return null;
  const title = typeof post.title === "string" ? post.title : "Reddit link";
  const subreddit = typeof post.subreddit_name_prefixed === "string" ? post.subreddit_name_prefixed : domain;
  const selftext = typeof post.selftext === "string" ? post.selftext : "";
  const description = firstText(selftext, typeof post.link_flair_text === "string" ? post.link_flair_text : "", subreddit);

  return {
    captureStatus: description ? "metadata" : "partial",
    captureMethod: "fetch",
    failureReason: description ? undefined : "metadata_missing",
    fallbackAvailable: true,
    parserUsed: "server-reddit-json",
    finalUrl: url.href,
    contentType: "application/json",
    title,
    description: description || `Reddit source from ${subreddit}.`,
    domain,
    userMessage: "Server Reddit JSON metadata captured.",
  };
}

function extractMetadataLegacy(html: string) {
  const title =
    getMeta(html, "og:title") ||
    getMeta(html, "twitter:title") ||
    decodeHtml(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  const description =
    getMeta(html, "og:description") ||
    getMeta(html, "description") ||
    getMeta(html, "twitter:description");
  const imageUrl = getMeta(html, "og:image") || getMeta(html, "twitter:image");
  const articleText = decodeHtml(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .slice(0, 1200),
  ).slice(0, 220);

  return { title, description: description || articleText, imageUrl };
}

async function captureFromServer(urlInput: string) {
  const parsed = new URL(urlInput);
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Unsupported protocol");
  }

  const platformResult = (await tryYouTubeOembed(parsed)) ?? (await tryRedditJson(parsed));
  if (platformResult) return platformResult;

  const response = await fetch(parsed.href, {
    headers: {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.8",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36 LinkTrace/0.1",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(CAPTURE_TIMEOUT_MS),
  });
  const finalUrl = response.url || parsed.href;
  const domain = getDomain(finalUrl);
  const contentType = response.headers.get("content-type") ?? "";

  if (!response.ok) {
    return {
      captureStatus: "link_only",
      captureMethod: "fallback",
      failureReason: response.status === 401 || response.status === 403 ? "blocked_or_login_required" : "http_error",
      fallbackAvailable: true,
      parserUsed: "server-fetch-status",
      finalUrl,
      contentType,
      title: domain,
      description: `HTTP ${response.status} while reading metadata from the server capture route.`,
      domain,
      userMessage: "Server capture saved the link because the page did not allow metadata capture.",
    };
  }

  if (!contentType.includes("text/html")) {
    return {
      captureStatus: "link_only",
      captureMethod: "fallback",
      failureReason: "unsupported_content_type",
      fallbackAvailable: true,
      parserUsed: "server-content-type-check",
      finalUrl,
      contentType,
      title: domain,
      description: "The server capture route reached the URL, but it was not readable HTML.",
      domain,
      userMessage: "Server capture saved the link because this content type is not readable as a page.",
    };
  }

  const html = await response.text();
  const metadata = extractMetadata(html, finalUrl);
  const legacyMetadata = extractMetadataLegacy(html);
  if (!metadata.title) metadata.title = legacyMetadata.title;
  if (!metadata.description) metadata.description = legacyMetadata.description;
  if (!metadata.imageUrl) metadata.imageUrl = legacyMetadata.imageUrl;
  const title = metadata.title || domain;
  const description = metadata.description || "The server reached this page but did not find readable metadata.";
  const blockedPage = BLOCKED_PAGE_PATTERNS.some((pattern) => pattern.test(`${title} ${description}`));

  if (blockedPage) {
    return {
      captureStatus: "link_only",
      captureMethod: "fallback",
      failureReason: description.match(/javascript/i) ? "js_rendered" : "blocked_or_login_required",
      fallbackAvailable: true,
      parserUsed: "server-blocked-page-detection",
      finalUrl,
      contentType,
      title: domain,
      description: "The server reached this page, but it returned a login, bot check, or JavaScript-only shell instead of the link content.",
      domain,
      userMessage: "Server capture found a blocked or JavaScript-rendered page, so LinkTrace kept the link fallback.",
    };
  }

  return {
    captureStatus: metadata.description ? "metadata" : "partial",
    captureMethod: "fetch",
    failureReason: metadata.description ? undefined : "metadata_missing",
    fallbackAvailable: true,
    parserUsed: "server-fetch-cheerio-readability",
    finalUrl,
    contentType,
    title,
    description,
    imageUrl: metadata.imageUrl || undefined,
    domain,
    userMessage: metadata.description ? "Server metadata captured." : "Server capture found only partial metadata.",
  };
}

async function handleCaptureRequest(request: IncomingMessage, response: ServerResponse) {
  let fallbackUrl = "";
  try {
    const requestUrl = new URL(request.url ?? "", "http://localhost");
    const url = requestUrl.searchParams.get("url");
    if (!url) {
      response.statusCode = 400;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ error: "Missing url" }));
      return;
    }

    fallbackUrl = url;
    const result = await captureFromServer(url);
    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify(result));
  } catch (error) {
    const invalidUrl = fallbackUrl ? !URL.canParse(fallbackUrl) : true;
    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json");
    response.end(
      JSON.stringify({
        captureStatus: "link_only",
        captureMethod: "fallback",
        failureReason: invalidUrl
          ? "invalid_url"
          : error instanceof Error && error.name === "TimeoutError"
            ? "timeout"
            : "network_error",
        fallbackAvailable: true,
        parserUsed: invalidUrl ? "server-url-validator" : "server-fetch-fallback",
        finalUrl: fallbackUrl,
        title: fallbackUrl ? getDomain(fallbackUrl) : "Link saved with fallback",
        description: invalidUrl
          ? "The link format could not be parsed."
          : "The server capture route could not read this page directly. It may require login, block bots, or be unavailable.",
        domain: fallbackUrl ? getDomain(fallbackUrl) : "manual source",
        userMessage: invalidUrl
          ? "This does not look like a valid URL, but LinkTrace kept your note."
          : "Server capture failed, so LinkTrace kept the link-only fallback.",
      }),
    );
  }
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: "linktrace-capture-api",
      configureServer(server) {
        server.middlewares.use("/api/capture", handleCaptureRequest);
      },
      configurePreviewServer(server) {
        server.middlewares.use("/api/capture", handleCaptureRequest);
      },
    },
  ],
});
