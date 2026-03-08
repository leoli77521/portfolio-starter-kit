import { defaultOgImage } from 'app/lib/seo'
import { baseUrl } from './sitemap'
import type { Metadata } from 'next'
import { getBlogPosts } from 'app/blog/utils'
import { HeroSection } from 'app/components/hero-section'
import { FeaturedArticles } from 'app/components/featured-articles'
import { LatestPostsList } from 'app/components/latest-posts-list'
import { NewsletterCTA } from 'app/components/newsletter-cta'

export const metadata: Metadata = {
  title: 'ToLearn Blog | AI, Search, and Modern Web Work',
  description:
    'Editorial notes on AI systems, search visibility, and practical web execution for builders.',
  keywords: [
    'AI Tech Blog',
    'SEO Optimization Tutorials',
    'Programming Development',
    'Artificial Intelligence Applications',
    'Website Optimization Strategies',
    'Frontend Development Technology',
    'JavaScript Tutorials',
    'React Development Guide',
  ],
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: 'ToLearn Blog | AI, Search, and Modern Web Work',
    description:
      'Editorial notes on AI systems, search visibility, and practical web execution for builders.',
    url: baseUrl,
    type: 'website',
    locale: 'en_US',
    siteName: 'ToLearn Tech Blog',
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: 'ToLearn Blog homepage preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToLearn Blog | AI, Search, and Modern Web Work',
    description:
      'Editorial notes on AI systems, search visibility, and practical web execution for builders.',
    images: [defaultOgImage],
  },
}

export default function Page() {
  const allPosts = getBlogPosts().sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
  )
  const latestPost = allPosts[0]
  const uniqueCategories = new Set(
    allPosts.map((post) => post.metadata.category).filter(Boolean)
  )

  const organization = {
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: 'ToLearn Blog',
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/favicon.ico`,
      width: 32,
      height: 32,
    },
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    name: 'ToLearn Blog - AI Tech Blog',
    alternateName: 'ToLearn Tech Blog',
    description: 'Professional tech blog sharing AI insights, SEO strategies, and programming best practices. In-depth articles helping developers improve skills.',
    url: baseUrl,
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    },
    publisher: organization,
    mainEntity: {
      '@type': 'Blog',
      '@id': `${baseUrl}/blog/#blog`,
      name: 'ToLearn Tech Blog',
      description: 'In-depth technical articles sharing, covering AI artificial intelligence, SEO optimization, frontend development and trending tech topics',
      url: `${baseUrl}/blog`,
      author: organization,
      publisher: organization,
      isPartOf: {
        '@id': `${baseUrl}/#website`,
      },
      keywords: ['AI Technology', 'SEO Optimization', 'Programming Tutorials', 'Artificial Intelligence', 'Frontend Development'],
      inLanguage: 'en-US'
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />

      <HeroSection
        totalPosts={allPosts.length}
        categoryCount={uniqueCategories.size}
        latestPost={
          latestPost
            ? {
                slug: latestPost.slug,
                title: latestPost.metadata.title,
                category: latestPost.metadata.category,
                publishedAt: latestPost.metadata.publishedAt,
              }
            : null
        }
      />

      <FeaturedArticles limit={3} />

      <LatestPostsList limit={5} skipFirst={3} />

      <NewsletterCTA />
    </div>
  )
}
