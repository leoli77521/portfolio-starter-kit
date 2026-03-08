import type { Metadata } from 'next'
import { baseUrl, organization } from 'app/lib/constants'
import { getBlogPostsMetadata } from 'app/blog/utils'
import { PostsWithFilter } from 'app/components/posts-with-filter'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Journal',
  description:
    'Browse the full ToLearn archive covering AI systems, search visibility, and modern web execution.',
  keywords: [
    'technology blog',
    'AI artificial intelligence',
    'SEO optimization tips',
    'web development',
    'frontend technology',
    'programming learning',
    'tech sharing',
  ],
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
  openGraph: {
    title: 'Journal | ToLearn Blog',
    description:
      'Browse the full ToLearn archive covering AI systems, search visibility, and modern web execution.',
    url: `${baseUrl}/blog`,
    type: 'website',
  },
}

export default function Page() {
  const posts = getBlogPostsMetadata()


  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${baseUrl}/blog/#blog`,
    name: 'ToLearn Technology Blog',
    description: 'Browse our comprehensive collection of AI guides, SEO strategies, and programming tutorials. Find actionable insights to advance your tech career.',
    url: `${baseUrl}/blog`,
    author: organization,
    publisher: organization,
    isPartOf: {
      '@id': `${baseUrl}/#website`,
    },
    inLanguage: 'en-US',
    keywords: ['technology blog', 'AI artificial intelligence', 'SEO optimization', 'web development', 'programming technology', 'frontend development']
  }
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: posts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${baseUrl}/blog/${post.slug}`,
      name: post.metadata.title,
    })),
  }
  const structuredData = [blogSchema, itemListSchema]

  return (
    <section className="max-w-6xl mx-auto">
      <nav className="mb-6 text-sm" aria-label="Breadcrumb navigation">
        <ol className="flex items-center space-x-2 text-slate-500 theme-dark:text-slate-400">
          <li>
            <Link
              href="/"
              className="transition-colors hover:text-indigo-600 theme-dark:hover:text-indigo-400"
              title="ToLearn Blog Homepage"
            >
              Home
            </Link>
          </li>
          <li className="text-slate-400 theme-dark:text-slate-600">/</li>
          <li className="font-medium text-slate-900 theme-dark:text-slate-100">Journal</li>
        </ol>
      </nav>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <div className="surface-panel mb-10 px-6 py-8 md:px-8 md:py-10">
        <p className="section-kicker">Full archive</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white md:text-5xl">
          Journal
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 theme-dark:text-slate-300 md:text-lg">
          Every article in one place, filtered for fast browsing. This is where the
          broader archive lives after the curated homepage selections.
        </p>
      </div>

      <PostsWithFilter posts={posts} />
    </section>
  )
}

