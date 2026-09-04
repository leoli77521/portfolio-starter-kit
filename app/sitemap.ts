import pseoData from '@/data/pseo_data.json'
import { aiDirectories } from 'app/lib/ai-directories'
import { getBlogPosts } from 'app/blog/utils'
import { categories, getCategorySlug } from 'app/lib/categories'
import { baseUrl } from 'app/lib/constants'
import { guides } from 'app/lib/guides'
import { defaultLocale, locales, localizePath } from 'app/lib/i18n-paths'
import { getArticlePath } from 'app/lib/blog-i18n'
import { getMostRecentIsoString } from 'app/lib/seo'
import { MIN_POSTS_FOR_INDEXED_TAG_PAGE, toTagSlug } from 'app/lib/tags'
import { postBelongsToTopicHub, topicHubs } from 'app/lib/topic-hubs'
import { shouldIndexTemplate } from 'app/lib/seo-indexing-policy'

export { baseUrl } from 'app/lib/constants'

const DEFAULT_LAST_MODIFIED = '2026-01-01T00:00:00.000Z'
const SITE_CONTENT_LAST_MODIFIED = '2026-08-20T00:00:00.000Z'
const TOPIC_CONTENT_LAST_MODIFIED = '2026-09-04T00:00:00.000Z'
const GUIDE_CONTENT_LAST_MODIFIED = '2026-09-04T00:00:00.000Z'
const MIN_POSTS_FOR_YEAR_PAGE = 3
// GSC shows that most URLs waiting for indexing are automatically generated
// locale variants. Until a translated page is reviewed and earns demand in
// its target market, keep the XML sitemap focused on the English editorial
// canonicals. Localized pages remain available to readers and can be added
// back deliberately after a quality review.
const INDEXABLE_SITEMAP_LOCALES = [defaultLocale]
const INCLUDE_TRANSLATED_ARTICLES_IN_SITEMAP = false
const REDIRECTED_TOPIC_HUB_SLUGS = new Set(['ai-model-comparisons'])
const LOCALIZED_SITEMAP_PATHS = new Set([
  '/',
  '/blog',
  '/categories',
  '/tags',
  '/topics',
  '/guides',
  '/templates',
  '/solutions',
  '/about',
  '/contact',
  '/privacy',
  '/terms',
])

type BlogPost = ReturnType<typeof getBlogPosts>[number]

function formatDateForSitemap(dateString: string): string {
  const normalizedDate = dateString.includes('T') ? dateString : `${dateString}T00:00:00.000Z`
  const date = new Date(normalizedDate)

  if (Number.isNaN(date.getTime())) {
    return DEFAULT_LAST_MODIFIED
  }

  return date.toISOString()
}

function getLatestTimestamp(...values: Array<string | undefined>): string {
  return getMostRecentIsoString(values, DEFAULT_LAST_MODIFIED)
}

function getPostLastModified(post: BlogPost): string {
  return formatDateForSitemap(post.metadata.updatedAt || post.metadata.publishedAt)
}

function pathFromAbsoluteUrl(url: string): string {
  const path = url.replace(baseUrl, '')
  return path || '/'
}

function localizeSitemapRoutes<T extends { url: string }>(routes: T[]): T[] {
  return routes.flatMap((route) => {
    const path = pathFromAbsoluteUrl(route.url)

    if (!LOCALIZED_SITEMAP_PATHS.has(path)) {
      return [route]
    }

    return INDEXABLE_SITEMAP_LOCALES.map((locale) => {
      const localizedPath = localizePath(path, locale)
      return {
        ...route,
        url: `${baseUrl}${localizedPath === '/' ? '' : localizedPath}`,
      }
    })
  })
}

export default async function sitemap() {
  const posts = getBlogPosts()
  const latestPostLastModified = getLatestTimestamp(...posts.map(getPostLastModified))
  const categorySourceLastModified = SITE_CONTENT_LAST_MODIFIED
  const tagSourceLastModified = SITE_CONTENT_LAST_MODIFIED
  const topicSourceLastModified = TOPIC_CONTENT_LAST_MODIFIED
  const guideSourceLastModified = GUIDE_CONTENT_LAST_MODIFIED
  const aiDirectorySourceLastModified = SITE_CONTENT_LAST_MODIFIED
  const pseoSourceLastModified = SITE_CONTENT_LAST_MODIFIED

  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: getLatestTimestamp(SITE_CONTENT_LAST_MODIFIED, latestPostLastModified),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: getLatestTimestamp(
        SITE_CONTENT_LAST_MODIFIED,
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
    ...aiDirectories.map((directory) => ({
      url: `${baseUrl}${directory.canonicalPath}`,
      lastModified: aiDirectorySourceLastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.78,
    })),
    {
      url: `${baseUrl}/about`,
      lastModified: SITE_CONTENT_LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: SITE_CONTENT_LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: SITE_CONTENT_LAST_MODIFIED,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: SITE_CONTENT_LAST_MODIFIED,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  const blogs = posts.map((post) => ({
    url: `${baseUrl}/blog/${encodeURIComponent(post.slug)}`,
    lastModified: getPostLastModified(post),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const localizedBlogs = INCLUDE_TRANSLATED_ARTICLES_IN_SITEMAP
    ? locales
        .filter((locale) => locale !== defaultLocale)
        .flatMap((locale) =>
          getBlogPosts(locale)
            .filter((post) => post.isTranslated)
            .map((post) => ({
              url: `${baseUrl}${getArticlePath(post.slug, locale)}`,
              lastModified: getLatestTimestamp(getPostLastModified(post), post.metadata.translatedAt),
              changeFrequency: 'weekly' as const,
              priority: 0.65,
            }))
        )
    : []

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
            categorySourceLastModified,
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
    const matchingPosts = posts.filter((post) => postBelongsToTopicHub(post, topic))

    if (matchingPosts.length === 0 || REDIRECTED_TOPIC_HUB_SLUGS.has(topic.slug)) {
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
    lastModified: guide.updatedAt
      ? formatDateForSitemap(guide.updatedAt)
      : guideSourceLastModified,
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
    pseoData.roles
      .filter((role) => shouldIndexTemplate(tech.slug, role.slug))
      .map((role) => ({
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

  const localizedStaticRoutes = localizeSitemapRoutes(staticRoutes)

  return [
    ...localizedStaticRoutes,
    ...blogs,
    ...localizedBlogs,
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
