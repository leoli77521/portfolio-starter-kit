import { defaultOgImage } from 'app/lib/seo'
import { baseUrl } from './sitemap'
import type { Metadata } from 'next'
import { getBlogPosts } from 'app/blog/utils'
import { HeroSection } from 'app/components/hero-section'
import {
  getHomepageFeaturedSeries,
  getHomepageGuidedPaths,
  getHomepageTrackData,
  homepageStartHere,
} from 'app/lib/homepage'
import {
  HomepageFeaturedSeriesCard,
  HomepageGuidedPaths,
  HomepageMiniAbout,
  HomepageStartHere,
  HomepageTrackExplorer,
} from 'app/components/homepage-sections'
import { LatestPostsList } from 'app/components/latest-posts-list'
import { NewsletterCTA } from 'app/components/newsletter-cta'
import { topicHubs } from 'app/lib/topic-hubs'

export const metadata: Metadata = {
  title: 'ToLearn Blog | AI, Search, and Modern Web Work',
  description:
    'Practical analysis of AI systems, coding agents, search visibility, technical SEO, and modern web execution for builders.',
  keywords: [
    'AI systems',
    'coding agents',
    'search visibility',
    'technical SEO',
    'modern web execution',
    'developer workflows',
    'AI architecture analysis',
    'web performance',
  ],
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: 'ToLearn Blog | AI, Search, and Modern Web Work',
    description:
      'Practical analysis of AI systems, coding agents, search visibility, technical SEO, and modern web execution for builders.',
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
      'Practical analysis of AI systems, coding agents, search visibility, technical SEO, and modern web execution for builders.',
    images: [defaultOgImage],
  },
}

export default function Page() {
  const allPosts = getBlogPosts().sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
  )
  const trackData = getHomepageTrackData(allPosts)
  const guidedPaths = getHomepageGuidedPaths(allPosts)
  const featuredSeries = getHomepageFeaturedSeries(allPosts)

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
    name: 'ToLearn Blog',
    alternateName: 'ToLearn Tech Blog',
    description:
      'Signal-first analysis covering AI systems, coding agents, search visibility, and modern web execution for builders.',
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
      description:
        'Practical analysis, implementation notes, and strategic writeups on AI systems, search visibility, and modern web execution.',
      url: `${baseUrl}/blog`,
      author: organization,
      publisher: organization,
      isPartOf: {
        '@id': `${baseUrl}/#website`,
      },
      keywords: ['AI systems', 'coding agents', 'search visibility', 'technical SEO', 'modern web execution'],
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
        topicHubCount={topicHubs.length}
      />

      <HomepageStartHere items={homepageStartHere} />

      <HomepageTrackExplorer tracks={trackData} />

      <HomepageGuidedPaths paths={guidedPaths} />

      <HomepageFeaturedSeriesCard series={featuredSeries} />

      <LatestPostsList limit={3} />

      <NewsletterCTA />

      <HomepageMiniAbout />
    </div>
  )
}
