import { MetadataRoute } from 'next'
import { getBlogPosts } from 'app/blog/utils'

export const baseUrl = 'https://tolearn.blog'

export default function sitemap(): MetadataRoute.Sitemap {
  let blogs = getBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }))

  let routes = ['', '/blog'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogs]
}
