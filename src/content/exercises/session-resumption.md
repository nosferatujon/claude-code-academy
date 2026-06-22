---
title: Resume and fork sessions in Claude Code
domain: agentic
difficulty: intermediate
estMinutes: 15
order: 2
intro: Use --resume to continue a named session across terminal restarts, and fork_session to safely explore two different approaches from a shared baseline without losing either.
steps:
  - "Start a new Claude Code session and give it a task with meaningful state — e.g. 'scaffold a REST endpoint for user registration'. Do not finish it."
  - "Exit Claude Code (`/exit` or Ctrl+C). Note the session ID shown in the exit message, or use the name you gave it."
  - "Restart Claude Code with `claude --resume <session-id>`. Confirm the conversation history is restored and you can continue exactly where you left off."
  - "Now start a fresh session with a clean baseline: ask Claude to read and summarize a module without making any changes."
  - "From this baseline, use `fork_session` to create two branches: in branch A, ask Claude to refactor the module for readability; in branch B, ask Claude to refactor it for performance."
  - "Compare the two forks. Notice that each branch has the shared context (the summary) but independent edit histories."
  - "Decide which approach you prefer. To discard the other fork, simply close it — neither branch affects the other."
  - "Practice the decision rule: resume when you want to continue incomplete work; fork when you want to explore two paths from a known-good point; start fresh when prior context would mislead more than help."
hints:
  - "`--resume <session-id>` restores the full conversation history. The model sees everything it saw before."
  - "Session IDs are shown on exit and in `claude sessions list`."
  - "`fork_session` creates a copy of the current session state. Changes in the fork do not propagate back to the original."
  - "Forking is especially useful before a risky refactor — you can explore the change without committing to it."
  - "When starting fresh is better: when the prior context has stale assumptions, contains many failed attempts that would bias the model, or the task has fundamentally changed direction."
verify:
  - label: "Lists available sessions with their IDs."
    command: "claude sessions list"
solution: |
  Resuming a session:

  ```bash
  # List sessions to find the ID
  claude sessions list

  # Resume by ID
  claude --resume abc123def456

  # Or if you named the session
  claude --resume my-registration-endpoint
  ```

  When you resume, Claude Code restores:
  - The full conversation history
  - All file edits made in the previous session
  - The working directory state

  Forking for parallel exploration:

  ```
  # In an active session, after Claude has summarized the module:
  > fork_session

  # Branch A — readability focus
  > Refactor this module to be more readable: extract helper functions,
    improve variable names, and add explanatory comments.

  # (In the other fork / separate terminal)
  > fork_session  # fork from the same baseline

  # Branch B — performance focus
  > Refactor this module for performance: identify hot paths, reduce
    allocations, and minimize function call overhead.
  ```

  Decision framework:

  | Situation | Action | Why |
  |-----------|--------|-----|
  | Mid-task, need to close terminal | Resume next session | Full context preserved |
  | Want to try two approaches safely | Fork from baseline | Each branch is independent |
  | Prior context has stale assumptions | Start fresh | Old context can mislead |
  | Many failed attempts polluting context | Start fresh + summary | Clean slate with key findings |
  | Continuing a long-running research task | Resume | Avoid re-explaining the problem |

  When to start fresh instead of resuming:

  A prior session where Claude attempted five different approaches and failed at each is a liability, not an asset. The failed attempts bias the model toward the same dead ends. In this case, start fresh and open with a structured summary of what you tried and why it didn't work — this gives the model the signal without the noise.
---

<div class="callout callout--prereq">
  <strong>Prerequisites</strong>
  Claude Code installed. A multi-step task you can start and return to — any project. Basic comfort running Claude Code interactively.
</div>

**Why this matters:** Session management is how you avoid losing work and control context quality in long-running tasks. The exam tests `--resume` syntax, the behavior of `fork_session`, and — critically — the judgment of when to resume vs start fresh. A session full of failed attempts can actively harm the next attempt; knowing when to discard that history is part of effective agentic workflow.
