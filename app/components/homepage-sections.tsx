import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowRight, ArrowUpRight, Bot, Code2, Route, Search, Sparkles } from 'lucide-react'
import { getContentPath, localizePath } from 'app/lib/i18n-paths'
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
  const locale = useLocale()
  const t = useTranslations('Home')
  const hrefFor = (href: string) => getContentPath(href, locale)

  if (items.length === 0) {
    return null
  }

  return (
    <section id="start-here" className="content-section pt-4">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-kicker">{t('startKicker')}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white md:text-4xl">
            {t('startTitle')}
          </h2>
          <p className="section-copy mt-3 max-w-2xl">
            {t('startBody')}
          </p>
        </div>

        <Link href={localizePath('/blog', locale)} className="editorial-link">
          {t('browseFull')}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={hrefFor(item.href)}
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
  const locale = useLocale()
  const t = useTranslations('Home')
  const common = useTranslations('Common')

  if (tracks.length === 0) {
    return null
  }

  return (
    <section className="content-section">
      <div className="mb-8">
        <p className="section-kicker">{t('tracksKicker')}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white md:text-4xl">
          {t('tracksTitle')}
        </h2>
        <p className="section-copy mt-3 max-w-2xl">
          {t('tracksBody')}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {tracks.map((track) => (
          <Link
            key={track.title}
            href={localizePath(track.href, locale)}
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
                {common('articles', { count: track.postCount })}
              </span>
              <span className="meta-chip normal-case tracking-normal">
                {common('hubs', { count: track.hubCount })}
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
  const locale = useLocale()
  const t = useTranslations('Home')
  const common = useTranslations('Common')

  if (paths.length === 0) {
    return null
  }

  return (
    <section className="content-section">
      <div className="mb-8">
        <p className="section-kicker">{t('guidedKicker')}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white md:text-4xl">
          {t('guidedTitle')}
        </h2>
        <p className="section-copy mt-3 max-w-2xl">
          {t('guidedBody')}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {paths.map((path) => (
          <Link
            key={path.slug}
            href={localizePath(path.href, locale)}
            className="surface-card group block px-6 py-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-100/80 text-slate-700 theme-dark:border-slate-800 theme-dark:bg-slate-900/80 theme-dark:text-slate-200">
                <Route className="h-5 w-5" />
              </div>
              <span className="meta-chip normal-case tracking-normal">
                {common('posts', { count: path.postCount })}
              </span>
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
  const locale = useLocale()
  const t = useTranslations('Home')

  if (!series) {
    return null
  }

  return (
    <section className="content-section">
      <div className="surface-panel px-6 py-7 md:px-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:items-start">
          <div>
            <p className="section-kicker">{t('seriesKicker')}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white md:text-4xl">
              {series.title}
            </h2>
            <p className="section-copy mt-4 max-w-2xl">{series.description}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="meta-chip normal-case tracking-normal">
                {t('seriesPart', { count: series.postCount })}
              </span>
              <span className="meta-chip normal-case tracking-normal">
                {t('seriesPath')}
              </span>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href={getContentPath(series.primaryHref, locale)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 theme-dark:bg-slate-100 theme-dark:text-slate-950"
              >
                {t('seriesStart')}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={localizePath(series.secondaryHref, locale)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200/80 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-300 hover:text-slate-950 theme-dark:border-slate-800 theme-dark:text-slate-300 theme-dark:hover:border-indigo-500/60 theme-dark:hover:text-white"
              >
                {t('seriesAll')}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="surface-card px-5 py-5">
            <p className="section-kicker">{t('readingOrder')}</p>
            <ol className="mt-5 space-y-3">
              {series.posts.map((post, index) => (
                <li key={post.slug}>
                  <Link
                    href={getContentPath(`/blog/${post.slug}`, locale)}
                    className="block rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 px-4 py-4 transition-colors hover:border-indigo-300 hover:bg-white theme-dark:border-slate-800 theme-dark:bg-slate-950/70 theme-dark:hover:border-indigo-500/60 theme-dark:hover:bg-slate-950"
                  >
                    <div className="flex items-center gap-3">
                      <span className="meta-chip normal-case tracking-normal">
                        {t('part', { index: index + 1 })}
                      </span>
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
  const locale = useLocale()
  const t = useTranslations('Home')

  return (
    <section className="content-section">
      <div className="surface-panel flex flex-col gap-4 px-6 py-6 md:flex-row md:items-end md:justify-between md:px-8">
        <div className="max-w-3xl">
          <p className="section-kicker">{t('whyKicker')}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
            {t('whyTitle')}
          </h2>
          <p className="section-copy mt-3">
            {t('whyBody')}
          </p>
        </div>

        <Link href={localizePath('/about', locale)} className="editorial-link">
          <Sparkles className="h-4 w-4" />
          {t('whyLink')}
        </Link>
      </div>
    </section>
  )
}
