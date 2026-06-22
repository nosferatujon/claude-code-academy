---
title: Agentic Architecture & Orchestration
domain: agentic
order: 1
minutes: 12
summary: How agents are structured — single-agent loops, the Claude Agent SDK, multi-agent orchestration, hub-and-spoke patterns, and lifecycle hooks.
---

## What is an AI agent?

An **agent** is an AI model that doesn't just answer a question and stop — it takes a sequence of actions to complete a goal. Instead of responding once, it can use tools (like reading files, running code, or browsing the web), observe what happened, and decide what to do next.

Think of the difference between asking a colleague "what's in this file?" (one answer) vs. asking them to "fix the bug in this codebase" — the second task requires them to explore, try things, check results, and keep going until it's done. That's an agent.

**Claude Code** is a concrete example of an agent: when you ask it to add a feature, it reads files, writes edits, runs tests, reads the output, fixes errors — all on its own, in a loop.

## The agentic loop

Every agent — including Claude Code — runs the same core cycle:

1. **Gather context** — read the current state: the task, files, tool results so far
2. **Decide** — choose what to do next: reply, or call a tool
3. **Act** — execute the tool call (e.g. read a file, run a command)
4. **Observe** — read the result and add it to context
5. **Repeat** — until the task is done or a stop condition is hit

**Example:** You ask Claude Code to "add input validation to the login form."
- It reads the login form file *(gather)*
- It decides to also read the validation utilities *(decide → act → observe)*
- It writes the new validation logic *(decide → act)*
- It runs the test suite *(act → observe)*
- It sees a failing test, fixes it *(observe → decide → act)*
- All tests pass — it stops *(stop condition)*

This loop continues automatically. You don't direct each step.

## Single-agent vs. multi-agent

### Single agent
One loop, one context window, one Claude instance handling everything.

- **When to use it:** The task is focused and fits in one conversation — e.g. "refactor this module."
- **Advantages:** Simple, predictable, cheaper, no coordination overhead.
- **Limitation:** One agent can only do one thing at a time, and everything it has seen shares the same context window.

### Multi-agent
A **coordinator** agent splits a large task into sub-tasks and delegates each one to a **worker** agent. Each worker has its *own* fresh context window and runs independently.

- **When to use it:** Work can be done in parallel (e.g. analyze 10 files simultaneously), or you want to prevent one sub-task's details from polluting another's context.
- **Example:** A research task where one agent searches documentation, another analyzes code, and a third writes a summary — all running at the same time.

In Claude Code, sub-agents are spawned using the **Agent tool**. Each runs in isolation and returns only its final result to the parent, keeping the parent's context clean.

## Hub-and-spoke (orchestrator–worker)

The most common multi-agent pattern looks like a wheel:

```
         Worker A
        /
Orchestrator — Worker B
        \
         Worker C
```

- The **orchestrator** (hub) receives the goal, breaks it into pieces, and hands each piece to a worker.
- **Workers** (spokes) execute their piece and return results to the orchestrator.
- Workers never talk directly to each other — all coordination goes through the hub.

**Why this matters:**
- With 3 workers, you have 3 communication paths (each worker ↔ hub) instead of 6 (every worker ↔ every other worker). Simpler to reason about and debug.
- If a worker fails, the orchestrator handles it — workers don't need to know about each other.

**Real example:** An orchestrator is asked to audit a codebase for security issues. It spawns one worker per directory, each scanning independently. Workers return findings; the orchestrator merges and ranks them.

## Lifecycle hooks

Hooks let you run **your own code** at specific moments in the agent's lifecycle — before a tool runs, after it finishes, when the agent stops, etc.

| Hook event | When it fires |
|---|---|
| `PreToolUse` | Before the agent calls any tool |
| `PostToolUse` | After a tool call completes |
| `UserPromptSubmit` | When the user sends a message |
| `Stop` | When the agent finishes |

**Why hooks exist:** The agent (the model) decides what to do, but hooks are run by the **harness** (the software running the agent). This means the model cannot skip them — they are enforced deterministically.

**What you'd use hooks for:**
- Auto-format code after every file edit
- Scan for secrets before any commit
- Block specific dangerous commands unconditionally
- Log every tool call for auditing

**Example:** A `PreToolUse` hook that checks if the agent is about to run `rm -rf` and blocks it before it happens — no matter what the model decides.

## What to remember for the exam

- The agentic loop is: **gather context → decide → act → observe → repeat**.
- Choose **single-agent** by default; add multi-agent only when you need parallelism or context isolation.
- **Hub-and-spoke** means an orchestrator coordinates workers; workers don't talk to each other.
- **Hooks** are enforced by the harness (not the model), so they cannot be skipped — use them for non-negotiable policy.
- This is the largest exam domain at **27%**.
