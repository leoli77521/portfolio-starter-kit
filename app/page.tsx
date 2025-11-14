import { BlogPosts } from 'app/components/posts'
import { baseUrl } from './sitemap'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ToLearn Blog - AI Tech Hub | SEO & Programming Guide',
  description: 'Welcome to ToLearn - where developers discover AI breakthroughs, master SEO tactics, and build exceptional web experiences. Start your journey here.',
  keywords: ['AI Tech Blog', 'SEO Optimization Tutorials', 'Programming Development', 'Artificial Intelligence Applications', 'Website Optimization Strategies', 'Frontend Development Technology', 'JavaScript Tutorials', 'React Development Guide'],
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: 'ToLearn Blog - AI Tech Hub | SEO & Programming Guide',
    description: 'Welcome to ToLearn - where developers discover AI breakthroughs, master SEO tactics, and build exceptional web experiences. Start your journey here.',
    url: baseUrl,
    type: 'website',
    locale: 'en_US',
    siteName: 'ToLearn Tech Blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToLearn Blog - AI Tech Hub | SEO & Programming Guide',
    description: 'Welcome to ToLearn - where developers discover AI breakthroughs, master SEO tactics, and build exceptional web experiences. Start your journey here.',
  },
}

export default function Page() {
  return (
    <section className="max-w-6xl mx-auto">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'ToLearn Blog - AI Tech Blog',
            alternateName: 'ToLearn Tech Blog',
            description: 'Professional tech blog sharing AI insights, SEO strategies, and programming best practices. In-depth articles helping developers improve skills.',
            url: baseUrl,
            inLanguage: 'en-US',
            potentialAction: {
              '@type': 'SearchAction',
              target: `${baseUrl}/search?q={search_term_string}`,
              'query-input': 'required name=search_term_string'
            },
            mainEntity: {
              '@type': 'Blog',
              name: 'ToLearn Tech Blog',
              description: 'In-depth technical articles sharing, covering AI artificial intelligence, SEO optimization, frontend development and trending tech topics',
              url: `${baseUrl}/blog`,
              author: {
                '@type': 'Organization',
                name: 'ToLearn Blog',
                url: baseUrl
              },
              keywords: ['AI Technology', 'SEO Optimization', 'Programming Tutorials', 'Artificial Intelligence', 'Frontend Development'],
              inLanguage: 'en-US'
            },
            publisher: {
              '@type': 'Organization',
              name: 'ToLearn Blog',
              url: baseUrl,
              logo: {
                '@type': 'ImageObject',
                url: `${baseUrl}/favicon.ico`,
                width: 32,
                height: 32
              }
            }
          }),
        }}
      />
      {/* Hero Section */}
      <div className="mb-16 py-12 -mx-4 px-4 lg:-mx-8 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-3xl">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="mb-6 text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            ToLearn Blog
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-light leading-relaxed mb-8">
            Exploring the frontiers of AI, programming, and modern web development
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <span className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
              <span aria-hidden="true">🚀</span> AI Innovation
            </span>
            <span className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
              <span aria-hidden="true">💻</span> Clean Code
            </span>
            <span className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
              <span aria-hidden="true">📈</span> SEO Excellence
            </span>
          </div>
        </div>
      </div>

      {/* Featured Articles Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Featured Articles
          </h2>
          <Link 
            href="/blog" 
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-2 group"
            title="View All Articles"
          >
            View all
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Link 
            href="/blog/google-ai-energy-data-disclosure"
            className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl"
            title="Google AI Energy Data Disclosure"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⚡</span>
                <span className="text-xs uppercase tracking-wider font-semibold text-blue-600 dark:text-blue-400">Energy & AI</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Google's AI Energy Transparency Breakthrough
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                First-ever disclosure reveals 0.24 watt-hours per AI query, setting new industry standards for sustainable AI development.
              </p>
              <div className="mt-4 flex items-center text-sm text-blue-600 dark:text-blue-400 font-medium">
                Read more
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>
          
          <Link 
            href="/blog/ai-revolution-finance"
            className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl"
            title="AI Revolution in Finance"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">💰</span>
                <span className="text-xs uppercase tracking-wider font-semibold text-green-600 dark:text-green-400">Finance & AI</span>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                AI Revolution in Your Wallet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                From fraud detection to algorithmic trading, discover how AI is reshaping the financial landscape.
              </p>
              <div className="mt-4 flex items-center text-sm text-blue-600 dark:text-blue-400 font-medium">
                Read more
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Latest Articles List */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Latest Posts</h2>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <BlogPosts />
        </div>
      </section>

      {/* Developer Resources Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Resources</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="group p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <span className="text-lg">📚</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Documentation</h3>
            </div>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://developers.google.com/community" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title="Google Developers"
                >
                  <span className="text-xs">•</span>
                  Google Developers
                </a>
              </li>
              <li>
                <a 
                  href="https://developer.mozilla.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title="MDN Web Docs"
                >
                  <span className="text-xs">•</span>
                  MDN Web Docs
                </a>
              </li>
            </ul>
          </div>
          
          <div className="group p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <span className="text-lg">🎓</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Learning</h3>
            </div>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://web.dev/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title="Web.dev"
                >
                  <span className="text-xs">•</span>
                  Web.dev
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/topics/artificial-intelligence" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title="GitHub AI"
                >
                  <span className="text-xs">•</span>
                  GitHub AI
                </a>
              </li>
            </ul>
          </div>

          <div className="group p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <span className="text-lg">🔔</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Stay Updated</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Access curated resources to stay ahead with the latest in AI, web development, and technology trends.
            </p>
          </div>
        </div>
      </section>
    </section>
  )
}
