import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

type LatestPost = {
  slug: string
  title: string
  category?: string
  publishedAt: string
}

interface HeroSectionProps {
  totalPosts: number
  categoryCount: number
  latestPost: LatestPost | null
}

function formatPublishedDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

const coverageLanes = [
  {
    title: 'AI systems',
    description: 'Agents, benchmarks, product shifts, and practical implementation notes.',
  },
  {
    title: 'Search visibility',
    description: 'SEO decisions, indexing behavior, and content strategy that actually ships.',
  },
  {
    title: 'Modern web work',
    description: 'Developer workflow, performance, frontend execution, and production patterns.',
  },
]

export function HeroSection({
  totalPosts,
  categoryCount,
  latestPost,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pb-4">
      <div className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.16),transparent_40%),radial-gradient(circle_at_78%_18%,rgba(14,165,233,0.14),transparent_32%),linear-gradient(180deg,rgba(248,250,252,0.92),rgba(248,250,252,0))] theme-dark:bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.22),transparent_38%),radial-gradient(circle_at_78%_18%,rgba(56,189,248,0.18),transparent_32%),linear-gradient(180deg,rgba(2,6,23,0.78),rgba(2,6,23,0))]" />

      <div className="surface-panel grid gap-8 px-6 py-8 md:px-8 md:py-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.88fr)] lg:gap-10 lg:px-10 lg:py-12">
        <div className="space-y-6">
          <p className="section-kicker">Editorial briefing for builders</p>

          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-[-0.05em] text-slate-950 theme-dark:text-white md:text-5xl lg:text-6xl">
              Signal over hype for AI, search, and modern product work.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 theme-dark:text-slate-300 md:text-lg">
              ToLearn is a running notebook for people shipping on the web. We break down
              product shifts, technical decisions, and execution patterns without the usual
              trend-chasing noise.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 theme-dark:bg-slate-100 theme-dark:text-slate-950"
            >
              Read the journal
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/topics"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200/80 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-300 hover:text-slate-950 theme-dark:border-slate-800 theme-dark:text-slate-300 theme-dark:hover:border-indigo-500/60 theme-dark:hover:text-white"
            >
              Explore topic hubs
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="stat-pill">
              <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">{totalPosts}</span>
              <span>published posts</span>
            </div>
            <div className="stat-pill">
              <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">{categoryCount}</span>
              <span>active tracks</span>
            </div>
            <div className="stat-pill">
              <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">Weekly</span>
              <span>new analysis cadence</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {latestPost && (
            <Link
              href={`/blog/${latestPost.slug}`}
              className="surface-card block px-5 py-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="section-kicker">Latest release</p>
                  <h2 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-slate-950 theme-dark:text-white">
                    {latestPost.title}
                  </h2>
                </div>
                <ArrowUpRight className="mt-1 h-4 w-4 text-slate-400" />
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-500 theme-dark:text-slate-400">
                {latestPost.category && <span className="meta-chip">{latestPost.category}</span>}
                <span>{formatPublishedDate(latestPost.publishedAt)}</span>
              </div>
            </Link>
          )}

          <div className="surface-card px-5 py-5">
            <p className="section-kicker">Coverage map</p>
            <div className="mt-4 space-y-4">
              {coverageLanes.map((lane) => (
                <div key={lane.title} className="rounded-2xl border border-slate-200/70 bg-slate-50/90 px-4 py-4 theme-dark:border-slate-800 theme-dark:bg-slate-900/90">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-900 theme-dark:text-slate-100">
                    {lane.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 theme-dark:text-slate-400">
                    {lane.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

