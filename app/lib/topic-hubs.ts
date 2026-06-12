import type { Category } from '@/app/types'
import aiTopicClusters from '@/data/ai-topic-clusters.json'
import { normalizeTagName } from 'app/lib/tag-utils'

export interface TopicHub {
  slug: string
  title: string
  description: string
  longDescription: string
  relatedTags: string[]
  relatedCategories: Category[]
  targetKeywords: string[]
  icon: string
  featuredArticleSlugs?: string[]
  learningGoals?: string[]
  seriesTitle?: string
  seriesDescription?: string
  directoryHref?: string
}

const primaryHubBySlug = aiTopicClusters.primaryHubBySlug as Record<string, string>
const directoryHrefByHubSlug = new Map(
  aiTopicClusters.hubs.map((hub) => [hub.slug, hub.directoryHref])
)

/**
 * Topic Hubs - Curated collections of related content
 * Each hub aggregates posts by related tags to create comprehensive topic pages
 */
export const topicHubs: TopicHub[] = [
  {
    slug: 'ai-development-guide',
    title: 'AI Development Guide',
    description: 'Complete guide to building AI-powered applications with modern frameworks and tools.',
    longDescription: `Master the art of AI development with our comprehensive guide covering everything from fundamentals to advanced implementations. Learn how to build intelligent applications using cutting-edge frameworks like LangChain, integrate with powerful APIs from OpenAI and Anthropic, and create autonomous AI agents that can handle complex tasks. Whether you're just starting with AI development or looking to expand your expertise, this hub provides structured learning paths, practical tutorials, and real-world examples to accelerate your journey in AI engineering.`,
    relatedTags: ['AI Agents', 'LangChain', 'GPT', 'ChatGPT', 'Claude', 'Machine Learning', 'Prompt Engineering', 'AI Tools', 'AI Programming', 'Artificial Intelligence', 'Gemini'],
    relatedCategories: ['AI Technology', 'Technology'],
    targetKeywords: ['AI开发教程', 'AI development tutorial', 'build AI applications', 'LangChain guide', 'AI agent development'],
    icon: '🤖',
  },
  {
    slug: 'seo-fundamentals',
    title: 'SEO Fundamentals',
    description: 'SEO fundamentals learning hub for Google SEO basics, technical setup, content optimization, and better search rankings.',
    longDescription: `Take your website from invisible to irresistible with our comprehensive SEO fundamentals learning hub. This collection covers the complete spectrum of Google SEO fundamentals, from understanding how search engines work to implementing advanced technical SEO strategies. Learn the art of keyword research, master on-page optimization techniques, build quality backlinks, and understand how to measure your SEO success with analytics. Our practical, up-to-date guides help you navigate the ever-changing landscape of search algorithms and stay ahead of the competition.`,
    relatedTags: ['SEO Optimization', 'Keyword Research', 'Technical SEO', 'Content Marketing', 'Analytics'],
    relatedCategories: ['SEO & Marketing', 'Web Development'],
    targetKeywords: ['SEO fundamentals', 'Google SEO fundamentals', 'SEO learning hub', 'fundamentals of SEO', 'SEO basics', 'search engine optimization guide', 'improve search ranking', 'SEO tutorial'],
    icon: '📈',
    featuredArticleSlugs: [
      'seo-optimization-guide',
      'ai-tools-seo-optimization',
      'ai-javascript-seo-blog',
      '2025-08-15-ai-content-pipeline-seo',
    ],
    learningGoals: [
      'Understand the SEO fundamentals that help Google discover, render, and rank content.',
      'Turn keyword research into titles, headings, summaries, and internal links that match search intent.',
      'Measure mobile search performance with Search Console data and refresh weak pages systematically.',
    ],
  },
  {
    slug: 'ai-tools-for-developers',
    title: 'AI Tools for Developers',
    description: 'Discover and master AI-powered tools that enhance developer productivity.',
    longDescription: `Supercharge your development workflow with our curated collection of AI-powered tools designed specifically for developers. From intelligent code completion with GitHub Copilot to automated code review with AI assistants, discover how artificial intelligence is transforming software development. This hub explores productivity boosters, code generation tools, AI-assisted debugging, and intelligent documentation generators. Learn which tools work best for different tasks, how to integrate them into your existing workflow, and tips for getting the most out of AI assistance in your daily coding.`,
    relatedTags: ['AI Tools', 'ChatGPT', 'Claude', 'Productivity', 'Developer Tools', 'Automation', 'AI Programming', 'Gemini'],
    relatedCategories: ['AI Technology', 'Productivity', 'Technology'],
    targetKeywords: ['开发者AI工具', 'AI tools for coding', 'developer productivity AI', 'AI code assistant', 'programming with AI'],
    icon: '🛠️',
    directoryHref: directoryHrefByHubSlug.get('ai-tools-for-developers'),
    featuredArticleSlugs: [
      'ai-agent-tools-comparison-2026',
      'ai-coding-tools-slower-productivity-paradox',
      'claude-ai-now-executes-code',
      '2026-03-10-google-gemini-phone-layer',
    ],
    learningGoals: [
      'Compare developer-facing AI tools by workflow fit instead of product hype.',
      'Understand where coding assistants speed teams up and where they can slow work down.',
      'Choose tool stacks based on autonomy, review needs, integration surface, and operating cost.',
    ],
  },
  {
    slug: 'nextjs-mastery',
    title: 'Next.js Mastery',
    description: 'Comprehensive Next.js tutorials from basics to production-ready applications.',
    longDescription: `Become a Next.js expert with our in-depth learning hub covering the React framework that powers modern web applications. From understanding the fundamentals of server-side rendering and static generation to mastering the new App Router and Server Components, this collection provides everything you need to build fast, scalable, and SEO-friendly web applications. Learn best practices for data fetching, authentication, API routes, and deployment strategies. Whether you're building a personal blog or an enterprise application, these tutorials will guide you through every step of the Next.js journey.`,
    relatedTags: ['Next.js', 'React', 'TypeScript', 'JavaScript', 'Web Development'],
    relatedCategories: ['Web Development', 'Technology'],
    targetKeywords: ['Next.js教程', 'Next.js tutorial', 'learn Next.js', 'React framework guide', 'server-side rendering'],
    icon: '⚡',
  },
  {
    slug: 'productivity-automation',
    title: 'Productivity & Automation',
    description: 'Automate your workflow and boost productivity with smart tools and techniques.',
    longDescription: `Transform your work efficiency with our comprehensive productivity and automation hub. Discover powerful techniques to automate repetitive tasks, streamline your development workflow, and reclaim hours of your day. From scripting and task automation to leveraging AI assistants for routine work, this collection helps you work smarter, not harder. Learn about workflow optimization tools, time management strategies specifically for developers, and how to build custom automation solutions that fit your unique needs. Boost your output while reducing burnout with proven productivity methods.`,
    relatedTags: ['Productivity', 'Automation', 'Developer Tools', 'AI Tools', 'Workflow'],
    relatedCategories: ['Productivity', 'Technology', 'AI Technology'],
    targetKeywords: ['开发者效率工具', 'developer productivity', 'workflow automation', 'automate coding tasks', 'productivity tips'],
    icon: '⚙️',
  },
  {
    slug: 'ai-coding-agent-stack',
    title: 'AI Coding Agent Stack',
    description: 'A practical path for understanding coding agent runtime design, tool systems, MCP integration, permissions, sessions, and extensibility.',
    longDescription: `Study how serious AI coding agents are put together beyond the model layer. This topic hub focuses on the architecture patterns that make coding agents usable in real developer workflows: runtime loops, tool execution, permission models, MCP-powered external capabilities, session continuity, hooks, plugins, and migration discipline. It is designed for readers who want to understand the operating environment around AI coding agents rather than only compare model demos or benchmark charts.`,
    relatedTags: ['AI Coding Agents', 'AI Agents', 'Developer Tools', 'AI Programming', 'MCP', 'Claw Code', 'Claude Code', 'Rust', 'Python', 'Automation'],
    relatedCategories: ['AI Technology', 'Technology'],
    targetKeywords: ['AI coding agent architecture', 'coding agent stack', 'AI developer tools', 'MCP coding agents', 'agent runtime design'],
    icon: '🧭',
    directoryHref: directoryHrefByHubSlug.get('ai-coding-agent-stack'),
    seriesTitle: 'Inside the AI Coding Agent Stack',
    seriesDescription:
      'A connected series on runtime architecture, tool systems, MCP integration, permissions, sessions, hooks, plugins, and migration discipline in modern coding agents.',
    featuredArticleSlugs: [
      '2026-04-02-claw-code-ai-coding-agent-architecture',
      '2026-04-02-rust-python-ai-agent-runtime-architecture',
      '2026-04-02-tooling-permissions-mcp-coding-agents',
      '2026-04-02-hooks-plugins-sessions-ai-agents',
      '2026-04-02-clean-room-rewrites-parity-audits-ai-agents',
    ],
    learningGoals: [
      'Understand the runtime layers that sit between a foundation model and a usable coding agent.',
      'See why tool registries, permission gates, and MCP integrations define real-world capability.',
      'Learn how sessions, hooks, and plugins turn an assistant into an extensible developer environment.',
      'Use parity audits and rewrite discipline to reason about agent migrations without losing behavior.',
    ],
  },
  {
    slug: 'ai-model-comparisons',
    title: 'AI Model Comparisons',
    description:
      'Benchmarks, pricing, open-source tradeoffs, and coding capability analysis for builders choosing AI models.',
    longDescription: `Model choice has become an engineering decision, not a leaderboard ritual. This hub organizes ToLearn analysis on coding benchmarks, reasoning claims, open-source model shifts, local hardware, and enterprise cost tradeoffs so builders can compare AI models in context. The goal is to connect benchmark results to real workflow decisions: which model to use, where the scaffold matters more than the score, when local AI changes the economics, and how much reliability teams should expect in production.`,
    relatedTags: [
      'LLM',
      'GPT-5',
      'Gemini',
      'DeepSeek',
      'Kimi K2',
      'Claude Opus 4.5',
      'Coding Benchmark',
      'SWE-bench',
      'LiveCodeBench',
      'AI benchmarks',
      'AI reasoning',
      'OpenAI',
      'Apple M5',
      'local AI',
      'open source',
    ],
    relatedCategories: ['AI Technology', 'Technology'],
    targetKeywords: [
      'AI model comparison',
      'LLM benchmark comparison',
      'best AI model for coding',
      'GPT-5 vs Claude vs Gemini',
      'open source AI models',
    ],
    icon: '📊',
    directoryHref: directoryHrefByHubSlug.get('ai-model-comparisons'),
    featuredArticleSlugs: [
      'llm-coding-benchmark-comparison-2026',
      'gpt-5-for-coding',
      'gpt-5-enterprise-reality-check',
      'verbose-ai-beats-fast-ai-moonshot-k2',
    ],
    learningGoals: [
      'Read benchmark claims alongside scaffolding, cost, and production constraints.',
      'Compare proprietary and open-source model tradeoffs without flattening them into one score.',
      'Understand when local hardware, context windows, or tool interfaces change model selection.',
    ],
  },
  {
    slug: 'ai-search-geo',
    title: 'AI Search and GEO',
    description:
      'A focused path on AI search, generative engine optimization, search reliability, and content visibility in answer engines.',
    longDescription: `AI search is changing the web traffic map. This hub gathers ToLearn work on answer engines, AI search reliability, content pipelines, GEO strategy, and the practical ways publishers can keep their work discoverable when users get more answers directly from AI interfaces. It is meant for builders and operators who need to connect SEO fundamentals with the realities of Google AI Overviews, Perplexity-style answers, and AI-mediated research flows.`,
    relatedTags: [
      'AI Search',
      'GEO',
      'SEO',
      'SEO Strategy',
      'Content Pipeline',
      'Search Engine Optimization',
      'Traditional Search',
      'Perplexity',
      'ChatGPT',
      'Claude',
      'Next.js',
      'pgvector',
    ],
    relatedCategories: ['AI Technology', 'SEO & Marketing', 'Web Development'],
    targetKeywords: [
      'AI search optimization',
      'generative engine optimization',
      'GEO strategy',
      'AI search vs Google',
      'AI content pipeline SEO',
    ],
    icon: '🔎',
    directoryHref: directoryHrefByHubSlug.get('ai-search-geo'),
    featuredArticleSlugs: [
      'ai-search-vs-traditional-search-reliability',
      '2025-08-15-ai-content-pipeline-seo',
      '2025-10-10-ai-search-rewriting-web-traffic-map',
    ],
    learningGoals: [
      'Understand how AI answers change publisher traffic and search behavior.',
      'Build content systems that support visibility in both search engines and answer engines.',
      'Use reliability, citations, and original analysis as durable search assets.',
    ],
  },
  {
    slug: 'enterprise-ai-governance',
    title: 'Enterprise AI Governance',
    description:
      'Control planes, adoption strategy, safety, policy, and operating models for AI systems inside organizations.',
    longDescription: `Enterprise AI is moving from demos into governance. This hub collects analysis on control planes, agent registries, safety failures, adoption pressure, regulation, sustainability, and organizational readiness. It is designed for engineering leaders, operators, and builders who need to understand how AI systems behave once they leave isolated experiments and enter real businesses, policy environments, and user trust boundaries.`,
    relatedTags: [
      'Enterprise AI',
      'Governance',
      'AI Adoption',
      'AI Strategy',
      'Microsoft',
      'Agent 365',
      'AI Agents',
      'AI Infrastructure',
      'AI safety',
      'AI regulation',
      'AI ethics',
      'Sustainability',
      'Business Intelligence',
      'Future of Work',
    ],
    relatedCategories: ['AI Technology', 'Technology', 'Productivity'],
    targetKeywords: [
      'enterprise AI governance',
      'AI agent control plane',
      'AI adoption strategy',
      'AI safety governance',
      'enterprise AI operating model',
    ],
    icon: '🏢',
    directoryHref: directoryHrefByHubSlug.get('enterprise-ai-governance'),
    featuredArticleSlugs: [
      '2026-03-15-microsoft-agent-365-control-plane',
      '2026-03-26-ai-war-wont-be-won-on-benchmarks-itll-be-won-in-distribution',
      '2026-03-18-ai-chatbot-era-ending-agent-systems',
      'when-ai-becomes-too-human',
    ],
    learningGoals: [
      'Recognize why enterprise AI needs identity, policy, observability, and governance layers.',
      'Separate adoption theater from durable operating models for AI systems.',
      'Track safety, regulation, and sustainability risks before they become scaling blockers.',
    ],
  },
]

