import { getBlogPosts } from 'app/blog/utils'
import { categories, getCategorySlug } from 'app/lib/categories'
import { slugify } from 'app/lib/formatters'
import { topicHubs } from 'app/lib/topic-hubs'
import { guides } from 'app/lib/guides'

export { baseUrl } from 'app/lib/constants'
import { baseUrl } from 'app/lib/constants'

function formatDateForSitemap(dateString: string): string {
  // 如果日期没有包含时间，添加默认时间
  if (!dateString.includes('T')) {
    dateString = `${dateString}T00:00:00`
  }

  const date = new Date(dateString)

  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    // 如果日期无效，返回当前日期
    return new Date().toISOString().split('T')[0]
  }

  // 返回 YYYY-MM-DD 格式
  return date.toISOString().split('T')[0]
}

// Minimum posts required for category+year pages
const MIN_POSTS_FOR_YEAR_PAGE = 3

export default async function sitemap() {
  const posts = getBlogPosts()
  const toTagSlug = (tag: string) => {
    const slug = slugify(tag)
    return slug || tag.trim().toLowerCase().replace(/\s+/g, '-')
  }
  // 静态路由
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/topics`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    }
  ]

  // API路由（仅包含公开可访问的）
  const apiRoutes = [
    {
      url: `${baseUrl}/rss`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.3,
    }
  ]

  // 博客文章
  const blogs = posts.map((post) => {
    const sourceDate = post.metadata.updatedAt || post.metadata.publishedAt
    const lastModified = new Date(formatDateForSitemap(sourceDate) + 'T00:00:00.000Z').toISOString()

    return {
      url: `${baseUrl}/blog/${encodeURIComponent(post.slug)}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }
  })

  const tagSlugs = new Set<string>()
  const categoryNames = new Set<string>()

  // Track posts per category per year
  const categoryYearCounts: Record<string, Record<number, number>> = {}

  posts.forEach((post) => {
    if (post.metadata.category) {
      categoryNames.add(post.metadata.category)

      // Count posts per year for each category
      const year = new Date(post.metadata.publishedAt).getFullYear()
      if (!categoryYearCounts[post.metadata.category]) {
        categoryYearCounts[post.metadata.category] = {}
      }
      categoryYearCounts[post.metadata.category][year] =
        (categoryYearCounts[post.metadata.category][year] || 0) + 1
    }
    if (post.metadata.tags) {
      post.metadata.tags.forEach((tag) => {
        const slug = toTagSlug(tag)
        if (slug) {
          tagSlugs.add(slug)
        }
      })
    }
  })

  // Category routes (increased priority)
  const categoryRoutes = categories
    .filter((category) => category.name !== 'All' && categoryNames.has(category.name))
    .map((category) => {
      const slug = getCategorySlug(category.name)
      return {
        url: `${baseUrl}/categories/${encodeURIComponent(slug)}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }
    })

  // Category + Year routes
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
        // Only create year pages if there are enough posts
        if (count >= MIN_POSTS_FOR_YEAR_PAGE) {
          const slug = getCategorySlug(category.name)
          categoryYearRoutes.push({
            url: `${baseUrl}/categories/${encodeURIComponent(slug)}/${year}`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'weekly' as const,
            priority: 0.55,
          })
        }
      })
    })

  // Tag routes (slightly increased priority)
  const tagRoutes = Array.from(tagSlugs).map((slug) => ({
    url: `${baseUrl}/tags/${encodeURIComponent(slug)}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }))

  // Topic hub routes (high priority)
  const topicRoutes = topicHubs.map((topic) => ({
    url: `${baseUrl}/topics/${topic.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Guide routes (highest priority for educational content)
  const guideRoutes = guides.map((guide) => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  // 按优先级排序
  const allRoutes = [
    ...staticRoutes,
    ...apiRoutes,
    ...blogs,
    ...categoryRoutes,
    ...categoryYearRoutes,
    ...tagRoutes,
    ...topicRoutes,
    ...guideRoutes,
  ]
  return allRoutes.sort((a, b) => b.priority - a.priority)
}
