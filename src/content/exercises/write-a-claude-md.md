---
title: Write your first CLAUDE.md
domain: workflows
difficulty: beginner
estMinutes: 10
order: 1
intro: Give Claude Code durable project memory by creating a CLAUDE.md, then watch it get used.
steps:
  - "In any small project (or a fresh folder with a `package.json` or `README`), start Claude Code."
  - "Ask Claude to run `/init` — it will scan the project and draft a `CLAUDE.md` for you."
  - "Edit the generated `CLAUDE.md`: keep only durable facts — build/test commands, conventions, and one or two gotchas. Delete anything obvious or transient."
  - "Add a deliberately specific convention, e.g. `Always use 2-space indentation` or `Never edit files in /generated`."
  - "Start a new Claude Code session and ask it to make a small change. Confirm it follows your convention without being told again."
hints:
  - "`CLAUDE.md` is loaded automatically on every turn, so shorter is better — it costs context each message."
  - "You can have a root `CLAUDE.md` plus additional ones in subfolders that load when you work in that area."
verify:
  - label: "Confirms the file exists at the project root."
    command: "ls CLAUDE.md"
  - label: "See how large it is — aim for tight, high-signal content."
    command: "wc -l CLAUDE.md"
solution: |
  A good starter `CLAUDE.md` is short and high-signal:

  ```markdown
  # Project: acme-api

  ## Commands
  - Build: `npm run build`
  - Test: `npm test` (run before every commit)
  - Lint: `npm run lint`

  ## Conventions
  - 2-space indentation, no semicolons.
  - Never edit files in `src/generated/` — they are produced by `npm run codegen`.
  - New endpoints go in `src/routes/` and must have a test in `test/routes/`.

  ## Gotchas
  - The dev server needs `DATABASE_URL` set; copy `.env.example` to `.env`.
  ```

  Key ideas it demonstrates:

  - **Durable, not transient.** Commands, conventions, and gotchas rarely change. Don't record today's task here.
  - **Concise.** Because it loads every turn, every line should earn its place.
  - **Specific and testable.** "Never edit `src/generated/`" is enforceable; "write good code" is not.
---

**Why this matters:** `CLAUDE.md` is the single most leveraged piece of Claude Code configuration. It's the difference between re-explaining your project every session and having Claude already know it. On the exam, remember the contrast with Agent Skills: CLAUDE.md is *always* loaded, while a Skill loads *on demand*.
