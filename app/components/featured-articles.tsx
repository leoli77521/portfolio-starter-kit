import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Clock } from 'lucide-react'
import { getBlogPosts, calculateReadingTime, formatDate } from 'app/blog/utils'

const categoryColors: Record<string, { bg: string; text: string }> = {
  'AI Technology': { bg: 'bg-indigo-100 dark:bg-indigo-950/50', text: 'text-indigo-700 dark:text-indigo-300' },
  'Web Development': { bg: 'bg-emerald-100 dark:bg-emerald-950/50', text: 'text-emerald-700 dark:text-emerald-300' },
  'SEO & Marketing': { bg: 'bg-amber-100 dark:bg-amber-950/50', text: 'text-amber-700 dark:text-amber-300' },
  'Programming': { bg: 'bg-blue-100 dark:bg-blue-950/50', text: 'text-blue-700 dark:text-blue-300' },
  'Productivity': { bg: 'bg-purple-100 dark:bg-purple-950/50', text: 'text-purple-700 dark:text-purple-300' },
}

function getCategoryStyle(category: string | undefined) {
  if (!category) return categoryColors['AI Technology']
  return categoryColors[category] || categoryColors['AI Technology']
}

export function FeaturedArticles({ limit = 3 }: { limit?: number }) {
  const posts = getBlogPosts()
    .sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime())
    .slice(0, limit)

  return (
    <section className="py-16 md:py-20">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Featured Articles
        </h2>
        <Link
          href="/blog"
          className="hidden sm:flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group"
        >
          View all
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const categoryStyle = getCategoryStyle(post.metadata.category)
          const readingTime = calculateReadingTime(post.content)

          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-xl transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 overflow-hidden">
                {post.metadata.image ? (
                  <Image
                    src={post.metadata.image}
                    alt={post.metadata.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                      <span className="text-2xl text-white">
                        {post.metadata.category === 'AI Technology' ? '🤖' :
                         post.metadata.category === 'Web Development' ? '💻' :
                         post.metadata.category === 'SEO & Marketing' ? '📈' : '📝'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-6">
                {/* Category Tag */}
                <div className="mb-3">
                  <span className={`inline-block px-3 py-1 rounded-md text-xs font-semibold ${categoryStyle.bg} ${categoryStyle.text}`}>
                    {post.metadata.category || 'Article'}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {post.metadata.title}
                </h3>

                {/* Summary */}
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                  {post.metadata.summary}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                  <time dateTime={post.metadata.publishedAt}>
                    {formatDate(post.metadata.publishedAt, false)}
                  </time>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {readingTime} min read
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Mobile View All Link */}
      <div className="mt-8 text-center sm:hidden">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium"
        >
          View all articles
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
