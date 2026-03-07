import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Clock } from 'lucide-react'
import { calculateReadingTime, formatDate, getBlogPosts } from 'app/blog/utils'
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

function getSortedPosts(limit: number) {
  return getBlogPosts()
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
    )
    .slice(0, limit)
}

function renderLeadMedia(image: string | undefined, title: string, category?: string) {
  if (image && image.startsWith('/')) {
    return (
      <div className="relative aspect-[16/9] overflow-hidden rounded-[1.5rem] border border-slate-200/70 theme-dark:border-slate-800">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
        />
      </div>
    )
  }

  return (
    <div className="flex aspect-[16/9] items-end rounded-[1.5rem] border border-slate-200/70 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(79,70,229,0.78),rgba(56,189,248,0.58))] p-6 text-white theme-dark:border-slate-800">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
          {category || 'Featured dispatch'}
        </p>
        <p className="mt-3 max-w-lg text-2xl font-semibold tracking-[-0.04em]">
          {title}
        </p>
      </div>
    </div>
  )
}

export function FeaturedArticles({ limit = 3 }: { limit?: number }) {
  const posts = getSortedPosts(Math.max(limit, 1))

  if (!posts.length) {
    return null
  }

  const [leadPost, ...secondaryPosts] = posts
  const leadCategoryTone = getCategoryColor(leadPost.metadata.category || 'All')
  const leadReadingTime = calculateReadingTime(leadPost.content)

  return (
    <section className="content-section pt-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-kicker">Featured analysis</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white md:text-4xl">
            Start with the strongest recent work
          </h2>
          <p className="section-copy mt-3 max-w-2xl">
            A tighter front page works better when it promotes a small set of standout
            pieces instead of asking readers to parse a long feed immediately.
          </p>
        </div>

        <Link href="/blog" className="editorial-link">
          Browse the full archive
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.9fr)]">
        <article className="surface-card overflow-hidden p-5 md:p-6">
          <Link href={`/blog/${leadPost.slug}`} className="group block" title={leadPost.metadata.title}>
            {renderLeadMedia(leadPost.metadata.image, leadPost.metadata.title, leadPost.metadata.category)}

            <div className="mt-6">
              <div className="flex flex-wrap items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-500 theme-dark:text-slate-400">
                {leadPost.metadata.category && (
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 ${categoryBadgeStyles[leadCategoryTone]}`}
                  >
                    {leadPost.metadata.category}
                  </span>
                )}
                <span>{formatDate(leadPost.metadata.publishedAt, false)}</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {leadReadingTime} min read
                </span>
              </div>

              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 transition-colors group-hover:text-indigo-700 theme-dark:text-white theme-dark:group-hover:text-indigo-300">
                    {leadPost.metadata.title}
                  </h3>
                  <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600 theme-dark:text-slate-300">
                    {leadPost.metadata.summary}
                  </p>
                </div>
                <span className="hidden rounded-full border border-slate-200/80 p-3 text-slate-500 transition-colors group-hover:border-indigo-300 group-hover:text-indigo-700 theme-dark:border-slate-800 theme-dark:text-slate-400 theme-dark:group-hover:border-indigo-500/60 theme-dark:group-hover:text-indigo-300 md:inline-flex">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        </article>

        <div className="space-y-5">
          {secondaryPosts.map((post) => {
            const categoryTone = getCategoryColor(post.metadata.category || 'All')
            const readingTime = calculateReadingTime(post.content)

            return (
              <article key={post.slug} className="surface-card overflow-hidden p-5">
                <Link href={`/blog/${post.slug}`} className="group block" title={post.metadata.title}>
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

                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950 transition-colors group-hover:text-indigo-700 theme-dark:text-white theme-dark:group-hover:text-indigo-300">
                        {post.metadata.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-slate-600 theme-dark:text-slate-300">
                        {post.metadata.summary}
                      </p>
                    </div>
                    <ArrowUpRight className="mt-1 hidden h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-indigo-700 theme-dark:group-hover:text-indigo-300 md:block" />
                  </div>

                  <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium uppercase tracking-[0.16em] text-slate-500 theme-dark:text-slate-400">
                    <Clock className="h-3.5 w-3.5" />
                    {readingTime} min read
                  </div>
                </Link>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

