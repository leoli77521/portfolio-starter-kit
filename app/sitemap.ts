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
  const staticRoutes = ['', '/blog'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  const blogs = getBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: formatDateForSitemap(post.metadata.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...blogs]
}
