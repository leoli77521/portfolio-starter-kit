import { baseUrl } from './sitemap'
import type { Metadata } from 'next'
import { HeroSection } from 'app/components/hero-section'
import { FeaturedArticles } from 'app/components/featured-articles'
import { LatestPostsList } from 'app/components/latest-posts-list'
import { NewsletterCTA } from 'app/components/newsletter-cta'

export const metadata: Metadata = {
  title: 'ToLearn Blog - AI Tech Hub | SEO & Programming Guide',
  description: 'Welcome to ToLearn - where developers discover AI breakthroughs, master SEO tactics, and build exceptional web experiences. Start your journey here.',
  keywords: ['AI Tech Blog', 'SEO Optimization Tutorials', 'Programming Development', 'Artificial Intelligence Applications', 'Website Optimization Strategies', 'Frontend Development Technology', 'JavaScript Tutorials', 'React Development Guide'],
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: 'ToLearn Blog - AI Tech Hub | SEO & Programming Guide',
    description: 'Welcome to ToLearn - where developers discover AI breakthroughs, master SEO tactics, and build exceptional web experiences. Start your journey here.',
    url: baseUrl,
    type: 'website',
    locale: 'en_US',
    siteName: 'ToLearn Tech Blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToLearn Blog - AI Tech Hub | SEO & Programming Guide',
    description: 'Welcome to ToLearn - where developers discover AI breakthroughs, master SEO tactics, and build exceptional web experiences. Start your journey here.',
  },
}

export default function Page() {
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
    <div className="max-w-6xl mx-auto">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Featured Articles with Thumbnails */}
      <FeaturedArticles limit={3} />

      {/* Latest Posts List */}
      <LatestPostsList limit={5} skipFirst={3} />

      {/* Newsletter CTA */}
      <NewsletterCTA />
    </div>
  )
}
