import { getBlogPosts } from 'app/blog/utils'

export const baseUrl = 'https://tolearn.blog'

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

export default async function sitemap() {
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
  const blogs = getBlogPosts().map((post) => {
    const lastModified = new Date(formatDateForSitemap(post.metadata.publishedAt) + 'T00:00:00.000Z').toISOString()

    return {
      url: `${baseUrl}/blog/${encodeURIComponent(post.slug)}`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }
  })

  // 按优先级排序
  const allRoutes = [...staticRoutes, ...apiRoutes, ...blogs]
  return allRoutes.sort((a, b) => b.priority - a.priority)
}
