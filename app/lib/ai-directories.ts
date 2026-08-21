export interface AiDirectoryConfig {
  slug: 'ai-coding-agents' | 'ai-tools' | 'ai-models'
  title: string
  description: string
  longDescription: string
  canonicalPath: string
  hubSlugs: string[]
  hubLink?: string | null
  keywords: string[]
  pageRole: string
  entryLinks: Array<{
    href: string
    label: string
    description: string
  }>
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
    pageRole:
      'The canonical entry point for agent runtime architecture, tool execution, permissions, MCP, sessions, and migration practice.',
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
    entryLinks: [
      {
        href: '/blog/2026-04-02-claw-code-ai-coding-agent-architecture',
        label: 'Read the runtime architecture overview',
        description: 'See how a coding agent is assembled beyond the foundation model.',
      },
      {
        href: '/blog/claw-code-usage-guide',
        label: 'Follow the Claw Code usage guide',
        description: 'Translate the architecture into a practical evaluation and rollout path.',
      },
      {
        href: '/blog/mcp-model-context-protocol-guide',
        label: 'Understand MCP and tool boundaries',
        description: 'Learn how external tools, permissions, and context exchange fit together.',
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
    pageRole:
      'The canonical directory for choosing AI developer tools by workflow fit, review cost, automation surface, and product comparison.',
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
    entryLinks: [
      {
        href: '/blog/ai-agent-tools-comparison-2026',
        label: 'Compare AI agent tools',
        description: 'Start with a workflow-level comparison of coding assistants and agents.',
      },
      {
        href: '/blog/ai-tools-seo-optimization',
        label: 'Use the data-first SEO workflow',
        description: 'See how AI tools support research, briefs, internal links, and refreshes.',
      },
      {
        href: '/ai-coding-agents',
        label: 'Go deeper on coding agents',
        description: 'Move from a tool catalogue into runtime, permission, and session design.',
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
    hubLink: null,
    pageRole:
      'The canonical entry point for model comparison, benchmark interpretation, learning paths, and production tradeoffs.',
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
    entryLinks: [
      {
        href: '/blog/llm-coding-benchmark-comparison-2026',
        label: 'Read the current benchmark comparison',
        description: 'Match SWE-bench, Aider, LiveCodeBench, and Terminal-Bench to real work.',
      },
      {
        href: '/blog/ai-benchmark-methodology',
        label: 'Audit the benchmark methodology',
        description: 'Separate vendor claims, third-party tests, scaffolds, and reproducibility.',
      },
      {
        href: '/blog/gpt-5-for-coding',
        label: 'Follow the coding-model learning path',
        description: 'Connect benchmark scores to pricing, prompting, validation, and rollout.',
      },
    ],
  },
]

export function getAiDirectory(slug: AiDirectoryConfig['slug']) {
  return aiDirectories.find((directory) => directory.slug === slug)
}
