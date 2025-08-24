import { BlogPosts } from 'app/components/posts'
import { baseUrl } from './sitemap'
import type { Metadata } from 'next'
import Link from 'next/link'

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
            description: 'Professional tech blog sharing AI insights, SEO strategies, and programming best practices. In-depth articles helping developers improve skills.',
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
            title="SEO Optimization Guide - Complete Website Optimization Tutorial for Beginners"
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
            title="AI Revolution in Finance - How Artificial Intelligence is Transforming Financial Services"
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
            title="View All Technical Articles - Complete Collection of AI Insights & Programming Tutorials"
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

      {/* Developer Communities Section */}
      <section className="content-section mt-16">
        <h2 className="section-title text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-50">Recommended Developer Communities</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Explore these valuable communities and resources for developers, data scientists, and tech enthusiasts.
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Reddit Communities</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <a 
                  href="https://www.reddit.com/r/artificial/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  title="Reddit Artificial Intelligence Community - Latest AI Discussions"
                >
                  r/artificial - AI Discussions
                </a>
              </li>
              <li>
                <a 
                  href="https://www.reddit.com/r/SEO/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  title="Reddit SEO Community - Search Engine Optimization Tips"
                >
                  r/SEO - SEO Strategies
                </a>
              </li>
            </ul>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Google Developer Resources</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <a 
                  href="https://developers.google.com/community" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  title="Google Developers Community - Official Developer Resources and Support"
                >
                  Google Dev Community
                </a>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 md:col-span-2 lg:col-span-1">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Stay Connected</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Join these communities to stay updated with the latest in tech, AI, and web development.
            </p>
          </div>
        </div>
      </section>
    </section>
  )
}
