# Interview

This interview captures the current LinkTrace direction.

Use it to refine scope before running the loop, not to restart idea selection from zero.

## Current Answers

1. What are we building? LinkTrace, a mobile-first personal memory for saved links.
2. Who is the primary user? Ordinary users who receive links in chat/social feeds and save them before reading.
3. What problem does it solve? Saved links become forgotten piles; LinkTrace turns them into summaries, recall cues, search, and clusters.
4. What is the smallest useful version? Demo dataset, manual link add, metadata/fallback status, Today Brief, vague-memory search, and Memory Clusters.
5. What is explicitly out of scope? Financial advice, crypto investing, accounts, paywall bypassing, and perfect parsing of every platform.
6. What are the risky assumptions? External links can be hard to parse; mobile cluster UI can become too dense; judge demo must not depend on live network success.
7. What existing code, APIs, datasets, or tools must be used? Repo-local Ralph loop, deterministic demo dataset, mobile viewport checks, and URL parsing package experiments when justified.
8. What verification commands can judge the work? `npm run build`, mobile viewport inspection, demo happy path, and URL platform smoke tests.
9. What should the agent never do without an explicit ticket? Add accounts, server persistence, finance features, or scraping that bypasses access limits.
10. What does done mean by the end of Ralphthon? A 3-minute mobile demo shows saved links becoming summaries, cues, searchable memory, and plausible clusters, with graceful fallbacks.

## Open Refinement Questions

- Which six concrete smoke-test URLs should be used for X/Twitter, Reddit, GitHub, YouTube, news, and blog?
- Should the demo prioritize Korean, English, or bilingual copy?
- What is the preferred implementation stack if a starter is chosen on the day?
