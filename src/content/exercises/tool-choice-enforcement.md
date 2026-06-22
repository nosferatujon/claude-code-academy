---
title: Control tool selection with tool_choice
domain: mcp
difficulty: intermediate
estMinutes: 20
order: 3
intro: Observe the difference between auto, any, and forced tool_choice — then use forced selection to guarantee a specific tool runs first in an agentic workflow.
steps:
  - "Set up two tools in a test script: `search_docs` (searches documentation) and `get_current_date` (returns today's date)."
  - "Send a request with `tool_choice: {type: 'auto'}` asking 'What does the deploy command do?'. Observe: Claude picks `search_docs` because it's relevant, and may not call `get_current_date` at all."
  - "Send the same request with `tool_choice: {type: 'any'}`. Observe: Claude must call at least one tool, but still chooses which one."
  - "Send a request with `tool_choice: {type: 'tool', name: 'get_current_date'}`. Observe: Claude calls `get_current_date` first, regardless of whether it's obviously needed."
  - "Design a scenario where forced tool use is the right choice: an audit log workflow where you need a timestamp on every run. Wire up `tool_choice` to force `get_current_date` before any other work."
  - "Identify a scenario where `auto` is better: a general assistant where you don't know in advance which tool will be relevant."
hints:
  - "`tool_choice: auto` — Claude decides whether to call a tool and which one. This is the default."
  - "`tool_choice: any` — Claude must call at least one tool, but chooses which. Useful when you know a tool call is needed but don't know which one."
  - "`tool_choice: {type: 'tool', name: 'X'}` — Claude must call tool X as its first action. Use this when a specific tool must always run (e.g. to fetch a timestamp, a session token, or required context)."
  - "Forced tool_choice is also how you ensure structured output — force a schema-bearing tool so the response is always a valid tool_use block."
  - "After a forced first call, subsequent turns can use `auto` so Claude continues naturally."
verify:
  - label: "Confirms the test script exists."
    command: "ls tool-choice-test.*"
solution: |
  `tool-choice-test.py`:

  ```python
  import anthropic
  import json

  client = anthropic.Anthropic()

  tools = [
      {
          "name": "search_docs",
          "description": "Search the product documentation for a topic.",
          "input_schema": {
              "type": "object",
              "properties": {"query": {"type": "string"}},
              "required": ["query"]
          }
      },
      {
          "name": "get_current_date",
          "description": "Return today's date in ISO 8601 format.",
          "input_schema": {"type": "object", "properties": {}}
      }
  ]

  question = "What does the deploy command do?"

  # --- auto: Claude chooses ---
  r_auto = client.messages.create(
      model="claude-opus-4-5",
      max_tokens=256,
      tools=tools,
      tool_choice={"type": "auto"},
      messages=[{"role": "user", "content": question}]
  )
  print("auto:", r_auto.stop_reason, [b.name for b in r_auto.content if b.type == "tool_use"])
  # Expected: tool_use, ['search_docs']

  # --- any: must call something ---
  r_any = client.messages.create(
      model="claude-opus-4-5",
      max_tokens=256,
      tools=tools,
      tool_choice={"type": "any"},
      messages=[{"role": "user", "content": question}]
  )
  print("any:", r_any.stop_reason, [b.name for b in r_any.content if b.type == "tool_use"])
  # Expected: tool_use, ['search_docs'] (Claude still picks the relevant one)

  # --- forced: must call get_current_date first ---
  r_forced = client.messages.create(
      model="claude-opus-4-5",
      max_tokens=256,
      tools=tools,
      tool_choice={"type": "tool", "name": "get_current_date"},
      messages=[{"role": "user", "content": question}]
  )
  print("forced:", r_forced.stop_reason, [b.name for b in r_forced.content if b.type == "tool_use"])
  # Expected: tool_use, ['get_current_date']  — forced regardless of relevance
  ```

  When to use each mode:

  | Mode | When to use |
  |------|-------------|
  | `auto` | General assistant; you don't know which tool (or whether any tool) is needed |
  | `any` | You know a tool call is required but the right choice depends on the query |
  | `tool: X` | A specific tool MUST run — for timestamps, session tokens, structured output, or audit requirements |

  Forced tool_choice is also the recommended way to guarantee structured output: define your schema as a tool, force it with `tool_choice`, and the response is always a valid `tool_use` block matching your schema — never prose.
---

<div class="callout callout--prereq">
  <strong>Prerequisites</strong>
  An Anthropic API key (this exercise uses the Claude API directly). Familiarity with JSON Schema basics — types, required fields, and enums. The <strong>Prompt Engineering — Advanced Patterns</strong> lesson covers the concepts this builds on.
</div>

**Why this matters:** `tool_choice` is a key knob in agentic workflows. The exam tests all three modes and the situations that call for each. The most commonly missed scenario is using forced `tool_choice` not because you need the tool's output, but because you need to guarantee the response shape — making it the reliable path to structured output from the API.