/**
 * Get a topic hub by slug
 */
export function getTopicHub(slug: string): TopicHub | undefined {
  return topicHubs.find((hub) => hub.slug === slug)
}

/**
 * Get all topic hub slugs
 */
export function getTopicHubSlugs(): string[] {
  return topicHubs.map((hub) => hub.slug)
}

/**
 * Check if a post matches a topic hub by its tags
 */
export function postMatchesTopicHub(postTags: string[], hub: TopicHub): boolean {
  if (!postTags || postTags.length === 0) return false
  const normalizedPostTags = postTags.map((tag) => normalizeTagName(tag).toLowerCase())
  return hub.relatedTags.some((hubTag) =>
    normalizedPostTags.includes(normalizeTagName(hubTag).toLowerCase())
  )
}

export function getPrimaryHubSlugForPost(slug: string): string | null {
  return primaryHubBySlug[slug] || null
}

export function getPrimaryTopicHubForPost(post: {
  slug: string
  metadata?: {
    category?: string
    tags?: string[]
  }
}): TopicHub | null {
  const assignedHubSlug = getPrimaryHubSlugForPost(post.slug)
  if (assignedHubSlug) {
    return getTopicHub(assignedHubSlug) || null
  }

  if (post.metadata?.category !== 'AI Technology') {
    return null
  }

  return (
    topicHubs.find((hub) => postMatchesTopicHub(post.metadata?.tags || [], hub)) || null
  )
}

