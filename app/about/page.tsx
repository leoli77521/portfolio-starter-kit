import Link from 'next/link'

export const metadata = {
  title: 'About - ToLearn Blog',
  description: 'Learn about ToLearn Blog - your source for AI technology insights, programming tutorials, and SEO optimization guides.',
}

export default function AboutPage() {
  return (
    <section>
      <h1 className="mb-4 text-4xl font-black tracking-tight text-gray-900 dark:text-gray-100">
        About ToLearn Blog
      </h1>
      <p className="mb-12 text-lg text-gray-600 dark:text-gray-400">
        Your trusted source for AI insights, programming tutorials, and digital innovation.
      </p>

      {/* 简介 */}
      <div className="mb-12 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 p-8">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Our Mission
        </h2>
        <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
          ToLearn Blog is dedicated to exploring the frontiers of AI, programming, and modern web development.
          We provide in-depth articles, practical tutorials, and industry insights to help developers,
          entrepreneurs, and tech enthusiasts stay ahead in the rapidly evolving digital landscape.
        </p>
      </div>

      {/* 核心主题 */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
          What We Cover
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="mb-4 text-4xl">🤖</div>
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
              AI Technology
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Cutting-edge AI developments, machine learning insights, and practical AI applications
              for developers and businesses.
            </p>
          </div>

          <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="mb-4 text-4xl">💻</div>
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
              Programming
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Clean code practices, development tutorials, framework guides, and software engineering
              best practices.
            </p>
          </div>

          <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="mb-4 text-4xl">📈</div>
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
              SEO & Marketing
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Search engine optimization strategies, digital marketing insights, and growth hacking
              techniques for online success.
            </p>
          </div>
        </div>
      </div>

      {/* 价值观 */}
      <div className="mb-12 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Our Values
        </h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
              ✓
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Quality Over Quantity
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We prioritize in-depth, well-researched content that provides real value to our readers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
              ✓
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Practical & Actionable
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Every article includes practical examples, code snippets, and actionable insights you can implement immediately.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
              ✓
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Stay Current
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We keep our finger on the pulse of technology, covering the latest developments and emerging trends.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
              ✓
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Community-Focused
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We're building a community of learners, sharing knowledge and growing together.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 统计数据 */}
      <div className="mb-12 grid gap-6 sm:grid-cols-3">
        <div className="text-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 p-6">
          <div className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-2">
            50+
          </div>
          <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
            In-Depth Articles
          </div>
        </div>

        <div className="text-center rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 p-6">
          <div className="text-4xl font-black text-purple-600 dark:text-purple-400 mb-2">
            15+
          </div>
          <div className="text-sm font-medium text-purple-700 dark:text-purple-300">
            Topics Covered
          </div>
        </div>

        <div className="text-center rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 p-6">
          <div className="text-4xl font-black text-green-600 dark:text-green-400 mb-2">
            100%
          </div>
          <div className="text-sm font-medium text-green-700 dark:text-green-300">
            Free Content
          </div>
        </div>
      </div>

      {/* 技术栈 */}
      <div className="mb-12 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Built With
        </h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          This blog is built with modern web technologies to ensure fast performance,
          excellent SEO, and a great user experience:
        </p>
        <div className="flex flex-wrap gap-3">
          {[
            'Next.js 14',
            'React 18',
            'TypeScript',
            'Tailwind CSS',
            'MDX',
            'Vercel',
          ].map((tech) => (
            <span
              key={tech}
              className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 p-12">
        <h2 className="mb-4 text-3xl font-bold text-white">
          Ready to Start Learning?
        </h2>
        <p className="mb-6 text-lg text-indigo-100">
          Explore our latest articles and join our growing community of tech enthusiasts.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-indigo-600 font-bold hover:bg-gray-100 transition-all duration-200 hover:scale-105 hover:shadow-xl"
        >
          Browse All Articles
          <svg
            className="w-5 h-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
