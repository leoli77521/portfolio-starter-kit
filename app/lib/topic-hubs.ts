import type { Category } from '@/app/types'
import aiTopicClusters from '@/data/ai-topic-clusters.json'
import { normalizeTagName } from 'app/lib/tag-utils'

export interface TopicHub {
  slug: string
  title: string
  seoTitle?: string
  seoDescription?: string
  description: string
  longDescription: string
  relatedTags: string[]
  relatedCategories: Category[]
  targetKeywords: string[]
  icon: string
  featuredArticleSlugs?: string[]
  learningGoals?: string[]
  readingOrderDescription?: string
  learningGoalsDescription?: string
  guideSections?: {
    title: string
    body: string[]
    bullets?: string[]
  }[]
  checklist?: {
    title: string
    description: string
    items: string[]
  }
  faq?: {
    question: string
    answer: string
  }[]
  conclusion?: {
    title: string
    body: string[]
  }
  coreTerms?: string[]
  referenceLinks?: {
    label: string
    href: string
    description: string
  }[]
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
    seoTitle: 'SEO Fundamentals Guide 2026: Learn Google SEO',
    seoDescription:
      'Learn SEO fundamentals for 2026: search intent, technical SEO, on-page optimization, internal links, schema, mobile performance, and measurement.',
    description:
      'Learn SEO fundamentals for 2026: search intent, technical SEO, on-page optimization, internal links, schema, mobile performance, and measurement.',
    longDescription: `SEO fundamentals are not tricks for gaming Google. They are the basic signals that help search engines discover your pages, understand what each page covers, and decide whether the result is useful enough to show to searchers. Start with crawlability, search intent, helpful content, clean page structure, internal links, mobile performance, and Search Console measurement before chasing advanced tactics.`,
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
      'Understand how Google crawls, indexes, renders, and ranks pages before optimizing individual keywords.',
      'Turn search intent and keyword research into titles, headings, summaries, internal links, and useful answers.',
      'Improve mobile SEO with readable layouts, fast loading, stable images, and Core Web Vitals basics.',
      'Use Google Search Console to find query-page pairs that already have impressions and refresh them systematically.',
    ],
    readingOrderDescription:
      'Start with the core Google SEO checklist, then move into AI-assisted optimization, JavaScript rendering, and repeatable content refresh workflows.',
    learningGoalsDescription:
      'Use these goals as a practical path from SEO basics to measurable ranking improvements, especially for mobile search results.',
    guideSections: [
      {
        title: 'What Are SEO Fundamentals?',
        body: [
          'SEO fundamentals are the core practices that help search engines discover, understand, and rank a page: crawlable URLs, helpful content, clear title tags, structured headings, internal links, schema markup, fast mobile performance, and measurement. They are the baseline signals every page needs before advanced search engine optimization work can compound.',
          'For a beginner, the goal is not to memorize every ranking factor. The goal is to build pages that answer a real query better than the current results and make that answer easy for Google and users to parse.',
        ],
      },
      {
        title: 'How Google Search Works: Crawl, Index, Rank',
        body: [
          'Google first needs to crawl a URL, render the page, and decide whether it belongs in the index. After that, ranking depends on how well the page satisfies search intent compared with other pages for the same query.',
          'That means technical SEO and content quality work together. A useful article can underperform if it is blocked, slow, duplicated, missing a canonical URL, or buried without internal links.',
        ],
        bullets: [
          'Crawlability: important pages should be reachable through links and included in an XML sitemap.',
          'Indexing: each page should have a clear canonical URL, unique content, and no accidental noindex rule.',
          'Ranking: the page should answer the query quickly, show topical depth, and earn trust through useful examples and sources.',
        ],
      },
      {
        title: 'Match Search Intent Before Writing',
        body: [
          'Search intent is the reason behind the query. For "seo fundamentals", most users want a beginner-friendly guide, a checklist, plain-language definitions, and a path for improving one website without buying a full SEO tool stack.',
          'Before updating a page, compare the top results and ask what format Google is rewarding: definition, step-by-step guide, checklist, comparison table, FAQ, or examples. Then make the page satisfy that format faster and more completely.',
        ],
      },
      {
        title: 'On-Page SEO That Still Moves Rankings',
        body: [
          'On-page SEO turns keyword research into a page Google can understand. Put the primary keyword in the title, H1, early introduction, and at least one H2, then support it with natural semantic terms like SEO basics, Google SEO, technical SEO, on-page SEO, internal linking, and Core Web Vitals.',
          'The page should answer first and explain second. A strong opening definition, a tight table of steps, and descriptive headings help both mobile users and search crawlers understand the page faster.',
        ],
        bullets: [
          'Write a 50-60 character title tag that includes the primary keyword and a clear benefit.',
          'Use a 150-160 character meta description that tells searchers what they will learn.',
          'Use H2 questions such as "What are SEO fundamentals?" and "How do I start SEO?" to target People Also Ask style intent.',
          'Add descriptive internal links to related guides instead of vague anchors like "read more".',
        ],
      },
      {
        title: 'Technical SEO and Mobile Performance',
        body: [
          'Mobile rankings depend on more than responsive design. The page should load quickly, keep text readable without zooming, avoid horizontal scrolling, reserve image dimensions to prevent layout shift, and keep tap targets comfortable.',
          'For technical SEO, check HTTPS, sitemap coverage, robots.txt rules, canonical tags, structured data, image compression, and Core Web Vitals. If the mobile page feels slow or cramped, users leave before the content has a chance to earn trust.',
        ],
      },
      {
        title: 'SEO in the AI Search Era',
        body: [
          'AI Overviews and AI assistants do not make SEO fundamentals obsolete. They raise the value of clear answers, original examples, trustworthy sources, structured data, and pages that cover related subtopics without becoming bloated.',
          'Write for retrieval as well as clicks: define the topic plainly, cite authoritative sources when claims need support, use FAQ sections for direct answers, and connect the page to related topic clusters such as AI search and GEO.',
        ],
      },
      {
        title: 'Measure, Refresh, Repeat',
        body: [
          'SEO is a feedback loop. Use Google Search Console to find queries where a page already has impressions but ranks outside the top 10, then improve the exact section that should answer that query.',
          'Track impressions, click-through rate, average position, mobile usability, and indexed status. Refresh the title, intro, headings, examples, internal links, and FAQ when the query data shows a mismatch between what people search and what the page answers.',
        ],
      },
    ],
    checklist: {
      title: 'SEO Fundamentals Checklist for 2026',
      description:
        'Use this checklist when publishing or refreshing any important page. It covers the baseline SEO signals that support search visibility before advanced tactics matter.',
      items: [
        'Confirm the page is crawlable, indexable, canonicalized, and included in the sitemap.',
        'Match one primary search intent instead of mixing beginner guide, product pitch, and news angles.',
        'Use the primary keyword in the title tag, H1, first paragraph, URL, and one H2 naturally.',
        'Write a meta description that promises a specific outcome and earns the click on mobile.',
        'Answer the main question in the first 100 words before adding background context.',
        'Structure the page with H2 and H3 headings that work as a scan-friendly outline.',
        'Add original examples, screenshots, tables, or checklists that competitors do not provide.',
        'Use internal links with descriptive anchor text to connect the page to its topic cluster.',
        'Add FAQ or HowTo schema when the page includes real questions or step-by-step guidance.',
        'Compress images, reserve width and height, and test for mobile layout stability.',
        'Cite official or high-authority sources for claims about Google Search behavior.',
        'Review Search Console impressions, CTR, and average position after every major refresh.',
      ],
    },
    faq: [
      {
        question: 'What are SEO fundamentals?',
        answer:
          'SEO fundamentals are the baseline practices that help search engines discover, understand, and rank a page: crawlability, indexing, search intent, helpful content, title tags, headings, internal links, structured data, mobile performance, and measurement.',
      },
      {
        question: 'How do I learn Google SEO fundamentals?',
        answer:
          'Start with how Google crawls and indexes pages, then optimize one page at a time. Learn keyword research, search intent, title tags, meta descriptions, headings, internal links, technical SEO, and Search Console measurement before moving to advanced tactics.',
      },
      {
        question: 'Are SEO fundamentals different in 2026?',
        answer:
          'The basics are still the same, but the bar is higher. Pages need fast mobile experiences, answer-first structure, original value, trustworthy sourcing, and content that can be understood by traditional search results and AI-assisted search features.',
      },
      {
        question: 'How long does SEO take?',
        answer:
          'Small indexing or title changes can be noticed quickly, but meaningful ranking gains usually take weeks or months. The fastest improvements often come from refreshing pages that already have impressions but rank outside the top 10.',
      },
      {
        question: 'What should I fix first for mobile SEO rankings?',
        answer:
          'Fix crawl and index issues first, then improve mobile readability, page speed, layout stability, title relevance, and the opening answer. If users cannot read or trust the page quickly on a phone, rankings and engagement both suffer.',
      },
    ],
    conclusion: {
      title: 'The Practical Way to Improve SEO Rankings',
      body: [
        'SEO works best when you treat it as a publishing system, not a one-time optimization task. Start with the fundamentals: make every important page discoverable, answer a clear search intent, write titles and headings that match the topic, connect related pages with internal links, and keep the mobile experience fast.',
        'From there, improve one page at a time. Check Search Console for queries where you already get impressions, refresh the page with clearer answers and better structure, then monitor CTR, position, and engagement over the next few weeks. Small, consistent improvements compound.',
        'If you only do one thing after reading this guide, audit your most important page against the checklist above. Fix what blocks crawling, clarify what the page is about, add the missing answer users came for, and make the next useful step obvious.',
      ],
    },
    coreTerms: [
      'SEO basics',
      'search engine optimization',
      'Google SEO',
      'search intent',
      'keyword research',
      'on-page SEO',
      'technical SEO',
      'crawlability and indexing',
      'internal linking',
      'Core Web Vitals',
    ],
    referenceLinks: [
      {
        label: 'Google SEO Starter Guide',
        href: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide',
        description: 'Official baseline guidance on helping Google understand and surface your content.',
      },
      {
        label: 'Helpful Content Guidance',
        href: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content',
        description: 'Google guidance for creating people-first content that satisfies real searchers.',
      },
      {
        label: 'AI Features and Your Website',
        href: 'https://developers.google.com/search/docs/appearance/ai-features',
        description: 'Google guidance on how existing SEO practices apply to AI search experiences.',
      },
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
