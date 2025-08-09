import Link from 'next/link'

const navItems = {
  '/': {
    name: 'Home',
    title: 'ToLearn Blog Homepage - AI Tech Hub & Programming Tutorials',
  },
  '/blog': {
    name: 'Tech Blog',
    title: 'Tech Blog - Latest AI Insights & Programming Tutorials',
  },
}

// Featured articles quick navigation
const featuredArticles = [
  {
    href: '/blog/seo-optimization-guide',
    name: 'SEO Guide',
    description: 'Complete website optimization tutorial',
    title: 'SEO Optimization Guide - Complete Website Optimization Tutorial'
  },
  {
    href: '/blog/ai-revolution-finance', 
    name: 'AI Finance Revolution',
    description: 'How AI is changing finance',
    title: 'AI Revolution in Finance - How AI is Transforming Financial Services'
  }
]

export function Navbar() {
  return (
    <header className="mb-12">
      <div className="sticky top-0 z-40 -mx-4 px-4 lg:mx-0 lg:px-0 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-black/40">
        <div className="flex items-center justify-between py-3">
          <Link href="/" className="font-semibold text-lg text-neutral-900 dark:text-neutral-100" title="ToLearn Blog Homepage">
            ToLearn
          </Link>
          <nav className="flex items-center gap-1">
            {Object.entries(navItems).map(([path, { name, title }]) => (
              <Link
                key={path}
                href={path}
                className="nav-link"
                title={title}
              >
                {name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="hidden md:flex flex-wrap items-center gap-2 mb-6">
        {featuredArticles.map((article) => (
          <Link
            key={article.href}
            href={article.href}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition-colors"
            title={article.title}
          >
            <span className="font-medium">{article.name}</span>
            <span className="text-neutral-500 dark:text-neutral-400">{article.description}</span>
          </Link>
        ))}
      </div>
    </header>
  )
}
