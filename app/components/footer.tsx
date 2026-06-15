import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'
import { localizePath } from 'app/lib/i18n-paths'
import NewsletterForm from './newsletter-form'

const browseLinks = [
  { href: '/blog', labelKey: 'Common.journal' },
  { href: '/categories', labelKey: 'Common.categories' },
  { href: '/tags', labelKey: 'Common.tags' },
]

const collectionLinks = [
  { href: '/topics', labelKey: 'Common.topics' },
  { href: '/guides', labelKey: 'Common.guides' },
  { href: '/templates', labelKey: 'Common.templates' },
]

const companyLinks = [
  { href: '/about', labelKey: 'Common.about' },
  { href: '/contact', labelKey: 'Common.contact' },
  { href: '/rss', labelKey: 'Common.rss', keepRoot: true },
]

const legalLinks = [
  { href: '/privacy', labelKey: 'Common.privacy' },
  { href: '/terms', labelKey: 'Common.terms' },
]

export default async function Footer() {
  const locale = await getLocale()
  const t = await getTranslations({ locale })
  const hrefFor = (href: string, keepRoot = false) =>
    keepRoot ? href : localizePath(href, locale)

  return (
    <footer className="mb-12 mt-24">
      <div className="surface-panel px-6 py-8 md:px-8 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_0.7fr_0.7fr_minmax(18rem,0.95fr)]">
          <div className="space-y-4">
            <p className="section-kicker">ToLearn</p>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
              {t('Footer.headline')}
            </h2>
            <p className="max-w-xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
              {t('Footer.description')}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 theme-dark:text-slate-400">
              {t('Footer.browse')}
            </h3>
            <div className="mt-4 space-y-3">
              {browseLinks.map((link) => (
                <Link key={link.href} href={hrefFor(link.href)} className="footer-link">
                  {t(link.labelKey)}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 theme-dark:text-slate-400">
              {t('Footer.collections')}
            </h3>
            <div className="mt-4 space-y-3">
              {collectionLinks.map((link) => (
                <Link key={link.href} href={hrefFor(link.href)} className="footer-link">
                  {t(link.labelKey)}
                </Link>
              ))}
            </div>

            <h3 className="mt-7 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 theme-dark:text-slate-400">
              {t('Footer.company')}
            </h3>
            <div className="mt-4 space-y-3">
              {companyLinks.map((link) => (
                <Link key={link.href} href={hrefFor(link.href, link.keepRoot)} className="footer-link">
                  {t(link.labelKey)}
                </Link>
              ))}
            </div>
          </div>

          <NewsletterForm />
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-slate-200/70 pt-6 text-sm text-slate-500 theme-dark:border-slate-800 theme-dark:text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>{t('Footer.copyright', { year: new Date().getFullYear() })}</p>

          <div className="flex flex-wrap gap-4">
            {legalLinks.map((link) => (
              <Link key={link.href} href={hrefFor(link.href)} className="transition-colors hover:text-slate-950 theme-dark:hover:text-white">
                {t(link.labelKey)}
              </Link>
            ))}
            <a
              href="https://nextjs.org"
              rel="noopener noreferrer"
              target="_blank"
              className="transition-colors hover:text-slate-950 theme-dark:hover:text-white"
            >
              Next.js
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
