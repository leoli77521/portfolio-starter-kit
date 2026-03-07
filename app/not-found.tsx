import type { Metadata } from 'next'
import Link from 'next/link'
import { baseUrl } from './sitemap'
import { getBlogPosts } from './blog/utils'

export const metadata: Metadata = {
  title: '404 - Page Not Found | ToLearn Blog',
  description:
    'The page you are looking for does not exist. Return to ToLearn Blog to explore our AI insights, SEO guides, and programming tutorials.',
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
    .sort(
      (a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
    )
    .slice(0, 3)

  const popularCategories = [
    {
      name: 'AI Technology',
      href: '/blog',
      description: 'Artificial Intelligence insights and tools',
    },
    {
      name: 'SEO Optimization',
      href: '/blog',
      description: 'Search engine optimization guides',
    },
    {
      name: 'Web Development',
      href: '/blog',
      description: 'Programming tutorials and best practices',
    },
  ]

  return (
    <section className="max-w-2xl">
      <div className="mb-8">
        <h1 className="mb-4 text-4xl font-bold tracking-tighter text-neutral-900 theme-dark:text-neutral-100">
          404 - Page Not Found
        </h1>
        <p className="mb-6 text-lg text-neutral-600 theme-dark:text-neutral-400">
          Sorry, the page you&apos;re looking for doesn&apos;t exist. It might have been moved,
          deleted, or you entered the wrong URL.
        </p>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-neutral-900 theme-dark:text-neutral-100">
          What can you do?
        </h2>
        <ul className="space-y-2 text-neutral-600 theme-dark:text-neutral-400">
          <li>Check the URL for typos.</li>
          <li>Use the navigation menu to find what you&apos;re looking for.</li>
          <li>Visit the homepage to explore all content.</li>
          <li>Search the latest blog posts below.</li>
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-neutral-900 theme-dark:text-neutral-100">
          Popular Categories
        </h2>
        <div className="grid gap-4 md:grid-cols-1">
          {popularCategories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="block rounded-lg border border-neutral-200 p-4 transition-colors hover:border-blue-300 theme-dark:border-neutral-800 theme-dark:hover:border-blue-700"
            >
              <h3 className="mb-1 font-medium text-neutral-900 theme-dark:text-neutral-100">
                {category.name}
              </h3>
              <p className="text-sm text-neutral-600 theme-dark:text-neutral-400">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold text-neutral-900 theme-dark:text-neutral-100">
          Recent Articles
        </h2>
        <div className="space-y-3">
          {recentPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block rounded-lg border border-neutral-200 p-3 transition-colors hover:border-blue-300 theme-dark:border-neutral-800 theme-dark:hover:border-blue-700"
            >
              <h3 className="mb-1 font-medium text-neutral-900 theme-dark:text-neutral-100">
                {post.metadata.title}
              </h3>
              <p className="line-clamp-2 text-sm text-neutral-600 theme-dark:text-neutral-400">
                {post.metadata.summary}
              </p>
              {post.metadata.category ? (
                <span className="mt-2 inline-block rounded bg-blue-100 px-2 py-1 text-xs text-blue-800 theme-dark:bg-blue-900 theme-dark:text-blue-200">
                  {post.metadata.category}
                </span>
              ) : null}
            </Link>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/"
          className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Back to Home
        </Link>
        <Link
          href="/blog"
          className="ml-4 inline-flex items-center rounded-lg border border-neutral-300 px-6 py-3 font-medium text-neutral-900 transition-colors hover:border-blue-300 theme-dark:border-neutral-700 theme-dark:text-neutral-100 theme-dark:hover:border-blue-700"
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
              url: baseUrl,
            },
          }),
        }}
      />
    </section>
  )
}
