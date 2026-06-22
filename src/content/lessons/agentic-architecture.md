---
title: Agentic Architecture & Orchestration
domain: agentic
order: 1
minutes: 8
summary: How agents are structured — single-agent loops, the Claude Agent SDK, multi-agent orchestration, hub-and-spoke patterns, and lifecycle hooks.
---

This is the largest domain on the exam (**27%**) and the hardest to practice with Claude Code alone, because much of it concerns the **Claude Agent SDK** and multi-agent systems you would normally build with the API. Focus on understanding the patterns conceptually.

## The agentic loop

Every agent — including Claude Code itself — runs the same core loop:

1. **Gather context** (the prompt, files, tool results so far)
2. **Decide** on the next action (reply, or call a tool)
3. **Act** (execute a tool call)
4. **Observe** the result and feed it back into context
5. Repeat until the task is done or a stop condition is hit

Claude Code is a reference implementation of this loop: it plans, calls tools (Read, Edit, Bash, etc.), observes results, and continues.

## Single-agent vs multi-agent

- **Single agent**: one loop, one context window. Simple, predictable, cheaper. Best when the task is cohesive.
- **Multi-agent**: a coordinator delegates sub-tasks to specialized sub-agents, each with *its own* context window. Best when work is parallelizable or when isolating context prevents one task from polluting another.

In Claude Code, sub-agents are spawned via the Task/Agent tool — each runs independently and returns only its final result to the parent, keeping the parent's context clean.

## Hub-and-spoke (orchestrator–worker)

The most common multi-agent topology: a central **orchestrator** (hub) decomposes a goal, fans work out to **workers** (spokes), and synthesizes their outputs. Workers don't talk to each other — all coordination flows through the hub. This keeps communication paths simple (`n` instead of `n²`) and makes failures easy to localize.

## Lifecycle hooks

Hooks let you run deterministic code at defined points in the agent lifecycle — e.g. `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Stop`. Hooks are how you enforce policy that the model must not be able to skip (formatting, secret scanning, blocking dangerous commands), because they are executed by the harness, not decided by the model.

## What to remember for the exam

- The agentic loop is gather → decide → act → observe → repeat.
- Prefer a single agent unless you specifically need parallelism or context isolation.
- Hub-and-spoke centralizes coordination through an orchestrator.
- Hooks enforce deterministic, non-skippable behavior around tool use and lifecycle events.
