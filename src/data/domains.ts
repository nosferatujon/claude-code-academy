// The five CCA-F (Claude Certified Architect – Foundations) exam domains.
// `practiceable` = users can do hands-on exercises with Claude Code alone
// (no Claude API / Agent SDK access required).
// Ordered for learners: start with Claude Code itself, work toward advanced orchestration.

export type DomainId =
  | 'agentic'
  | 'prompting'
  | 'workflows'
  | 'mcp'
  | 'context';

export interface Domain {
  id: DomainId;
  name: string;
  weight: number; // exam weighting, %
  blurb: string;
  practiceable: boolean;
  objectives: string[]; // "By the end of this module you will be able to..."
}

export const DOMAINS: Domain[] = [
  {
    id: 'workflows',
    name: 'Claude Code Configuration & Workflows',
    weight: 20,
    blurb:
      'CLAUDE.md, Agent Skills, plan mode, slash commands, hooks, settings, and CI/CD with Claude Code.',
    practiceable: true,
    objectives: [
      'Set up CLAUDE.md to give Claude durable project memory',
      'Create slash commands, skills, and hooks for repeatable workflows',
      'Run Claude Code headlessly in CI/CD pipelines',
    ],
  },
  {
    id: 'prompting',
    name: 'Prompt Engineering & Structured Output',
    weight: 20,
    blurb:
      'Context engineering, JSON schemas, extraction patterns, few-shot prompting and structured output.',
    practiceable: true,
    objectives: [
      'Write prompts that produce consistent, reliable results from Claude',
      'Extract structured JSON using schemas, few-shot examples, and tool_use',
      'Design validation-retry loops for production extraction pipelines',
    ],
  },
  {
    id: 'context',
    name: 'Context Management & Reliability',
    weight: 15,
    blurb:
      'Long-context strategies, multi-agent handoffs, error propagation, escalation, and reliability patterns.',
    practiceable: true,
    objectives: [
      'Keep the context window focused and avoid overflow degradation',
      'Design multi-agent handoffs that pass results, not raw transcripts',
      'Build bounded retry and escalation patterns for autonomous agents',
    ],
  },
  {
    id: 'mcp',
    name: 'Tool Design & MCP Integration',
    weight: 18,
    blurb:
      'Model Context Protocol servers, tool boundaries, resources, and prompts. Practiceable via Claude Code MCP config.',
    practiceable: true,
    objectives: [
      'Add and scope MCP servers in Claude Code and project config',
      'Design single-purpose tools with clear descriptions and typed schemas',
      'Return structured error responses that guide agents to recover correctly',
    ],
  },
  {
    id: 'agentic',
    name: 'Agentic Architecture & Orchestration',
    weight: 27,
    blurb:
      'Agent SDK, multi-agent orchestration, hub-and-spoke patterns, lifecycle hooks. Architecture-focused — exercises use Claude Code to observe the concepts.',
    practiceable: false,
    objectives: [
      'Explain the agentic loop and how stop_reason drives termination',
      'Design hub-and-spoke orchestration with correct task decomposition',
      'Identify what the Claude Agent SDK requires to spawn and run subagents',
    ],
  },
];

export const DOMAIN_MAP: Record<DomainId, Domain> = Object.fromEntries(
  DOMAINS.map((d) => [d.id, d]),
) as Record<DomainId, Domain>;

export function domainName(id: DomainId): string {
  return DOMAIN_MAP[id]?.name ?? id;
}
