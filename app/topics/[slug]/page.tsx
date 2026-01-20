import { topicHubs, getTopicHub } from 'app/lib/topic-hubs'
import { getBlogPosts, calculateReadingTime } from 'app/blog/utils'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { baseUrl } from 'app/sitemap'
import Link from 'next/link'
import { PostCard } from 'app/components/post-card'
import { categories, getCategorySlug } from 'app/lib/categories'
import {
  generateItemListSchema,
  generateCollectionPageSchema,
  generateBreadcrumbSchema,
  schemaToJsonLd,
} from 'app/lib/schemas'
import { slugify } from 'app/lib/formatters'

export async function generateStaticParams() {
  return topicHubs.map((hub) => ({
    slug: hub.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const hub = getTopicHub(params.slug)

  if (!hub) {
    return {
      title: 'Topic Not Found',
    }
  }

  return {
    title: `${hub.title} - Topic Hub`,
    description: hub.description,
    keywords: hub.targetKeywords,
    alternates: {
      canonical: `${baseUrl}/topics/${hub.slug}`,
    },
    openGraph: {
      title: `${hub.title} | ToLearn Blog`,
      description: hub.description,
      url: `${baseUrl}/topics/${hub.slug}`,
      type: 'website',
    },
  }
}

export default function TopicHubPage({ params }: { params: { slug: string } }) {
  const hub = getTopicHub(params.slug)

  if (!hub) {
    notFound()
  }

  const allPosts = getBlogPosts()

  // Find posts matching this topic hub
  const normalizedHubTags = hub.relatedTags.map((t) => t.toLowerCase())
  const matchingPosts = allPosts
    .filter((post) => {
      if (!post.metadata.tags) return false
      return post.metadata.tags.some((tag) => normalizedHubTags.includes(tag.toLowerCase()))
    })
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
    )

  // Calculate statistics
  const totalReadingTime = matchingPosts.reduce(
    (acc, post) => acc + calculateReadingTime(post.content),
    0
  )

  // Get tag frequency within matching posts
  const tagCounts: Record<string, number> = {}
  matchingPosts.forEach((post) => {
    post.metadata.tags?.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })
  const sortedTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  // Get related categories
  const relatedCategoryConfigs = categories.filter(
    (cat) => cat.name !== 'All' && hub.relatedCategories.includes(cat.name)
  )

  // Get other topic hubs
  const otherHubs = topicHubs.filter((h) => h.slug !== hub.slug).slice(0, 3)

  // Generate schemas
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: baseUrl },
    { name: 'Topics', url: `${baseUrl}/topics` },
    { name: hub.title, url: `${baseUrl}/topics/${hub.slug}` },
  ])

  const itemListSchema = generateItemListSchema({
    name: hub.title,
    description: hub.description,
    items: matchingPosts.slice(0, 10).map((post, index) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      name: post.metadata.title,
      description: post.metadata.summary,
      position: index + 1,
    })),
  })

  const collectionPageSchema = generateCollectionPageSchema({
    name: `${hub.title} - Topic Hub`,
    description: hub.longDescription,
    url: `${baseUrl}/topics/${hub.slug}`,
    dateModified: new Date().toISOString(),
    items: matchingPosts.map((post, index) => ({
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
        dangerouslySetInnerHTML={{
          __html: schemaToJsonLd([breadcrumbSchema, itemListSchema, collectionPageSchema]),
        }}
      />

      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-600 dark:text-gray-400">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/topics" className="hover:text-blue-600 dark:hover:text-blue-400">
              Topics
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 dark:text-gray-100 font-medium">{hub.title}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-12 text-center">
        <span className="text-6xl mb-4 block">{hub.icon}</span>
        <h1 className="mb-4 text-4xl font-black tracking-tight text-gray-900 dark:text-gray-100">
          {hub.title}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {hub.description}
        </p>
      </div>

      {/* Long Description */}
      <div className="mb-10 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{hub.longDescription}</p>
      </div>

      {/* Statistics */}
      <div className="mb-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {matchingPosts.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Articles</div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {totalReadingTime}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Min Read Total</div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {hub.relatedTags.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Related Tags</div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {hub.relatedCategories.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
        </div>
      </div>

      {/* Tags in this hub */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          Topics Covered
        </h2>
        <div className="flex flex-wrap gap-2">
          {sortedTags.map(([tag, count]) => (
            <Link
              key={tag}
              href={`/tags/${slugify(tag)}`}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              {tag} ({count})
            </Link>
          ))}
        </div>
      </div>

      {/* Related Categories */}
      {relatedCategoryConfigs.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
            Related Categories
          </h2>
          <div className="flex flex-wrap gap-3">
            {relatedCategoryConfigs.map((cat) => (
              <Link
                key={cat.name}
                href={`/categories/${getCategorySlug(cat.name)}`}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
              >
                <span>{cat.emoji}</span>
                <span className="text-gray-800 dark:text-gray-200">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Articles List */}
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        All Articles in This Hub
      </h2>
      {matchingPosts.length > 0 ? (
        <div className="space-y-6">
          {matchingPosts.map((post) => (
            <PostCard
              key={post.slug}
              post={{
                slug: post.slug,
                metadata: post.metadata,
                readingTime: calculateReadingTime(post.content),
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-600 dark:text-gray-400">
            No articles found in this topic hub yet.
          </p>
        </div>
      )}

      {/* Other Topic Hubs */}
      {otherHubs.length > 0 && (
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
            Explore Other Topic Hubs
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {otherHubs.map((otherHub) => (
              <Link
                key={otherHub.slug}
                href={`/topics/${otherHub.slug}`}
                className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
              >
                <span className="text-2xl mb-2 block">{otherHub.icon}</span>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{otherHub.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {otherHub.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
