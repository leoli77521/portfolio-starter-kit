import { getBlogPosts, getBlogPostsMetadata } from 'app/blog/utils'
import { notFound } from 'next/navigation'
import { PostCard } from 'app/components/post-card'
import type { Metadata } from 'next'
import { slugify } from '@/app/lib/formatters'
import { baseUrl } from 'app/sitemap'

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

const toTagSlug = (tag: string) => {
  const slug = slugify(tag)
  return slug || tag.trim().toLowerCase().replace(/\s+/g, '-')
}

const normalizeTagSlug = (value: string) => {
  try {
    return toTagSlug(decodeURIComponent(value))
  } catch {
    return toTagSlug(value)
  }
}

const getDisplayTag = (tagSlug: string, tags: string[]) => {
  const match = tags.find((tag) => toTagSlug(tag) === tagSlug)
  return match || tagSlug
}

export async function generateStaticParams() {
  const tags = getAllTags()
  const tagSlugs = Array.from(new Set(tags.map(toTagSlug).filter(Boolean)))
  return tagSlugs.map((tag) => ({
    tag,
  }))
}

export async function generateMetadata({ params }: { params: { tag: string } }): Promise<Metadata> {
  const allTags = getAllTags()
  const normalizedSlug = normalizeTagSlug(params.tag)
  const displayTag = getDisplayTag(normalizedSlug, allTags)

  if (!normalizedSlug) {
    return {
      title: 'Tag Not Found',
    }
  }

  return {
    title: `${displayTag} - Blog Tags`,
    description: `Read articles tagged with ${displayTag}.`,
    alternates: {
      canonical: `${baseUrl}/tags/${normalizedSlug}`,
    },
  }
}

export default function TagPage({ params }: { params: { tag: string } }) {
  const normalizedSlug = normalizeTagSlug(params.tag)
  const allTags = getAllTags()
  const displayTag = getDisplayTag(normalizedSlug, allTags)
  const allPosts = getBlogPostsMetadata()
  
  // Filter posts that contain this tag
  const posts = allPosts.filter((post) =>
    post.metadata.tags && post.metadata.tags.some(tag => toTagSlug(tag) === normalizedSlug)
  )

  if (!normalizedSlug || posts.length === 0) {
    notFound()
  }

  return (
    <section>
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-black tracking-tight text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3">
          <span className="text-5xl">🏷️</span>
          {displayTag}
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
