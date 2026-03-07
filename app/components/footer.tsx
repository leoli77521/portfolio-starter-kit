import Link from 'next/link'
import NewsletterForm from './newsletter-form'

const browseLinks = [
  { href: '/blog', label: 'Journal' },
  { href: '/categories', label: 'Categories' },
  { href: '/tags', label: 'Tags' },
]

const collectionLinks = [
  { href: '/topics', label: 'Topic Hubs' },
  { href: '/guides', label: 'Guides' },
  { href: '/templates', label: 'Templates' },
]

const companyLinks = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/rss', label: 'RSS' },
]

const legalLinks = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
]

export default function Footer() {
  return (
    <footer className="mb-12 mt-24">
      <div className="surface-panel px-6 py-8 md:px-8 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_0.7fr_0.7fr_minmax(18rem,0.95fr)]">
          <div className="space-y-4">
            <p className="section-kicker">ToLearn</p>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
              Notes for builders who care about signal.
            </h2>
            <p className="max-w-xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
              ToLearn covers AI systems, search visibility, and modern web execution with a
              bias toward practical decisions instead of recycled hype.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 theme-dark:text-slate-400">
              Browse
            </h3>
            <div className="mt-4 space-y-3">
              {browseLinks.map((link) => (
                <Link key={link.href} href={link.href} className="footer-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 theme-dark:text-slate-400">
              Collections
            </h3>
            <div className="mt-4 space-y-3">
              {collectionLinks.map((link) => (
                <Link key={link.href} href={link.href} className="footer-link">
                  {link.label}
                </Link>
              ))}
            </div>

            <h3 className="mt-7 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 theme-dark:text-slate-400">
              Company
            </h3>
            <div className="mt-4 space-y-3">
              {companyLinks.map((link) => (
                <Link key={link.href} href={link.href} className="footer-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <NewsletterForm />
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-slate-200/70 pt-6 text-sm text-slate-500 theme-dark:border-slate-800 theme-dark:text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>{`Copyright ${new Date().getFullYear()} ToLearn. All rights reserved.`}</p>

          <div className="flex flex-wrap gap-4">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-slate-950 theme-dark:hover:text-white">
                {link.label}
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

