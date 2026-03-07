import Link from 'next/link'
import { ArrowUpRight, Clock3 } from 'lucide-react'
import { formatDate } from 'app/blog/utils'
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
  const current = currentPost || posts.find((post) => post.slug === currentSlug)

  if (!current) {
    return null
  }

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

  const allPostsForSimilarity: PostForSimilarity[] = posts.map((post) => ({
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

  const similarPosts: SimilarityResult[] = findSimilarPosts(
    currentForSimilarity,
    allPostsForSimilarity,
    3
  )

  if (similarPosts.length === 0) {
    return null
  }

  return (
    <section className="mt-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-kicker">Keep reading</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
            Related technical articles
          </h2>
        </div>

        <Link href="/blog" className="editorial-link">
          Browse the full archive
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {similarPosts.map((result) => {
          const post = result.post
          const publishedAt = post.metadata.publishedAt
          const reason = result.reasons[0]

          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="surface-card group block px-6 py-6"
              title={post.metadata.title}
            >
              <p className="section-kicker">
                {post.metadata.category || 'Editorial pick'}
              </p>
              <h3 className="mt-3 line-clamp-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950 transition-colors group-hover:text-indigo-700 theme-dark:text-white theme-dark:group-hover:text-indigo-300">
                {post.metadata.title}
              </h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 theme-dark:text-slate-300">
                {post.metadata.summary || 'No summary available'}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {publishedAt ? (
                  <span className="meta-chip normal-case tracking-[0.04em]">
                    {formatDate(publishedAt, false)}
                  </span>
                ) : null}
                {post.readingTime ? (
                  <span className="meta-chip normal-case tracking-[0.04em]">
                    <Clock3 className="mr-1 h-3.5 w-3.5" />
                    {post.readingTime} min read
                  </span>
                ) : null}
              </div>

              {reason ? (
                <div className="mt-5 rounded-[1.25rem] border border-slate-200/80 bg-slate-100/80 px-4 py-3 text-sm text-slate-600 theme-dark:border-slate-800 theme-dark:bg-slate-900/80 theme-dark:text-slate-300">
                  {reason}
                </div>
              ) : null}

              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors group-hover:text-slate-950 theme-dark:text-slate-300 theme-dark:group-hover:text-white">
                Read article
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

