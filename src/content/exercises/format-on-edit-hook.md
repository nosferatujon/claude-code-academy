---
title: Auto-format with a PostToolUse hook
domain: workflows
difficulty: advanced
estMinutes: 20
order: 3
intro: Use a hook to run a formatter automatically every time Claude Code edits a file — enforced by the harness, not the model.
steps:
  - "Open (or create) `.claude/settings.json` in your project."
  - "Add a `hooks` block with a `PostToolUse` hook that matches the Edit and Write tools."
  - "Have the hook run your formatter (e.g. `npx prettier --write` or `gofmt -w`) on the changed file."
  - "Ask Claude Code to make a small, deliberately messy edit and confirm the file comes out formatted."
hints:
  - "Hooks are configured under the `hooks` key in settings; `PostToolUse` runs after a tool call completes."
  - "Use a `matcher` to target only `Edit` and `Write` so the formatter doesn't run after every Bash command."
  - "Hooks receive context (including the file path) via stdin as JSON; many formatters can also just run on the whole project."
verify:
  - label: "Validates your settings file is well-formed JSON."
    command: "cat .claude/settings.json | python -m json.tool"
solution: |
  A minimal `.claude/settings.json` that formats with Prettier after each edit:

  ```json
  {
    "hooks": {
      "PostToolUse": [
        {
          "matcher": "Edit|Write",
          "hooks": [
            {
              "type": "command",
              "command": "npx prettier --write ."
            }
          ]
        }
      ]
    }
  }
  ```

  Why this is the right tool for the job:

  - **Deterministic.** The harness runs the hook every time the matcher fires — the model cannot "forget" to format.
  - **Scoped.** The `matcher` limits it to `Edit` and `Write`, so it doesn't fire after unrelated tool calls.
  - **Separation of concerns.** Formatting is policy, not a creative decision, so it belongs in a hook rather than in your prompt or `CLAUDE.md`.

  The same pattern (a `PreToolUse` hook that exits non-zero) is how you *block* dangerous commands before they run.
---

<div class="callout callout--prereq">
  <strong>Prerequisites</strong>
  Claude Code installed. A project where you can run a code formatter from the command line — for example, a Node.js project with <code>prettier</code> installed, or any project with a linter/formatter available.
</div>

**Why this matters:** Hooks are the exam's canonical answer to "how do I guarantee something happens around tool use?" Because they're executed by the harness rather than chosen by the model, they enforce non-negotiable behavior: formatting, secret scanning, or blocking destructive commands.
