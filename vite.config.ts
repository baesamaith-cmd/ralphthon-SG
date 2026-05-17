import type { IncomingMessage, ServerResponse } from "node:http";
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

function extractMetadata(html: string) {
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
  const metadata = extractMetadata(html);
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
    parserUsed: "server-fetch-metadata",
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
    response.statusCode = 200;
    response.setHeader("Content-Type", "application/json");
    response.end(
      JSON.stringify({
        captureStatus: "link_only",
        captureMethod: "fallback",
        failureReason: error instanceof Error && error.name === "TimeoutError" ? "timeout" : "network_error",
        fallbackAvailable: true,
        parserUsed: "server-fetch-fallback",
        finalUrl: fallbackUrl,
        title: fallbackUrl ? getDomain(fallbackUrl) : "Link saved with fallback",
        description:
          "The server capture route could not read this page directly. It may require login, block bots, or be unavailable.",
        domain: fallbackUrl ? getDomain(fallbackUrl) : "manual source",
        userMessage: "Server capture failed, so LinkTrace kept the link-only fallback.",
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
