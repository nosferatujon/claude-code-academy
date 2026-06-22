---
title: Improve a task with few-shot examples
domain: prompting
difficulty: intermediate
estMinutes: 12
order: 2
intro: See how adding 2–4 examples sharpens a classification or formatting task far more than extra prose.
steps:
  - "Choose a small classification task — e.g. label short support messages as `bug`, `billing`, `feature`, or `other`."
  - "First, write a zero-shot prompt (just instructions) and classify 5 sample messages."
  - "Now add 3 example input→label pairs covering the tricky/edge cases, and re-run the same 5 messages."
  - "Compare: note where the few-shot version is more consistent, especially on ambiguous inputs."
hints:
  - "Make your examples cover the boundaries (the cases you'd get wrong), not just the obvious ones."
  - "Keep the example format identical to what you ask for in the real output."
  - "More isn't always better — 2–4 well-chosen examples usually beat 10 redundant ones."
solution: |
  Zero-shot (works, but drifts on edge cases):

  ```text
  Classify each message as one of: bug, billing, feature, other.
  Respond with just the label.
  Message: "The export button does nothing when I click it."
  ```

  Few-shot (more consistent):

  ```text
  Classify each message as one of: bug, billing, feature, other.

  Examples:
  Message: "I was charged twice this month." -> billing
  Message: "Can you add dark mode?" -> feature
  Message: "App crashes on startup since the update." -> bug
  Message: "Thanks for the great product!" -> other

  Now classify:
  Message: "The export button does nothing when I click it."
  ```

  What changed: the examples *demonstrate* the boundaries — a vague compliment maps to `other`, a request maps to `feature`. The model imitates the pattern instead of guessing your intent from prose. This is why few-shot is the go-to technique for formatting and classification on the exam.
---

<div class="callout callout--prereq">
  <strong>Prerequisites</strong>
  Claude Code installed, or access to Claude at claude.ai. No programming knowledge required — this exercise uses Claude as a tool, not code you write.
</div>

**Why this matters:** Few-shot prompting is one of the highest-leverage techniques in the Prompt Engineering domain. The exam wants you to recognize *when* to reach for examples (formatting, classification, edge-case behavior) and that quality and coverage of examples matter more than quantity.
