'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MobileMenu } from './mobile-menu'
import { Search } from './search'
import { ThemeToggle } from './theme-toggle'

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
      <div className="sticky top-0 z-50 -mx-4 px-4 lg:mx-0 lg:px-0 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-gray-200/50 dark:border-slate-800/50">
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
              return (
                <Link
                  key={path}
                  href={path}
                  className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-200 ${isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800'
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
        <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-slate-500 mr-2" aria-hidden="true">
          Quick Access:
        </span>
        {featuredArticles.map((article) => (
          <Link
            key={article.href}
            href={article.href}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-full bg-gradient-to-r from-gray-50 to-gray-100 dark:from-transparent dark:to-transparent dark:bg-slate-800/30 border border-gray-200 dark:border-slate-700/50 hover:from-indigo-50 hover:to-purple-50 dark:hover:bg-slate-700/50 hover:border-indigo-300 dark:hover:border-slate-600 text-gray-700 dark:text-slate-300 transition-all duration-200 hover:scale-105 hover:shadow-md"
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
