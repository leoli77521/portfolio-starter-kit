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
    <section>
      {/* Breadcrumb navigation */}
      <nav className="mb-6 text-sm" aria-label="Breadcrumb navigation">
        <ol className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400">
          <li><a href="/" className="hover:text-blue-600 dark:hover:text-blue-400" title="ToLearn Blog Homepage - AI Tech Hub & Programming Tutorials">Home</a></li>
          <li>/</li>
          <li className="text-neutral-900 dark:text-neutral-100">Tech Blog</li>
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
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">ToLearn Technology Blog</h1>
      <BlogPosts />
    </section>
  )
}
