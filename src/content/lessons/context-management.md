---
title: Context Management & Reliability
domain: context
order: 1
minutes: 7
summary: Working within the context window, compaction, multi-agent handoffs, error propagation, and building reliable agent systems.
---

This domain (**15%**) is about keeping agents accurate and dependable as tasks grow long.

## The context window is a budget

Everything the model can "see" — system prompt, CLAUDE.md, conversation, tool results — shares one finite window. Two failure modes:

- **Overflow**: too much content, important details get pushed out or truncated.
- **Distraction / rot**: irrelevant content dilutes attention and degrades quality even before overflow.

Treat context as a budget: include what's needed, drop what isn't.

## Compaction and summarization

When a conversation grows long, the harness can **compact** it — summarizing earlier turns into a compact form and carrying that forward instead of the raw history. Good practice: keep durable facts in `CLAUDE.md` or files so they survive compaction, rather than relying on them staying in the live transcript.

## Retrieval over stuffing

Don't paste an entire codebase into the prompt. Let the agent **retrieve** what it needs (search, read specific files, query a resource) just in time. This keeps the window lean and relevant.

## Multi-agent handoffs

When an orchestrator delegates to a sub-agent, only the **result** should return — not the sub-agent's entire transcript. Define a clear contract: what the sub-agent receives, and what shape it returns. Sloppy handoffs leak noise and cause errors to propagate.

## Error propagation & escalation

- **Fail loud, not silent**: a tool error should surface, not get swallowed.
- **Bounded retries**: retry transient failures a limited number of times, then stop.
- **Escalate** to a human (or a higher-level agent) when the agent is stuck, lacks permission, or hits ambiguity it can't resolve. Don't let it loop forever or guess destructively.

## What to remember for the exam

- Context is a shared, finite budget — guard against overflow and distraction.
- Persist durable facts to files so they survive compaction.
- Retrieve just-in-time instead of stuffing everything in.
- Hand off results, not transcripts; fail loud, retry with bounds, escalate when stuck.
