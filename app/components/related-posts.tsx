import Link from 'next/link'

interface RelatedPost {
  slug: string
  title: string
  summary: string
  category?: string
}

interface RelatedPostsProps {
  currentSlug: string
  posts: RelatedPost[]
}

export function RelatedPosts({ currentSlug, posts }: RelatedPostsProps) {
  // 过滤掉当前文章
  const filteredPosts = posts.filter(post => post.slug !== currentSlug)
  
  // 最多显示3篇相关文章
  const relatedPosts = filteredPosts.slice(0, 3)

  if (relatedPosts.length === 0) {
    return null
  }

  return (
    <section className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800">
      <h2 className="text-xl font-semibold mb-6 text-neutral-900 dark:text-neutral-100">
        相关技术文章
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <h3 className="font-medium text-blue-600 dark:text-blue-400 mb-2 line-clamp-2">
              {post.title}
            </h3>
            {post.category && (
              <span className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full mb-2">
                {post.category}
              </span>
            )}
            <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3">
              {post.summary}
            </p>
            <div className="mt-3 text-blue-600 dark:text-blue-400 text-sm font-medium">
              阅读更多 →
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <Link 
          href="/blog" 
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
        >
          查看所有技术文章 →
        </Link>
      </div>
    </section>
  )
}