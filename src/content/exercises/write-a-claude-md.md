---
title: Write your first CLAUDE.md
domain: workflows
difficulty: beginner
estMinutes: 15
order: 1
intro: Give Claude Code durable project memory by creating a CLAUDE.md, then explore the configuration hierarchy, @import syntax, and path-scoped rules.
steps:
  - "In any small project (or a fresh folder with a `package.json` or `README`), start Claude Code."
  - "Ask Claude to run `/init` — it will scan the project and draft a `CLAUDE.md` for you."
  - "Edit the generated `CLAUDE.md`: keep only durable facts — build/test commands, conventions, and one or two gotchas. Delete anything obvious or transient."
  - "Add a deliberately specific convention, e.g. `Always use 2-space indentation` or `Never edit files in /generated`."
  - "Create a subdirectory `src/api/` and add a `CLAUDE.md` inside it with API-specific rules (e.g. 'All endpoints must validate input with Zod'). This is the directory-level layer of the hierarchy."
  - "Use `@import path/to/shared-rules.md` in your root `CLAUDE.md` to pull in a shared conventions file without duplicating content."
  - "Create `.claude/rules/test-rules.md` with `paths: [\"**/*.test.*\"]` in its frontmatter — this rule only loads when Claude edits a test file."
  - "Start a new Claude Code session, ask it to edit a test file, and run `/memory` to confirm the test rule is active. Then ask it to edit a non-test file and verify the rule is absent."
hints:
  - "`CLAUDE.md` is loaded automatically on every turn, so shorter is better — it costs context each message."
  - "The hierarchy loads in order: user-level (`~/.claude/CLAUDE.md`) → project root (`CLAUDE.md`) → subdirectory (`src/api/CLAUDE.md`). Later layers can override earlier ones."
  - "`@import` is resolved relative to the file it appears in. Use it to split a large CLAUDE.md into focused modules without copying content."
  - "`.claude/rules/` files use YAML frontmatter with a `paths:` glob list. The rule file is only injected into context when the active file matches one of the globs."
  - "Path-scoped rules are more efficient than a monolithic CLAUDE.md because rules that don't apply to the current file don't consume context tokens."
verify:
  - label: "Confirms the root CLAUDE.md exists."
    command: "ls CLAUDE.md"
  - label: "Confirms the subdirectory CLAUDE.md exists."
    command: "ls src/api/CLAUDE.md"
  - label: "Confirms the path-scoped rule file exists."
    command: "ls .claude/rules/test-rules.md"
  - label: "Shows line count — aim for tight, high-signal content."
    command: "wc -l CLAUDE.md"
solution: |
  A good starter `CLAUDE.md` (root level, project layer):

  ```markdown
  # Project: acme-api

  @import .claude/shared-conventions.md

  ## Commands
  - Build: `npm run build`
  - Test: `npm test` (run before every commit)
  - Lint: `npm run lint`

  ## Gotchas
  - The dev server needs `DATABASE_URL` set; copy `.env.example` to `.env`.
  ```

  The imported file `.claude/shared-conventions.md`:

  ```markdown
  ## Conventions
  - 2-space indentation, no semicolons.
  - Never edit files in `src/generated/` — they are produced by `npm run codegen`.
  - New endpoints go in `src/routes/` and must have a test in `test/routes/`.
  ```

  The subdirectory `src/api/CLAUDE.md` (directory layer, only loads when working in `src/api/`):

  ```markdown
  # API layer rules

  - All endpoints must validate input with Zod before touching the database.
  - Return errors as `{ error: string, code: string }` — never expose stack traces.
  ```

  A path-scoped rule `.claude/rules/test-rules.md`:

  ```markdown
  ---
  paths:
    - "**/*.test.*"
    - "**/*.spec.*"
  ---

  ## Test file conventions
  - Use `describe` / `it` blocks, not bare `test()`.
  - Each test must have exactly one assertion group.
  - Mock external services — never hit real APIs in tests.
  ```

  Configuration hierarchy summary:

  | Layer | Location | When loaded |
  |-------|----------|-------------|
  | User | `~/.claude/CLAUDE.md` | Every session, every project |
  | Project | `CLAUDE.md` (repo root) | Every turn in this project |
  | Directory | `src/api/CLAUDE.md` | Only when working in `src/api/` |
  | Path-scoped rule | `.claude/rules/*.md` with `paths:` | Only when active file matches glob |

  Key ideas:

  - **Durable, not transient.** Commands, conventions, and gotchas rarely change. Don't record today's task here.
  - **Concise.** Because it loads every turn, every line should earn its place.
  - **Specific and testable.** "Never edit `src/generated/`" is enforceable; "write good code" is not.
  - **@import splits without duplicating.** Shared rules live in one place; multiple CLAUDE.md files reference them.
  - **Path-scoped rules save tokens.** Test conventions only load when editing test files.
---

<div class="callout callout--prereq">
  <strong>Prerequisites</strong>
  Claude Code installed and working — complete <strong>Your first five minutes with Claude Code</strong> first if you haven't already. A project folder with at least a few files (any language).
</div>

**Why this matters:** The CLAUDE.md hierarchy is one of the most heavily tested topics on the exam. You need to know all four layers (user, project, directory, path-scoped), how `@import` works, and the syntax for `.claude/rules/` files with glob-based `paths:` frontmatter. This is the difference between re-explaining your project every session and having Claude already know exactly the right rules for the file it's editing.
