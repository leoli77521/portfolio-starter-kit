import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { formatDate, getBlogPosts } from 'app/blog/utils'
import { baseUrl } from 'app/sitemap'
import { RelatedPosts } from 'app/components/related-posts'

export async function generateStaticParams() {
  let posts = getBlogPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export function generateMetadata({ params }): Metadata {
  const allPosts = getBlogPosts()
  
  // 首先尝试直接匹配
  let post = allPosts.find((post) => post.slug === params.slug)
  
  // 如果直接匹配失败，尝试解码后匹配
  if (!post) {
    try {
      const decodedSlug = decodeURIComponent(params.slug)
      post = allPosts.find((post) => post.slug === decodedSlug)
    } catch (e) {
      // 解码失败，保持 post 为 undefined
    }
  }
  
  if (!post) {
    return {}
  }

  let {
    title,
    publishedAt: publishedTime,
    summary: description,
    image,
  } = post.metadata
  let ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  // 使用一致的URL结构，不使用双重编码
  const cleanSlug = post.slug

  return {
    title: `${title} - SEO优化技巧与策略分享`,
    description: `${description} - ToLearn博客专业分享编程技术、AI洞察与SEO优化策略。`,
    authors: [{ name: 'ToLearn Blog' }],
    creator: 'ToLearn Blog',
    publisher: 'ToLearn Blog',
    category: '技术文章',
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      modifiedTime: publishedTime,
      authors: ['ToLearn Blog'],
      section: '技术文章',
      url: `${baseUrl}/blog/${cleanSlug}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: '@tolearn_blog',
    },
    alternates: {
      canonical: `${baseUrl}/blog/${cleanSlug}`,
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default function Blog({ params }) {
  const allPosts = getBlogPosts()
  
  // 首先尝试直接匹配
  let post = allPosts.find((post) => post.slug === params.slug)
  
  // 如果直接匹配失败，尝试解码后匹配
  if (!post) {
    try {
      const decodedSlug = decodeURIComponent(params.slug)
      post = allPosts.find((post) => post.slug === decodedSlug)
    } catch (e) {
      // 解码失败，保持 post 为 undefined
    }
  }

  if (!post) {
    notFound()
  }

  const cleanSlug = post.slug

  // 准备相关文章数据
  const relatedPostsData = allPosts.map(p => ({
    slug: p.slug,
    title: p.metadata.title,
    summary: p.metadata.summary,
    category: p.metadata.category
  }))

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            description: post.metadata.summary,
            image: {
              '@type': 'ImageObject',
              url: post.metadata.image
                ? `${baseUrl}${post.metadata.image}`
                : `${baseUrl}/og?title=${encodeURIComponent(post.metadata.title)}`,
              width: 1200,
              height: 630
            },
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            author: {
              '@type': 'Person',
              name: 'ToLearn Blog',
              url: baseUrl,
              sameAs: [baseUrl]
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
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${baseUrl}/blog/${cleanSlug}`
            },
            url: `${baseUrl}/blog/${cleanSlug}`,
            wordCount: post.content.split(' ').length,
            keywords: ['编程技术', 'AI人工智能', 'SEO优化', 'Web开发', '技术分享'],
            articleSection: '技术文章',
            inLanguage: 'en-US'
          }),
        }}
      />
      
      {/* 面包屑导航 */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400">
          <li><a href="/" className="hover:text-blue-600 dark:hover:text-blue-400">首页</a></li>
          <li>/</li>
          <li><a href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400">技术博客</a></li>
          <li>/</li>
          <li className="text-neutral-900 dark:text-neutral-100">{post.metadata.title}</li>
        </ol>
      </nav>

      <h1 className="title font-semibold text-2xl tracking-tighter">
        {post.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {formatDate(post.metadata.publishedAt)}
        </p>
        {post.metadata.category && (
          <span className="inline-block px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
            {post.metadata.category}
          </span>
        )}
      </div>
      <article className="prose">
        <CustomMDX source={post.content} />
      </article>

      {/* 相关文章推荐 */}
      <RelatedPosts currentSlug={cleanSlug} posts={relatedPostsData} />
    </section>
  )
}
