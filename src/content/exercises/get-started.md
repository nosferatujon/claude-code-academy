---
title: Your first five minutes with Claude Code
domain: workflows
difficulty: beginner
estMinutes: 10
order: 0
intro: Install Claude Code, authenticate, and give it your first real task — from zero to a working session in under ten minutes.
steps:
  - "Install Claude Code globally: `npm install -g @anthropic-ai/claude-code`"
  - "Open a terminal and navigate to any folder — your own project, or even just an empty folder."
  - "Type `claude` and press Enter to start a session. On first launch, it will walk you through authentication — follow the prompts to connect your Anthropic account."
  - "Once the session starts, give Claude a simple first task: *'List the files in this directory and briefly describe what each one is for.'*"
  - "Watch Claude use its tools (Read, Bash, Glob) to explore the folder and respond. Notice that it doesn't just guess — it actually reads the files."
  - "Ask a follow-up in the same session: *'Which of these files would I edit most often as a developer?'* Claude remembers the context from the previous turn."
  - "Type `/help` to see available slash commands and built-in features."
  - "When you're done, press Ctrl+C or type `exit` to end the session."
hints:
  - "You don't need a complex project — even an empty folder works for a first session."
  - "Claude Code needs an Anthropic API key. If you don't have one, sign up at anthropic.com and create a key in the API console."
  - "When Claude asks 'Allow this action?' before running a command, that's intentional — it's asking your permission before doing anything potentially impactful."
  - "The session stays open as long as you keep chatting. You can give it multiple tasks in one session."
  - "If the `claude` command isn't found after installing, try closing and reopening your terminal, or check that your npm global bin directory is on your PATH."
verify:
  - label: "Confirms Claude Code is installed and shows the version."
    command: "claude --version"
  - label: "Shows the help menu with available flags and slash commands."
    command: "claude --help"
solution: |
  Here's what a successful first session looks like. Your exact output will vary based on your folder contents.

  **Installation:**
  ```bash
  npm install -g @anthropic-ai/claude-code
  # Output: added 1 package, and audited 2 packages in 3s
  ```

  **Starting a session (empty folder):**
  ```
  $ claude
  ╭─────────────────────────────────╮
  │  Claude Code  v1.x.x            │
  │  Working in: /Users/you/sandbox │
  ╰─────────────────────────────────╯
  > List the files in this directory and briefly describe what each one is for.
  ```

  **What Claude does next:**
  Claude calls the `Bash` tool to run `ls -la`, reads any files it finds, and replies with a summary. In a real project you might see something like:

  ```
  Here's what's in this directory:

  - package.json — project metadata and dependency list
  - src/ — source code directory
  - README.md — documentation for the project
  - .gitignore — tells git which files to skip
  ```

  **The key things to notice:**
  - Claude *used tools* — it didn't guess. You can see each tool call before the final reply.
  - The session is conversational — your follow-up question worked because Claude remembered what it just read.
  - Slash commands like `/help`, `/plan`, and `/memory` are always available. You'll use these in later exercises.

  **If authentication fails:**
  Run `claude auth login` and follow the browser prompts to connect your Anthropic account.
---

<div class="callout callout--prereq">
  <strong>Prerequisites</strong>
  A terminal (command prompt or shell), Node.js 18 or newer installed, and an Anthropic account (free to sign up at anthropic.com). That's it — no prior AI or programming experience required.
</div>

**Why this matters:** Every exercise in this course assumes you can start Claude Code and give it a task. Complete this one first and you'll have a working foundation for everything that follows.
