import { defaultOgImage } from 'app/lib/seo'
import { baseUrl } from './sitemap'
import type { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
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
import {
  getAbsoluteLocalizedAlternates,
  getCanonicalUrl,
  getLocaleLanguageTag,
  getLocaleOpenGraph,
} from 'app/lib/i18n-paths'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'Metadata' })
  const title = t('homeTitle')
  const description = t('homeDescription')
  const canonicalUrl = getCanonicalUrl('/', locale, baseUrl)

  return {
    title,
    description,
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
      canonical: canonicalUrl,
      languages: getAbsoluteLocalizedAlternates('/', baseUrl),
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      locale: getLocaleOpenGraph(locale),
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
      title,
      description,
      images: [defaultOgImage],
    },
  }
}

export default async function Page() {
  const locale = await getLocale()
  const metadataT = await getTranslations({ locale, namespace: 'Metadata' })
  const allPosts = getBlogPosts().sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
  )
  const trackData = getHomepageTrackData(allPosts)
  const guidedPaths = getHomepageGuidedPaths(allPosts)
  const featuredSeries = getHomepageFeaturedSeries(allPosts)
  const canonicalUrl = getCanonicalUrl('/', locale, baseUrl)
  const blogUrl = getCanonicalUrl('/blog', locale, baseUrl)
  const searchUrl = getCanonicalUrl('/search', locale, baseUrl)
  const languageTag = getLocaleLanguageTag(locale)

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
    description: metadataT('rootDescription'),
    url: canonicalUrl,
    inLanguage: languageTag,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${searchUrl}?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    },
    publisher: organization,
    mainEntity: {
      '@type': 'Blog',
      '@id': `${baseUrl}/blog/#blog`,
      name: 'ToLearn Tech Blog',
      description:
        'Practical analysis, implementation notes, and strategic writeups on AI systems, search visibility, and modern web execution.',
      url: blogUrl,
      author: organization,
      publisher: organization,
      isPartOf: {
        '@id': `${baseUrl}/#website`,
      },
      keywords: ['AI systems', 'coding agents', 'search visibility', 'technical SEO', 'modern web execution'],
      inLanguage: languageTag
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
