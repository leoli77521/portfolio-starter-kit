import { BlogPosts } from 'app/components/posts'
import { baseUrl } from './sitemap'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ToLearn Blog - AI Tech Blog Home | SEO Optimization Tutorials | Programming Development Guide',
  description: 'ToLearn professional technology blog, focusing on sharing AI artificial intelligence technology, SEO website optimization strategies, and frontend programming development best practices. Providing in-depth technical articles to help developers improve skills and career growth.',
  keywords: ['AI Tech Blog', 'SEO Optimization Tutorials', 'Programming Development', 'Artificial Intelligence Applications', 'Website Optimization Strategies', 'Frontend Development Technology', 'JavaScript Tutorials', 'React Development Guide'],
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: 'ToLearn Blog - AI Tech Blog | SEO Optimization Tutorials | Programming Development Guide',
    description: 'ToLearn professional technology blog, focusing on sharing AI artificial intelligence technology, SEO website optimization strategies, and frontend programming development best practices. Providing in-depth technical articles to help developers improve skills.',
    url: baseUrl,
    type: 'website',
    locale: 'en_US',
    siteName: 'ToLearn Tech Blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToLearn Blog - AI Tech Blog | SEO Optimization Tutorials',
    description: 'ToLearn professional technology blog, sharing AI artificial intelligence, SEO optimization, and programming development best practices.',
  },
}

export default function Page() {
  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'ToLearn Blog - AI Tech Blog',
            alternateName: 'ToLearn Tech Blog',
            description: 'Professional technology blog sharing AI artificial intelligence, SEO optimization, and programming development best practices. In-depth technical articles helping developers improve skills.',
            url: baseUrl,
            inLanguage: 'en-US',
            potentialAction: {
              '@type': 'SearchAction',
              target: `${baseUrl}/search?q={search_term_string}`,
              'query-input': 'required name=search_term_string'
            },
            mainEntity: {
              '@type': 'Blog',
              name: 'ToLearn Tech Blog',
              description: 'In-depth technical articles sharing, covering AI artificial intelligence, SEO optimization, frontend development and trending tech topics',
              url: `${baseUrl}/blog`,
              author: {
                '@type': 'Organization',
                name: 'ToLearn Blog',
                url: baseUrl
              },
              keywords: ['AI Technology', 'SEO Optimization', 'Programming Tutorials', 'Artificial Intelligence', 'Frontend Development'],
              inLanguage: 'en-US'
            },
            publisher: {
              '@type': 'Organization',
              name: 'ToLearn Blog',
              url: baseUrl,
              logo: {
                '@type': 'ImageObject',
                url: `${baseUrl}/logo.png`,
                width: 150,
                height: 150
              }
            }
          }),
        }}
      />
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
        ToLearn Blog - Professional Tech Insights
      </h1>
      <p className="mb-8 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
        Welcome to ToLearn Technology Blog! We focus on sharing cutting-edge programming techniques, AI artificial intelligence insights, and web development best practices.
        Whether you're a beginner or an experienced developer, you'll find valuable in-depth technical content here.
      </p>

      {/* Featured Articles Section */}
      <section className="content-section">
        <h2 className="section-title text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-50">Featured Technical Articles</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Link 
            href="/blog/seo-optimization-guide"
            className="featured-card block"
          >
            <h3 className="card-title text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
              SEO Deployment for Beginners: A Step-by-Step Guide
            </h3>
            <p className="card-description text-gray-600 dark:text-gray-400">
              Learn how to deploy effective SEO strategies for your website as a beginner, from technical setup to content optimization and beyond.
            </p>
          </Link>
          
          <Link 
            href="/blog/ai-revolution-finance"
            className="featured-card block"
          >
            <h3 className="card-title text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
              The AI Revolution in Your Wallet: How AI is Changing Finance
            </h3>
            <p className="card-description text-gray-600 dark:text-gray-400">
              Discover how artificial intelligence is being used in the world of finance, from keeping your money safe to making investing easier.
            </p>
          </Link>
        </div>
        
        <div className="mt-8 text-center">
          <Link 
            href="/blog" 
            className="btn-primary inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Technical Articles →
          </Link>
        </div>
      </section>

      {/* Latest Articles List */}
      <section className="content-section">
        <h2 className="section-title text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-50">Latest Technical Articles</h2>
        <BlogPosts />
      </section>
    </section>
  )
}
