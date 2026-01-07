'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MobileMenu } from './mobile-menu'
import { Search } from './search'
import { ThemeToggle } from './theme-toggle'
import { categories, getCategorySlug } from './category-filter'

const navItems = {
  '/': {
    name: 'Home',
    title: 'ToLearn Blog Homepage - AI Tech Hub & Programming Tutorials',
  },
  '/blog': {
    name: 'Blog',
    title: 'Tech Blog - Latest AI Insights & Programming Tutorials',
  },
  '/categories': {
    name: 'Categories',
    title: 'Browse Articles by Category',
  },
  '/tags': {
    name: 'Tags',
    title: 'Browse Articles by Tags',
  },
  '/about': {
    name: 'About',
    title: 'About ToLearn Blog',
  },
}

// Featured articles quick navigation
const featuredArticles = [
  {
    href: '/blog/gemini-deep-thinking-api-math-reasoning',
    name: 'Gemini Deep Thinking',
    description: 'Build advanced AI reasoning apps',
    title: 'Gemini Deep Thinking API - Build Advanced Math Reasoning Applications'
  },
  {
    href: '/blog/verbose-ai-beats-fast-ai-moonshot-k2',
    name: 'Verbose AI vs Fast AI',
    description: 'Moonshot K2 paradox explained',
    title: 'Verbose AI Beats Fast AI: Moonshot K2 $1,172 Paradox'
  },
  {
    href: '/blog/ai-revolution-finance',
    name: 'AI Finance Revolution',
    description: 'How AI is changing finance',
    title: 'AI Revolution in Finance - How AI is Transforming Financial Services'
  }
]

const categoryDescriptions: Record<string, string> = {
  'AI Technology': 'Models, agents, and intelligent systems',
  'Web Development': 'Frontend, backend, and full-stack builds',
  'SEO & Marketing': 'Search visibility and growth tactics',
  'Productivity': 'Workflows, focus, and automation',
}

const categoryLinks = categories.filter((cat) => cat.name !== 'All')
const categorySplitIndex = Math.ceil(categoryLinks.length / 2)
const categoryColumns = [
  categoryLinks.slice(0, categorySplitIndex),
  categoryLinks.slice(categorySplitIndex),
]

const exploreLinks = [
  {
    href: '/blog',
    name: 'Latest Posts',
    description: 'Fresh writing and tutorials',
  },
  {
    href: '/tags',
    name: 'Tags',
    description: 'Browse topics and keywords',
  },
  {
    href: '/categories',
    name: 'All Categories',
    description: 'Every topic in one view',
  },
  {
    href: '/about',
    name: 'About',
    description: 'Mission, author, and goals',
  },
]

