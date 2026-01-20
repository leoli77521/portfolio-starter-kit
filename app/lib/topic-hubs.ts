import type { Category } from '@/app/types'

export interface TopicHub {
  slug: string
  title: string
  description: string
  longDescription: string
  relatedTags: string[]
  relatedCategories: Category[]
  targetKeywords: string[]
  icon: string
}

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
    relatedTags: ['AI Agents', 'LangChain', 'GPT', 'ChatGPT', 'Claude', 'Machine Learning', 'Prompt Engineering', 'AI Tools'],
    relatedCategories: ['AI Technology', 'Technology'],
    targetKeywords: ['AI开发教程', 'AI development tutorial', 'build AI applications', 'LangChain guide', 'AI agent development'],
    icon: '🤖',
  },
  {
    slug: 'seo-fundamentals',
    title: 'SEO Fundamentals',
    description: 'Essential SEO knowledge from basics to advanced techniques for better search rankings.',
    longDescription: `Take your website from invisible to irresistible with our comprehensive SEO fundamentals hub. This collection covers the complete spectrum of search engine optimization, from understanding how search engines work to implementing advanced technical SEO strategies. Learn the art of keyword research, master on-page optimization techniques, build quality backlinks, and understand how to measure your SEO success with analytics. Our practical, up-to-date guides help you navigate the ever-changing landscape of search algorithms and stay ahead of the competition.`,
    relatedTags: ['SEO Optimization', 'Keyword Research', 'Technical SEO', 'Content Marketing', 'Analytics'],
    relatedCategories: ['SEO & Marketing', 'Web Development'],
    targetKeywords: ['SEO入门指南', 'SEO basics', 'search engine optimization guide', 'improve search ranking', 'SEO tutorial'],
    icon: '📈',
  },
  {
    slug: 'ai-tools-for-developers',
    title: 'AI Tools for Developers',
    description: 'Discover and master AI-powered tools that enhance developer productivity.',
    longDescription: `Supercharge your development workflow with our curated collection of AI-powered tools designed specifically for developers. From intelligent code completion with GitHub Copilot to automated code review with AI assistants, discover how artificial intelligence is transforming software development. This hub explores productivity boosters, code generation tools, AI-assisted debugging, and intelligent documentation generators. Learn which tools work best for different tasks, how to integrate them into your existing workflow, and tips for getting the most out of AI assistance in your daily coding.`,
    relatedTags: ['AI Tools', 'ChatGPT', 'Claude', 'Productivity', 'Developer Tools', 'Automation'],
    relatedCategories: ['AI Technology', 'Productivity', 'Technology'],
    targetKeywords: ['开发者AI工具', 'AI tools for coding', 'developer productivity AI', 'AI code assistant', 'programming with AI'],
    icon: '🛠️',
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
  const normalizedPostTags = postTags.map((t) => t.toLowerCase())
  return hub.relatedTags.some((hubTag) =>
    normalizedPostTags.includes(hubTag.toLowerCase())
  )
}
