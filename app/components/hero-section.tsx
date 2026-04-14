import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

interface HeroSectionProps {
  totalPosts: number
  topicHubCount: number
}

export function HeroSection({
  totalPosts,
  topicHubCount,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pb-2">
      <div className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.16),transparent_40%),radial-gradient(circle_at_78%_18%,rgba(14,165,233,0.14),transparent_32%),linear-gradient(180deg,rgba(248,250,252,0.92),rgba(248,250,252,0))] theme-dark:bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.22),transparent_38%),radial-gradient(circle_at_78%_18%,rgba(56,189,248,0.18),transparent_32%),linear-gradient(180deg,rgba(2,6,23,0.78),rgba(2,6,23,0))]" />

      <div className="surface-panel px-6 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.18fr)_minmax(18rem,0.82fr)] lg:gap-10">
          <div className="space-y-6">
            <p className="section-kicker">Independent analysis for builders</p>

            <div className="max-w-3xl">
              <h1 className="text-4xl font-semibold tracking-[-0.05em] text-slate-950 theme-dark:text-white md:text-5xl lg:text-6xl">
                Practical analysis of AI systems, search visibility, and modern web execution.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 theme-dark:text-slate-300 md:text-lg">
                ToLearn publishes clear, signal-first breakdowns for people building products on
                the web, from coding agents and AI workflows to search strategy and technical
                execution.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#start-here"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 theme-dark:bg-slate-100 theme-dark:text-slate-950"
              >
                Start here
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/topics"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200/80 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-300 hover:text-slate-950 theme-dark:border-slate-800 theme-dark:text-slate-300 theme-dark:hover:border-indigo-500/60 theme-dark:hover:text-white"
              >
                Browse topic hubs
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <p className="text-sm text-slate-500 theme-dark:text-slate-400">
              {totalPosts} published posts · {topicHubCount} topic hubs · Weekly analysis, not
              filler
            </p>
          </div>

          <div className="space-y-4">
            <div className="surface-card px-5 py-5">
              <p className="section-kicker">Built for</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950 theme-dark:text-white">
                Builders who need clearer thinking before they ship.
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                Read for architecture patterns, search changes, and implementation notes you can
                actually use.
              </p>
            </div>

            <div className="surface-card px-5 py-5">
              <p className="section-kicker">How to use the site</p>
              <div className="mt-4 space-y-3">
                <Link
                  href="/#start-here"
                  className="block rounded-[1.25rem] border border-slate-200/80 bg-slate-50/85 px-4 py-4 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:text-slate-950 theme-dark:border-slate-800 theme-dark:bg-slate-950/70 theme-dark:text-slate-300 theme-dark:hover:border-indigo-500/60 theme-dark:hover:text-white"
                >
                  Start with three core entry points
                </Link>
                <Link
                  href="/topics"
                  className="block rounded-[1.25rem] border border-slate-200/80 bg-slate-50/85 px-4 py-4 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:text-slate-950 theme-dark:border-slate-800 theme-dark:bg-slate-950/70 theme-dark:text-slate-300 theme-dark:hover:border-indigo-500/60 theme-dark:hover:text-white"
                >
                  Follow guided paths through topic hubs
                </Link>
                <Link
                  href="/blog"
                  className="block rounded-[1.25rem] border border-slate-200/80 bg-slate-50/85 px-4 py-4 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:text-slate-950 theme-dark:border-slate-800 theme-dark:bg-slate-950/70 theme-dark:text-slate-300 theme-dark:hover:border-indigo-500/60 theme-dark:hover:text-white"
                >
                  Scan the latest dispatches in the journal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
