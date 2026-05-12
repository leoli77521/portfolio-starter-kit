import { calculateReadingTime, getBlogPosts } from 'app/blog/utils'
import { PostCard } from 'app/components/post-card'
import { baseUrl } from 'app/sitemap'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search the ToLearn archive by title, summary, and full article content.',
  alternates: {
    canonical: `${baseUrl}/search`,
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const q = typeof searchParams.q === 'string' ? searchParams.q : ''
  const posts = getBlogPosts()

  const filteredPosts = posts
    .filter((post) => {
      if (!q) return false
      const searchContent =
        `${post.metadata.title} ${post.metadata.summary} ${post.content}`.toLowerCase()
      return searchContent.includes(q.toLowerCase())
    })
    .sort(
      (left, right) =>
        new Date(right.metadata.publishedAt).getTime() - new Date(left.metadata.publishedAt).getTime()
    )

  return (
    <section className="mx-auto max-w-6xl space-y-8">
      <div className="surface-panel px-6 py-8 md:px-8 md:py-10">
        <p className="section-kicker">Archive search</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white md:text-5xl">
          Search the archive
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 theme-dark:text-slate-300 md:text-lg">
          Search runs across titles, summaries, and full article content so you can recover a post
          from a phrase, concept, or name you only half remember.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {q ? (
            <span className="meta-chip normal-case tracking-normal">Query: "{q}"</span>
          ) : (
            <span className="meta-chip normal-case tracking-normal">No query yet</span>
          )}
          <span className="meta-chip normal-case tracking-normal">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'result' : 'results'}
          </span>
        </div>
      </div>

      {!q ? (
        <div className="surface-panel px-6 py-12 text-center md:px-8">
          <p className="section-kicker">Ready when you are</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
            Start from the search button in the header
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
            Use the site search to open this page with a query, or jump straight into the archive
            if you want to browse by recency.
          </p>
          <div className="mt-6">
            <Link href="/blog" className="editorial-link justify-center">
              Open the journal
            </Link>
          </div>
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.slug}
              post={{
                slug: post.slug,
                metadata: post.metadata,
                readingTime: calculateReadingTime(post.content),
              }}
            />
          ))}
        </div>
      ) : (
        <div className="surface-panel px-6 py-12 text-center md:px-8">
          <p className="section-kicker">No direct match</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
            No articles matched "{q}"
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
            Try a shorter phrase, a product name, or a broader topic like AI agents, search, or
            Next.js.
          </p>
          <Link href="/blog" className="mt-6 inline-flex editorial-link justify-center">
            Browse all articles
          </Link>
        </div>
      )}
    </section>
  )
}
