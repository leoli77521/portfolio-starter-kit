import Link from 'next/link'
import type { Metadata } from 'next'
import { getBlogPosts } from 'app/blog/utils'
import { slugify } from '@/app/lib/formatters'
import { baseUrl } from 'app/sitemap'

export const metadata: Metadata = {
  title: 'Tags - ToLearn Blog',
  description: 'Browse articles by tags - AI, Programming, SEO, Machine Learning, and more.',
  alternates: {
    canonical: `${baseUrl}/tags`,
  },
}

const toTagSlug = (tag: string) => {
  const slug = slugify(tag)
  return slug || tag.trim().toLowerCase().replace(/\s+/g, '-')
}

export default function TagsPage() {
  const allPosts = getBlogPosts()

  // 统计每个标签的文章数量
  const tagCounts = allPosts.reduce((acc, post) => {
    const tags = post.metadata.tags || []
    tags.forEach((tag) => {
      acc[tag] = (acc[tag] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  // 按文章数量排序
  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])

  // 定义标签大小（基于文章数量）
  const getTagSize = (count: number) => {
    if (count >= 10) return 'text-2xl'
    if (count >= 5) return 'text-xl'
    if (count >= 3) return 'text-lg'
    return 'text-base'
  }

  const getTagColor = (index: number) => {
    const colors = [
      'from-blue-500 to-indigo-600',
      'from-purple-500 to-pink-600',
      'from-green-500 to-emerald-600',
      'from-orange-500 to-red-600',
      'from-cyan-500 to-blue-600',
      'from-pink-500 to-rose-600',
      'from-yellow-500 to-orange-600',
      'from-indigo-500 to-purple-600',
    ]
    return colors[index % colors.length]
  }

  return (
    <section>
      <h1 className="mb-4 text-4xl font-black tracking-tight text-gray-900 dark:text-gray-100">
        Tags
      </h1>
      <p className="mb-12 text-lg text-gray-600 dark:text-gray-400">
        Discover articles by tags. Click on any tag to explore related content.
      </p>

      {/* 标签统计 */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 p-6">
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
            {sortedTags.length}
          </div>
          <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Total Tags
          </div>
        </div>
        <div className="rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 p-6">
          <div className="text-3xl font-black text-purple-600 dark:text-purple-400">
            {allPosts.length}
          </div>
          <div className="text-sm font-medium text-purple-700 dark:text-purple-300">
            Total Articles
          </div>
        </div>
        <div className="rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 p-6">
          <div className="text-3xl font-black text-green-600 dark:text-green-400">
            {sortedTags[0]?.[1] || 0}
          </div>
          <div className="text-sm font-medium text-green-700 dark:text-green-300">
            Most Used Tag
          </div>
        </div>
      </div>

      {/* 标签云 */}
      <div className="mb-12 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Tag Cloud
        </h2>
        <div className="flex flex-wrap gap-3">
          {sortedTags.map(([tag, count], index) => (
            <Link
              key={tag}
              href={`/tags/${toTagSlug(tag)}`}
              className={`group relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getTagColor(
                index
              )} text-white font-semibold ${getTagSize(
                count
              )} hover:scale-110 hover:shadow-lg transition-all duration-200`}
              title={`${count} ${count === 1 ? 'article' : 'articles'}`}
            >
              <span>{tag}</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
                {count}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 标签列表 */}
      <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
          All Tags
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedTags.map(([tag, count], index) => (
            <Link
              key={tag}
              href={`/tags/${toTagSlug(tag)}`}
              className="group flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 transition-all duration-200 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md hover:scale-105"
            >
              <span className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                {tag}
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                {count}
                <svg
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* 返回链接 */}
      <div className="mt-12 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all duration-200 hover:scale-105 hover:shadow-lg"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
          Back to All Articles
        </Link>
      </div>
    </section>
  )
}
