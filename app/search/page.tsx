import { getBlogPosts, formatDate } from 'app/blog/utils'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search Results',
  description: 'Search results for ToLearn Blog articles.',
  robots: {
    index: false,
    follow: true,
  }
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const q = typeof searchParams.q === 'string' ? searchParams.q : ''
  const posts = getBlogPosts()

  const filteredPosts = posts.filter((post) => {
    if (!q) return false
    const searchContent = `${post.metadata.title} ${post.metadata.summary} ${post.content}`.toLowerCase()
    return searchContent.includes(q.toLowerCase())
  })

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Search Results
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Showing results for <span className="font-semibold">"{q}"</span>
        </p>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="group relative p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg overflow-hidden"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="block relative"
              >
                <div className="flex flex-col space-y-3">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.metadata.title}
                    </h2>
                    <time 
                      className="text-gray-500 dark:text-gray-400 text-sm font-medium tabular-nums shrink-0"
                      dateTime={post.metadata.publishedAt}
                    >
                      {formatDate(post.metadata.publishedAt, false)}
                    </time>
                  </div>
                  
                  {post.metadata.summary && (
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm line-clamp-2">
                      {post.metadata.summary}
                    </p>
                  )}
                  
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                    Read article
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">{'->'}</span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No articles found matching your query.</p>
          <Link 
            href="/blog" 
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Browse all articles {'->'}
          </Link>
        </div>
      )}
    </section>
  )
}

