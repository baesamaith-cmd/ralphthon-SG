export type CaptureStatus =
  | "pending"
  | "manual"
  | "metadata"
  | "partial"
  | "link_only"
  | "failed"
  | "screenshot";

export type FailureReason =
  | "invalid_url"
  | "network_error"
  | "timeout"
  | "http_error"
  | "blocked_or_login_required"
  | "unsupported_content_type"
  | "js_rendered"
  | "metadata_missing"
  | "parser_error";

export type CaptureMethod = "manual" | "demo" | "fetch" | "oembed" | "fallback";

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
  captureMethod: CaptureMethod;
  createdAt: string;
  note?: string;
  screenshotDataUrl?: string;
  failureReason?: FailureReason;
  fallbackAvailable?: boolean;
  parserUsed?: string;
  finalUrl?: string;
  contentType?: string;
  imageUrl?: string;
};
