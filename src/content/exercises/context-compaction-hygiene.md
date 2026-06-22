---
title: Manage context compaction & scratchpads
domain: context
difficulty: intermediate
estMinutes: 15
order: 2
intro: Simulate a long-running session, witness how progressive summarization degrades specific metrics, and learn to maintain a scratchpad to keep critical facts durable.
steps:
  - "Start a Claude Code session in a mock project directory."
  - "Provide Claude with a set of specific project requirements containing exact metrics (e.g. 'Database latency must remain under 15ms, user login timeout is 500ms, and API rate limits are 100 requests/sec')."
  - "Simulate conversation length by asking Claude to perform 5-6 verbose file searches or read several long source files."
  - "Now, ask Claude: *'What are the exact latency, timeout, and rate limit metrics I told you at the start?'* Observe if the model is still precise or if it generalizes them."
  - "To prevent this degradation, create a `scratchpad.md` file in your workspace: *'Create a scratchpad.md file at the root. Use it to record key numbers and project parameters as they are discovered.'*"
  - "Instruct Claude to update this scratchpad whenever new numbers are set."
  - "Run the `/compact` command to force-summarize the chat history. Ask Claude to read the `scratchpad.md` file again and confirm the metrics are still perfectly preserved."
hints:
  - "Progressive summarization excels at maintaining narrative flow, but strips specific detail like numbers, dates, and order IDs."
  - "A scratchpad file is durable because it lives on disk; the model reads it on demand instead of trying to recall it from conversation history."
  - "Use `/compact` when the terminal session becomes slow or Claude starts referencing generic libraries rather than your project specifics."
  - "You can configure Claude to load the scratchpad automatically in your CLAUDE.md by adding `Always read scratchpad.md for active project parameters.`"
verify:
  - label: "Confirms the scratchpad file was created in your project directory."
    command: "cat scratchpad.md"
solution: |
  Maintaining context hygiene with a scratchpad:

  **1. The Problem (Context Contamination & Loss):**
  When you start a session with:
  ```text
  We are optimizing the payments API. The response SLA is 80ms, the DB pool size is 25, and database connection retry count is 3.
  ```
  After reading several files and running tests, the raw messages are compacted. If you ask for the metrics, Claude might respond:
  *"You mentioned response SLAs and database pool limits, but I don't have the exact numbers in my history."*

  **2. The Fix (Durable Disk Storage):**
  Instruct the model to write facts to disk:
  ```text
  Create a scratchpad.md file and document the current SLA (80ms), pool size (25), and DB retry count (3).
  ```

  **3. Active Session Compaction:**
  Type the slash command to compact the active thread:
  ```text
  > /compact
  ```
  Claude will summarize the history, reducing the active token count.

  **4. Reading the Scratchpad:**
  Even after compaction, Claude can access the metrics by checking the file:
  ```text
  > Read the scratchpad.md and tell me the DB connection retry count.
  ```
  Claude calls the `Read` tool on `scratchpad.md` and correctly returns: `3`.

  **Key Takeaways for the Exam:**
  * **Progressive summarization** preserves the general outline of the conversation but degrades transactional facts (numbers, dates, IDs).
  * **Scratchpads** represent a pattern of offloading memory to storage, ensuring that the model reads from a single source of truth on disk instead of relying on context history.
  * The `/compact` command reduces context usage in long-running interactive sessions.
---

<div class="callout callout--prereq">
  <strong>Prerequisites</strong>
  Claude Code installed. A folder where you can write files. Read the <strong>Context Management & Reliability</strong> lesson first.
</div>

**Why this matters:** Context is a leaky bucket. When it fills up, the oldest and least structured details are the first to get lost in progressive summarization. The exam expects you to know this exact failure mode (losing numbers and dates) and how to design around it by writing state to disk (the scratchpad pattern) and utilizing `/compact` to maintain focus.
