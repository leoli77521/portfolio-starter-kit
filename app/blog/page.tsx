import { BlogPosts } from 'app/components/posts'
import type { Metadata } from 'next'
import { baseUrl } from 'app/sitemap'

export const metadata: Metadata = {
  title: 'Tech Blog - AI Insights & Programming Tutorials',
  description: 'Browse our comprehensive collection of AI guides, SEO strategies, and programming tutorials. Find actionable insights to advance your tech career.',
  keywords: ['technology blog', 'AI artificial intelligence', 'SEO optimization tips', 'web development', 'frontend technology', 'programming learning', 'tech sharing'],
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
  openGraph: {
    title: 'Tech Blog - AI Insights & Programming Tutorials',
    description: 'Browse our comprehensive collection of AI guides, SEO strategies, and programming tutorials. Find actionable insights to advance your tech career.',
    url: `${baseUrl}/blog`,
    type: 'website',
  },
}

export default function Page() {
  return (
    <section className="max-w-6xl mx-auto">
      {/* Breadcrumb navigation */}
      <nav className="mb-8 text-sm" aria-label="Breadcrumb navigation">
        <ol className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
          <li>
            <a href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" title="ToLearn Blog Homepage">
              Home
            </a>
          </li>
          <li className="text-gray-400 dark:text-gray-600">/</li>
          <li className="text-gray-900 dark:text-gray-100 font-medium">Tech Blog</li>
        </ol>
      </nav>
      
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'ToLearn Technology Blog',
            description: 'Browse our comprehensive collection of AI guides, SEO strategies, and programming tutorials. Find actionable insights to advance your tech career.',
            url: `${baseUrl}/blog`,
            author: {
              '@type': 'Person',
              name: 'ToLearn Blog',
              url: baseUrl
            },
            publisher: {
              '@type': 'Organization',
              name: 'ToLearn Blog',
              logo: {
                '@type': 'ImageObject',
                url: `${baseUrl}/logo.png`,
                width: 150,
                height: 150
              }
            },
            inLanguage: 'en-US',
            keywords: ['technology blog', 'AI artificial intelligence', 'SEO optimization', 'web development', 'programming technology', 'frontend development']
          }),
        }}
      />
      {/* Page Header */}
      <div className="mb-12 pb-8 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
          Tech Blog
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
          Explore cutting-edge insights on AI, programming, and web development. 
          Stay ahead with our expert tutorials and industry analysis.
        </p>
      </div>
      
      {/* Blog Posts Grid */}
      <div className="grid gap-8">
        <BlogPosts />
      </div>
    </section>
  )
}
