---
title: Tool Design & MCP Integration
domain: mcp
order: 1
minutes: 8
summary: What the Model Context Protocol is, its primitives (tools, resources, prompts), transports, and how to design good tool boundaries.
---

This domain (**18%**) covers the **Model Context Protocol (MCP)** — the open standard for connecting AI applications to external tools and data. You can practice it directly by configuring MCP servers in Claude Code.

## What MCP is

MCP is a client–server protocol. The **host** (e.g. Claude Code) runs an MCP **client** that connects to one or more MCP **servers**. Each server exposes capabilities the model can use. Think of it as "USB-C for AI tools": write a server once, and any MCP-compatible client can use it.

## The three server primitives

- **Tools** — functions the model can *call* to take action or fetch data (e.g. `search_issues`, `run_query`). Model-controlled.
- **Resources** — read-only data the server exposes (files, records) that can be loaded into context. Application/user-controlled.
- **Prompts** — reusable prompt templates the server offers, often surfaced as slash commands.

## Transports

- **stdio** — the server runs as a local subprocess; the client talks to it over stdin/stdout. Best for local tools.
- **HTTP / streamable HTTP** — the server is remote; good for hosted, shared, or multi-user servers.

In Claude Code you add servers with `claude mcp add` or via configuration; scopes can be local, project (shared, committed), or user.

## Designing good tools

- **Right granularity**: a tool should do one clear thing. Too broad and the model misuses it; too narrow and it needs many calls.
- **Clear names and descriptions**: the description is the model's only guide to *when* to use the tool — write it for the model.
- **Typed inputs**: define a JSON schema for parameters; constrain enums and required fields.
- **Helpful errors**: return actionable messages so the model can recover, not just stack traces.
- **Least privilege**: expose only what's needed; dangerous actions should require explicit confirmation.

## What to remember for the exam

- MCP = open standard; host runs a client, connects to servers.
- Primitives: tools (model-called actions), resources (read-only data), prompts (templates).
- Transports: stdio (local) and HTTP (remote).
- Good tools are single-purpose, well-described, typed, and least-privilege.
