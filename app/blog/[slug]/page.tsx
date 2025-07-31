import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { formatDate, getBlogPosts } from 'app/blog/utils'
import { baseUrl } from 'app/sitemap'

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

  const encodedSlug = encodeURIComponent(post.slug)

  return {
    title,
    description,
    authors: [{ name: 'Vim Enthusiast Portfolio' }],
    creator: 'Vim Enthusiast Portfolio',
    publisher: 'Vim Enthusiast Portfolio',
    category: 'technology',
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      modifiedTime: publishedTime,
      authors: ['Vim Enthusiast Portfolio'],
      section: 'Technology',
      url: `${baseUrl}/blog/${encodedSlug}`,
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
      creator: '@vim_enthusiast',
    },
    alternates: {
      canonical: `${baseUrl}/blog/${encodedSlug}`,
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

  const encodedSlug = encodeURIComponent(post.slug)

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
              name: 'Vim Enthusiast Portfolio',
              url: baseUrl,
              sameAs: [baseUrl]
            },
            publisher: {
              '@type': 'Organization',
              name: 'Vim Enthusiast Portfolio',
              logo: {
                '@type': 'ImageObject',
                url: `${baseUrl}/logo.png`,
                width: 150,
                height: 150
              }
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${baseUrl}/blog/${encodedSlug}`
            },
            url: `${baseUrl}/blog/${encodedSlug}`,
            wordCount: post.content.split(' ').length,
            keywords: ['programming', 'technology', 'vim'],
            articleSection: 'Technology',
            inLanguage: 'en-US'
          }),
        }}
      />
      <h1 className="title font-semibold text-2xl tracking-tighter">
        {post.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {formatDate(post.metadata.publishedAt)}
        </p>
      </div>
      <article className="prose">
        <CustomMDX source={post.content} />
      </article>
    </section>
  )
}
