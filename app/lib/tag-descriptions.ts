import type { Category } from '@/app/types'

export interface TagDescription {
  tag: string
  description: string
  relatedTags: string[]
  relatedCategory?: Category
}

/**
 * Descriptions for top tags to improve SEO
 * Add descriptions for your most important/popular tags
 */
export const tagDescriptions: Record<string, TagDescription> = {
  // AI Technology tags
  'AI Agents': {
    tag: 'AI Agents',
    description:
      'Explore autonomous AI agents that can perform complex tasks, make decisions, and interact with external tools and APIs. Learn how to build and deploy intelligent agent systems.',
    relatedTags: ['LangChain', 'GPT', 'AI Tools', 'Automation'],
    relatedCategory: 'AI Technology',
  },
  LangChain: {
    tag: 'LangChain',
    description:
      'Master LangChain, the popular framework for building applications powered by large language models. Tutorials cover chains, agents, memory, and integrations.',
    relatedTags: ['AI Agents', 'GPT', 'Python', 'AI Development'],
    relatedCategory: 'AI Technology',
  },
  GPT: {
    tag: 'GPT',
    description:
      'Learn to work with GPT models from OpenAI, including API integration, prompt engineering, and building GPT-powered applications.',
    relatedTags: ['ChatGPT', 'AI Agents', 'LangChain', 'Prompt Engineering'],
    relatedCategory: 'AI Technology',
  },
  ChatGPT: {
    tag: 'ChatGPT',
    description:
      'Discover tips, tricks, and techniques for getting the most out of ChatGPT. From effective prompting to advanced use cases for developers.',
    relatedTags: ['GPT', 'AI Tools', 'Prompt Engineering', 'Productivity'],
    relatedCategory: 'AI Technology',
  },
  Claude: {
    tag: 'Claude',
    description:
      'Articles about Anthropic\'s Claude AI assistant, including API usage, comparison with other models, and practical applications.',
    relatedTags: ['AI Tools', 'ChatGPT', 'LLM', 'AI Development'],
    relatedCategory: 'AI Technology',
  },
  'AI Tools': {
    tag: 'AI Tools',
    description:
      'Comprehensive reviews and tutorials on AI-powered tools for developers, creators, and businesses. Find the right AI tools to enhance your workflow.',
    relatedTags: ['ChatGPT', 'Claude', 'Productivity', 'Automation'],
    relatedCategory: 'AI Technology',
  },
  'Machine Learning': {
    tag: 'Machine Learning',
    description:
      'Fundamentals and advanced concepts in machine learning, including model training, neural networks, and practical ML applications.',
    relatedTags: ['AI Technology', 'Python', 'Data Science', 'Deep Learning'],
    relatedCategory: 'AI Technology',
  },
  'Prompt Engineering': {
    tag: 'Prompt Engineering',
    description:
      'Learn the art and science of crafting effective prompts for AI models. Techniques for better outputs from LLMs and generative AI.',
    relatedTags: ['GPT', 'ChatGPT', 'LLM', 'AI Development'],
    relatedCategory: 'AI Technology',
  },

  // Web Development tags
  'Next.js': {
    tag: 'Next.js',
    description:
      'Build modern web applications with Next.js, the React framework for production. Covers App Router, Server Components, and deployment strategies.',
    relatedTags: ['React', 'TypeScript', 'Vercel', 'Web Development'],
    relatedCategory: 'Web Development',
  },
  React: {
    tag: 'React',
    description:
      'Master React development with tutorials on hooks, components, state management, and best practices for building interactive UIs.',
    relatedTags: ['Next.js', 'TypeScript', 'JavaScript', 'Frontend'],
    relatedCategory: 'Web Development',
  },
  TypeScript: {
    tag: 'TypeScript',
    description:
      'Write safer, more maintainable code with TypeScript. Learn type systems, advanced patterns, and TypeScript best practices.',
    relatedTags: ['JavaScript', 'React', 'Next.js', 'Node.js'],
    relatedCategory: 'Web Development',
  },
  JavaScript: {
    tag: 'JavaScript',
    description:
      'Essential JavaScript tutorials covering modern ES6+ features, async programming, and advanced concepts for web development.',
    relatedTags: ['TypeScript', 'React', 'Node.js', 'Frontend'],
    relatedCategory: 'Web Development',
  },
  'Node.js': {
    tag: 'Node.js',
    description:
      'Server-side JavaScript with Node.js. Build APIs, CLI tools, and backend services with tutorials and best practices.',
    relatedTags: ['JavaScript', 'TypeScript', 'Express', 'API Development'],
    relatedCategory: 'Web Development',
  },
  CSS: {
    tag: 'CSS',
    description:
      'Modern CSS techniques including Flexbox, Grid, animations, and responsive design patterns for beautiful web interfaces.',
    relatedTags: ['Tailwind CSS', 'Frontend', 'Web Design', 'HTML'],
    relatedCategory: 'Web Development',
  },
  'Tailwind CSS': {
    tag: 'Tailwind CSS',
    description:
      'Utility-first CSS with Tailwind. Learn efficient styling patterns, customization, and building design systems.',
    relatedTags: ['CSS', 'React', 'Next.js', 'Frontend'],
    relatedCategory: 'Web Development',
  },
  'API Development': {
    tag: 'API Development',
    description:
      'Design and build robust APIs using REST, GraphQL, and modern backend technologies. Best practices for API architecture.',
    relatedTags: ['Node.js', 'Backend', 'REST', 'GraphQL'],
    relatedCategory: 'Web Development',
  },

  // SEO & Marketing tags
  'SEO Optimization': {
    tag: 'SEO Optimization',
    description:
      'Comprehensive SEO strategies to improve your search rankings. Technical SEO, on-page optimization, and algorithm updates.',
    relatedTags: ['Keyword Research', 'Technical SEO', 'Content Marketing', 'Google'],
    relatedCategory: 'SEO & Marketing',
  },
  'Keyword Research': {
    tag: 'Keyword Research',
    description:
      'Master keyword research to find opportunities and drive organic traffic. Tools, techniques, and strategies for effective keyword targeting.',
    relatedTags: ['SEO Optimization', 'Content Marketing', 'Google', 'Analytics'],
    relatedCategory: 'SEO & Marketing',
  },
  'Technical SEO': {
    tag: 'Technical SEO',
    description:
      'Optimize your website\'s technical foundation for search engines. Site speed, structured data, crawlability, and Core Web Vitals.',
    relatedTags: ['SEO Optimization', 'Web Performance', 'Schema', 'Core Web Vitals'],
    relatedCategory: 'SEO & Marketing',
  },
  'Content Marketing': {
    tag: 'Content Marketing',
    description:
      'Create content that ranks and converts. Strategies for content planning, creation, and distribution that drives results.',
    relatedTags: ['SEO Optimization', 'Keyword Research', 'Blogging', 'Marketing'],
    relatedCategory: 'SEO & Marketing',
  },
  Analytics: {
    tag: 'Analytics',
    description:
      'Measure and analyze your website performance. Google Analytics, Search Console, and data-driven decision making.',
    relatedTags: ['SEO Optimization', 'Google', 'Data', 'Metrics'],
    relatedCategory: 'SEO & Marketing',
  },

  // Productivity tags
  Productivity: {
    tag: 'Productivity',
    description:
      'Boost your efficiency with productivity tools, techniques, and workflows. Work smarter with proven strategies.',
    relatedTags: ['Automation', 'Tools', 'Time Management', 'Workflow'],
    relatedCategory: 'Productivity',
  },
  Automation: {
    tag: 'Automation',
    description:
      'Automate repetitive tasks and workflows. Tools and techniques for developers to save time and reduce errors.',
    relatedTags: ['Productivity', 'AI Tools', 'Scripts', 'Workflow'],
    relatedCategory: 'Productivity',
  },
  'Developer Tools': {
    tag: 'Developer Tools',
    description:
      'Essential tools for modern developers. IDEs, extensions, CLI tools, and utilities that improve your development experience.',
    relatedTags: ['Productivity', 'VS Code', 'Git', 'Terminal'],
    relatedCategory: 'Technology',
  },
  Git: {
    tag: 'Git',
    description:
      'Version control with Git. Commands, workflows, branching strategies, and collaboration best practices.',
    relatedTags: ['GitHub', 'Developer Tools', 'Version Control', 'Collaboration'],
    relatedCategory: 'Technology',
  },
  'VS Code': {
    tag: 'VS Code',
    description:
      'Get the most out of Visual Studio Code. Extensions, settings, shortcuts, and customizations for developers.',
    relatedTags: ['Developer Tools', 'Productivity', 'IDE', 'Extensions'],
    relatedCategory: 'Technology',
  },

  // General Technology tags
  Python: {
    tag: 'Python',
    description:
      'Python programming tutorials for web development, data science, automation, and AI applications.',
    relatedTags: ['Machine Learning', 'AI', 'Data Science', 'Automation'],
    relatedCategory: 'Technology',
  },
  Tutorial: {
    tag: 'Tutorial',
    description:
      'Step-by-step tutorials covering various technologies and development techniques. Learn by building real projects.',
    relatedTags: ['Guide', 'How-To', 'Learning', 'Development'],
    relatedCategory: 'Technology',
  },
  'Best Practices': {
    tag: 'Best Practices',
    description:
      'Industry best practices and proven patterns for software development. Write cleaner, more maintainable code.',
    relatedTags: ['Clean Code', 'Architecture', 'Patterns', 'Development'],
    relatedCategory: 'Technology',
  },
  Performance: {
    tag: 'Performance',
    description:
      'Optimize your applications for speed and efficiency. Web performance, code optimization, and monitoring.',
    relatedTags: ['Web Vitals', 'Optimization', 'Speed', 'Caching'],
    relatedCategory: 'Technology',
  },
}

/**
 * Get tag description by tag name
 */
export function getTagDescription(tag: string): TagDescription | undefined {
  // Try exact match first
  if (tagDescriptions[tag]) {
    return tagDescriptions[tag]
  }
  // Try case-insensitive match
  const lowerTag = tag.toLowerCase()
  const found = Object.entries(tagDescriptions).find(
    ([key]) => key.toLowerCase() === lowerTag
  )
  return found ? found[1] : undefined
}

/**
 * Get related tags for a given tag
 */
export function getRelatedTags(tag: string): string[] {
  const description = getTagDescription(tag)
  return description?.relatedTags || []
}

/**
 * Get all described tags
 */
export function getAllDescribedTags(): string[] {
  return Object.keys(tagDescriptions)
}
