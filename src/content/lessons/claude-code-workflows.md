---
title: Claude Code Configuration & Workflows
domain: workflows
order: 1
minutes: 9
summary: CLAUDE.md, settings and permissions, slash commands, Agent Skills, plan mode, hooks, and using Claude Code in CI/CD.
---

This domain (**20%**) is the heart of day-to-day Claude Code use and is fully practiceable.

## CLAUDE.md

`CLAUDE.md` is project memory that is automatically loaded into context. Put durable, project-specific facts here: how to build/test, conventions, architecture notes, gotchas. It can live at the project root (shared, committed) or in subdirectories (loaded when working in that area). Keep it concise — it costs context on every turn.

## Settings & permissions

`.claude/settings.json` configures the harness: allowed/denied tools, environment variables, hooks, and more. Permissions follow allow / ask / deny rules so you can pre-approve safe commands (`npm test`) and block dangerous ones. Project settings can be committed; `settings.local.json` holds personal overrides and is git-ignored.

## Slash commands

Slash commands are reusable prompts stored as Markdown files in `.claude/commands/`. A file `.claude/commands/review.md` becomes `/review`. They can take arguments and are great for codifying repeatable workflows (release notes, PR reviews, scaffolding).

## Agent Skills

Skills package expertise — instructions plus optional scripts and resources — that Claude loads *on demand* when a task matches the skill's description. Unlike CLAUDE.md (always loaded), a skill's body is only pulled in when relevant, so skills scale without bloating context. Each skill is a folder with a `SKILL.md`.

## Plan mode

Plan mode lets Claude research and propose a plan **without making edits**, so you can review and approve the approach before any changes happen. Ideal for risky or large changes.

## Hooks

Hooks run shell commands at lifecycle events (`PreToolUse`, `PostToolUse`, `Stop`, etc.). Because the harness — not the model — runs them, they're the right tool for non-negotiable automation: auto-format after edits, scan for secrets before a commit, or block a tool call entirely.

## CI/CD

Claude Code runs headlessly (`claude -p "..."` / print mode) so it can be scripted in pipelines — triage issues, draft fixes, review diffs. Combine with permission settings to constrain what it can do in automation.

## What to remember for the exam

- `CLAUDE.md` = always-loaded project memory; keep it tight.
- Skills load on demand; CLAUDE.md loads always.
- Slash commands = reusable prompt files in `.claude/commands/`.
- Hooks enforce deterministic behavior because the harness runs them.
- Plan mode reviews an approach before edits; print mode enables CI/CD.
