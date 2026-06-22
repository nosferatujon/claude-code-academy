---
title: Claude Code Configuration & Workflows
domain: workflows
order: 1
minutes: 12
summary: CLAUDE.md, settings and permissions, slash commands, Agent Skills, plan mode, hooks, and using Claude Code in CI/CD.
---

## What is Claude Code?

**Claude Code** is a command-line tool (and IDE extension) that lets you work with Claude directly inside your codebase. Instead of copying and pasting code into a chat window, Claude Code can read your files, make edits, run commands, and work autonomously on tasks — all from your terminal or editor.

This domain is **20%** of the exam and covers how to configure and customize Claude Code for your project and workflow.

## CLAUDE.md — project memory

Every time Claude Code starts in a project, it automatically reads a file called `CLAUDE.md` if one exists. This is your project's **persistent memory** — facts that Claude should always know about your codebase.

**What to put in CLAUDE.md:**
- How to build and test the project (`npm run build`, `pytest`, etc.)
- Architectural decisions and conventions ("we use snake_case for all database fields")
- Gotchas and non-obvious constraints ("never edit generated files in `/dist`")
- Key file locations ("API routes are in `src/routes/`")

**What not to put there:**
- Things Claude can figure out by reading the code
- Generic best practices that apply to every project

`CLAUDE.md` can live at the project root (shared, committed to git) or in subdirectories (Claude loads it when working in that area). Keep it concise — it loads into the context window on every turn, so a bloated CLAUDE.md wastes your token budget.

**Example CLAUDE.md:**
```markdown
# CLAUDE.md

Run tests: `npm test`
Build: `npm run build` → output in `./dist`

Never modify files in `src/generated/` — they are auto-created by the build.
Database column names use snake_case; TypeScript fields use camelCase.
```

## Settings and permissions

Claude Code's behavior is controlled by `.claude/settings.json`. This file lets you:

- **Allow** specific commands to run without asking for confirmation (e.g. `npm test`)
- **Deny** dangerous operations unconditionally (e.g. `rm -rf`)
- Set environment variables
- Configure hooks (see below)

```json
{
  "permissions": {
    "allow": ["npm test", "npm run build"],
    "deny": ["rm -rf"]
  }
}
```

**Two settings files:**
- `.claude/settings.json` — committed to git; shared with the whole team
- `.claude/settings.local.json` — git-ignored; personal overrides (your API keys, personal preferences)

This separation means you can pre-approve safe commands for everyone on the team, while keeping personal configuration private.

## Slash commands — reusable prompt shortcuts

A **slash command** is a saved prompt you can invoke by typing `/command-name`. They're stored as Markdown files in `.claude/commands/`.

**Example:** Create `.claude/commands/review.md` containing:
```markdown
Review the staged changes for bugs and style issues.
List each finding with the file name, line number, and a one-sentence description.
```

Now you can type `/review` anytime instead of rewriting that prompt. Slash commands can also accept arguments.

**Good uses for slash commands:**
- Code review checklists
- Release notes generation
- Scaffolding boilerplate (new component, new API route)
- Any task you do repeatedly with the same instructions

## Agent Skills — expertise loaded on demand

**Skills** are like more powerful slash commands. A skill packages expertise — instructions, scripts, and context — into a folder with a `SKILL.md` file.

The key difference from CLAUDE.md:
- `CLAUDE.md` is **always loaded** (every turn)
- A skill is loaded **only when Claude decides it's relevant** to the current task

This means you can have many skills without bloating the context window. Claude reads skill descriptions and pulls in the full skill body only when it matches what you're asking for.

**Example skill use:** A "security-review" skill that knows how to check for OWASP vulnerabilities. It only loads when you ask Claude to review for security — not during every regular edit.

## Plan mode — review before acting

By default, Claude Code acts immediately: it reads files, makes edits, runs commands. **Plan mode** changes this: Claude researches the task and writes a plan, but does **not** make any edits until you approve.

**When to use plan mode:**
- Large refactors that touch many files
- Risky changes (migrations, API changes, deletions)
- Anytime you want to understand Claude's approach before it runs

You enable it with `/plan` or by configuring it in settings for certain types of tasks.

## Hooks — automation that can't be skipped

Hooks are shell commands that run automatically at key moments in Claude Code's lifecycle. Because they're run by the **harness** (not decided by Claude), the model cannot bypass them.

| Hook | When it fires |
|---|---|
| `PreToolUse` | Before any tool call (Read, Edit, Bash, etc.) |
| `PostToolUse` | After a tool call completes |
| `UserPromptSubmit` | When you press enter on a message |
| `Stop` | When Claude finishes responding |

**Practical examples:**
- `PostToolUse` on Edit → auto-run `prettier` to format the file
- `PreToolUse` on Bash → scan for `rm -rf` and block it
- `Stop` → run `npm test` automatically after every response
- `UserPromptSubmit` → prepend your team's coding standards to every prompt

Hooks are defined in `.claude/settings.json`:
```json
{
  "hooks": {
    "PostToolUse": [{"command": "npm run format"}]
  }
}
```

## CI/CD — Claude Code in pipelines

Claude Code can run **headlessly** (without a human in the loop) using print mode:

```bash
claude -p "Review this diff for security issues and output findings as JSON"
```

This makes it scriptable in CI/CD pipelines. Common uses:
- Automatically triage new GitHub issues
- Review pull request diffs before merge
- Generate release notes from commit history
- Run as a pre-merge quality gate

Combine headless mode with permission settings to tightly control what Claude can do when running unattended.

## What to remember for the exam

- `CLAUDE.md` is always loaded — keep it concise and project-specific.
- **Skills** load on demand; `CLAUDE.md` loads always — skills scale without context overhead.
- **Slash commands** = reusable prompt files in `.claude/commands/`.
- **Hooks** are enforced by the harness — the model cannot skip them. Use for non-negotiable automation.
- **Plan mode** = Claude researches and proposes, no edits until you approve.
- **Print mode** (`-p`) enables headless use in CI/CD pipelines.
