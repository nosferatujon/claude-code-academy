---
title: Tool Design & MCP Integration
domain: mcp
order: 1
minutes: 11
summary: What the Model Context Protocol is, its primitives (tools, resources, prompts), transports, and how to design good tool boundaries.
---

## What is MCP?

**MCP (Model Context Protocol)** is an open standard that defines how AI applications connect to external tools and data sources. It's the plumbing that lets Claude use tools beyond its built-in capabilities.

Without MCP, if you wanted Claude to query your database or search your internal docs, you'd have to build a custom integration. With MCP, you build a **server** once using the standard protocol, and any MCP-compatible AI application — Claude Code, Claude Desktop, or your own app — can connect to it.

The analogy: MCP is like **USB-C for AI tools**. Different devices, one standard connector.

This domain is **18%** of the exam.

## How it works: host, client, and server

MCP has three roles:

- **Host** — the AI application (e.g. Claude Code, Claude Desktop, your custom app). It runs the client.
- **Client** — built into the host; manages connections to MCP servers.
- **Server** — a separate program you write or install that exposes tools, data, or prompts.

```
You → Claude Code (host + client) → MCP Server (your tools/data)
```

When you ask Claude Code to do something, it can invoke tools on connected MCP servers, just like it can use its built-in Read or Edit tools.

## The three server primitives

Every MCP server can expose up to three types of capabilities:

### Tools — actions the model can call
Tools are functions. Claude calls them to take action or retrieve data.

**Examples:**
- `search_jira_issues(query)` — search your project management system
- `run_sql_query(sql)` — query a database
- `send_slack_message(channel, text)` — post a message
- `get_weather(city)` — fetch current weather

The model decides *when* to call a tool based on the tool's description. Tools are **model-controlled**.

### Resources — data the application loads into context
Resources are read-only data that can be loaded into the conversation as context. Unlike tools (which the model calls), resources are controlled by the **application or user**.

**Examples:**
- The contents of a specific file
- A database record
- A user's profile

Think of resources as "here is data I want Claude to be aware of" rather than "here is an action Claude can take."

### Prompts — reusable templates
Servers can also expose **prompt templates** — pre-written prompts that users or applications can invoke. These often surface as slash commands in Claude Code.

**Example:** An MCP server for your codebase might expose a `/explain-function` prompt template that, when invoked, fills in the current function and asks Claude to explain it.

## Transports — how client and server communicate

The transport is the communication channel between the MCP client and server:

### stdio (local subprocess)
The server runs as a **child process** on the same machine. The client communicates via stdin and stdout.

```
Claude Code → (stdin/stdout) → local MCP server process
```

- Best for: developer tools, local file access, personal integrations
- Simple to set up, no network required

### HTTP / Streamable HTTP (remote server)
The server runs somewhere on the network and exposes an HTTP endpoint.

```
Claude Code → (HTTP) → remote MCP server (could be anywhere)
```

- Best for: shared team tools, hosted services, multi-user servers
- Allows centralized deployment and access control

**In Claude Code**, you add MCP servers with:
```bash
claude mcp add my-server --command "node my-server.js"   # stdio
claude mcp add my-api --url "https://my-api.com/mcp"     # HTTP
```

Server scopes:
- **Local** — only available to you on this machine
- **Project** — defined in `.claude/mcp.json`, committed to git and shared with the team
- **User** — available across all your projects

## Designing good tools

When you write an MCP server, the quality of your tool design determines whether Claude uses your tools correctly.

### Right granularity
Each tool should do **one clear thing**. Avoid tools that are too broad or too narrow.

| Too broad | Too narrow | Just right |
|---|---|---|
| `do_database_operation(type, ...)` | `get_user_by_id(id)`, `get_user_by_email(email)`, ... | `find_user(query)` |

If a tool does too many things, the model won't know when to use it. If it's too narrow, the model needs 10 calls to do what 1 should do.

### Clear names and descriptions
The tool's **description is the model's only guide** to when and how to use it. Write descriptions for Claude, not for humans.

```json
{
  "name": "search_issues",
  "description": "Search for Jira issues by keyword. Use this when the user asks about tickets, bugs, or tasks. Returns a list of matching issues with title, status, and URL."
}
```

A vague description like "gets issues" will cause Claude to misuse or ignore the tool.

### Typed inputs with JSON Schema
Define exactly what each parameter expects:

```json
{
  "parameters": {
    "query": {"type": "string", "description": "Search terms"},
    "status": {"type": "string", "enum": ["open", "closed", "all"], "default": "open"},
    "limit": {"type": "integer", "minimum": 1, "maximum": 50, "default": 10}
  },
  "required": ["query"]
}
```

Enums prevent invalid values. Required fields prevent incomplete calls. Types prevent type errors.

### Helpful error messages
When something goes wrong, return a message the model can act on — not a stack trace.

| Bad error | Good error |
|---|---|
| `NullPointerException at line 42` | `"User not found. Try searching by email instead of username."` |
| `403 Forbidden` | `"Permission denied. This action requires the 'admin' role."` |

Claude will use the error message to decide what to try next. Make it actionable.

### Least privilege
Expose only what's necessary. If a tool only needs to *read* data, don't give it write access. Dangerous or irreversible actions (delete, publish, send) should require explicit confirmation in the tool's logic.

## What to remember for the exam

- MCP = open protocol; host runs a client, client connects to servers.
- **Primitives**: tools (model-called actions), resources (read-only data loaded by app/user), prompts (templates).
- **Transports**: stdio for local subprocesses, HTTP for remote/shared servers.
- Good tools are: **single-purpose**, **well-described** (for the model), **typed**, and **least-privilege**.
- Tool descriptions are the model's only signal for when to use a tool — write them carefully.
