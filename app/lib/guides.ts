import type { Category } from '@/app/types'

export interface GuideStep {
  title: string
  description: string
  relatedPostSlug?: string
}

export interface Guide {
  slug: string
  title: string
  description: string
  longDescription: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  estimatedTime: string // e.g., "2 hours", "1 week"
  prerequisites?: string[]
  relatedTags: string[]
  relatedCategories: Category[]
  targetKeywords: string[]
  steps: GuideStep[]
  icon: string
}

/**
 * Comprehensive guides / learning paths
 * Each guide provides structured learning with multiple steps
 */
export const guides: Guide[] = [
  {
    slug: 'getting-started-with-ai-development',
    title: 'Getting Started with AI Development',
    description: 'A beginner-friendly guide to building your first AI-powered application.',
    longDescription: `This comprehensive guide walks you through the fundamentals of AI development, from understanding basic concepts to deploying your first AI-powered application. You'll learn how to work with AI APIs, integrate language models into your projects, and build practical applications that leverage artificial intelligence. Perfect for developers who are new to AI but have programming experience.`,
    difficulty: 'Beginner',
    estimatedTime: '4-6 hours',
    prerequisites: ['Basic JavaScript/TypeScript knowledge', 'Familiarity with REST APIs', 'Node.js installed'],
    relatedTags: ['AI Tools', 'GPT', 'ChatGPT', 'API Development'],
    relatedCategories: ['AI Technology', 'Technology'],
    targetKeywords: ['AI开发入门', 'learn AI development', 'build AI app', 'AI for beginners', 'start with AI'],
    steps: [
      {
        title: 'Understanding AI Fundamentals',
        description: 'Learn the basic concepts of artificial intelligence and how language models work.',
      },
      {
        title: 'Setting Up Your Development Environment',
        description: 'Configure your local environment with the necessary tools and API keys.',
      },
      {
        title: 'Making Your First API Call',
        description: 'Learn how to interact with AI APIs like OpenAI and Anthropic.',
      },
      {
        title: 'Building a Simple Chat Interface',
        description: 'Create a basic chat application that connects to an AI model.',
      },
      {
        title: 'Adding Context and Memory',
        description: 'Implement conversation history and context management.',
      },
      {
        title: 'Deploying Your AI Application',
        description: 'Learn best practices for deploying AI applications to production.',
      },
    ],
    icon: '🚀',
  },
  {
    slug: 'seo-optimization-complete-guide',
    title: 'Complete SEO Optimization Guide',
    description: 'Master search engine optimization from technical fundamentals to advanced strategies.',
    longDescription: `This comprehensive SEO guide covers everything you need to know to rank higher in search results and drive organic traffic to your website. From technical SEO foundations like site structure and performance optimization, to content strategy and link building, you'll learn actionable techniques that deliver results. This guide is perfect for developers building content-driven websites and marketers looking to improve their SEO skills.`,
    difficulty: 'Intermediate',
    estimatedTime: '8-10 hours',
    prerequisites: ['Basic HTML/CSS knowledge', 'Access to Google Search Console', 'A website to optimize'],
    relatedTags: ['SEO Optimization', 'Technical SEO', 'Keyword Research', 'Content Marketing'],
    relatedCategories: ['SEO & Marketing', 'Web Development'],
    targetKeywords: ['SEO优化指南', 'complete SEO guide', 'SEO tutorial', 'improve website ranking', 'SEO for developers'],
    steps: [
      {
        title: 'SEO Fundamentals',
        description: 'Understand how search engines work and the key ranking factors.',
      },
      {
        title: 'Technical SEO Audit',
        description: 'Learn to identify and fix technical issues affecting your site.',
      },
      {
        title: 'Keyword Research Mastery',
        description: 'Discover high-value keywords and search intent analysis.',
      },
      {
        title: 'On-Page Optimization',
        description: 'Optimize your content, meta tags, and page structure.',
      },
      {
        title: 'Content Strategy',
        description: 'Create content that ranks and converts visitors.',
      },
      {
        title: 'Link Building Strategies',
        description: 'Build quality backlinks through ethical methods.',
      },
      {
        title: 'Measuring SEO Success',
        description: 'Set up analytics and track your SEO progress.',
      },
    ],
    icon: '📊',
  },
  {
    slug: 'building-ai-agents-with-langchain',
    title: 'Building AI Agents with LangChain',
    description: 'Learn to create autonomous AI agents that can perform complex tasks.',
    longDescription: `Dive deep into the world of AI agents with this advanced guide to LangChain. You'll learn how to build autonomous agents that can reason, plan, and execute multi-step tasks using external tools. From simple chain-of-thought patterns to complex agent architectures with memory and tool use, this guide provides hands-on experience building production-ready AI agent systems.`,
    difficulty: 'Advanced',
    estimatedTime: '12-15 hours',
    prerequisites: ['Python programming experience', 'Understanding of LLM APIs', 'Basic knowledge of prompt engineering'],
    relatedTags: ['AI Agents', 'LangChain', 'GPT', 'Python', 'Automation'],
    relatedCategories: ['AI Technology', 'Technology'],
    targetKeywords: ['AI Agent开发', 'LangChain tutorial', 'build AI agents', 'autonomous AI', 'agent development'],
    steps: [
      {
        title: 'Introduction to AI Agents',
        description: 'Understand agent architectures and when to use them.',
      },
      {
        title: 'LangChain Fundamentals',
        description: 'Set up LangChain and learn core concepts like chains and prompts.',
      },
      {
        title: 'Building Custom Tools',
        description: 'Create tools that agents can use to interact with external systems.',
      },
      {
        title: 'Implementing Agent Memory',
        description: 'Add short-term and long-term memory to your agents.',
      },
      {
        title: 'Multi-Agent Systems',
        description: 'Build systems where multiple agents collaborate on tasks.',
      },
      {
        title: 'Production Deployment',
        description: 'Deploy agents with proper error handling and monitoring.',
      },
    ],
    icon: '🤖',
  },
  {
    slug: 'nextjs-performance-optimization',
    title: 'Next.js Performance Optimization',
    description: 'Optimize your Next.js application for speed, SEO, and user experience.',
    longDescription: `Learn advanced techniques to make your Next.js application lightning fast. This guide covers everything from Core Web Vitals optimization to efficient data fetching strategies, image optimization, and caching best practices. You'll understand how to measure performance, identify bottlenecks, and implement solutions that significantly improve load times and user experience.`,
    difficulty: 'Intermediate',
    estimatedTime: '6-8 hours',
    prerequisites: ['Next.js development experience', 'Understanding of React', 'Basic knowledge of web performance metrics'],
    relatedTags: ['Next.js', 'Performance', 'Web Development', 'React', 'Technical SEO'],
    relatedCategories: ['Web Development', 'Technology'],
    targetKeywords: ['Next.js性能优化', 'Next.js performance', 'optimize Next.js', 'web vitals Next.js', 'fast Next.js'],
    steps: [
      {
        title: 'Understanding Web Performance Metrics',
        description: 'Learn about Core Web Vitals and how to measure them.',
      },
      {
        title: 'Image Optimization',
        description: 'Implement efficient image loading strategies.',
      },
      {
        title: 'Data Fetching Optimization',
        description: 'Choose the right data fetching strategy for each page.',
      },
      {
        title: 'Bundle Size Optimization',
        description: 'Reduce JavaScript bundle size and improve load times.',
      },
      {
        title: 'Caching Strategies',
        description: 'Implement effective caching at multiple levels.',
      },
      {
        title: 'Monitoring and Continuous Improvement',
        description: 'Set up monitoring to track performance over time.',
      },
    ],
    icon: '⚡',
  },
]

/**
 * Get a guide by slug
 */
export function getGuide(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug)
}

/**
 * Get all guide slugs
 */
export function getGuideSlugs(): string[] {
  return guides.map((guide) => guide.slug)
}

/**
 * Get guides by difficulty level
 */
export function getGuidesByDifficulty(difficulty: Guide['difficulty']): Guide[] {
  return guides.filter((guide) => guide.difficulty === difficulty)
}

/**
 * Get guides by category
 */
export function getGuidesByCategory(category: Category): Guide[] {
  return guides.filter((guide) => guide.relatedCategories.includes(category))
}
