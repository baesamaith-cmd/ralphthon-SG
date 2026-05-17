---
id: 017
status: todo
title: "Add eval fixtures and judge scorecard"
---

## Problem

The team needs a clear way to decide whether Trace is ready for judging. The repo should include eval fixtures and a scorecard that maps the product to judge criteria.

## Acceptance

- Add eval/demo fixtures for:
  - diverse random links
  - blocked/metadata-only link
  - screenshot fallback source
  - search-by-memory query
  - cluster grouping example
- Add a judge scorecard document with criteria:
  - impact
  - technical execution
  - originality
  - demo quality
  - harness/agent craft
  - trust/robustness
  - mobile usability
- The scorecard includes a 100-point scoring table.
- The scorecard says the target is an average judge score above 90/100 before calling the project demo-ready.
- The scorecard lists concrete improvements if any criterion is below 90.
- The ticket is complete only if the repo itself can explain why Trace should average above 90/100.

## Quantitative Review Criteria

- At least 5 eval/demo fixtures exist.
- Scorecard has at least 7 criteria.
- Each criterion is scored on a 100-point scale.
- Target average is explicitly `90/100` or higher.
- Any criterion below 90 has at least 1 concrete improvement listed.
- At least 5 vague-memory test queries are included.
- At least 3 cluster expectation examples are included.

## Retry Budget and Stop Rule

- Critical demo path: optional.
- Maximum implementation passes: 2, because this ticket is evaluation/documentation work.
- Target judge score: 90/100 average.
- Minimum acceptable score: 90/100 for the scorecard target.
- If still below 90/100 after 2 passes, apply the Demo Fallback before considering `blocked`.
- Do not invent unsupported evidence to improve the scorecard.

## Demo Fallback

- If full eval coverage is not ready, keep a concise scorecard plus the most important demo fixtures.
- If the scorecard average is below target, mark `done-with-follow-up` and list the weakest criteria.
- Use `blocked` only if the scorecard cannot be created without unsupported claims.

## Verification

```bash
rg -n "90/100|impact|technical execution|demo quality|mobile usability" doc
```

## Constraints

- Do not rely on private judge data.
- Keep score estimates honest and evidence-backed.
- Do not add speculative claims that the demo cannot show.

## Hints

- Put fixtures in `doc/evals/` or an app-specific demo data directory, depending on the stack chosen.
