'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MobileMenu } from './mobile-menu'
import { Search } from './search'
import { ThemeToggle } from './theme-toggle'
import { categories } from './category-filter'

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

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="mb-16" role="banner">
      <div className="sticky top-0 z-50 px-4 lg:px-0 rounded-2xl overflow-hidden backdrop-blur-xl bg-white/80 dark:bg-slate-950/85 dark:bg-gradient-to-r dark:from-indigo-500/15 dark:via-slate-950/85 dark:to-purple-500/15 border border-gray-200/60 dark:border-indigo-500/20 shadow-sm dark:shadow-[0_10px_30px_rgba(79,70,229,0.25)] supports-[backdrop-filter]:bg-white/70">
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
                    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2 z-50 w-64">
                      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-xl border border-gray-200/60 dark:border-indigo-500/20 shadow-xl dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)] overflow-hidden p-2">
                        <div className="flex flex-col gap-1">
                          {categories.map((cat) => (
                            <Link
                              key={cat.name}
                              href={`/categories/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors group/item"
                            >
                              <span className="text-xl group-hover/item:scale-110 transition-transform duration-200">{cat.emoji}</span>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-300">
                                {cat.name}
                              </span>
                            </Link>
                          ))}
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
