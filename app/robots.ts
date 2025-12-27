import { baseUrl } from 'app/sitemap'

export default function robots() {
  return {
    rules: [
      // 通用爬虫规则
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/static/',
          '/_next/image',
          '/static/',
          '*.json',
          // Keep OG endpoint crawlable; control indexing via response headers
          '/manifest.json',
          '/_vercel/',
          '/500', // Do not index the 500 error page
        ],
      },
      // Google爬虫特殊规则
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/blog/',
          '/rss',
          '/sitemap.xml',
        ],
        disallow: [
          '/api/',
          '*.json',
        ],
        crawlDelay: 1,
      },
      // Bing爬虫特殊规则
      {
        userAgent: 'Bingbot',
        allow: [
          '/',
          '/blog/',
          '/rss',
          '/sitemap.xml',
        ],
        disallow: [
          '/api/',
          '*.json',
        ],
        crawlDelay: 1,
      },
      // 其他搜索引擎
      {
        userAgent: 'Slurp', // Yahoo
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/static/',
        ],
        crawlDelay: 2,
      },
      {
        userAgent: 'DuckDuckBot',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/static/',
        ],
        crawlDelay: 1,
      },
      // AI Crawlers - Explicit Allow
      {
        userAgent: ['GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended'],
        allow: ['/', '/blog/', '/rss', '/sitemap.xml'],
        disallow: ['/api/', '/_next/', '/static/', '*.json'],
      },
      // 阻止有害爬虫
      {
        userAgent: [
          'AhrefsBot',
          'SemrushBot',
          'MJ12bot',
          'DotBot',
          'AspiegelBot',
          'DataForSeoBot',
          'BLEXBot'
        ],
        disallow: '/',
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
