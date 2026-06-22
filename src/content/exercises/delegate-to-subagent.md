---
title: Isolate context with a sub-agent
domain: context
difficulty: intermediate
estMinutes: 15
order: 1
intro: Use a sub-agent to do a noisy research task so its intermediate work never pollutes your main session's context — and learn what the orchestrator must configure to make it work.
steps:
  - "In a real repo, think of a question that needs reading many files — e.g. 'where is authentication handled and what are all the entry points?'"
  - "Ask Claude Code to delegate that exploration to a sub-agent (the Task/Agent tool) rather than doing it inline."
  - "Before delegating, check that the orchestrator's `allowedTools` list includes `'Task'` — without it, Claude cannot spawn sub-agents at all."
  - "Write your delegation prompt so it is fully self-contained: include the repo path, the question, and exactly what format you want back. Sub-agents do NOT inherit the parent session's context."
  - "Observe that the sub-agent reads lots of files but returns only a concise summary to your main session."
  - "Continue your main task and notice the main context stayed lean — it never saw the raw file dumps."
hints:
  - "Sub-agents run their own loop in their own context window and report back only their final answer."
  - "The orchestrator must have `'Task'` in its `allowedTools`; the sub-agent's `allowedTools` controls what *it* can do."
  - "Because sub-agents start with a blank context, any information the orchestrator has must be explicitly passed in the prompt — file paths, prior decisions, constraints, everything."
  - "This is the hub-and-spoke idea applied to context hygiene: the orchestrator keeps a clean window."
  - "Delegate when a task is read-heavy or exploratory and you only need the conclusion."
verify:
  - label: "Confirms the Task tool is listed in Claude Code's available tools."
    command: "claude --help | grep -i task"
solution: |
  A prompt that correctly triggers delegation with full context handoff:

  ```text
  Use the Task tool to spawn a sub-agent with these exact instructions:

  ---
  Repo: /Users/me/acme-api (Node.js, Express)
  Task: Map out how authentication works — every entry point, every
  middleware, and where sessions are created or validated.
  Return a short summary with file:line references. Do not return
  raw file contents.
  ---

  Report back only the summary. Do not read the files yourself.
  ```

  Key things this prompt does right:

  - **Passes the repo path explicitly** — the sub-agent has no idea where it is.
  - **States the output format** — "short summary with file:line references, not raw contents."
  - **Restricts the orchestrator** — "Do not read the files yourself" keeps the main context clean.

  What you should observe and why it matters:

  - The sub-agent does the **fan-out** (reading dozens of files) in *its own* context window.
  - Only the **distilled result** returns to your session — file dumps never enter your main window.
  - Your main context stays focused on the task, avoiding **distraction / context rot**.

  What breaks without the right setup:

  - If `'Task'` is not in `allowedTools`, Claude cannot spawn the sub-agent and will fall back to doing the work inline, bloating your context.
  - If the sub-agent prompt omits the repo path or constraints, it may operate on the wrong directory or return unstructured output.

  This is the practical payoff of the context-management domain: hand off *results, not transcripts*. The same discipline applies to multi-agent systems built with the Agent SDK — workers report conclusions, the orchestrator stays clean.
---

**Why this matters:** Context is a finite, shared budget. The exam rewards knowing that sub-agents are a context-management tool — they isolate noisy work and return only conclusions. But it also tests the mechanics: `allowedTools` must include `'Task'` for delegation to work, and sub-agents receive no inherited context, so the orchestrator's prompt must be self-contained.
