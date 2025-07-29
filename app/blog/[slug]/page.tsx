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
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/blog/${encodedSlug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `/blog/${encodedSlug}`,
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
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}/blog/${encodedSlug}`,
            author: {
              '@type': 'Person',
              name: 'My Portfolio',
            },
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
