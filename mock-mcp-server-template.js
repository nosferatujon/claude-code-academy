/**
 * mock-mcp-server-template.js
 * 
 * Starter skeleton for the "Design structured MCP error responses" exercise.
 * 
 * Complete the TODO sections below to return structured error shapes.
 * Then copy this file to `mock-mcp-server.js` and register it with Claude Code:
 *   claude mcp add records -- node ./mock-mcp-server.js
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create a new MCP server instance
const server = new McpServer({ name: "mock-records", version: "1.0.0" });

// Define the query_records tool
server.tool(
  "query_records",
  "Query the records database. Returns records matching the filter, or a structured error.",
  {
    filter: z.string().describe("Filter string for the query (e.g., transient, forbidden, invalid, empty)")
  },
  async ({ filter }) => {
    // 1. Simulate a transient database timeout
    if (filter === "transient") {
      // TODO: Return a tool error payload. Set `isError: true` and return a content block
      // containing a JSON string with errorCategory: "transient", isRetryable: true, and a message.
      return {
        content: [{ type: "text", text: JSON.stringify({
          // Fill in values here
        })}],
        isError: true
      };
    }

    // 2. Simulate a permission denied error
    if (filter === "forbidden") {
      // TODO: Return a tool error payload. Set `isError: true` and return a content block
      // containing a JSON string with errorCategory: "permission", isRetryable: false, and a message.
      return {
        content: [{ type: "text", text: JSON.stringify({
          // Fill in values here
        })}],
        isError: true
      };
    }

    // 3. Simulate an input validation error
    if (filter === "invalid") {
      // TODO: Return a tool error payload. Set `isError: true` and return a content block
      // containing a JSON string with errorCategory: "validation", isRetryable: false, and a message.
      return {
        content: [{ type: "text", text: JSON.stringify({
          // Fill in values here
        })}],
        isError: true
      };
    }

    // 4. Simulate a valid query that returned 0 records (empty result set)
    if (filter === "empty") {
      // TODO: Return a valid (non-error) response containing an empty records array.
      // Do NOT set `isError: true` because an empty result is a successful query outcome.
      return {
        content: [{ type: "text", text: JSON.stringify({
          // Fill in values here
        })}]
      };
    }

    // Happy path (successful extraction)
    return {
      content: [{ 
        type: "text", 
        text: JSON.stringify({
          records: [
            { id: 101, name: "Database Record A", filter },
            { id: 102, name: "Database Record B", filter }
          ],
          total: 2
        }) 
      }]
    };
  }
);

// Connect the stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);
