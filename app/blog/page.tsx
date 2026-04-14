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
    'AI systems archive',
    'coding agents analysis',
    'search visibility',
    'technical SEO',
    'modern web execution',
    'developer workflows',
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
    description:
      'Browse the full ToLearn archive covering AI systems, search visibility, and modern web execution.',
    url: `${baseUrl}/blog`,
    author: organization,
    publisher: organization,
    isPartOf: {
      '@id': `${baseUrl}/#website`,
    },
    inLanguage: 'en-US',
    keywords: ['AI systems', 'coding agents', 'search visibility', 'technical SEO', 'modern web execution']
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

      <div className="surface-panel mb-8 px-6 py-6 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker">Curated entry points</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
              Don&apos;t start the archive cold
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
              Use the strongest entry points first, then come back here when you want the full
              stream of posts.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Link href="/#start-here" className="surface-card block px-5 py-5">
            <p className="section-kicker">New here?</p>
            <h3 className="mt-3 text-xl font-semibold text-slate-950 theme-dark:text-white">
              Start with essentials
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
              Three curated entry points that explain the site&apos;s AI, search, and web lanes.
            </p>
          </Link>

          <Link href="/topics" className="surface-card block px-5 py-5">
            <p className="section-kicker">Need structure?</p>
            <h3 className="mt-3 text-xl font-semibold text-slate-950 theme-dark:text-white">
              Browse topic hubs
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
              Follow guided paths through the archive instead of reading in timestamp order.
            </p>
          </Link>

          <Link href="/guides" className="surface-card block px-5 py-5">
            <p className="section-kicker">Want a progression?</p>
            <h3 className="mt-3 text-xl font-semibold text-slate-950 theme-dark:text-white">
              Read guides
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
              Use the most structured layer when you want step-by-step learning, not just posts.
            </p>
          </Link>
        </div>
      </div>

      <PostsWithFilter posts={posts} />
    </section>
  )
}
