import fs from 'node:fs'
import path from 'node:path'
import pseoData from '@/data/pseo_data.json'
import { getBlogPosts } from 'app/blog/utils'
import { categories, getCategorySlug } from 'app/lib/categories'
import { baseUrl } from 'app/lib/constants'
import { guides } from 'app/lib/guides'
import { getMostRecentIsoString } from 'app/lib/seo'
import { MIN_POSTS_FOR_INDEXED_TAG_PAGE, toTagSlug } from 'app/lib/tags'
import { postMatchesTopicHub, topicHubs } from 'app/lib/topic-hubs'

export { baseUrl } from 'app/lib/constants'

const PROJECT_ROOT = process.cwd()
const DEFAULT_LAST_MODIFIED = '2026-01-01T00:00:00.000Z'
const MIN_POSTS_FOR_YEAR_PAGE = 3

type BlogPost = ReturnType<typeof getBlogPosts>[number]

function formatDateForSitemap(dateString: string): string {
  const normalizedDate = dateString.includes('T') ? dateString : `${dateString}T00:00:00.000Z`
  const date = new Date(normalizedDate)

  if (Number.isNaN(date.getTime())) {
    return DEFAULT_LAST_MODIFIED
  }

  return date.toISOString()
}

function getFileLastModified(relativePath: string, fallback = DEFAULT_LAST_MODIFIED): string {
  try {
    return fs.statSync(path.join(PROJECT_ROOT, relativePath)).mtime.toISOString()
  } catch {
    return fallback
  }
}

function getLatestTimestamp(...values: Array<string | undefined>): string {
  return getMostRecentIsoString(values, DEFAULT_LAST_MODIFIED)
}

function getPostLastModified(post: BlogPost): string {
  return formatDateForSitemap(post.metadata.updatedAt || post.metadata.publishedAt)
}

