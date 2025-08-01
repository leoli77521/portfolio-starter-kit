import { BlogPosts } from 'app/components/posts'
import type { Metadata } from 'next'
import { baseUrl } from 'app/sitemap'

export const metadata: Metadata = {
  title: 'ToLearn博客 - 前沿技术分享与洞察',
  description: '专业的编程技术博客，分享AI人工智能、SEO优化、Web开发最佳实践。深度技术文章，助力开发者提升技能与认知。',
  keywords: ['技术博客', 'AI人工智能', 'SEO优化技巧', 'Web开发', '前端技术', '编程学习', '技术分享'],
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
  openGraph: {
    title: 'ToLearn博客 - 前沿技术分享与洞察',
    description: '专业的编程技术博客，分享AI人工智能、SEO优化、Web开发最佳实践。深度技术文章，助力开发者提升技能与认知。',
    url: `${baseUrl}/blog`,
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
            '@type': 'Blog',
            name: 'ToLearn技术博客',
            description: '专业的编程技术博客，分享AI人工智能、SEO优化、Web开发最佳实践。深度技术文章，助力开发者提升技能与认知。',
            url: `${baseUrl}/blog`,
            author: {
              '@type': 'Person',
              name: 'ToLearn Blog',
              url: baseUrl
            },
            publisher: {
              '@type': 'Organization',
              name: 'ToLearn Blog',
              logo: {
                '@type': 'ImageObject',
                url: `${baseUrl}/logo.png`,
                width: 150,
                height: 150
              }
            },
            inLanguage: 'en-US',
            keywords: ['技术博客', 'AI人工智能', 'SEO优化', 'Web开发', '编程技术', '前端开发']
          }),
        }}
      />
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">ToLearn 技术博客</h1>
      <BlogPosts />
    </section>
  )
}
