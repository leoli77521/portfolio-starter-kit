import { baseUrl } from 'app/sitemap'

const sharedDisallowRules = ['/api/', '/_next/', '/static/', '*.json']
const allowSeoToolBots = process.env.BLOCK_SEO_TOOL_BOTS !== 'true'

export default function robots() {
  const rules = [
    {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/_next/static/',
        '/_next/image',
        '/static/',
        '*.json',
        '/manifest.json',
        '/_vercel/',
        '/500',
      ],
    },
    {
      userAgent: 'Googlebot',
      allow: ['/', '/blog/', '/guides/', '/rss', '/sitemap.xml'],
      disallow: ['/api/', '*.json'],
      crawlDelay: 1,
    },
    {
      userAgent: 'Bingbot',
      allow: ['/', '/blog/', '/guides/', '/rss', '/sitemap.xml'],
      disallow: ['/api/', '*.json'],
      crawlDelay: 1,
    },
    {
      userAgent: 'Slurp',
      allow: '/',
      disallow: ['/api/', '/_next/', '/static/'],
      crawlDelay: 2,
    },
    {
      userAgent: 'DuckDuckBot',
      allow: '/',
      disallow: ['/api/', '/_next/', '/static/'],
      crawlDelay: 1,
    },
    {
      userAgent: ['GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended'],
      allow: ['/', '/blog/', '/guides/', '/rss', '/sitemap.xml'],
      disallow: sharedDisallowRules,
    },
    allowSeoToolBots
      ? {
          userAgent: ['AhrefsBot', 'SemrushBot', 'DataForSeoBot'],
          allow: ['/', '/blog/', '/guides/', '/templates/', '/solutions/', '/rss', '/sitemap.xml'],
          disallow: sharedDisallowRules,
          crawlDelay: 5,
        }
      : {
          userAgent: ['AhrefsBot', 'SemrushBot', 'DataForSeoBot'],
          disallow: '/',
        },
    {
      userAgent: ['MJ12bot', 'DotBot', 'AspiegelBot', 'BLEXBot'],
      disallow: '/',
    },
  ]

  return {
    rules,
    sitemap: `${baseUrl}/sitemap.xml`,
    host: new URL(baseUrl).host,
  }
}
