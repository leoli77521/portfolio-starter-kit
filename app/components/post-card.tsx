'use client'

import Link from 'next/link'
import { formatDate, truncateSummary } from '@/app/lib/formatters'
import { getCategoryColor, getCategoryEmoji } from '@/app/lib/categories'

interface PostCardProps {
  post: {
    slug: string
    metadata: {
      title: string
      publishedAt: string
      summary?: string
      category?: string
    }
    readingTime?: number
  }
}

export function PostCard({ post }: PostCardProps) {
  const categoryBadge = getCategoryBadgeStyles(post.metadata.category || 'All')
  const readingTime = post.readingTime || 1

  return (
    <article
      className="group relative p-8 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300 hover:shadow-xl overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-full blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
      <Link
        href={`/blog/${post.slug}`}
        className="block relative"
        title={`${post.metadata.title} - ${truncateSummary(post.metadata.summary || 'Read this technical article', 80)}`}
      >
        <div className="flex flex-col space-y-4">
          {/* Category Badge and Reading Time */}
          <div className="flex items-center gap-3 flex-wrap">
            {post.metadata.category && (
              <span className={`
                px-3 py-1 rounded-full text-xs font-semibold border
                flex items-center gap-1.5
                ${categoryBadge.className}
              `}>
                <span>{categoryBadge.emoji}</span>
                {post.metadata.category}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {readingTime} min read
            </span>
          </div>

          {/* Title and Date */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">
              {post.metadata.title}
            </h2>
            <time
              className="text-gray-500 dark:text-gray-400 text-sm font-medium tabular-nums shrink-0 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full"
              dateTime={post.metadata.publishedAt}
            >
              {formatDate(post.metadata.publishedAt)}
            </time>
          </div>

          {/* Summary */}
          {post.metadata.summary && (
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
              {truncateSummary(post.metadata.summary)}
            </p>
          )}

          {/* Read More Link */}
          <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-semibold group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
            Read article
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </Link>
    </article>
  )
}

function getCategoryBadgeStyles(category: string) {
  const color = getCategoryColor(category)
  const emoji = getCategoryEmoji(category)

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800',
    gray: 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-400 border-gray-200 dark:border-gray-700',
  }

  return {
    className: colorClasses[color as keyof typeof colorClasses] || colorClasses.gray,
    emoji,
  }
}
