import Link from 'next/link'
import { formatDate, getBlogPosts } from 'app/blog/utils'
import { memo } from 'react'

export const BlogPosts = memo(function BlogPosts() {
  let allBlogs = getBlogPosts()

  const truncateSummary = (summary: string, maxLength: number = 160) => {
    if (summary.length <= maxLength) return summary
    return summary.slice(0, maxLength).replace(/\s+\S*$/, '') + '...'
  }

  return (
    <div className="space-y-6">
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
          ) {
            return -1
          }
          return 1
        })
        .map((post) => (
          <article
            key={post.slug}
            className="group relative p-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300 hover:shadow-xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
            <Link
              href={`/blog/${post.slug}`}
              className="block relative"
              title={`${post.metadata.title} - ${truncateSummary(post.metadata.summary || 'Read this technical article', 80)}`}
            >
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">
                    {post.metadata.title}
                  </h2>
                  <time 
                    className="text-gray-500 dark:text-gray-400 text-sm font-medium tabular-nums shrink-0 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full"
                    dateTime={post.metadata.publishedAt}
                  >
                    {formatDate(post.metadata.publishedAt, false)}
                  </time>
                </div>
                
                {post.metadata.summary && (
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                    {truncateSummary(post.metadata.summary)}
                  </p>
                )}
                
                <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-semibold group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                  Read article
                  <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          </article>
        ))}
    </div>
  )
})