const featuredMenuItems = featuredArticles.slice(0, 2)

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="mb-16" role="banner">
      <div className="sticky top-0 z-50 px-4 lg:px-0 rounded-2xl backdrop-blur-xl bg-white/80 dark:bg-slate-950/85 dark:bg-gradient-to-r dark:from-indigo-500/15 dark:via-slate-950/85 dark:to-purple-500/15 border border-gray-200/60 dark:border-indigo-500/20 shadow-sm dark:shadow-[0_10px_30px_rgba(79,70,229,0.25)] supports-[backdrop-filter]:bg-white/70">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-black text-2xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-300 dark:hover:to-purple-300 transition-all duration-200"
            title="ToLearn Blog Homepage"
            aria-label="ToLearn Blog - Go to homepage"
          >
            <span className="text-3xl" aria-hidden="true">🎓</span>
            <span>ToLearn</span>
          </Link>

          {/* 桌面端导航 */}
          <nav className="hidden md:flex items-center gap-2" role="navigation" aria-label="Main navigation">
            {Object.entries(navItems).map(([path, { name, title }]) => {
              const isActive = pathname === path
              
              if (path === '/categories') {
                return (
                  <div key={path} className="relative group">
                    <Link
                      href={path}
                      className={`nav-link text-sm flex items-center gap-1 ${isActive || pathname?.startsWith('/categories/')
                        ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                        : ''
                        }`}
                      title={title}
                      aria-label={title}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {name}
                      <svg 
                        className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180 opacity-70" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Link>

                    {/* Dropdown Menu */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-6 opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:translate-y-0 transition-all duration-200 transform translate-y-2 z-50 w-[min(94vw,980px)]">
                      <div className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl rounded-2xl border border-gray-200/70 dark:border-slate-800 shadow-2xl">
                        <div className="grid gap-8 p-6 lg:grid-cols-[1fr_1fr_1fr_1.1fr]">
                          {categoryColumns.map((column, columnIndex) => (
                            <div key={`category-column-${columnIndex}`} className="space-y-4">
                              <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 dark:text-slate-400">
                                {columnIndex === 0 ? 'Core Topics' : 'More Topics'}
                              </p>
                              <div className="space-y-2">
                                {column.map((cat) => (
                                  <Link
                                    key={cat.name}
                                    href={`/categories/${getCategorySlug(cat.name)}`}
                                    className="group/link block rounded-lg px-3 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-slate-900"
                                  >
                                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover/link:text-indigo-600 dark:group-hover/link:text-indigo-300">
                                      {cat.name}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-slate-400">
                                      {categoryDescriptions[cat.name] || 'Browse posts in this topic'}
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}

                          <div className="space-y-4">
                            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 dark:text-slate-400">
                              Explore
                            </p>
                            <div className="space-y-2">
                              {exploreLinks.map((link) => (
                                <Link
                                  key={link.href}
                                  href={link.href}
                                  className="group/link block rounded-lg px-3 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-slate-900"
                                >
                                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover/link:text-indigo-600 dark:group-hover/link:text-indigo-300">
                                    {link.name}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-slate-400">
                                    {link.description}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4 border-l border-gray-200/80 dark:border-slate-800 pl-6">
                            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 dark:text-slate-400">
                              Featured
                            </p>
                            <div className="space-y-3">
                              {featuredMenuItems.map((article) => (
                                <Link
                                  key={article.href}
                                  href={article.href}
                                  className="block rounded-xl border border-gray-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                                  title={article.title}
                                  aria-label={`Read article: ${article.name} - ${article.description}`}
                                >
                                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    {article.name}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                                    {article.description}
                                  </div>
                                </Link>
                              ))}
                              <Link
                                href="/blog"
                                className="inline-flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                              >
                                Browse all articles
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }

              return (
                <Link
                  key={path}
                  href={path}
                  className={`nav-link text-sm ${isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                    : ''
                    }`}
                  title={title}
                  aria-label={title}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {name}
                </Link>
              )
            })}
          </nav>

          {/* 右侧工具栏 */}
          <div className="flex items-center gap-2">
            {/* 搜索按钮 */}
            <Search />

            {/* 主题切换按钮 */}
            <ThemeToggle />

            {/* 移动端菜单 */}
            <MobileMenu navItems={navItems} />
          </div>
        </div>
      </div>

      {/* Featured Articles Quick Access - 仅桌面端显示 */}
      <nav className="hidden md:flex flex-wrap items-center gap-3 mt-6 max-w-6xl mx-auto" role="navigation" aria-label="Featured articles quick access">
        <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-slate-400 mr-2" aria-hidden="true">
          Quick Access:
        </span>
        {featuredArticles.map((article) => (
          <Link
            key={article.href}
            href={article.href}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-full bg-white/60 dark:bg-slate-900/60 border border-gray-200/70 dark:border-indigo-500/20 hover:bg-white dark:hover:bg-indigo-950/60 hover:border-indigo-300 dark:hover:border-indigo-400/50 text-gray-700 dark:text-slate-200 transition-all duration-200 hover:scale-105 hover:shadow-lg dark:hover:shadow-[0_10px_24px_rgba(79,70,229,0.25)] backdrop-blur-sm"
            title={article.title}
            aria-label={`Read article: ${article.name} - ${article.description}`}
          >
            <span className="font-semibold">{article.name}</span>
            <span className="text-gray-500 dark:text-slate-500 text-xs hidden lg:inline" aria-hidden="true">
              {article.description}
            </span>
          </Link>
        ))}
      </nav>
    </header>
  )
}
