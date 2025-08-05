import { BlogPosts } from 'app/components/posts'
import { baseUrl } from './sitemap'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ToLearn Blog - Professional Technology Blog Homepage',
  description: 'ToLearn professional technology blog, focusing on AI artificial intelligence, SEO optimization strategies, and web development best practices. In-depth technical articles to help developers grow.',
  keywords: ['technology blog', 'AI artificial intelligence', 'SEO optimization', 'web development', 'programming technology', 'frontend development'],
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: 'ToLearn Blog - Professional Technology Blog Homepage',
    description: 'ToLearn professional technology blog, focusing on AI artificial intelligence, SEO optimization strategies, and web development best practices. In-depth technical articles to help developers grow.',
    url: baseUrl,
    type: 'website',
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
            name: 'ToLearn Blog',
            description: 'Professional technology blog focusing on AI artificial intelligence, SEO optimization strategies, and web development best practices.',
            url: baseUrl,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${baseUrl}/search?q={search_term_string}`,
              'query-input': 'required name=search_term_string'
            },
            mainEntity: {
              '@type': 'Blog',
              name: 'ToLearn Technology Blog',
              description: 'In-depth technical articles to help developers grow',
              url: `${baseUrl}/blog`
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
      <div className="content-section">
        <h2 className="section-title">Featured Technical Articles</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Link 
            href="/blog/seo-optimization-guide"
            className="featured-card block"
          >
            <h3 className="card-title">
              SEO Deployment for Beginners: A Step-by-Step Guide
            </h3>
            <p className="card-description">
              Learn how to deploy effective SEO strategies for your website as a beginner, from technical setup to content optimization and beyond.
            </p>
          </Link>
          
          <Link 
            href="/blog/ai-revolution-finance"
            className="featured-card block"
          >
            <h3 className="card-title">
              The AI Revolution in Your Wallet: How AI is Changing Finance
            </h3>
            <p className="card-description">
              Discover how artificial intelligence is being used in the world of finance, from keeping your money safe to making investing easier.
            </p>
          </Link>
        </div>
        
        <div className="mt-8 text-center">
          <Link 
            href="/blog" 
            className="btn-primary"
          >
            View All Technical Articles →
          </Link>
        </div>
      </div>

      {/* Latest Articles List */}
      <div className="content-section">
        <h2 className="section-title">Latest Technical Articles</h2>
        <BlogPosts />
      </div>
    </section>
  )
}
