'use client'

import { usePathname } from 'next/navigation'
import { baseUrl } from '../sitemap'
import Head from 'next/head'

interface SEOProps {
  title?: string
  description?: string
  canonical?: string
  noindex?: boolean
  alternateLanguages?: { [key: string]: string }
  structuredData?: object
}

export default function SEO({
  title,
  description,
  canonical,
  noindex = false,
  alternateLanguages,
  structuredData
}: SEOProps) {
  const pathname = usePathname()
  const currentUrl = `${baseUrl}${pathname}`
  const canonicalUrl = canonical || currentUrl

  // 生成hreflang链接
  const hrefLangLinks = alternateLanguages ? Object.entries(alternateLanguages).map(([locale, url]) => ({
    rel: 'alternate',
    hrefLang: locale,
    href: url
  })) : []

  // 添加x-default如果有多语言
  if (hrefLangLinks.length > 0) {
    hrefLangLinks.push({
      rel: 'alternate',
      hrefLang: 'x-default',
      href: canonicalUrl
    })
  }

  return (
    <>
      <Head>
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Robots meta tag */}
        {noindex && <meta name="robots" content="noindex,nofollow" />}
        
        {/* Hreflang links */}
        {hrefLangLinks.map((link, index) => (
          <link 
            key={index}
            rel={link.rel}
            hrefLang={link.hrefLang}
            href={link.href}
          />
        ))}
        
        {/* Prev/Next for paginated content */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      </Head>
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
    </>
  )
}

// Hook for generating structured data
export function useStructuredData() {
  return {
    generateWebsiteSchema: () => ({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
      'url': baseUrl,
      'name': 'ToLearn Blog',
      'description': 'Your gateway to AI innovation, SEO mastery, and modern web development.',
      'publisher': {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        'name': 'ToLearn Blog',
        'url': baseUrl,
      },
      'potentialAction': {
        '@type': 'SearchAction',
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': `${baseUrl}/blog?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    }),

    generateArticleSchema: (post: any) => ({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `${baseUrl}/blog/${post.slug}`,
      'url': `${baseUrl}/blog/${post.slug}`,
      'headline': post.metadata.title,
      'description': post.metadata.summary,
      'datePublished': post.metadata.publishedAt,
      'dateModified': post.metadata.publishedAt,
      'author': {
        '@type': 'Person',
        'name': 'ToLearn Blog',
      },
      'publisher': {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        'name': 'ToLearn Blog',
        'url': baseUrl,
      },
      'isPartOf': {
        '@type': 'Blog',
        '@id': `${baseUrl}/blog/#blog`,
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `${baseUrl}/blog/${post.slug}`,
      },
    }),

    generateBreadcrumbSchema: (items: Array<{ name: string; url: string }>) => ({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': items.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'item': {
          '@type': 'WebPage',
          '@id': item.url,
          'name': item.name,
        },
      })),
    }),
  }
}