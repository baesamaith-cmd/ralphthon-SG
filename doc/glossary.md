# Glossary

## Product Terms

- LinkTrace: The mobile-first link memory app planned in this repo.
- source: A saved URL, pasted text, or screenshot fallback.
- recall cue: A short phrase that helps a user find a saved source later from vague memory.
- Today Brief: A daily summary view of recently saved sources.
- Memory Cluster: A mobile visualization that groups similar sources without requiring user-created folders.
- capture status: The state of a source after parsing, such as `metadata`, `partial`, `link_only`, or `screenshot`.
- failure reason: A structured explanation for partial capture, such as `blocked_or_login_required`, `metadata_missing`, or `js_rendered`.
- demo dataset: Deterministic seed data used to keep the demo reliable when external links are unavailable.

## Loop Terms

- interview: The pre-loop clarification phase where the product, user, constraints, and verification commands are defined.
- ticket: A small, numbered, verifiable unit of work in `doc/tickets/`.
- acceptance criteria: Observable behavior that must be true for a ticket to count as complete.
- verification: The command or manual check that judges whether a ticket passed.
- Ralph loop: A repeated agent workflow that reads repo-local instructions, implements the next ticket, verifies it, records progress, and moves on.
- dry run: The first single-ticket execution used to test whether the loop is ready before the code-touch-ban phase.
- code-touch-ban phase: The period when humans do not manually edit code and only run or supervise the loop.
- done-with-follow-up: A ticket state used when the demo fallback works and build passes, but some quality criteria remain below target.
- blocked: A ticket state used only when build fails, core demo screens cannot render, storage/demo data cannot load, or no fallback is possible.
