import Link from 'next/link'
import type { Metadata } from 'next'
import { getBlogPosts } from 'app/blog/utils'
import { getCategorySlug } from 'app/lib/categories'
import { baseUrl } from 'app/sitemap'

export const metadata: Metadata = {
  title: 'Categories - ToLearn Blog',
  description: 'Browse articles by category - AI Technology, Programming, SEO & Marketing, and more.',
  alternates: {
    canonical: `${baseUrl}/categories`,
  },
}

export default function CategoriesPage() {
  const allPosts = getBlogPosts()

  // 统计每个分类的文章数量
  const categoryCounts = allPosts.reduce((acc, post) => {
    const category = post.metadata.category || 'Uncategorized'
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // 定义分类图标和颜色
  const categoryInfo: Record<string, { icon: string; color: string; description: string }> = {
    'AI Technology': {
      icon: '🤖',
      color: 'from-blue-500 to-indigo-600',
      description: 'Artificial Intelligence, Machine Learning, and AI Development',
    },
    'Programming': {
      icon: '💻',
      color: 'from-green-500 to-emerald-600',
      description: 'Software Development, Coding Tutorials, and Best Practices',
    },
    'SEO & Marketing': {
      icon: '📈',
      color: 'from-purple-500 to-pink-600',
      description: 'Search Engine Optimization, Digital Marketing, and Growth Strategies',
    },
    'Web Development': {
      icon: '🌐',
      color: 'from-orange-500 to-red-600',
      description: 'Frontend, Backend, and Full-Stack Web Development',
    },
    'Uncategorized': {
      icon: '📁',
      color: 'from-gray-500 to-gray-600',
      description: 'Miscellaneous articles and resources',
    },
  }

  const categories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])

  return (
    <section>
      <h1 className="mb-4 text-4xl font-black tracking-tight text-gray-900 dark:text-gray-100">
        Categories
      </h1>
      <p className="mb-12 text-lg text-gray-600 dark:text-gray-400">
        Explore articles organized by topic. Find content that interests you most.
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map(([category, count]) => {
          const info = categoryInfo[category] || categoryInfo['Uncategorized']
          return (
            <Link
              key={category}
              href={`/categories/${getCategorySlug(category)}`}
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-transparent"
            >
              {/* 渐变背景 */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              {/* 内容 */}
              <div className="relative">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-5xl" aria-hidden="true">
                    {info.icon}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-lg font-bold text-gray-700 dark:text-gray-300 group-hover:bg-white dark:group-hover:bg-gray-600 transition-colors duration-300">
                    {count}
                  </span>
                </div>

                <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 dark:group-hover:from-indigo-400 dark:group-hover:to-purple-400 transition-all duration-300">
                  {category}
                </h2>

                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {info.description}
                </p>

                <div className="mt-4 flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                  View {count} {count === 1 ? 'article' : 'articles'}
                  <svg
                    className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          )
        })}
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
