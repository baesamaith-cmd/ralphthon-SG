---
id: 012
status: todo
title: "Add screenshot fallback capture"
---

## Problem

Many social links cannot be fetched. LinkTrace should let users keep context by attaching a screenshot when the web is unreadable.

## Acceptance

- Source detail or capture flow includes an `Add screenshot` action.
- Users can upload an image file.
- The screenshot is stored locally as part of the source.
- The source capture status updates to `screenshot` when appropriate.
- Source cards show a screenshot fallback badge.
- The screenshot can be previewed in source detail.
- If text extraction/OCR is not implemented, the UI clearly treats screenshot as preserved context, not analyzed text.
- The ticket is complete only if blocked-link handling feels intentional and would likely score above 90/100 for robustness.

## Quantitative Review Criteria

- Build exits 0.
- Uploading 1 image stores it locally with the source.
- Screenshot preview is visible in source detail.
- Capture status changes to `screenshot` after upload.
- The app handles at least 1 failed or blocked source with screenshot fallback.
- UI includes a clear no-OCR disclaimer if OCR is not implemented.
- Screenshot upload does not require remote storage.

## Retry Budget and Stop Rule

- Critical demo path: soft-critical.
- Maximum implementation passes: 3.
- Target judge score: 90/100 average.
- Minimum acceptable score: 80/100 if screenshots are preserved locally and clearly labeled, even without OCR.
- If still below 80/100 after 3 passes, apply the Demo Fallback before considering `blocked`.
- Do not claim image understanding or OCR unless it is implemented and verified.

## Demo Fallback

- If upload is unstable, include a screenshot fallback placeholder state in the demo dataset.
- If screenshot preview works but upload polish is weak, mark `done-with-follow-up`.
- Use `blocked` only if screenshot handling breaks source detail or build.

## Verification

```bash
npm run build
```

## Constraints

- Do not require server-side file storage.
- Do not upload screenshots to a remote service for MVP.
- Do not claim OCR exists unless it is actually implemented.

## Hints

- Use local browser file reading and store a data URL for the demo.
