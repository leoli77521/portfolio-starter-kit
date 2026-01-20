import Link from 'next/link'
import { findSimilarPosts, type PostForSimilarity, type SimilarityResult } from 'app/lib/content-similarity'

interface RelatedPost {
  slug: string
  title: string
  summary: string
  category?: string
  tags?: string[]
  publishedAt?: string
  readingTime?: number
}

interface RelatedPostsProps {
  currentSlug: string
  posts: RelatedPost[]
  currentPost?: RelatedPost
}

export function RelatedPosts({ currentSlug, posts, currentPost }: RelatedPostsProps) {
  // Find current post if not provided
  const current = currentPost || posts.find(post => post.slug === currentSlug)

  if (!current) {
    return null
  }

  // Convert to PostForSimilarity format
  const currentForSimilarity: PostForSimilarity = {
    slug: current.slug,
    metadata: {
      title: current.title,
      summary: current.summary,
      publishedAt: current.publishedAt || new Date().toISOString(),
      category: current.category as any,
      tags: current.tags,
    },
    readingTime: current.readingTime,
  }

  const allPostsForSimilarity: PostForSimilarity[] = posts.map(post => ({
    slug: post.slug,
    metadata: {
      title: post.title,
      summary: post.summary,
      publishedAt: post.publishedAt || new Date().toISOString(),
      category: post.category as any,
      tags: post.tags,
    },
    readingTime: post.readingTime,
  }))

  // Use similarity algorithm to find related posts
  const similarPosts: SimilarityResult[] = findSimilarPosts(
    currentForSimilarity,
    allPostsForSimilarity,
    3
  )

  if (similarPosts.length === 0) {
    return null
  }

  return (
    <section className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800">
      <h2 className="text-xl font-semibold mb-6 text-neutral-900 dark:text-neutral-100">
        Related Technical Articles
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {similarPosts.map((result) => {
          const post = result.post
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block p-5 bg-white/60 dark:bg-neutral-900/60 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all hover:shadow-md hover:shadow-blue-50 dark:hover:shadow-blue-900/20"
              title={`${post.metadata.title} - ${post.metadata.summary?.slice(0, 80) || 'No summary available'}${(post.metadata.summary?.length || 0) > 80 ? '...' : ''}`}
            >
              <h3 className="font-medium text-blue-600 dark:text-blue-400 mb-2 line-clamp-2">
                {post.metadata.title}
              </h3>
              {post.metadata.category && (
                <span className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full mb-2">
                  {post.metadata.category}
                </span>
              )}
              <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3">
                {post.metadata.summary || 'No summary available'}
              </p>

              {/* Show similarity reasons */}
              {result.reasons.length > 0 && (
                <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <p className="text-xs text-neutral-500 dark:text-neutral-500 line-clamp-1">
                    {result.reasons[0]}
                  </p>
                </div>
              )}

              <div className="mt-3 text-blue-600 dark:text-blue-400 text-sm font-medium">
                Read more →
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/blog"
          className="btn-secondary"
          title="View All Technical Articles - Complete Collection of AI Insights & Programming Tutorials"
        >
          View All Technical Articles →
        </Link>
      </div>
    </section>
  )
}
