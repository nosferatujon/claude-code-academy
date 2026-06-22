---
title: Build a custom slash command
domain: workflows
difficulty: intermediate
estMinutes: 15
order: 2
intro: Codify a repeatable workflow as a reusable /slash command that accepts an argument.
steps:
  - "Create the folder `.claude/commands/` in your project if it doesn't exist."
  - "Add a file `.claude/commands/changelog.md` containing a prompt that writes a changelog entry."
  - "Use the `$ARGUMENTS` placeholder so the command can take input — e.g. a version number."
  - "Restart or refresh Claude Code and run `/changelog 1.4.0` to confirm it appears and runs."
  - "Refine the prompt until the output format is exactly what you want every time."
hints:
  - "The file name becomes the command name: `changelog.md` → `/changelog`."
  - "Anything after the command on the line replaces `$ARGUMENTS` in the prompt body."
  - "Commands committed under `.claude/commands/` are shared with your whole team."
verify:
  - label: "The command file is in the right place."
    command: "ls .claude/commands/"
solution: |
  `.claude/commands/changelog.md`:

  ```markdown
  ---
  description: Draft a CHANGELOG entry for the given version
  ---
  Look at the git commits since the last tag and draft a CHANGELOG.md entry
  for version $ARGUMENTS.

  Group changes under "Added", "Changed", "Fixed", and "Removed".
  Use past-tense bullet points. Output only the markdown for the new entry —
  do not modify any files yet.
  ```

  Run it with:

  ```
  /changelog 1.4.0
  ```

  Notes:

  - The optional frontmatter `description` is what shows up in the command list.
  - `$ARGUMENTS` captures everything typed after `/changelog`.
  - Because the prompt says "output only the markdown … do not modify any files," you stay in control and can review before applying — a small but important guardrail.
---

<div class="callout callout--prereq">
  <strong>Prerequisites</strong>
  Claude Code installed. Basic familiarity with Markdown (you're writing <code>.md</code> files). Completing <strong>Write your first CLAUDE.md</strong> first is helpful but not required.
</div>

**Why this matters:** Slash commands turn a prompt you keep retyping into a one-liner the whole team shares. The exam expects you to know that custom commands live as Markdown files in `.claude/commands/`, support arguments via `$ARGUMENTS`, and differ from Skills (which load automatically based on relevance rather than being explicitly invoked).
