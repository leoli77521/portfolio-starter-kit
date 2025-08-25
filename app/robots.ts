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
          '/og*', // 禁止直接访问OG图片生成端点
          '/manifest.json',
          '/_vercel/',
          '/404', // 不索引404页面
          '/500', // 不索引500页面
          '*?*', // 禁止带查询参数的URL
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
          '/_next/',
          '/static/',
          '/og*',
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
          '/_next/',
          '/static/',
          '/og*',
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
