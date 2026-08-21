import { localizePath } from 'app/lib/i18n-paths'
import { getArticlePath } from 'app/lib/blog-i18n'
import { getBlogPosts } from 'app/blog/utils'
import { baseUrl } from 'app/lib/constants'

const localizedStaticPaths = [
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
]

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function safeIsoDate(value: string | undefined) {
  const parsed = value ? new Date(value) : new Date('2026-01-01T00:00:00.000Z')
  return Number.isNaN(parsed.getTime()) ? '2026-01-01T00:00:00.000Z' : parsed.toISOString()
}

export function buildLocalizedSitemap(locale: string) {
  const posts = getBlogPosts(locale)
    .filter((post) => post.isTranslated)
    .sort(
      (left, right) =>
        new Date(right.metadata.updatedAt || right.metadata.publishedAt).getTime() -
        new Date(left.metadata.updatedAt || left.metadata.publishedAt).getTime()
    )

  const staticEntries = localizedStaticPaths.map((pathname) => ({
    loc: `${baseUrl}${localizePath(pathname, locale) === '/' ? '' : localizePath(pathname, locale)}`,
    lastmod: new Date().toISOString(),
  }))
  const articleEntries = posts.map((post) => ({
    loc: `${baseUrl}${getArticlePath(post.slug, locale)}`,
    lastmod: safeIsoDate(post.metadata.updatedAt || post.metadata.publishedAt),
  }))

  const entries = [...staticEntries, ...articleEntries]
    .filter((entry, index, all) => all.findIndex((candidate) => candidate.loc === entry.loc) === index)
    .map(
      (entry) =>
        `  <url>\n    <loc>${escapeXml(entry.loc)}</loc>\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>\n  </url>`
    )
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>`

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
