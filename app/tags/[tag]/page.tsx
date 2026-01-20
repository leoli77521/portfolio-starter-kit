import { getBlogPosts, getBlogPostsMetadata } from 'app/blog/utils'
import { notFound } from 'next/navigation'
import { PostCard } from 'app/components/post-card'
import type { Metadata } from 'next'
import { slugify } from '@/app/lib/formatters'
import { baseUrl } from 'app/sitemap'
import Link from 'next/link'
import { getTagDescription, getRelatedTags } from 'app/lib/tag-descriptions'
import { generateItemListSchema, generateCollectionPageSchema, schemaToJsonLd } from 'app/lib/schemas'
import { categories, getCategorySlug } from 'app/lib/categories'

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
  const tagDesc = getTagDescription(displayTag)

  if (!normalizedSlug) {
    return {
      title: 'Tag Not Found',
    }
  }

  const description = tagDesc?.description || `Read articles tagged with ${displayTag}.`

  return {
    title: `${displayTag} - Blog Tags`,
    description,
    alternates: {
      canonical: `${baseUrl}/tags/${normalizedSlug}`,
    },
    openGraph: {
      title: `${displayTag} Articles | ToLearn Blog`,
      description,
      url: `${baseUrl}/tags/${normalizedSlug}`,
      type: 'website',
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

  const sortedPosts = posts.sort((a, b) =>
    new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
  )

  // Get tag description
  const tagDesc = getTagDescription(displayTag)

  // Get related tags
  const relatedTagNames = tagDesc?.relatedTags || getRelatedTags(displayTag)
  const validRelatedTags = relatedTagNames.filter(tag =>
    allTags.some(t => toTagSlug(t) === toTagSlug(tag))
  )

  // Get category hint
  const relatedCategory = tagDesc?.relatedCategory
  const categoryConfig = relatedCategory
    ? categories.find(c => c.name === relatedCategory)
    : undefined

  // Get other tags commonly used with this tag
  const coTags: Record<string, number> = {}
  posts.forEach(post => {
    post.metadata.tags?.forEach(tag => {
      if (toTagSlug(tag) !== normalizedSlug) {
        coTags[tag] = (coTags[tag] || 0) + 1
      }
    })
  })
  const frequentCoTags = Object.entries(coTags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag)

  // Generate schemas
  const itemListSchema = generateItemListSchema({
    name: `${displayTag} Articles`,
    description: tagDesc?.description || `Articles tagged with ${displayTag}`,
    items: sortedPosts.slice(0, 10).map((post, index) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      name: post.metadata.title,
      description: post.metadata.summary,
      position: index + 1,
    })),
  })

  const collectionPageSchema = generateCollectionPageSchema({
    name: `${displayTag} - Blog Tags`,
    description: tagDesc?.description || `Articles tagged with ${displayTag}`,
    url: `${baseUrl}/tags/${normalizedSlug}`,
    dateModified: new Date().toISOString(),
    items: sortedPosts.map((post, index) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      name: post.metadata.title,
      position: index + 1,
    })),
  })

  return (
    <section>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd([itemListSchema, collectionPageSchema]) }}
      />

      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-black tracking-tight text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3">
          <span className="text-5xl">🏷️</span>
          {displayTag}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {posts.length} {posts.length === 1 ? 'article' : 'articles'} with this tag
        </p>
      </div>

      {/* Tag Description */}
      {tagDesc && (
        <div className="mb-10 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {tagDesc.description}
          </p>
        </div>
      )}

      {/* Category Hint */}
      {categoryConfig && (
        <div className="mb-8">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Part of category:</p>
          <Link
            href={`/categories/${getCategorySlug(categoryConfig.name)}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
          >
            <span>{categoryConfig.emoji}</span>
            <span className="text-gray-800 dark:text-gray-200">{categoryConfig.name}</span>
          </Link>
        </div>
      )}

      {/* Related Tags */}
      {validRelatedTags.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Related Tags</h2>
          <div className="flex flex-wrap gap-2">
            {validRelatedTags.map(tag => (
              <Link
                key={tag}
                href={`/tags/${toTagSlug(tag)}`}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Frequently Co-occurring Tags */}
      {frequentCoTags.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Often Used With</h2>
          <div className="flex flex-wrap gap-2">
            {frequentCoTags.map(tag => (
              <Link
                key={tag}
                href={`/tags/${toTagSlug(tag)}`}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Articles List */}
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        All {displayTag} Articles
      </h2>
      <div className="space-y-6">
        {sortedPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  )
}
