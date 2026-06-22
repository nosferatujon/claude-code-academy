---
title: Watch the agentic loop in plan mode
domain: agentic
difficulty: beginner
estMinutes: 15
order: 1
intro: Use plan mode to make the decide → act → observe cycle visible, then observe how stop_reason signals whether the loop continues or terminates.
steps:
  - "In a project, give Claude Code a multi-step task (e.g. 'add input validation to the signup form and a test for it')."
  - "Enter plan mode so Claude researches and proposes a plan WITHOUT editing."
  - "Read the plan as a sequence of the agentic loop: what context it gathered, what actions it intends, in what order."
  - "Approve the plan and watch it execute. Run Claude Code with `--verbose` so you can see each API response."
  - "In the verbose output, find turns where `stop_reason` is `tool_use` — this means Claude chose to call a tool and the loop continues."
  - "Find the final turn where `stop_reason` is `end_turn` — this means Claude produced a text response and the loop terminates."
  - "Reflect: which steps could a sub-agent have handled in parallel (hub-and-spoke), and which had to be sequential?"
hints:
  - "Plan mode = gather + decide, with no act — that's why it's safe for risky changes."
  - "The loop is: gather context → decide → act (tool call) → observe result → repeat."
  - "`stop_reason: tool_use` means the model emitted a tool_use block; the harness calls the tool and sends the result back, re-entering the loop."
  - "`stop_reason: end_turn` means the model emitted only text — there is nothing more to call, so the loop exits."
  - "A third value, `max_tokens`, fires when the context limit is hit — the loop may truncate rather than complete cleanly."
  - "Parallelizable, independent steps are candidates for fan-out to workers; dependent steps must stay sequential."
verify:
  - label: "Confirms verbose mode is available in your Claude Code version."
    command: "claude --help | grep verbose"
solution: |
  There's no single 'correct' artifact here — the goal is to *see* the loop and the stop_reason signals. A typical verbose run exposes both.

  Plan produced in plan mode:

  ```text
  Plan:
  1. Read src/forms/signup.* and existing validation utils   (gather)
  2. Add validation to the signup handler                    (act)
  3. Add a test in test/forms/signup.test.*                  (act)
  4. Run the test suite                                       (observe)
  5. Fix any failures                                         (decide → act)
  ```

  In verbose output, intermediate turns look like:

  ```json
  { "stop_reason": "tool_use", "content": [{ "type": "tool_use", "name": "Read", "input": {...} }] }
  ```

  The final turn looks like:

  ```json
  { "stop_reason": "end_turn", "content": [{ "type": "text", "text": "All done! The validation is in place..." }] }
  ```

  Mapping to exam concepts:

  - **stop_reason: tool_use** — Claude wants to act; the harness must service the call and re-enter the loop. The loop is not finished.
  - **stop_reason: end_turn** — Claude is done; the loop exits and the result is delivered to the user.
  - **stop_reason: max_tokens** — The response was cut off by the token limit. The loop may silently truncate. Handle this explicitly in production agents.
  - **Plan mode:** stops after gather+decide so you approve the approach before any edit — your safety gate for large or risky work.
  - **Orchestration:** steps 2 and 3 are largely independent and could be fanned out to workers; step 4 depends on both and must run after.
---

<div class="callout callout--prereq">
  <strong>Prerequisites</strong>
  Claude Code installed. A project you can run a real task on — any language, any size. No programming required; you're observing Claude's behavior, not writing code.
</div>

**Why this matters:** `stop_reason` is the signal that drives the agentic loop. When it is `tool_use` the harness must keep going; when it is `end_turn` the task is complete. Confusing the two — or not handling `max_tokens` — is a common source of agents that silently truncate. The exam expects you to know all three values and what each requires from the host.
