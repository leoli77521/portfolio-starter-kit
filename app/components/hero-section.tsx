import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { localizePath } from 'app/lib/i18n-paths'

interface HeroSectionProps {
  totalPosts: number
  topicHubCount: number
}

export function HeroSection({
  totalPosts,
  topicHubCount,
}: HeroSectionProps) {
  const locale = useLocale()
  const t = useTranslations('Home')
  const hrefFor = (href: string) => localizePath(href, locale)

  return (
    <section className="relative overflow-hidden pb-2">
      <div className="absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.16),transparent_40%),radial-gradient(circle_at_78%_18%,rgba(14,165,233,0.14),transparent_32%),linear-gradient(180deg,rgba(248,250,252,0.92),rgba(248,250,252,0))] theme-dark:bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.22),transparent_38%),radial-gradient(circle_at_78%_18%,rgba(56,189,248,0.18),transparent_32%),linear-gradient(180deg,rgba(2,6,23,0.78),rgba(2,6,23,0))]" />

      <div className="surface-panel px-6 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.18fr)_minmax(18rem,0.82fr)] lg:gap-10">
          <div className="space-y-6">
            <p className="section-kicker">{t('heroKicker')}</p>

            <div className="max-w-3xl">
              <h1 className="text-4xl font-semibold tracking-[-0.05em] text-slate-950 theme-dark:text-white md:text-5xl lg:text-6xl">
                {t('heroTitle')}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 theme-dark:text-slate-300 md:text-lg">
                {t('heroBody')}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={hrefFor('/#start-here')}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 theme-dark:bg-slate-100 theme-dark:text-slate-950"
              >
                {t('startHere')}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={hrefFor('/topics')}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200/80 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-300 hover:text-slate-950 theme-dark:border-slate-800 theme-dark:text-slate-300 theme-dark:hover:border-indigo-500/60 theme-dark:hover:text-white"
              >
                {t('browseTopics')}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <p className="text-sm text-slate-500 theme-dark:text-slate-400">
              {t('stats', { posts: totalPosts, hubs: topicHubCount })}
            </p>
          </div>

          <div className="space-y-4">
            <div className="surface-card px-5 py-5">
              <p className="section-kicker">{t('builtFor')}</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950 theme-dark:text-white">
                {t('builtForTitle')}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                {t('builtForBody')}
              </p>
            </div>

            <div className="surface-card px-5 py-5">
              <p className="section-kicker">{t('howToUse')}</p>
              <div className="mt-4 space-y-3">
                <Link
                  href={hrefFor('/#start-here')}
                  className="block rounded-[1.25rem] border border-slate-200/80 bg-slate-50/85 px-4 py-4 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:text-slate-950 theme-dark:border-slate-800 theme-dark:bg-slate-950/70 theme-dark:text-slate-300 theme-dark:hover:border-indigo-500/60 theme-dark:hover:text-white"
                >
                  {t('useOne')}
                </Link>
                <Link
                  href={hrefFor('/topics')}
                  className="block rounded-[1.25rem] border border-slate-200/80 bg-slate-50/85 px-4 py-4 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:text-slate-950 theme-dark:border-slate-800 theme-dark:bg-slate-950/70 theme-dark:text-slate-300 theme-dark:hover:border-indigo-500/60 theme-dark:hover:text-white"
                >
                  {t('useTwo')}
                </Link>
                <Link
                  href={hrefFor('/blog')}
                  className="block rounded-[1.25rem] border border-slate-200/80 bg-slate-50/85 px-4 py-4 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:text-slate-950 theme-dark:border-slate-800 theme-dark:bg-slate-950/70 theme-dark:text-slate-300 theme-dark:hover:border-indigo-500/60 theme-dark:hover:text-white"
                >
                  {t('useThree')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
