'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { MobileMenu } from './mobile-menu'
import { Search } from './search'
import { ThemeToggle } from './theme-toggle'
import { categories, getCategorySlug } from './category-filter'

type NavItem = {
  href: string
  name: string
  title: string
}

const navItems: NavItem[] = [
  { href: '/', name: 'Home', title: 'ToLearn home' },
  { href: '/blog', name: 'Journal', title: 'All articles and essays' },
  { href: '/topics', name: 'Topics', title: 'Browse topic hubs' },
  { href: '/about', name: 'About', title: 'About ToLearn' },
]

const exploreLinks: NavItem[] = [
  { href: '/categories', name: 'Categories', title: 'Browse all categories' },
  { href: '/tags', name: 'Tags', title: 'Browse all tags' },
  { href: '/guides', name: 'Guides', title: 'Read curated guides' },
  { href: '/templates', name: 'Templates', title: 'Browse practical templates' },
]

const focusTopics = categories
  .filter((category) => category.name !== 'All')
  .slice(0, 4)
  .map((category) => ({
    href: `/categories/${getCategorySlug(category.name)}`,
    name: category.name,
  }))

function isItemActive(pathname: string | null, href: string) {
  if (!pathname) return false
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="mb-12 md:mb-16" role="banner">
      <div className="sticky top-0 z-50">
        <div className="surface-panel px-4 py-3 lg:px-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <div className="flex items-center gap-4 lg:gap-8">
              <Link
                href="/"
                className="group inline-flex items-center gap-3"
                title="ToLearn home"
                aria-label="ToLearn home"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white shadow-sm theme-dark:bg-slate-100 theme-dark:text-slate-950">
                  TL
                </span>
                <span className="hidden sm:block">
                  <span className="block text-sm font-semibold uppercase tracking-[0.24em] text-slate-500 theme-dark:text-slate-400">
                    ToLearn
                  </span>
                  <span className="block text-sm text-slate-700 transition-colors group-hover:text-slate-950 theme-dark:text-slate-300 theme-dark:group-hover:text-white">
                    Signal-first notes for builders
                  </span>
                </span>
              </Link>

              <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
                {navItems.map((item) => {
                  const active = isItemActive(pathname, item.href)

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={item.title}
                      aria-current={active ? 'page' : undefined}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        active
                          ? 'bg-slate-900 text-white theme-dark:bg-slate-100 theme-dark:text-slate-950'
                          : 'text-slate-600 hover:text-slate-950 theme-dark:text-slate-300 theme-dark:hover:text-white'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )
                })}

                <div className="group relative">
                  <Link
                    href="/categories"
                    title="Browse the content library"
                    className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      isItemActive(pathname, '/categories') ||
                      isItemActive(pathname, '/tags') ||
                      isItemActive(pathname, '/guides') ||
                      isItemActive(pathname, '/templates')
                        ? 'bg-slate-900 text-white theme-dark:bg-slate-100 theme-dark:text-slate-950'
                        : 'text-slate-600 hover:text-slate-950 theme-dark:text-slate-300 theme-dark:hover:text-white'
                    }`}
                  >
                    Explore
                    <ChevronDown className="h-4 w-4 opacity-70 transition-transform duration-200 group-hover:rotate-180" />
                  </Link>

                  <div className="pointer-events-none invisible absolute left-1/2 top-full z-50 w-[min(92vw,34rem)] -translate-x-1/2 translate-y-2 pt-4 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    <div className="surface-panel p-4">
                      <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                        <div className="space-y-2">
                          <p className="section-kicker">Browse the library</p>
                          {exploreLinks.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="surface-card block px-4 py-4"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <div className="text-sm font-semibold text-slate-900 theme-dark:text-slate-100">
                                    {link.name}
                                  </div>
                                  <div className="mt-1 text-sm text-slate-600 theme-dark:text-slate-400">
                                    {link.title}
                                  </div>
                                </div>
                                <ArrowUpRight className="mt-0.5 h-4 w-4 text-slate-400" />
                              </div>
                            </Link>
                          ))}
                        </div>

                        <div className="surface-card px-4 py-4">
                          <p className="section-kicker">Focus tracks</p>
                          <div className="mt-4 space-y-3">
                            {focusTopics.map((topic) => (
                              <Link
                                key={topic.href}
                                href={topic.href}
                                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/90 px-3 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:text-slate-950 theme-dark:border-slate-800 theme-dark:bg-slate-900 theme-dark:text-slate-300 theme-dark:hover:border-indigo-500/60 theme-dark:hover:text-white"
                              >
                                {topic.name}
                                <ArrowUpRight className="h-4 w-4 text-slate-400" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/guides"
                className="hidden rounded-full border border-slate-200/80 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-300 hover:text-slate-950 theme-dark:border-slate-800 theme-dark:text-slate-300 theme-dark:hover:border-indigo-500/60 theme-dark:hover:text-white xl:inline-flex"
              >
                Start Here
              </Link>
              <Search />
              <ThemeToggle />
              <MobileMenu navItems={navItems} exploreLinks={exploreLinks} />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

