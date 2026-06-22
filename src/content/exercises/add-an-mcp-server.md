---
title: Add and inspect an MCP server
domain: mcp
difficulty: intermediate
estMinutes: 15
order: 1
intro: Connect Claude Code to an external capability over the Model Context Protocol, then inspect the tools it exposes.
steps:
  - "Pick a simple local MCP server. A safe one is the filesystem server: `npx -y @modelcontextprotocol/server-filesystem <path>`."
  - "Add it to Claude Code: `claude mcp add fs -- npx -y @modelcontextprotocol/server-filesystem <path-you-allow>`."
  - "Run `claude mcp list` to confirm it's connected."
  - "In a Claude Code session, ask what tools the `fs` server provides, then ask it to use one (e.g. list the directory)."
  - "Identify which capabilities are **tools** (actions) versus **resources** (read-only data)."
hints:
  - "`stdio` transport means the server runs as a local subprocess — exactly what `npx ...` does here."
  - "Scope matters: `--scope project` writes the config to a committed file shared with your team; default is local."
  - "Only grant the server access to a directory you're comfortable exposing — least privilege."
verify:
  - label: "Lists configured MCP servers and their connection status."
    command: "claude mcp list"
solution: |
  Add the server (here, scoped to the project and limited to one directory):

  ```bash
  claude mcp add fs --scope project -- \
    npx -y @modelcontextprotocol/server-filesystem ./data
  ```

  Confirm and inspect:

  ```bash
  claude mcp list
  ```

  Then in the session, Claude can call the server's **tools** (e.g. `read_file`, `list_directory`, `write_file`) and read its **resources**.

  What you should take away:

  - The **host** (Claude Code) ran an MCP **client** that launched your **server** over **stdio**.
  - **Tools** are model-callable actions; **resources** are read-only data the server publishes.
  - You constrained the blast radius by pointing the server at `./data` only — least privilege in action.
  - Project scope means the connection is defined once and shared via version control.
---

**Why this matters:** MCP is how Claude Code reaches beyond your repo — databases, issue trackers, internal APIs. The exam tests the architecture (host → client → server), the three primitives (tools, resources, prompts), the transports (stdio vs HTTP), and the security mindset of granting least privilege.
