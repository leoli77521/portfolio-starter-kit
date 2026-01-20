import type { Category } from '@/app/types'

export interface CategoryDescription {
  name: Category
  shortDescription: string
  longDescription: string
  keywords: string[]
  relatedCategories: Category[]
  featuredTopics: string[]
}

export const categoryDescriptions: Record<Exclude<Category, 'All'>, CategoryDescription> = {
  'AI Technology': {
    name: 'AI Technology',
    shortDescription:
      'Explore the latest developments in artificial intelligence, machine learning, and AI-powered tools.',
    longDescription: `Dive deep into the world of Artificial Intelligence with our comprehensive collection of articles. From practical AI development tutorials using frameworks like LangChain and GPT APIs, to exploring cutting-edge AI agents and automation tools, this category covers everything you need to stay ahead in the AI revolution. Whether you're a developer looking to integrate AI into your applications, or a tech enthusiast wanting to understand the latest breakthroughs, you'll find valuable insights and hands-on guides here. Our articles cover topics including large language models (LLMs), prompt engineering, AI workflow automation, and the practical applications of AI in software development.`,
    keywords: [
      'artificial intelligence',
      'machine learning',
      'AI development',
      'LangChain',
      'GPT',
      'AI agents',
      'LLM',
      'prompt engineering',
      'AI tools',
      'ChatGPT',
      'Claude',
      'AI automation',
    ],
    relatedCategories: ['Technology', 'Web Development', 'Productivity'],
    featuredTopics: ['AI Agents', 'LangChain Development', 'GPT Integration', 'AI Tools for Developers'],
  },
  'Web Development': {
    name: 'Web Development',
    shortDescription:
      'Master modern web development with tutorials on React, Next.js, TypeScript, and more.',
    longDescription: `Level up your web development skills with our in-depth technical articles covering the modern web stack. From building performant React applications with Next.js to implementing robust TypeScript solutions, this category provides practical knowledge for frontend and full-stack developers. Learn about component architecture, state management, API design, and deployment strategies. Our tutorials cover real-world scenarios and best practices, helping you build faster, more maintainable web applications. Whether you're working with server-side rendering, static site generation, or building complex interactive UIs, you'll find the guidance you need to succeed.`,
    keywords: [
      'web development',
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'frontend development',
      'full-stack',
      'API development',
      'CSS',
      'HTML',
      'Node.js',
      'server-side rendering',
    ],
    relatedCategories: ['Technology', 'AI Technology', 'SEO & Marketing'],
    featuredTopics: ['Next.js Development', 'React Patterns', 'TypeScript Best Practices', 'API Design'],
  },
  'SEO & Marketing': {
    name: 'SEO & Marketing',
    shortDescription:
      'Boost your online visibility with proven SEO strategies and digital marketing techniques.',
    longDescription: `Master the art and science of Search Engine Optimization with our comprehensive SEO and marketing guides. From technical SEO fundamentals like site structure and schema markup, to content optimization strategies and keyword research, this category helps you drive organic traffic to your website. Learn how to improve your search rankings, create SEO-friendly content, and leverage analytics to measure your success. Our articles cover both foundational concepts for beginners and advanced techniques for experienced marketers, including programmatic SEO, link building strategies, and the latest algorithm updates from Google and other search engines.`,
    keywords: [
      'SEO',
      'search engine optimization',
      'keyword research',
      'content marketing',
      'digital marketing',
      'Google ranking',
      'technical SEO',
      'schema markup',
      'link building',
      'analytics',
      'organic traffic',
    ],
    relatedCategories: ['Web Development', 'Productivity', 'Technology'],
    featuredTopics: ['Technical SEO', 'Content Strategy', 'Keyword Research', 'Analytics'],
  },
  Technology: {
    name: 'Technology',
    shortDescription:
      'Stay updated with the latest tech trends, tools, and innovations shaping our digital world.',
    longDescription: `Explore the broader technology landscape with articles covering emerging trends, development tools, and innovative solutions. This category serves as your guide to understanding new technologies and how they impact software development and digital transformation. From cloud computing and DevOps practices to new programming languages and frameworks, we cover the technologies that matter to developers and tech professionals. Stay informed about industry developments, learn about new tools that can improve your workflow, and discover the technologies shaping the future of software development.`,
    keywords: [
      'technology',
      'tech trends',
      'software development',
      'cloud computing',
      'DevOps',
      'programming',
      'developer tools',
      'innovation',
      'digital transformation',
      'tech news',
    ],
    relatedCategories: ['AI Technology', 'Web Development', 'Productivity'],
    featuredTopics: ['Developer Tools', 'Cloud Technologies', 'Tech Industry Trends', 'Software Architecture'],
  },
  Productivity: {
    name: 'Productivity',
    shortDescription:
      'Optimize your workflow and boost efficiency with practical productivity tips and tools.',
    longDescription: `Maximize your efficiency and get more done with our productivity-focused articles. Discover powerful tools, workflows, and techniques that help developers and knowledge workers work smarter, not harder. From automation scripts and time management strategies to AI-powered productivity tools and workflow optimization, this category helps you reclaim your time and focus on what matters most. Learn how to set up efficient development environments, automate repetitive tasks, and leverage modern tools to streamline your daily work. Whether you're looking to improve your personal productivity or optimize team workflows, you'll find actionable advice here.`,
    keywords: [
      'productivity',
      'workflow optimization',
      'automation',
      'time management',
      'developer productivity',
      'tools',
      'efficiency',
      'task management',
      'work smarter',
      'AI productivity',
    ],
    relatedCategories: ['AI Technology', 'Technology', 'Web Development'],
    featuredTopics: ['Workflow Automation', 'Developer Tools', 'AI Assistants', 'Time Management'],
  },
}

/**
 * Get category description by name
 */
export function getCategoryDescription(category: Category): CategoryDescription | undefined {
  if (category === 'All') return undefined
  return categoryDescriptions[category]
}

/**
 * Get all category descriptions as array
 */
export function getAllCategoryDescriptions(): CategoryDescription[] {
  return Object.values(categoryDescriptions)
}
