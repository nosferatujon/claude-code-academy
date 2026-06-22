// The five CCA-F (Claude Certified Architect – Foundations) exam domains.
// `practiceable` = users can do hands-on exercises with Claude Code alone
// (no Claude API / Agent SDK access required).

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
}

export const DOMAINS: Domain[] = [
  {
    id: 'agentic',
    name: 'Agentic Architecture & Orchestration',
    weight: 27,
    blurb:
      'Agent SDK, multi-agent orchestration, hub-and-spoke patterns, lifecycle hooks. Mostly conceptual for Claude-Code-only learners.',
    practiceable: false,
  },
  {
    id: 'prompting',
    name: 'Prompt Engineering & Structured Output',
    weight: 20,
    blurb:
      'Context engineering, JSON schemas, extraction patterns, few-shot prompting and structured output.',
    practiceable: true,
  },
  {
    id: 'workflows',
    name: 'Claude Code Configuration & Workflows',
    weight: 20,
    blurb:
      'CLAUDE.md, Agent Skills, plan mode, slash commands, hooks, settings, and CI/CD with Claude Code.',
    practiceable: true,
  },
  {
    id: 'mcp',
    name: 'Tool Design & MCP Integration',
    weight: 18,
    blurb:
      'Model Context Protocol servers, tool boundaries, resources, and prompts. Practiceable via Claude Code MCP config.',
    practiceable: true,
  },
  {
    id: 'context',
    name: 'Context Management & Reliability',
    weight: 15,
    blurb:
      'Long-context strategies, multi-agent handoffs, error propagation, escalation, and reliability patterns.',
    practiceable: true,
  },
];

export const DOMAIN_MAP: Record<DomainId, Domain> = Object.fromEntries(
  DOMAINS.map((d) => [d.id, d]),
) as Record<DomainId, Domain>;

export function domainName(id: DomainId): string {
  return DOMAIN_MAP[id]?.name ?? id;
}
