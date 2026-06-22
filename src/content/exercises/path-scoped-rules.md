---
title: Create path-scoped rules in .claude/rules/
domain: workflows
difficulty: intermediate
estMinutes: 20
order: 3
intro: Write rules that only load for specific file globs, keeping context lean while still enforcing the right conventions for every file type.
steps:
  - "Create the directory `.claude/rules/` in your project if it doesn't exist."
  - "Create `.claude/rules/test-conventions.md`. Add YAML frontmatter with `paths: [\"**/*.test.*\", \"**/*.spec.*\"]` and write 2–3 testing conventions in the body."
  - "Create `.claude/rules/api-conventions.md` with `paths: [\"src/api/**/*\"]` and write API-specific rules (e.g. input validation, error shape)."
  - "Open a Claude Code session and ask it to edit a test file. Run `/memory` and confirm the test rule appears in the active context."
  - "Now ask it to edit a file under `src/api/`. Run `/memory` again and confirm the API rule is now active instead."
  - "Ask it to edit a file that matches neither glob (e.g. `src/utils/helpers.ts`). Confirm neither rule loads."
  - "Compare this to putting a `CLAUDE.md` in `src/api/` — the directory-level approach loads for all files in the directory, while the glob approach gives you finer control."
hints:
  - "The `paths:` frontmatter takes a YAML array of glob strings. Standard glob syntax applies: `**` matches any depth, `*` matches within one segment."
  - "Rule files without a `paths:` key load for every file — they behave like a project-level `CLAUDE.md` addition."
  - "Rules in `.claude/rules/` supplement the hierarchy; they don't replace it. A matching rule loads *in addition to* the project root `CLAUDE.md`."
  - "Use `/memory` in a Claude Code session to see exactly which context files are currently loaded."
  - "Path-scoped rules save tokens: a 50-line test convention file only costs context when Claude is actually editing a test."
verify:
  - label: "Confirms the rules directory exists."
    command: "ls .claude/rules/"
  - label: "Confirms both rule files are in place."
    command: "ls .claude/rules/test-conventions.md .claude/rules/api-conventions.md"
  - label: "Shows the frontmatter of the test rule."
    command: "head -6 .claude/rules/test-conventions.md"
solution: |
  `.claude/rules/test-conventions.md`:

  ```markdown
  ---
  paths:
    - "**/*.test.*"
    - "**/*.spec.*"
    - "**/__tests__/**/*"
  ---

  ## Test file conventions

  - Use `describe` / `it` blocks. Never use bare `test()` at the top level.
  - Each `it` block should test exactly one behavior.
  - Mock all external services — never make real network calls in tests.
  - Prefer `toEqual` over `toBe` for objects; use `toBe` only for primitives.
  ```

  `.claude/rules/api-conventions.md`:

  ```markdown
  ---
  paths:
    - "src/api/**/*"
    - "src/routes/**/*"
  ---

  ## API layer conventions

  - Validate all incoming request bodies with Zod before any business logic.
  - Return errors as `{ error: string, code: string }`. Never expose stack traces.
  - Log the request ID on every error so ops can correlate logs.
  - New endpoints must have a corresponding integration test under `test/api/`.
  ```

  Behavior comparison:

  | Approach | When it loads | Token cost |
  |----------|--------------|------------|
  | Root `CLAUDE.md` | Every turn | Always |
  | `src/api/CLAUDE.md` | Any file in `src/api/` | When in that directory |
  | `.claude/rules/` with `paths:` glob | Only matching files | On demand |

  The glob approach is most efficient when rules are highly specific — test conventions, migration rules, generated-file warnings — because they only consume context when actually relevant.

  To verify in a session:

  ```
  /memory
  ```

  You will see a list of active context files. The rule file should appear when the current file matches the glob and be absent otherwise.
---

<div class="callout callout--prereq">
  <strong>Prerequisites</strong>
  Claude Code installed. Completed <strong>Write your first CLAUDE.md</strong> — you'll be building on that foundation here.
</div>

**Why this matters:** Path-scoped rules are a precision tool for context efficiency. Rather than loading all conventions for every file, you pay only for the rules that apply. The exam tests both the syntax (`paths:` YAML frontmatter, glob patterns) and the conceptual distinction between directory-scoped `CLAUDE.md` files (which load for any file under a directory) and glob-scoped rules (which load only for files matching the pattern).
