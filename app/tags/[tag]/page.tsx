import { getBlogPosts } from 'app/blog/utils'
import { notFound } from 'next/navigation'
import { PostCard } from 'app/components/post-card'
import type { Metadata } from 'next'

// Helper to get all unique tags
function getAllTags(): string[] {
  const posts = getBlogPosts()
  const tags = new Set<string>()
  posts.forEach((post) => {
    if (post.metadata.tags) {
      post.metadata.tags.forEach((tag) => {
        if (tag) tags.add(tag)
      })
    }
  })
  return Array.from(tags)
}

export async function generateStaticParams() {
  const tags = getAllTags()
  return tags.map((tag) => ({
    tag: encodeURIComponent(tag),
  }))
}

export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
  const decodedTag = decodeURIComponent(params.tag)
  return {
    title: `${decodedTag} - Blog Tags`,
    description: `Read articles tagged with ${decodedTag}.`,
  }
}

export default function TagPage({ params }: { params: { tag: string } }) {
  const decodedTag = decodeURIComponent(params.tag)
  const allPosts = getBlogPosts()
  
  // Filter posts that contain this tag
  const posts = allPosts.filter((post) => 
    post.metadata.tags && post.metadata.tags.some(t => t.toLowerCase() === decodedTag.toLowerCase())
  )

  if (posts.length === 0) {
    notFound()
  }

  return (
    <section>
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-black tracking-tight text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3">
          <span className="text-5xl">🏷️</span>
          {decodedTag}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {posts.length} {posts.length === 1 ? 'article' : 'articles'} with this tag
        </p>
      </div>

      <div className="space-y-6">
        {posts
          .sort((a, b) => {
            if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
              return -1
            }
            return 1
          })
          .map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
      </div>
    </section>
  )
}
