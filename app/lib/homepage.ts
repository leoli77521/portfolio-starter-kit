import type { BlogPost, Category } from '@/app/types'
import { getCategorySlug } from 'app/lib/categories'
import { getTopicHub, postBelongsToTopicHub } from 'app/lib/topic-hubs'

type StartHereItemType = 'Analysis' | 'Guide'

export interface HomepageStartHereItem {
  lane: string
  title: string
  description: string
  href: string
  cta: string
  type: StartHereItemType
}

export interface HomepageTrack {
  title: string
  description: string
  href: string
  cta: string
  categories: Category[]
  hubSlugs: string[]
  postCount: number
  hubCount: number
}

export interface HomepageGuidedPath {
  slug: string
  title: string
  description: string
  href: string
  cta: string
  postCount: number
  relatedTags: string[]
  audience: string
}

export interface HomepageFeaturedSeries {
  title: string
  description: string
  postCount: number
  primaryHref: string
  secondaryHref: string
  posts: Array<{
    slug: string
    title: string
  }>
}

export const homepageStartHere: HomepageStartHereItem[] = [
  {
    lane: 'AI systems',
    title: 'What Claw Code Reveals About AI Coding Agent Architecture',
    description:
      'A practical breakdown of how modern coding agents are structured beyond the model layer.',
    href: '/blog/2026-04-02-claw-code-ai-coding-agent-architecture',
    cta: 'Read the analysis',
    type: 'Analysis',
  },
  {
    lane: 'Search visibility',
    title: 'Complete SEO Optimization Guide',
    description:
      'A grounded path into search visibility, technical SEO, and content strategy for teams that actually ship.',
    href: '/guides/seo-optimization-complete-guide',
    cta: 'Start the guide',
    type: 'Guide',
  },
  {
    lane: 'Modern web work',
    title: 'Next.js Performance Optimization',
    description:
      'Execution notes on performance, rendering, and production-ready web systems for teams shipping on the modern stack.',
    href: '/guides/nextjs-performance-optimization',
    cta: 'Explore the guide',
    type: 'Guide',
  },
]

const homepageTrackConfigs = [
  {
    title: 'AI systems',
    description:
      'Agents, coding workflows, benchmarks, tool runtimes, and product shifts that matter in practice.',
    category: 'AI Technology' as const,
    hubSlugs: ['ai-development-guide', 'ai-tools-for-developers', 'ai-coding-agent-stack'],
    cta: 'Explore AI systems',
  },
  {
    title: 'Search visibility',
    description:
      'Technical SEO, indexing behavior, content structure, and discoverability decisions that compound over time.',
    category: 'SEO & Marketing' as const,
    hubSlugs: ['seo-fundamentals'],
    cta: 'Explore search visibility',
  },
  {
    title: 'Modern web work',
    description:
      'Frontend execution, performance patterns, web tooling, and the practical realities of shipping on the modern stack.',
    category: 'Web Development' as const,
    hubSlugs: ['nextjs-mastery'],
    cta: 'Explore modern web work',
  },
]

const guidedPathConfigs = [
  {
    slug: 'ai-development-guide',
    cta: 'Open the hub',
    audience: 'Best for builders moving from AI APIs to real product workflows.',
  },
  {
    slug: 'seo-fundamentals',
    cta: 'Read the path',
    audience: 'Best for teams that want clearer indexing, structure, and discoverability.',
  },
  {
    slug: 'ai-coding-agent-stack',
    cta: 'Follow the series',
    audience: 'Best for developers studying runtime architecture, tools, and agent design.',
  },
]

function getPostCountForHub(allPosts: BlogPost[], slug: string) {
  const hub = getTopicHub(slug)
  if (!hub) {
    return 0
  }

  return allPosts.filter((post) => postBelongsToTopicHub(post, hub)).length
}

export function getHomepageTrackData(allPosts: BlogPost[]): HomepageTrack[] {
  return homepageTrackConfigs.map((track) => ({
    title: track.title,
    description: track.description,
    href: `/categories/${getCategorySlug(track.category)}`,
    cta: track.cta,
    categories: [track.category],
    hubSlugs: track.hubSlugs,
    postCount: allPosts.filter((post) => post.metadata.category === track.category).length,
    hubCount: track.hubSlugs.length,
  }))
}

export function getHomepageGuidedPaths(allPosts: BlogPost[]): HomepageGuidedPath[] {
  return guidedPathConfigs
    .map((config) => {
      const hub = getTopicHub(config.slug)

      if (!hub) {
        return null
      }

      return {
        slug: hub.slug,
        title: hub.title,
        description: hub.description,
        href: `/topics/${hub.slug}`,
        cta: config.cta,
        postCount: getPostCountForHub(allPosts, hub.slug),
        relatedTags: hub.relatedTags.slice(0, 3),
        audience: config.audience,
      }
    })
    .filter((path): path is HomepageGuidedPath => Boolean(path))
}

export function getHomepageFeaturedSeries(allPosts: BlogPost[]): HomepageFeaturedSeries | null {
  const hub = getTopicHub('ai-coding-agent-stack')

  if (!hub?.featuredArticleSlugs?.length) {
    return null
  }

  const orderedPosts = hub.featuredArticleSlugs
    .map((slug) => allPosts.find((post) => post.slug === slug))
    .filter((post): post is BlogPost => Boolean(post))

  if (orderedPosts.length === 0) {
    return null
  }

  return {
    title: hub.seriesTitle || hub.title,
    description: hub.seriesDescription || hub.description,
    postCount: orderedPosts.length,
    primaryHref: `/blog/${orderedPosts[0].slug}`,
    secondaryHref: `/topics/${hub.slug}`,
    posts: orderedPosts.map((post) => ({
      slug: post.slug,
      title: post.metadata.title,
    })),
  }
}
