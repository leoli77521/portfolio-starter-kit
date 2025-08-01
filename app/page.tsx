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
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        ToLearn Blog - Professional Tech Insights
      </h1>
      <p className="mb-6 text-neutral-700 dark:text-neutral-300">
        Welcome to ToLearn Technology Blog! We focus on sharing cutting-edge programming techniques, AI artificial intelligence insights, and web development best practices.
        Whether you're a beginner or an experienced developer, you'll find valuable in-depth technical content here.
      </p>

      {/* Featured Articles Section */}
      <div className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">Featured Technical Articles</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Link 
            href="/blog/seo-optimization-guide"
            className="block p-4 bg-white dark:bg-neutral-800 rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium text-blue-600 dark:text-blue-400 mb-2">
              SEO Deployment for Beginners: A Step-by-Step Guide
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Learn how to deploy effective SEO strategies for your website as a beginner, from technical setup to content optimization and beyond.
            </p>
          </Link>
          
          <Link 
            href="/blog/ai-revolution-finance"
            className="block p-4 bg-white dark:bg-neutral-800 rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium text-blue-600 dark:text-blue-400 mb-2">
              The AI Revolution in Your Wallet: How AI is Changing Finance
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Discover how artificial intelligence is being used in the world of finance, from keeping your money safe to making investing easier.
            </p>
          </Link>
        </div>
        
        <div className="mt-4 text-center">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            View All Technical Articles →
          </Link>
        </div>
      </div>

      {/* Latest Articles List */}
      <div className="my-8">
        <h2 className="text-xl font-semibold mb-6 text-neutral-900 dark:text-neutral-100">Latest Technical Articles</h2>
        <BlogPosts />
      </div>
    </section>
  )
}
