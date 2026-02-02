import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getBlogPosts, formatDate } from 'app/blog/utils'

const categoryColors: Record<string, { bg: string; text: string }> = {
  'AI Technology': { bg: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-700 dark:text-indigo-300' },
  'Web Development': { bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-300' },
  'SEO & Marketing': { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-300' },
  'Programming': { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-700 dark:text-blue-300' },
  'Productivity': { bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-700 dark:text-purple-300' },
  'Technology': { bg: 'bg-cyan-100 dark:bg-cyan-900/40', text: 'text-cyan-700 dark:text-cyan-300' },
}

function getCategoryStyle(category: string | undefined) {
  if (!category) return categoryColors['AI Technology']
  return categoryColors[category] || categoryColors['AI Technology']
}

export function LatestPostsList({
  limit = 5,
  skipFirst = 3
}: {
  limit?: number
  skipFirst?: number
}) {
  const posts = getBlogPosts()
    .sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime())
    .slice(skipFirst, skipFirst + limit)

  if (posts.length === 0) return null

  return (
    <section className="py-16 md:py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-10">
        Latest Posts
      </h2>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden divide-y divide-gray-100 dark:divide-slate-800">
        {posts.map((post) => {
          const categoryStyle = getCategoryStyle(post.metadata.category)

          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex items-center justify-between p-5 md:p-6 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-4 md:gap-6 flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                  {post.metadata.title}
                </h3>
                <span className={`hidden sm:inline-block shrink-0 px-2.5 py-1 rounded text-xs font-semibold ${categoryStyle.bg} ${categoryStyle.text}`}>
                  {post.metadata.category || 'Article'}
                </span>
              </div>

              <div className="flex items-center gap-4 md:gap-6 shrink-0 ml-4">
                <time
                  dateTime={post.metadata.publishedAt}
                  className="hidden md:block text-sm text-gray-500 dark:text-gray-500"
                >
                  {formatDate(post.metadata.publishedAt, false)}
                </time>
                <ArrowRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-medium hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
        >
          View all posts
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
