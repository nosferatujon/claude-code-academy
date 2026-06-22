---
title: Watch the agentic loop in plan mode
domain: agentic
difficulty: beginner
estMinutes: 12
order: 1
intro: This domain is mostly conceptual, but you can see the agentic loop directly. Use plan mode to make the decide → act → observe cycle visible before any edits happen.
steps:
  - "In a project, give Claude Code a multi-step task (e.g. 'add input validation to the signup form and a test for it')."
  - "Enter plan mode so Claude researches and proposes a plan WITHOUT editing."
  - "Read the plan as a sequence of the agentic loop: what context it gathered, what actions it intends, in what order."
  - "Approve the plan and watch it execute, observing how each tool result feeds the next decision."
  - "Reflect: which steps could a sub-agent have handled in parallel (hub-and-spoke), and which had to be sequential?"
hints:
  - "Plan mode = gather + decide, with no act — that's why it's safe for risky changes."
  - "The loop is: gather context → decide → act (tool call) → observe result → repeat."
  - "Parallelizable, independent steps are candidates for fan-out to workers; dependent steps must stay sequential."
solution: |
  There's no single 'correct' artifact here — the goal is to *see* the loop. A typical plan exposes it clearly:

  ```text
  Plan:
  1. Read src/forms/signup.* and existing validation utils   (gather)
  2. Add validation to the signup handler                    (act)
  3. Add a test in test/forms/signup.test.*                  (act)
  4. Run the test suite                                       (observe)
  5. Fix any failures                                         (decide → act)
  ```

  Mapping it to the concepts the exam tests:

  - **Agentic loop:** step 1 is *gather context*, steps 2–3 are *act*, step 4 is *observe*, step 5 closes the loop with a new *decide*.
  - **Plan mode:** stops after gather+decide so you approve the approach before any edit — your safety gate for large or risky work.
  - **Orchestration:** steps 2 and 3 are largely independent and could be fanned out to workers in a multi-agent setup; step 4 depends on both, so it must run after — a concrete example of where hub-and-spoke parallelism helps and where it doesn't.
---

**Why this matters:** You can't run the Agent SDK with Claude Code alone, but you *can* watch the same loop it implements. Internalizing gather → decide → act → observe — and where parallelism (hub-and-spoke) does and doesn't apply — is exactly what the 27% Agentic Architecture domain is testing.
