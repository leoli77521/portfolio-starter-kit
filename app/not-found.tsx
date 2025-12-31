import type { Metadata } from 'next'
import Link from 'next/link'
import { baseUrl } from './sitemap'
import { getBlogPosts } from './blog/utils'

export const metadata: Metadata = {
  title: '404 - Page Not Found | ToLearn Blog',
  description: 'The page you are looking for does not exist. Return to ToLearn Blog to explore our AI insights, SEO guides, and programming tutorials.',
  alternates: {
    canonical: `${baseUrl}/404`,
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  const allPosts = getBlogPosts()
  const recentPosts = allPosts
    .sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime())
    .slice(0, 3)

  const popularCategories = [
    { name: 'AI Technology', href: '/blog', description: 'Artificial Intelligence insights and tools' },
    { name: 'SEO Optimization', href: '/blog', description: 'Search engine optimization guides' },
    { name: 'Web Development', href: '/blog', description: 'Programming tutorials and best practices' }
  ]

  return (
    <section className="max-w-2xl">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold tracking-tighter text-neutral-900 dark:text-neutral-100">
          404 - Page Not Found
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-6">
          Sorry, the page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
          What can you do?
        </h2>
        <ul className="space-y-2 text-neutral-600 dark:text-neutral-400">
          <li>• Check the URL for typos</li>
          <li>• Use the navigation menu to find what you're looking for</li>
          <li>• Visit our homepage to explore all content</li>
          <li>• Search our blog posts below</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
          Popular Categories
        </h2>
        <div className="grid gap-4 md:grid-cols-1">
          {popularCategories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="block p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
            >
              <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                {category.name}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
          Recent Articles
        </h2>
        <div className="space-y-3">
          {recentPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block p-3 border border-neutral-200 dark:border-neutral-800 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
            >
              <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                {post.metadata.title}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                {post.metadata.summary}
              </p>
              {post.metadata.category && (
                <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                  {post.metadata.category}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          ← Back to Home
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center px-6 py-3 ml-4 border border-neutral-300 dark:border-neutral-700 hover:border-blue-300 dark:hover:border-blue-700 text-neutral-900 dark:text-neutral-100 font-medium rounded-lg transition-colors"
        >
          Browse All Articles
        </Link>
      </div>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: '404 - Page Not Found',
            description: 'The requested page was not found on ToLearn Blog.',
            url: `${baseUrl}/404`,
            mainEntity: {
              '@type': 'Organization',
              name: 'ToLearn Blog',
              url: baseUrl
            }
          }),
        }}
      />
    </section>
  )
}