export default async function sitemap() {
  const posts = getBlogPosts()
  const latestPostLastModified = getLatestTimestamp(...posts.map(getPostLastModified))
  const categorySourceLastModified = getLatestTimestamp(
    getFileLastModified('app/categories/page.tsx'),
    getFileLastModified('app/categories/[slug]/page.tsx'),
    getFileLastModified('app/categories/[slug]/[year]/page.tsx'),
    getFileLastModified('app/lib/categories.ts'),
    getFileLastModified('app/lib/category-descriptions.ts')
  )
  const tagSourceLastModified = getLatestTimestamp(
    getFileLastModified('app/tags/page.tsx'),
    getFileLastModified('app/tags/[tag]/page.tsx'),
    getFileLastModified('app/lib/tag-descriptions.ts')
  )
  const topicSourceLastModified = getLatestTimestamp(
    getFileLastModified('app/topics/page.tsx'),
    getFileLastModified('app/topics/[slug]/page.tsx'),
    getFileLastModified('app/lib/topic-hubs.ts')
  )
  const guideSourceLastModified = getLatestTimestamp(
    getFileLastModified('app/guides/page.tsx'),
    getFileLastModified('app/guides/[slug]/page.tsx'),
    getFileLastModified('app/lib/guides.ts')
  )
  const pseoSourceLastModified = getLatestTimestamp(
    getFileLastModified('data/pseo_data.json'),
    getFileLastModified('app/templates/page.tsx'),
    getFileLastModified('app/templates/[tech]/[role]/page.tsx'),
    getFileLastModified('app/solutions/page.tsx'),
    getFileLastModified('app/solutions/[feature]/page.tsx')
  )

  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: getLatestTimestamp(getFileLastModified('app/page.tsx'), latestPostLastModified),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: getLatestTimestamp(
        getFileLastModified('app/blog/page.tsx'),
        latestPostLastModified
      ),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: getLatestTimestamp(categorySourceLastModified, latestPostLastModified),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: getLatestTimestamp(tagSourceLastModified, latestPostLastModified),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/topics`,
      lastModified: getLatestTimestamp(topicSourceLastModified, latestPostLastModified),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: guideSourceLastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: getFileLastModified('app/about/page.tsx'),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: getFileLastModified('app/contact/page.tsx'),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: getFileLastModified('app/privacy/page.tsx'),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: getFileLastModified('app/terms/page.tsx'),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  const apiRoutes = [
    {
      url: `${baseUrl}/rss`,
      lastModified: latestPostLastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.3,
    },
  ]

  const blogs = posts.map((post) => ({
    url: `${baseUrl}/blog/${encodeURIComponent(post.slug)}`,
    lastModified: getPostLastModified(post),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const tagCounts = new Map<string, number>()
  const categoryNames = new Set<string>()
  const categoryYearCounts: Record<string, Record<number, number>> = {}

  posts.forEach((post) => {
    if (post.metadata.category) {
      categoryNames.add(post.metadata.category)

      const year = new Date(post.metadata.publishedAt).getFullYear()
      if (!categoryYearCounts[post.metadata.category]) {
        categoryYearCounts[post.metadata.category] = {}
      }
      categoryYearCounts[post.metadata.category][year] =
        (categoryYearCounts[post.metadata.category][year] || 0) + 1
    }

    post.metadata.tags?.forEach((tag) => {
      const slug = toTagSlug(tag)
      if (slug) {
        tagCounts.set(slug, (tagCounts.get(slug) || 0) + 1)
      }
    })
  })

  const categoryRoutes = categories
    .filter((category) => category.name !== 'All' && categoryNames.has(category.name))
    .map((category) => {
      const slug = getCategorySlug(category.name)
      const categoryPosts = posts.filter((post) => post.metadata.category === category.name)

      return {
        url: `${baseUrl}/categories/${encodeURIComponent(slug)}`,
        lastModified: getLatestTimestamp(
          categorySourceLastModified,
          ...categoryPosts.map(getPostLastModified)
        ),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }
    })

  const categoryYearRoutes: Array<{
    url: string
    lastModified: string
    changeFrequency: 'weekly'
    priority: number
  }> = []

  categories
    .filter((category) => category.name !== 'All' && categoryNames.has(category.name))
    .forEach((category) => {
      const yearCounts = categoryYearCounts[category.name] || {}

      Object.entries(yearCounts).forEach(([year, count]) => {
        if (count < MIN_POSTS_FOR_YEAR_PAGE) {
          return
        }

        const slug = getCategorySlug(category.name)
        const matchingPosts = posts.filter((post) => {
          if (post.metadata.category !== category.name) return false
          return new Date(post.metadata.publishedAt).getFullYear() === Number(year)
        })

        categoryYearRoutes.push({
          url: `${baseUrl}/categories/${encodeURIComponent(slug)}/${year}`,
          lastModified: getLatestTimestamp(
            getFileLastModified('app/categories/[slug]/[year]/page.tsx'),
            ...matchingPosts.map(getPostLastModified)
          ),
          changeFrequency: 'weekly' as const,
          priority: 0.55,
        })
      })
    })

  const tagRoutes = Array.from(tagCounts.entries())
    .filter(([, count]) => count >= MIN_POSTS_FOR_INDEXED_TAG_PAGE)
    .map(([slug]) => {
    const matchingPosts = posts.filter((post) =>
      post.metadata.tags?.some((tag) => toTagSlug(tag) === slug)
    )

    return {
      url: `${baseUrl}/tags/${encodeURIComponent(slug)}`,
      lastModified: getLatestTimestamp(tagSourceLastModified, ...matchingPosts.map(getPostLastModified)),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }
    })

  const topicRoutes = topicHubs.reduce<
    Array<{
      url: string
      lastModified: string
      changeFrequency: 'weekly'
      priority: number
    }>
  >((routes, topic) => {
    const matchingPosts = posts.filter((post) => postMatchesTopicHub(post.metadata.tags || [], topic))

    if (matchingPosts.length === 0) {
      return routes
    }

    routes.push({
      url: `${baseUrl}/topics/${topic.slug}`,
      lastModified: getLatestTimestamp(
        topicSourceLastModified,
        ...matchingPosts.map(getPostLastModified)
      ),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })

    return routes
  }, [])

  const guideRoutes = guides.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: guideSourceLastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  const templateIndexRoute = {
    url: `${baseUrl}/templates`,
    lastModified: pseoSourceLastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }

  const solutionsIndexRoute = {
    url: `${baseUrl}/solutions`,
    lastModified: pseoSourceLastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }

  const templateRoutes = pseoData.technologies.flatMap((tech) =>
    pseoData.roles.map((role) => ({
      url: `${baseUrl}/templates/${tech.slug}/${role.slug}`,
      lastModified: pseoSourceLastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  )

  const solutionRoutes = pseoData.features.map((feature) => ({
    url: `${baseUrl}/solutions/${feature.slug}`,
    lastModified: pseoSourceLastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    ...staticRoutes,
    ...apiRoutes,
    ...blogs,
    ...categoryRoutes,
    ...categoryYearRoutes,
    ...tagRoutes,
    ...topicRoutes,
    ...guideRoutes,
    templateIndexRoute,
    solutionsIndexRoute,
    ...templateRoutes,
    ...solutionRoutes,
  ].sort((left, right) => right.priority - left.priority)
}
