import { getBlogPosts } from 'app/blog/utils'

export const baseUrl = 'https://tolearn.blog'

export default async function sitemap() {
  const staticRoutes = ['', '/blog'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  const blogs = getBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }))

  return [...staticRoutes, ...blogs]
}
