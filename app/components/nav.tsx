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
    href: '/blog/gemini-deep-thinking-api-math-reasoning',
    name: 'Gemini Deep Thinking',
    description: 'Build advanced AI reasoning apps',
    title: 'Gemini Deep Thinking API - Build Advanced Math Reasoning Applications'
  },
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
    <header className="mb-16">
      <div className="sticky top-0 z-50 -mx-4 px-4 lg:mx-0 lg:px-0 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-4">
          <Link 
            href="/" 
            className="font-black text-2xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-300 dark:hover:to-purple-300 transition-all duration-200" 
            title="ToLearn Blog Homepage"
          >
            ToLearn
          </Link>
          <nav className="flex items-center gap-2">
            {Object.entries(navItems).map(([path, { name, title }]) => (
              <Link
                key={path}
                href={path}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                title={title}
              >
                {name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="hidden md:flex flex-wrap items-center gap-3 mt-6 max-w-6xl mx-auto">
        <span className="text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 mr-2">Quick Access:</span>
        {featuredArticles.map((article) => (
          <Link
            key={article.href}
            href={article.href}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-full bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border border-gray-200 dark:border-gray-600 hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 hover:border-indigo-300 dark:hover:border-indigo-600 text-gray-700 dark:text-gray-200 transition-all duration-200 hover:scale-105 hover:shadow-md"
            title={article.title}
          >
            <span className="font-semibold">{article.name}</span>
            <span className="text-gray-500 dark:text-gray-400 text-xs hidden lg:inline">{article.description}</span>
          </Link>
        ))}
      </div>
    </header>
  )
}
