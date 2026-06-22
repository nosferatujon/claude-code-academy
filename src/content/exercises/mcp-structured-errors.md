---
title: Design structured MCP error responses
domain: mcp
difficulty: advanced
estMinutes: 25
order: 2
intro: Build a mock MCP tool that returns categorized errors so Claude can respond differently to transient failures, validation problems, business rule violations, and permission denials.
steps:
  - "Create a minimal MCP server in Node.js (or Python) with a single tool `query_records` that accepts a `filter` parameter."
  - "Make the tool return different error shapes based on the filter value: use `transient` to simulate a timeout, `forbidden` for a permission error, `invalid` for a malformed input, and `empty` for a valid query with no results."
  - "Each error response should include three fields: `errorCategory` (one of transient/validation/business/permission), `isRetryable` (boolean), and `message` (human-readable description)."
  - "Register the server in Claude Code with `claude mcp add`."
  - "Ask Claude to call the tool with filter `transient` and observe: does it retry automatically given `isRetryable: true`?"
  - "Ask Claude to call with filter `forbidden` and observe: does it explain the permission error to you rather than retrying?"
  - "Ask Claude to call with filter `empty` and observe: it should report 'no records found' — NOT treat this as an error, because an empty result is a valid outcome."
  - "Reflect on the distinction between an access failure (timeout — `isRetryable: true`) and a valid empty result (no records — not an error at all)."
hints:
  - "An empty result set is not an error — it's a valid answer. A tool that returns `[]` after a successful query succeeded; one that times out before connecting failed."
  - "`isRetryable: true` signals that the same call may succeed if tried again soon (e.g. a network hiccup). `isRetryable: false` means retrying won't help — fix the input or the permissions first."
  - "Claude uses the `message` field to explain failures to users in natural language — make it accurate and actionable."
  - "The MCP spec does not enforce error structure, so the categories and `isRetryable` flag are conventions you define. Document them in the tool's description."
verify:
  - label: "Confirms the mock MCP server file exists."
    command: "ls mock-mcp-server.*"
  - label: "Confirms the server is registered."
    command: "claude mcp list"
solution: |
  `mock-mcp-server.js` (Node.js, MCP SDK):

  ```javascript
  import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
  import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
  import { z } from "zod";

  const server = new McpServer({ name: "mock-records", version: "1.0.0" });

  server.tool(
    "query_records",
    "Query the records database. Returns records matching the filter, or a structured error.",
    { filter: z.string().describe("Filter string for the query") },
    async ({ filter }) => {
      // Simulate different outcomes based on filter value
      if (filter === "transient") {
        return {
          content: [{ type: "text", text: JSON.stringify({
            errorCategory: "transient",
            isRetryable: true,
            message: "Database connection timed out. The service is temporarily unavailable."
          })}],
          isError: true
        };
      }

      if (filter === "forbidden") {
        return {
          content: [{ type: "text", text: JSON.stringify({
            errorCategory: "permission",
            isRetryable: false,
            message: "Access denied. Your account does not have read access to this dataset."
          })}],
          isError: true
        };
      }

      if (filter === "invalid") {
        return {
          content: [{ type: "text", text: JSON.stringify({
            errorCategory: "validation",
            isRetryable: false,
            message: "Filter syntax error at position 3. Expected operator, got end of string."
          })}],
          isError: true
        };
      }

      if (filter === "empty") {
        // Valid result — not an error
        return {
          content: [{ type: "text", text: JSON.stringify({ records: [], total: 0 }) }]
        };
      }

      // Happy path
      return {
        content: [{ type: "text", text: JSON.stringify({
          records: [{ id: 1, name: "Example record", filter }],
          total: 1
        })}]
      };
    }
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
  ```

  Register it:

  ```bash
  claude mcp add records -- node ./mock-mcp-server.js
  ```

  Expected Claude behavior by error type:

  | Filter | errorCategory | isRetryable | Expected Claude behavior |
  |--------|--------------|-------------|--------------------------|
  | `transient` | transient | true | May retry; explains the outage |
  | `forbidden` | permission | false | Explains you need access; does not retry |
  | `invalid` | validation | false | Reports the syntax problem; asks you to fix the filter |
  | `empty` | — (not an error) | — | Reports "no records found" — success |

  The critical distinction:

  - **Access failure (transient):** The tool could not connect. `isRetryable: true`. Claude should tell the user the service is down and may try again.
  - **Valid empty result:** The tool connected, ran the query, and found nothing. `isError` is absent. Claude should report "no records found" — this is not a failure.

  Conflating these two — treating an empty result as an error — is a common agent bug that causes unnecessary retries and misleading error messages.
---

**Why this matters:** Real-world MCP tools fail in many different ways, and how Claude handles those failures depends entirely on the structure you give the errors. The exam tests whether you can design error responses that enable the right behavior: retry transient failures, explain permission problems, flag validation issues as the caller's responsibility, and never treat a valid empty result as an error.
