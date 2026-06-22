---
title: Debug subagent permission boundaries
domain: agentic
difficulty: intermediate
estMinutes: 15
order: 3
intro: Investigate what happens when a coordinator agent attempts to spawn subagents using the Task tool without the correct permission configuration, and learn how to debug it.
steps:
  - "Read the Agent SDK orchestration model. Recall that the coordinator is configured with a list of `allowedTools`."
  - "Construct a mock SDK AgentDefinition configuration for a coordinator agent, but omit the `'Task'` tool from the coordinator's `allowedTools` array."
  - "Simulate the agentic loop where the model decides to spawn a subagent to search a directory. Since `'Task'` is not in its allowed tools list, the model emits a tool call to `'Task'` but the host returns a tool-not-found/permission error."
  - "Reflect: does the coordinator fail silently, or does it try to do the search work itself? (Hint: it will fallback to executing the search inline, bloating its context window)."
  - "Now, fix the coordinator configuration by adding `'Task'` to the `allowedTools` array."
  - "Observe how the coordinator successfully delegates the task to the subagent, keeping its own context clean."
  - "Answer: does the spawned subagent inherit the coordinator's allowed tools list? (Hint: No, each subagent has its own independent `AgentDefinition` configuration)."
hints:
  - "In the Claude Agent SDK, `Task` is treated as a standard tool. If it is not in the coordinator's `allowedTools` list, the coordinator cannot spawn other agents."
  - "Subagents start with a completely empty context and their own separate tool permissions. They do not inherit anything from the parent coordinator."
  - "Parallel spawning requires a single response from the coordinator containing multiple Task tool calls. Spawning them sequentially across different turns wastes time and context."
verify:
  - label: "Confirms the lesson content covers coordinator allowedTools permission rules."
    command: "grep -n \"coordinator needs permission\" src/content/lessons/agentic-architecture.md"
solution: |
  Debugging subagent permission boundaries:

  **1. The Broken Configuration (Permission Denied):**
  If you define a coordinator agent like this:
  ```javascript
  const coordinatorAgent = {
    name: "Orchestrator",
    systemPrompt: "You are the manager. Split the user's task and delegate to workers.",
    allowedTools: ["Read", "Bash"] // Task tool is missing!
  };
  ```
  When the model decides to delegate:
  * Model calls: `Task(agentType: "Researcher", prompt: "Explore directory src/")`
  * SDK Host intercepts and returns: `Error: Tool 'Task' is not available to this agent.`
  * The model is forced to perform the file readings itself, bloating its context window and violating the design topology.

  **2. The Fixed Configuration:**
  Add `"Task"` to the list of tools the Orchestrator is allowed to use:
  ```javascript
  const coordinatorAgent = {
    name: "Orchestrator",
    systemPrompt: "You are the manager. Split the user's task and delegate to workers.",
    allowedTools: ["Read", "Bash", "Task"] // Added Task!
  };
  ```

  **3. Subagent Isolation Rule:**
  If the Orchestrator spawns a subagent:
  ```javascript
  const researcherAgent = {
    name: "Researcher",
    systemPrompt: "You are a research assistant. Read files and summarize findings.",
    allowedTools: ["Read", "Glob"] // Subagent has its own limits; cannot spawn more tasks
  };
  ```
  Even though the Orchestrator can call `Task`, the spawned `Researcher` cannot call `Task` because it does not inherit the Orchestrator's `allowedTools`.

  **Key Takeaways for the Exam:**
  * **Task is a tool:** The parent coordinator must explicitly list `"Task"` in its `allowedTools` list.
  * **No inheritance:** Spawned subagents do not inherit the parent's system prompt, conversation context, or tool permissions. Everything must be passed explicitly.
  * **Parallelism:** To spawn workers in parallel, the parent must return all `Task` tool calls in a single turn. If it calls them in sequence across turns, they run sequentially.
---

<div class="callout callout--prereq">
  <strong>Prerequisites</strong>
  Read the <strong>Agentic Architecture & Orchestration</strong> lesson first, focusing on the subagent spawning and allowedTools sections.
</div>

**Why this matters:** The Claude Agent SDK uses a strict security boundary model. The parent agent cannot spawn subagents unless it is granted permission via the `"Task"` tool. The exam tests your ability to spot broken configurations (e.g. why an agent failed to delegate) and understand that subagents require explicit parameter configuration rather than context/permission inheritance.
