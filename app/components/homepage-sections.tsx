import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Bot, Code2, Route, Search, Sparkles } from 'lucide-react'
import type {
  HomepageFeaturedSeries,
  HomepageGuidedPath,
  HomepageStartHereItem,
  HomepageTrack,
} from 'app/lib/homepage'

export function HomepageStartHere({
  items,
}: {
  items: HomepageStartHereItem[]
}) {
  if (items.length === 0) {
    return null
  }

  return (
    <section id="start-here" className="content-section pt-4">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-kicker">Start here</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white md:text-4xl">
            The clearest way into the site
          </h2>
          <p className="section-copy mt-3 max-w-2xl">
            New to ToLearn? Begin with a few entry points that show how the site thinks about AI
            systems, search visibility, and practical execution.
          </p>
        </div>

        <Link href="/blog" className="editorial-link">
          Browse the full journal
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="surface-card group block px-6 py-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="meta-chip normal-case tracking-normal">{item.lane}</span>
                <span className="meta-chip normal-case tracking-normal">{item.type}</span>
              </div>
              <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-indigo-700 theme-dark:group-hover:text-indigo-300" />
            </div>

            <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-slate-950 transition-colors group-hover:text-indigo-700 theme-dark:text-white theme-dark:group-hover:text-indigo-300">
              {item.title}
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
              {item.description}
            </p>

            <div className="mt-6 editorial-link">{item.cta}</div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function HomepageTrackExplorer({
  tracks,
}: {
  tracks: HomepageTrack[]
}) {
  if (tracks.length === 0) {
    return null
  }

  return (
    <section className="content-section">
      <div className="mb-8">
        <p className="section-kicker">Explore by track</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white md:text-4xl">
          Follow the part of the archive that matches your work
        </h2>
        <p className="section-copy mt-3 max-w-2xl">
          Choose the lane you care about instead of scanning the archive cold.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {tracks.map((track) => (
          <Link
            key={track.title}
            href={track.href}
            className="surface-card group block px-6 py-6"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-100/80 text-slate-700 theme-dark:border-slate-800 theme-dark:bg-slate-900/80 theme-dark:text-slate-200">
              {track.title === 'AI systems' ? (
                <Bot className="h-5 w-5" />
              ) : track.title === 'Search visibility' ? (
                <Search className="h-5 w-5" />
              ) : (
                <Code2 className="h-5 w-5" />
              )}
            </div>

            <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-slate-950 transition-colors group-hover:text-indigo-700 theme-dark:text-white theme-dark:group-hover:text-indigo-300">
              {track.title}
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
              {track.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="meta-chip normal-case tracking-normal">
                {track.postCount} articles
              </span>
              <span className="meta-chip normal-case tracking-normal">
                {track.hubCount} hubs
              </span>
            </div>

            <div className="mt-6 editorial-link">
              {track.cta}
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function HomepageGuidedPaths({
  paths,
}: {
  paths: HomepageGuidedPath[]
}) {
  if (paths.length === 0) {
    return null
  }

  return (
    <section className="content-section">
      <div className="mb-8">
        <p className="section-kicker">Guided paths</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white md:text-4xl">
          Curated topic hubs for readers who want structure
        </h2>
        <p className="section-copy mt-3 max-w-2xl">
          Follow a path instead of browsing the archive blind.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {paths.map((path) => (
          <Link
            key={path.slug}
            href={path.href}
            className="surface-card group block px-6 py-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-100/80 text-slate-700 theme-dark:border-slate-800 theme-dark:bg-slate-900/80 theme-dark:text-slate-200">
                <Route className="h-5 w-5" />
              </div>
              <span className="meta-chip normal-case tracking-normal">{path.postCount} posts</span>
            </div>

            <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-slate-950 transition-colors group-hover:text-indigo-700 theme-dark:text-white theme-dark:group-hover:text-indigo-300">
              {path.title}
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
              {path.description}
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-700 theme-dark:text-slate-200">
              {path.audience}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {path.relatedTags.map((tag) => (
                <span key={tag} className="meta-chip normal-case tracking-normal">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 editorial-link">
              {path.cta}
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function HomepageFeaturedSeriesCard({
  series,
}: {
  series: HomepageFeaturedSeries | null
}) {
  if (!series) {
    return null
  }

  return (
    <section className="content-section">
      <div className="surface-panel px-6 py-7 md:px-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:items-start">
          <div>
            <p className="section-kicker">Featured series</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white md:text-4xl">
              {series.title}
            </h2>
            <p className="section-copy mt-4 max-w-2xl">{series.description}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="meta-chip normal-case tracking-normal">
                {series.postCount}-part series
              </span>
              <span className="meta-chip normal-case tracking-normal">
                Organized as a reading path
              </span>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href={series.primaryHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 theme-dark:bg-slate-100 theme-dark:text-slate-950"
              >
                Start the series
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={series.secondaryHref}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200/80 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-300 hover:text-slate-950 theme-dark:border-slate-800 theme-dark:text-slate-300 theme-dark:hover:border-indigo-500/60 theme-dark:hover:text-white"
              >
                View all related posts
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="surface-card px-5 py-5">
            <p className="section-kicker">Reading order</p>
            <ol className="mt-5 space-y-3">
              {series.posts.map((post, index) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 px-4 py-4 transition-colors hover:border-indigo-300 hover:bg-white theme-dark:border-slate-800 theme-dark:bg-slate-950/70 theme-dark:hover:border-indigo-500/60 theme-dark:hover:bg-slate-950"
                  >
                    <div className="flex items-center gap-3">
                      <span className="meta-chip normal-case tracking-normal">Part {index + 1}</span>
                      <span className="text-sm font-semibold text-slate-900 theme-dark:text-slate-100">
                        {post.title}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

export function HomepageMiniAbout() {
  return (
    <section className="content-section">
      <div className="surface-panel flex flex-col gap-4 px-6 py-6 md:flex-row md:items-end md:justify-between md:px-8">
        <div className="max-w-3xl">
          <p className="section-kicker">Why ToLearn exists</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
            Signal-first notes for builders
          </h2>
          <p className="section-copy mt-3">
            ToLearn is a running notebook for builders who care more about signal than hype. The
            goal is simple: make product shifts, technical decisions, and execution patterns easier
            to understand without turning every post into noise.
          </p>
        </div>

        <Link href="/about" className="editorial-link">
          <Sparkles className="h-4 w-4" />
          Read about the project
        </Link>
      </div>
    </section>
  )
}
