import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Clock } from 'lucide-react'
import { calculateReadingTime, formatDate, getBlogPosts } from 'app/blog/utils'
import { truncateSummary } from 'app/lib/formatters'
import { getCategoryColor } from 'app/lib/categories'

const categoryBadgeStyles = {
  gray: 'border-slate-200/80 bg-slate-100/90 text-slate-600 theme-dark:border-slate-800 theme-dark:bg-slate-900 theme-dark:text-slate-300',
  blue: 'border-sky-200/80 bg-sky-50/90 text-sky-700 theme-dark:border-sky-900/80 theme-dark:bg-sky-950/50 theme-dark:text-sky-300',
  green:
    'border-emerald-200/80 bg-emerald-50/90 text-emerald-700 theme-dark:border-emerald-900/80 theme-dark:bg-emerald-950/50 theme-dark:text-emerald-300',
  purple:
    'border-violet-200/80 bg-violet-50/90 text-violet-700 theme-dark:border-violet-900/80 theme-dark:bg-violet-950/50 theme-dark:text-violet-300',
  orange:
    'border-amber-200/80 bg-amber-50/90 text-amber-700 theme-dark:border-amber-900/80 theme-dark:bg-amber-950/50 theme-dark:text-amber-300',
}

export function LatestPostsList({
  limit = 5,
  skipFirst = 0,
}: {
  limit?: number
  skipFirst?: number
}) {
  const posts = getBlogPosts()
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
    )
    .slice(skipFirst, skipFirst + limit)

  if (!posts.length) {
    return null
  }

  return (
    <section className="content-section pt-4">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-kicker">Latest dispatches</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white md:text-4xl">
            Fresh notes from the working notebook
          </h2>
          <p className="section-copy mt-3 max-w-2xl">
            These are the most recent entries after the featured set, laid out for fast
            scanning instead of long card repetition.
          </p>
        </div>

        <Link href="/blog" className="editorial-link">
          See every post
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {posts.map((post) => {
          const categoryTone = getCategoryColor(post.metadata.category || 'All')

          return (
            <article key={post.slug} className="surface-card overflow-hidden">
              <Link
                href={`/blog/${post.slug}`}
                className="group block px-5 py-5 md:px-6 md:py-6"
                title={post.metadata.title}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-500 theme-dark:text-slate-400">
                      {post.metadata.category && (
                        <span
                          className={`inline-flex items-center rounded-full border px-3 py-1 ${categoryBadgeStyles[categoryTone]}`}
                        >
                          {post.metadata.category}
                        </span>
                      )}
                      <span>{formatDate(post.metadata.publishedAt, false)}</span>
                    </div>

                    <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-slate-950 transition-colors group-hover:text-indigo-700 theme-dark:text-white theme-dark:group-hover:text-indigo-300">
                      {post.metadata.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-600 theme-dark:text-slate-300">
                      {truncateSummary(post.metadata.summary || '', 150)}
                    </p>
                  </div>

                  <span className="inline-flex rounded-full border border-slate-200/80 p-3 text-slate-500 transition-colors group-hover:border-indigo-300 group-hover:text-indigo-700 theme-dark:border-slate-800 theme-dark:text-slate-400 theme-dark:group-hover:border-indigo-500/60 theme-dark:group-hover:text-indigo-300">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>

                <div className="mt-5 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500 theme-dark:text-slate-400">
                  <Clock className="h-3.5 w-3.5" />
                  {calculateReadingTime(post.content)} min read
                </div>
              </Link>
            </article>
          )
        })}
      </div>
    </section>
  )
}

