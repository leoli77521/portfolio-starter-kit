import Link from 'next/link'
import { formatDate, getBlogPosts } from 'app/blog/utils'

export function BlogPosts() {
  let allBlogs = getBlogPosts()

  const truncateSummary = (summary: string, maxLength: number = 160) => {
    if (summary.length <= maxLength) return summary
    return summary.slice(0, maxLength).replace(/\s+\S*$/, '') + '...'
  }

  return (
    <div>
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
            className="mb-8 p-4 -mx-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            <Link
              href={`/blog/${post.slug}`}
              className="block group"
            >
              <div className="flex flex-col space-y-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.metadata.title}
                  </h2>
                  <time 
                    className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base tabular-nums shrink-0"
                    dateTime={post.metadata.publishedAt}
                  >
                    {formatDate(post.metadata.publishedAt, false)}
                  </time>
                </div>
                
                {post.metadata.summary && (
                  <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
                    {truncateSummary(post.metadata.summary)}
                  </p>
                )}
                
                <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                  Read more →
                </div>
              </div>
            </Link>
          </article>
        ))}
    </div>
  )
}
