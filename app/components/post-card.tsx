import Link from 'next/link'
import { ArrowUpRight, Clock } from 'lucide-react'
import { formatDate, truncateSummary } from 'app/lib/formatters'
import { getCategoryColor } from 'app/lib/categories'

interface PostCardProps {
  post: {
    slug: string
    metadata: {
      title: string
      publishedAt: string
      summary?: string
      category?: string
      image?: string
    }
    readingTime?: number
  }
}

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

export function PostCard({ post }: PostCardProps) {
  const summary = post.metadata.summary
    ? truncateSummary(post.metadata.summary, 180)
    : 'Read the full article for the complete analysis.'
  const categoryTone = getCategoryColor(post.metadata.category || 'All')

  return (
    <article className="surface-card overflow-hidden">
      <Link
        href={`/blog/${post.slug}`}
        className="group block px-6 py-6 md:px-7 md:py-7"
        title={post.metadata.title}
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
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
              {post.readingTime ? (
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readingTime} min read
                </span>
              ) : null}
            </div>

            <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-slate-950 transition-colors group-hover:text-indigo-700 theme-dark:text-white theme-dark:group-hover:text-indigo-300">
              {post.metadata.title}
            </h3>

            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600 theme-dark:text-slate-300">
              {summary}
            </p>
          </div>

          <div className="flex shrink-0 items-center justify-between md:block">
            <span className="section-kicker">Open article</span>
            <span className="mt-2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200/80 text-slate-500 transition-colors group-hover:border-indigo-300 group-hover:text-indigo-700 theme-dark:border-slate-800 theme-dark:text-slate-400 theme-dark:group-hover:border-indigo-500/60 theme-dark:group-hover:text-indigo-300">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}

