---
title: Context Management & Reliability
domain: context
order: 1
minutes: 10
summary: Working within the context window, compaction, multi-agent handoffs, error propagation, and building reliable agent systems.
---

## What is the context window?

The **context window** is everything Claude can "see" at once — its working memory for a conversation. It includes:
- The system prompt and `CLAUDE.md`
- All messages in the conversation so far
- Tool call results (file contents, command output, etc.)
- Any examples or data you've provided

The context window has a **fixed size limit** measured in tokens (roughly 1 token ≈ 1 word). Once you hit the limit, something has to give.

This domain is **15%** of the exam and focuses on keeping agents accurate and dependable as tasks grow long.

## Two ways context goes wrong

### 1. Overflow — too much content
When the context window fills up, older content gets dropped or truncated. If the task description, key constraints, or important earlier results get pushed out, Claude will start making mistakes or re-doing work it already did.

**Example:** You ask Claude to refactor 50 files. By file 30, the original refactoring instructions have been pushed out of context by tool results. Claude starts making inconsistent changes.

### 2. Distraction — irrelevant content degrades quality
You don't have to overflow to have problems. Even with room to spare, filling the context with irrelevant content makes Claude less accurate. It's like trying to focus on a task while someone reads you unrelated information out loud.

**Treat context like a budget:** spend it on what matters; don't waste it on noise.

## Compaction and summarization

When a long conversation grows near the context limit, the harness can **compact** it: older turns are summarized into a shorter form, and that summary replaces the raw history. This frees up space to continue.

**What this means for you:** Don't rely on exact details from early in a long conversation staying accessible verbatim. They may be summarized or lost.

**Best practice:** Keep durable facts — coding conventions, architectural decisions, task requirements — in `CLAUDE.md` or in files. They'll always be readable from disk, even after compaction. Don't leave them only in the conversation transcript.

## Retrieval over stuffing

A common mistake: pasting an entire codebase, document, or dataset into the prompt because "Claude might need it."

Instead, let the agent **retrieve just-in-time**: search for the right file, read only the relevant section, query only the needed record. This keeps the context window lean and focused.

**Stuffing (bad):**
```
Here is our entire 50,000-line codebase. Somewhere in here is the auth bug. Fix it.
```

**Retrieval (good):**
```
Find and fix the auth bug. The codebase is in ./src — use your tools to search and read the relevant files.
```

With retrieval, Claude reads what it needs when it needs it, and the context stays filled with relevant content rather than noise.

## Multi-agent handoffs

When an orchestrator delegates a sub-task to a worker agent, the handoff design matters enormously.

**What to send to the worker:**
- A clear, self-contained task description
- Only the context the worker actually needs
- The expected output format

**What the worker should return:**
- The result (e.g. a summary, a code snippet, a list of findings)
- NOT its entire conversation transcript

**Why this matters:** If a worker returns its full transcript, the orchestrator's context fills with irrelevant details from the sub-task. Multiply this across several workers and you've wasted most of your context budget on noise.

**Define a clear contract:** worker receives X, worker returns Y. Treat it like an API.

**Example of a clean handoff:**
- Orchestrator sends: "Analyze `src/auth/` for security vulnerabilities. Return a JSON array of findings with `file`, `line`, and `description` fields."
- Worker reads the files, does the analysis, returns structured JSON.
- Orchestrator gets clean, structured results — no transcript noise.

## Error propagation and escalation

Agents are autonomous, which means errors can compound silently if you're not careful.

### Fail loud, not silent
When a tool fails, the error should be visible in the agent's context — not swallowed. If Claude doesn't know a step failed, it may continue as if it succeeded, producing invalid results.

**Bad pattern:** a tool call fails silently, Claude assumes success, continues building on a broken foundation.
**Good pattern:** the tool returns a clear error message, Claude sees it and decides what to do next.

### Bounded retries
For transient failures (network timeout, rate limit), retrying makes sense — but only a limited number of times. An agent that retries forever will loop indefinitely and never stop.

**Rule of thumb:** retry 2–3 times with a short wait, then fail and escalate.

### Escalate when stuck
An agent should recognize when it cannot proceed on its own and **escalate** rather than guess destructively or loop forever. Escalation means:
- Pausing and asking the user for clarification
- Returning a partial result with a clear explanation of what's missing
- Flagging to an orchestrator that the sub-task failed

**When to escalate:**
- The agent needs a permission it doesn't have
- The task is ambiguous and guessing wrong would be destructive
- Retries have been exhausted
- The agent has been in the same loop for too many iterations

## What to remember for the exam

- The context window is a **finite shared budget** — guard against overflow and irrelevant content.
- Persist durable facts to `CLAUDE.md` or files; they survive compaction, the live transcript does not.
- **Retrieve just-in-time** instead of stuffing everything into the prompt upfront.
- Multi-agent handoffs should pass **results, not transcripts** — define a clear input/output contract.
- **Fail loud** (surface errors), **retry with bounds**, and **escalate** when stuck rather than looping or guessing.
