# Ralphthon SG Scaffold

This repository is a Ralphthon scaffold.

It is intentionally project-neutral. Use it to interview, plan, generate tickets, run one dry run, and then operate a Ralph loop during the code-touch-ban phase.

## Tomorrow's Flow

1. Spend 30 minutes writing `doc/interview.md` with a human and/or LLM.
2. Read `doc/judge-lenses.md` and use it to pressure-test the idea from the judges' likely perspectives.
3. Rewrite `doc/product.md`, `doc/non-goals.md`, `doc/glossary.md`, and `doc/architecture.md`.
4. Generate 10 to 20 tickets in `doc/tickets/`.
5. Make sure every ticket has `Acceptance` and `Verification`.
6. Update `doc/ralph-loop.md`.
7. Run only ticket 001 as a dry run.
8. During the code-touch-ban phase, only run the loop.

## Start Prompt

Use this in a fresh agent session:

```text
This repo is a Ralphthon scaffold, not an implementation assignment yet.

First, read doc/ralphthon-playbook.md.
Then read doc/judge-lenses.md and use it as perspective during idea selection.
Then interview me and create doc/interview.md.
Then rewrite product, non-goals, glossary, architecture, and tickets for the actual project.
Create 10 to 20 small tickets, each with Acceptance and Verification.
After that, update doc/ralph-loop.md.
Run only ticket 001 as a dry run.
After the dry run, stop and report whether the loop is ready for the code-touch-ban phase.
```

## Key Files

- `doc/ralphthon-playbook.md`: the full seven-step operating plan.
- `doc/judge-lenses.md`: public judge research and idea-generation lenses.
- `doc/interview.md`: questions to answer before ticket generation.
- `doc/ralph-loop.md`: the loop prompt used after setup.
- `doc/tickets/`: ticket queue for loop execution.

## Verification

Verification commands must be chosen during the interview and architecture phase. Examples:

```bash
npm test
```

```bash
python3 -m unittest
```

## Requirements

Python 3.11+. Standard library only.

## License

MIT.
