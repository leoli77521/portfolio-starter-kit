import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { TableOfContents } from 'app/components/toc'
import { formatDate, getBlogPosts, resolveBlogSlug, getHeadings } from 'app/blog/utils'
import { baseUrl } from 'app/sitemap'
import { RelatedPosts } from 'app/components/related-posts'
import { SocialShare } from 'app/components/SocialShare'
import { InArticleAd } from 'app/components/AdUnit'

export async function generateStaticParams() {
  let posts = getBlogPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export function generateMetadata({ params }): Metadata {
  const allPosts = getBlogPosts()
  const requestedSlug = params.slug
  const normalizedSlug = resolveBlogSlug(requestedSlug)

  // 标准化 slug，兼容旧的 /blog/SEO 等链接
  let post = allPosts.find((post) => post.slug === normalizedSlug)

  if (!post) {
    try {
      const decodedSlug = decodeURIComponent(requestedSlug)
      const decodedNormalizedSlug = resolveBlogSlug(decodedSlug)
      post = allPosts.find((post) => post.slug === decodedNormalizedSlug)
    } catch (e) {
      // 解码失败，保留 post 为 undefined
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
  const ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  // 使用一致的URL结构，确保canonical URL使用标准化的slug
  const cleanSlug = post.slug
  const canonicalUrl = `${baseUrl}/blog/${cleanSlug}`

  // Create category-specific Meta description with proper length control
  const getCategorySpecificDescription = (category, summary) => {
    // 确保 summary 存在
    if (!summary || typeof summary !== 'string') {
      summary = 'Professional technology insights and practical solutions.'
    }

    const suffixes = {
      'ai technology': ' | Expert AI insights and practical implementation strategies.',
      'ai & seo': ' | Expert AI insights and practical implementation strategies.',
      'seo optimization': ' | Proven SEO techniques and ranking improvement strategies.',
      'programming': ' | In-depth programming tutorials and development best practices.',
      'web development': ' | In-depth programming tutorials and development best practices.'
    }

    const suffix = suffixes[category?.toLowerCase()] || ' | Professional tech insights and optimization strategies.'
    const maxSummaryLength = 160 - suffix.length

    const truncatedSummary = summary.length > maxSummaryLength
      ? summary.substring(0, maxSummaryLength - 3) + '...'
      : summary

    return truncatedSummary + suffix
  }

  const optimizedDescription = getCategorySpecificDescription(post.metadata.category, description)

  // Optimize title length for SEO (50-60 chars)
  const getOptimizedTitle = (originalTitle) => {
    // 确保 title 存在
    if (!originalTitle || typeof originalTitle !== 'string') {
      originalTitle = 'Tech Article'
    }

    const suffix = ' | ToLearn Blog'
    const maxLength = 60 - suffix.length // 46 chars for main title

    if (originalTitle.length <= maxLength) {
      return `${originalTitle}${suffix}`
    }

    // Smart truncation at word boundaries
    const truncated = originalTitle.substring(0, maxLength)
    const lastSpace = truncated.lastIndexOf(' ')
    const finalTitle = lastSpace > 30 ? truncated.substring(0, lastSpace) : truncated

    return `${finalTitle}${suffix}`
  }

  return {
    title: getOptimizedTitle(title),
    description: optimizedDescription,
    authors: [{ name: 'ToLearn Blog' }],
    creator: 'ToLearn Blog',
    publisher: 'ToLearn Blog',
    category: 'Technology Articles',
    openGraph: {
      title,
      description: optimizedDescription,
      type: 'article',
      publishedTime,
      modifiedTime: publishedTime,
      authors: ['ToLearn Blog'],
      section: 'Technology Articles',
      url: canonicalUrl,
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
      description: optimizedDescription,
      images: [ogImage],
      creator: '@tolearn_blog',
    },
    alternates: {
      canonical: canonicalUrl,
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
  const requestedSlug = params.slug
  const normalizedSlug = resolveBlogSlug(requestedSlug)

  // 标准化 slug，兼容旧的 /blog/SEO 等链接
  let post = allPosts.find((post) => post.slug === normalizedSlug)

  if (post && requestedSlug !== post.slug) {
    redirect(`/blog/${post.slug}`)
  }

  if (!post) {
    try {
      const decodedSlug = decodeURIComponent(requestedSlug)
      const decodedNormalizedSlug = resolveBlogSlug(decodedSlug)
      post = allPosts.find((post) => post.slug === decodedNormalizedSlug)

      if (post && requestedSlug !== post.slug) {
        redirect(`/blog/${post.slug}`)
      }
    } catch (e) {
      // 解码失败，保留 post 为 undefined
    }
  }

  if (!post) {
    notFound()
  }

  const cleanSlug = post.slug
  const headings = getHeadings(post.content)

  // 准备相关文章数据
  const relatedPostsData = allPosts.map(p => ({
    slug: p.slug,
    title: p.metadata.title || 'Untitled',
    summary: p.metadata.summary || 'No summary available',
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
            keywords: ['programming technology', 'AI artificial intelligence', 'SEO optimization', 'web development', 'tech sharing'],
            articleSection: 'Technology Articles',
            inLanguage: 'en-US'
          }),
        }}
      />

      {/* Breadcrumb navigation */}
      <nav className="mb-6 text-sm" aria-label="Breadcrumb navigation">
        <ol className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400">
          <li><a href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</a></li>
          <li>/</li>
          <li><a href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400">Tech Blog</a></li>
          <li>/</li>
          <li className="text-neutral-900 dark:text-neutral-100 truncate max-w-xs" title={post.metadata.title}>
            {post.metadata.title}
          </li>
        </ol>
      </nav>

      <h1 className="title font-semibold text-2xl tracking-tighter mb-2 text-neutral-900 dark:text-neutral-100">
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

      <div className="flex gap-12">
        {/* Main Content */}
        <article className="prose flex-1 min-w-0">
          <CustomMDX source={post.content} />

          {/* Google AdSense - 文章底部广告 */}
          <div className="mt-8">
            <InArticleAd slot="YOUR_AD_SLOT_ID" />
          </div>

          {/* Social Share Component */}
          <div className="mt-8">
            <SocialShare
              title={post.metadata.title}
              url={`${baseUrl}/blog/${cleanSlug}`}
              summary={post.metadata.summary}
            />
          </div>
        </article>

        {/* Sidebar Table of Contents */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <TableOfContents headings={headings} />
          </div>
        </aside>
      </div>

      {/* Related articles recommendation */}
      <div className="mt-16">
        <RelatedPosts currentSlug={cleanSlug} posts={relatedPostsData} />
      </div>
    </section>
  )
}
