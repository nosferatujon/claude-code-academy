---
title: Add and inspect an MCP server
domain: mcp
difficulty: intermediate
estMinutes: 20
order: 1
intro: Connect Claude Code to an external capability over the Model Context Protocol, understand the two configuration scopes, and inspect the tools the server exposes.
steps:
  - "Pick a simple local MCP server — the filesystem server is safe: `npx -y @modelcontextprotocol/server-filesystem <path>`."
  - "Add it at **user scope** (stored in `~/.claude.json`, available in every project): `claude mcp add fs -- npx -y @modelcontextprotocol/server-filesystem ~/sandbox`."
  - "Now add the same server at **project scope** (stored in `.mcp.json` at the repo root, committed and shared with your team): `claude mcp add fs --scope project -- npx -y @modelcontextprotocol/server-filesystem ./data`."
  - "Open `.mcp.json` to see the raw config. Notice that environment variable expansion works here — you can write `$HOME` or `${DATA_DIR}` and the value is resolved at runtime."
  - "Run `claude mcp list` to confirm both registrations appear."
  - "In a Claude Code session, ask what tools the `fs` server provides, then ask it to use one (e.g. list the directory)."
  - "Identify which capabilities are **tools** (actions) versus **resources** (read-only data)."
hints:
  - "`stdio` transport means the server runs as a local subprocess — exactly what `npx ...` does here."
  - "User scope (`~/.claude.json`) is private to you. Project scope (`.mcp.json`) is shared via version control — use it for team-wide tools."
  - "Environment variable expansion lets you avoid hardcoding paths. `${DATA_DIR}` in `.mcp.json` is replaced with the shell variable at launch time."
  - "Only grant the server access to a directory you're comfortable exposing — least privilege."
  - "If a project-scope and user-scope server share the same name, project scope takes precedence."
verify:
  - label: "Lists configured MCP servers and their connection status."
    command: "claude mcp list"
  - label: "Shows the project-scope config file."
    command: "cat .mcp.json"
solution: |
  Add at user scope (private, all projects):

  ```bash
  claude mcp add fs -- npx -y @modelcontextprotocol/server-filesystem ~/sandbox
  ```

  Add at project scope (shared via `.mcp.json`, this project only):

  ```bash
  claude mcp add fs --scope project -- \
    npx -y @modelcontextprotocol/server-filesystem ./data
  ```

  The resulting `.mcp.json` will look like:

  ```json
  {
    "mcpServers": {
      "fs": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem", "./data"]
      }
    }
  }
  ```

  You can use environment variable expansion in the args array:

  ```json
  {
    "mcpServers": {
      "fs": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem", "${DATA_DIR}"]
      }
    }
  }
  ```

  Confirm and inspect:

  ```bash
  claude mcp list
  ```

  Then in the session, Claude can call the server's **tools** (e.g. `read_file`, `list_directory`, `write_file`) and read its **resources**.

  Scope comparison:

  | Scope | Config file | Who sees it | When to use |
  |-------|-------------|-------------|-------------|
  | user | `~/.claude.json` | Only you | Personal tools, credentials |
  | project | `.mcp.json` (repo root) | Whole team | Shared databases, internal APIs |

  What you should take away:

  - The **host** (Claude Code) ran an MCP **client** that launched your **server** over **stdio**.
  - **Tools** are model-callable actions; **resources** are read-only data the server publishes.
  - You constrained the blast radius by pointing the server at `./data` only — least privilege in action.
  - Environment variable expansion keeps secrets and machine-specific paths out of committed config.
---

<div class="callout callout--prereq">
  <strong>Prerequisites</strong>
  Claude Code installed. Node.js 18+ and npm installed (needed to run <code>npx</code> commands). Comfort using the command line. Read the <strong>Tool Design & MCP Integration</strong> lesson first.
</div>

**Why this matters:** MCP is how Claude Code reaches beyond your repo — databases, issue trackers, internal APIs. The exam tests the architecture (host → client → server), the three primitives (tools, resources, prompts), the two config scopes (user vs project), environment variable expansion, the transports (stdio vs HTTP), and the security mindset of granting least privilege.
