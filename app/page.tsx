import { BlogPosts } from 'app/components/posts'
import { baseUrl } from './sitemap'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'ToLearn Blog - 专业技术博客首页',
  description: 'ToLearn专业技术博客，专注分享AI人工智能、SEO优化策略、Web开发最佳实践。深度技术文章，助力开发者成长。',
  keywords: ['技术博客', 'AI人工智能', 'SEO优化', 'Web开发', '编程技术', '前端开发'],
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: 'ToLearn Blog - 专业技术博客首页',
    description: 'ToLearn专业技术博客，专注分享AI人工智能、SEO优化策略、Web开发最佳实践。深度技术文章，助力开发者成长。',
    url: baseUrl,
    type: 'website',
  },
}

export default function Page() {
  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'ToLearn Blog',
            description: '专业技术博客，专注分享AI人工智能、SEO优化策略、Web开发最佳实践。',
            url: baseUrl,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${baseUrl}/search?q={search_term_string}`,
              'query-input': 'required name=search_term_string'
            },
            mainEntity: {
              '@type': 'Blog',
              name: 'ToLearn技术博客',
              description: '深度技术文章，助力开发者成长',
              url: `${baseUrl}/blog`
            }
          }),
        }}
      />
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        ToLearn Blog - 专业技术分享
      </h1>
      <p className="mb-6 text-neutral-700 dark:text-neutral-300">
        欢迎来到ToLearn技术博客！我们专注于分享前沿的编程技术、AI人工智能洞察和Web开发最佳实践。
        无论您是初学者还是资深开发者，这里都有适合您的深度技术内容。
      </p>

      {/* 热门文章推荐区域 */}
      <div className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">热门技术文章</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Link 
            href="/blog/seo-optimization-guide"
            className="block p-4 bg-white dark:bg-neutral-800 rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium text-blue-600 dark:text-blue-400 mb-2">
              SEO部署初学者指南：网站优化的完整步骤
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              学习如何为您的网站部署有效的SEO策略，从技术设置到内容优化等方面的专业指导。
            </p>
          </Link>
          
          <Link 
            href="/blog/ai-revolution-finance"
            className="block p-4 bg-white dark:bg-neutral-800 rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium text-blue-600 dark:text-blue-400 mb-2">
              AI金融革命：人工智能如何改变您的钱包
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              探索人工智能在金融领域的应用，从资金安全到投资便利化，用通俗易懂的语言为您详细解读。
            </p>
          </Link>
        </div>
        
        <div className="mt-4 text-center">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            查看所有技术文章 →
          </Link>
        </div>
      </div>

      {/* 最新文章列表 */}
      <div className="my-8">
        <h2 className="text-xl font-semibold mb-6 text-neutral-900 dark:text-neutral-100">最新技术文章</h2>
        <BlogPosts />
      </div>
    </section>
  )
}
