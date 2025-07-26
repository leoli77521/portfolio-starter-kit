import { MetadataRoute } from 'next'
import { getBlogPosts } from 'app/blog/utils'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tolearn.blog'
  
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
