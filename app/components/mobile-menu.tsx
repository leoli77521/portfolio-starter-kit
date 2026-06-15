'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { ArrowUpRight } from 'lucide-react'
import { localizePath, stripLocaleFromPath } from 'app/lib/i18n-paths'

type NavItem = {
  href: string
  nameKey: string
  titleKey: string
}

interface MobileMenuProps {
  navItems: NavItem[]
  exploreLinks: NavItem[]
}

function isItemActive(pathname: string | null, href: string) {
  if (!pathname) return false
  const currentPath = stripLocaleFromPath(pathname).pathname
  const itemPath = stripLocaleFromPath(href).pathname
  if (itemPath === '/') return currentPath === '/'
  return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`)
}

export function MobileMenu({ navItems, exploreLinks }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations()
  const hrefFor = (href: string) => localizePath(href, locale)

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset'

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      <button
        onClick={() => setIsOpen((open) => !open)}
        className="rounded-full border border-slate-200/80 p-2.5 text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950 theme-dark:border-slate-800 theme-dark:text-slate-200 theme-dark:hover:border-slate-700 theme-dark:hover:text-white lg:hidden"
        aria-label={isOpen ? t('MobileMenu.close') : t('MobileMenu.open')}
        aria-expanded={isOpen}
        type="button"
      >
        <div className="flex h-5 w-6 flex-col justify-between">
          <span
            className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
              isOpen ? 'translate-y-2 rotate-45' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
              isOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-current transition-all duration-300 ${
              isOpen ? '-translate-y-2 -rotate-45' : ''
            }`}
          />
        </div>
      </button>

      {isOpen ? (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm lg:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div
            className="fixed right-0 top-0 z-50 flex h-full w-[min(88vw,24rem)] flex-col bg-white px-5 py-5 shadow-2xl theme-dark:bg-slate-950 lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label={t('MobileMenu.label')}
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 theme-dark:border-slate-800">
              <div>
                <p className="section-kicker">ToLearn</p>
                <p className="mt-2 text-sm text-slate-600 theme-dark:text-slate-400">
                  {t('MobileMenu.description')}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-slate-200/80 p-2 text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-950 theme-dark:border-slate-800 theme-dark:text-slate-200 theme-dark:hover:border-slate-700 theme-dark:hover:text-white"
                aria-label={t('MobileMenu.close')}
                type="button"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="mt-6 space-y-2" aria-label="Primary mobile navigation">
              {navItems.map((item) => {
                const active = isItemActive(pathname, item.href)

                return (
                  <Link
                    key={item.href}
                    href={hrefFor(item.href)}
                    className={`block rounded-2xl px-4 py-3 text-base font-medium transition-colors ${
                      active
                        ? 'bg-slate-900 text-white theme-dark:bg-slate-100 theme-dark:text-slate-950'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950 theme-dark:text-slate-200 theme-dark:hover:bg-slate-900 theme-dark:hover:text-white'
                    }`}
                    title={t(item.titleKey)}
                  >
                    {t(item.nameKey)}
                  </Link>
                )
              })}
            </nav>

            <div className="mt-8">
              <p className="section-kicker">{t('Nav.explore')}</p>
              <div className="mt-3 space-y-3">
                {exploreLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={hrefFor(item.href)}
                    className="surface-card block px-4 py-4"
                    title={t(item.titleKey)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                          <div className="text-sm font-semibold text-slate-900 theme-dark:text-slate-100">
                          {t(item.nameKey)}
                        </div>
                        <div className="mt-1 text-sm text-slate-600 theme-dark:text-slate-400">
                          {t(item.titleKey)}
                        </div>
                      </div>
                      <ArrowUpRight className="mt-0.5 h-4 w-4 text-slate-400" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-auto border-t border-slate-200 pt-5 theme-dark:border-slate-800">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500 theme-dark:text-slate-400">
                {t('MobileMenu.footer')}
              </p>
            </div>
          </div>
        </>
      ) : null}
    </>
  )
}
