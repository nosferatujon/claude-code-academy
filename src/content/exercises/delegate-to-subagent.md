---
title: Isolate context with a sub-agent
domain: context
difficulty: intermediate
estMinutes: 15
order: 1
intro: Use a sub-agent to do a noisy research task so its intermediate work never pollutes your main session's context.
steps:
  - "In a real repo, think of a question that needs reading many files — e.g. 'where is authentication handled and what are all the entry points?'"
  - "Ask Claude Code to delegate that exploration to a sub-agent (the Task/Agent tool) rather than doing it inline."
  - "Observe that the sub-agent reads lots of files but returns only a concise summary to your main session."
  - "Continue your main task and notice the main context stayed lean — it never saw the raw file dumps."
hints:
  - "Sub-agents run their own loop in their own context window and report back only their final answer."
  - "This is the hub-and-spoke idea applied to context hygiene: the orchestrator keeps a clean window."
  - "Delegate when a task is read-heavy or exploratory and you only need the conclusion."
solution: |
  A prompt that triggers delegation:

  ```text
  Spawn a sub-agent to map out how authentication works in this repo:
  every entry point, middleware, and where sessions are created.
  Have it return a short summary with file:line references — I don't need
  the full contents of everything it reads.
  ```

  What you should observe and why it matters:

  - The sub-agent does the **fan-out** (reading dozens of files) in *its own* context window.
  - Only the **distilled result** returns to your session — file dumps never enter your main window.
  - Your main context stays focused on the task, avoiding **distraction / context rot**.

  This is the practical payoff of the context-management domain: hand off *results, not transcripts*. The same discipline applies to multi-agent systems built with the Agent SDK — workers report conclusions, the orchestrator stays clean.
---

**Why this matters:** Context is a finite, shared budget. The exam rewards knowing that sub-agents (and multi-agent handoffs generally) are a context-management tool: they isolate noisy work and return only conclusions, protecting the orchestrator's window from overflow and distraction.
