# Ralph Loop

You are running this repository's Ralph loop.

This file should be updated after the real project, stack, and verification commands are chosen.

## Before Every Ticket

1. Read `doc/product.md`.
2. Read `doc/non-goals.md`.
3. Read `doc/glossary.md`.
4. Read `doc/architecture.md`.
5. Read `doc/judge-lenses.md`.
6. Inspect current git status.
7. Find the lowest-numbered file in `doc/tickets/` with `status: todo`.

## Ticket Execution

1. Read the selected ticket fully.
2. Implement exactly that ticket.
3. Add or update tests and verification artifacts required by the ticket.
4. Run the verification command from the ticket.
5. If verification fails, fix the implementation and tests until it passes.
6. Do not implement future tickets early.
7. Do not add features outside the ticket.

## Completion

1. Change the ticket frontmatter from `status: todo` to `status: done`.
2. Add a short `## Completion Notes` section with:
   - files changed
   - tests or checks run
   - important behavior added
3. Commit with message: `Complete ticket NNN: <title>`.
4. Continue to the next todo ticket only if explicitly instructed to keep looping.

## Failure Handling

If blocked:

1. Change the ticket frontmatter from `status: todo` to `status: blocked`.
2. Add a `## Blocked Notes` section explaining:
   - what failed
   - what was tried
   - what information is needed
3. Do not guess around unclear product behavior.

## Operating Principles

- The repository is the memory.
- The ticket is the scope.
- The verification command is the judge.
- One ticket should produce one focused commit.
- Prefer a simple implementation that passes explicit acceptance criteria over an impressive implementation that expands the product.

