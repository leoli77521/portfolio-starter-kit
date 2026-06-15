export interface AiDirectoryConfig {
  slug: 'ai-coding-agents' | 'ai-tools' | 'ai-models'
  title: string
  description: string
  longDescription: string
  canonicalPath: string
  hubSlugs: string[]
  keywords: string[]
  decisionCards: Array<{
    title: string
    description: string
  }>
}

export const aiDirectories: AiDirectoryConfig[] = [
  {
    slug: 'ai-coding-agents',
    title: 'AI Coding Agents',
    description:
      'A structured directory for understanding AI coding agents, runtime architecture, tools, permissions, MCP, sessions, and migration discipline.',
    longDescription:
      'Use this directory when you want the operating model behind AI coding agents rather than another quick product comparison. It connects the agent runtime stack, tool systems, permissions, MCP integration, plugin/session design, and migration practices into one editorial entry point.',
    canonicalPath: '/ai-coding-agents',
    hubSlugs: ['ai-coding-agent-stack'],
    keywords: [
      'AI coding agents',
      'coding agent architecture',
      'MCP coding agents',
      'agent runtime design',
      'AI developer tools',
    ],
    decisionCards: [
      {
        title: 'Start with the runtime',
        description:
          'Understand the loop, state, tool execution, and trust boundary before comparing model scores.',
      },
      {
        title: 'Evaluate the tool surface',
        description:
          'Look at file access, shell execution, MCP integrations, hooks, and permission gates as product features.',
      },
      {
        title: 'Plan for migration discipline',
        description:
          'Treat clean-room rewrites, parity audits, and session continuity as first-class engineering work.',
      },
    ],
  },
  {
    slug: 'ai-tools',
    title: 'AI Tools for Developers',
    description:
      'A practical directory for choosing AI developer tools, coding assistants, automation agents, and productivity workflows.',
    longDescription:
      'Use this directory to compare AI developer tools by workflow fit: IDE assistants, terminal agents, code execution surfaces, mobile assistants, and task automation tools. The emphasis is practical adoption, not product hype.',
    canonicalPath: '/ai-tools',
    hubSlugs: ['ai-tools-for-developers'],
    keywords: [
      'AI tools for developers',
      'AI coding tools',
      'developer productivity AI',
      'AI code assistant',
      'AI agent tools',
    ],
    decisionCards: [
      {
        title: 'Match the tool to the workflow',
        description:
          'Use IDE assistants for guided editing, terminal agents for autonomous changes, and automation tools for repeatable tasks.',
      },
      {
        title: 'Watch the productivity trap',
        description:
          'A tool can feel faster while increasing review cost, correction loops, or integration overhead.',
      },
      {
        title: 'Prefer inspectable systems',
        description:
          'Choose tools that expose actions, permissions, costs, and failure states clearly enough for serious work.',
      },
    ],
  },
  {
    slug: 'ai-models',
    title: 'AI Models and Benchmarks',
    description:
      'A builder-focused directory for comparing AI models, coding benchmarks, cost tradeoffs, open-source options, and local AI infrastructure.',
    longDescription:
      'Use this directory when model choice matters to product execution. It connects benchmark interpretation, coding performance, open-source model shifts, enterprise cost decisions, and hardware constraints so model comparisons lead to better engineering choices.',
    canonicalPath: '/ai-models',
    hubSlugs: ['ai-model-comparisons'],
    keywords: [
      'AI model comparison',
      'LLM benchmarks',
      'best AI model for coding',
      'GPT-5 vs Claude vs Gemini',
      'open source AI models',
    ],
    decisionCards: [
      {
        title: 'Read benchmarks in context',
        description:
          'SWE-bench, LiveCodeBench, and model leaderboards matter, but scaffolding and task mix change outcomes.',
      },
      {
        title: 'Balance cost and reliability',
        description:
          'Premium reasoning models, value models, and open-source systems each fit different latency and budget constraints.',
      },
      {
        title: 'Include the interface',
        description:
          'The same model behaves differently inside an IDE, terminal agent, API workflow, or local hardware setup.',
      },
    ],
  },
]

export function getAiDirectory(slug: AiDirectoryConfig['slug']) {
  return aiDirectories.find((directory) => directory.slug === slug)
}
