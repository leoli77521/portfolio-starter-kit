import Link from 'next/link'

const navItems = {
  '/': {
    name: 'Home',
  },
  '/blog': {
    name: 'Tech Blog',
  },
}

// Featured articles quick navigation
const featuredArticles = [
  {
    href: '/blog/seo-optimization-guide',
    name: 'SEO Guide',
    description: 'Complete website optimization tutorial'
  },
  {
    href: '/blog/ai-revolution-finance', 
    name: 'AI Finance Revolution',
    description: 'How AI is changing finance'
  }
]

export function Navbar() {
  return (
    <aside className="-ml-[8px] mb-16 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-col space-y-4 relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          {/* 主导航 */}
          <div className="flex flex-row flex-wrap space-x-0 pr-10">
            {Object.entries(navItems).map(([path, { name }]) => {
              return (
                <Link
                  key={path}
                  href={path}
                  className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-3 px-4 m-1 min-h-[44px] touch-manipulation font-medium"
                >
                  {name}
                </Link>
              )
            })}
          </div>

          {/* Featured articles quick navigation */}
          <div className="hidden md:block">
            <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2 px-4">Featured Articles</h3>
            <div className="space-y-1">
              {featuredArticles.map((article) => (
                <Link
                  key={article.href}
                  href={article.href}
                  className="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-md transition-colors"
                >
                  <div className="font-medium">{article.name}</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-500">{article.description}</div>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  )
}