export function postBelongsToTopicHub(
  post: {
    slug: string
    metadata?: {
      tags?: string[]
    }
  },
  hub: TopicHub
): boolean {
  const assignedHubSlug = getPrimaryHubSlugForPost(post.slug)
  return assignedHubSlug === hub.slug || postMatchesTopicHub(post.metadata?.tags || [], hub)
}

export function getSiblingPostsForPost<
  TPost extends {
    slug: string
    metadata: {
      publishedAt: string
      tags?: string[]
    }
  },
>(currentSlug: string, allPosts: TPost[], limit = 3): TPost[] {
  const assignedHubSlug = getPrimaryHubSlugForPost(currentSlug)

  if (!assignedHubSlug) {
    return []
  }

  return allPosts
    .filter((post) => post.slug !== currentSlug && getPrimaryHubSlugForPost(post.slug) === assignedHubSlug)
    .sort(
      (left, right) =>
        new Date(right.metadata.publishedAt).getTime() -
        new Date(left.metadata.publishedAt).getTime()
    )
    .slice(0, limit)
}

export function getFeaturedSeriesContextForPost(slug: string) {
  for (const hub of topicHubs) {
    if (!hub.featuredArticleSlugs?.includes(slug)) {
      continue
    }

    const slugs = hub.featuredArticleSlugs
    const index = slugs.indexOf(slug)

    return {
      hub,
      index,
      total: slugs.length,
      previousSlug: index > 0 ? slugs[index - 1] : null,
      nextSlug: index < slugs.length - 1 ? slugs[index + 1] : null,
    }
  }

  return null
}
