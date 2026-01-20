import { topicHubs } from 'app/lib/topic-hubs'
import { getBlogPosts } from 'app/blog/utils'
import type { Metadata } from 'next'
import { baseUrl } from 'app/sitemap'
import Link from 'next/link'
import { generateItemListSchema, generateCollectionPageSchema, schemaToJsonLd } from 'app/lib/schemas'

export const metadata: Metadata = {
  title: 'Topic Hubs - Curated Learning Collections',
  description:
    'Explore our curated topic hubs - comprehensive collections of articles organized by subject area. From AI development to SEO fundamentals, find structured learning paths.',
  alternates: {
    canonical: `${baseUrl}/topics`,
  },
  openGraph: {
    title: 'Topic Hubs | ToLearn Blog',
    description:
      'Explore curated collections of articles organized by subject area. Find comprehensive learning resources on AI, SEO, web development, and more.',
    url: `${baseUrl}/topics`,
    type: 'website',
  },
}

export default function TopicsPage() {
  const allPosts = getBlogPosts()

  // Calculate post counts for each topic hub
  const topicStats = topicHubs.map((hub) => {
    const normalizedHubTags = hub.relatedTags.map((t) => t.toLowerCase())
    const matchingPosts = allPosts.filter((post) => {
      if (!post.metadata.tags) return false
      return post.metadata.tags.some((tag) => normalizedHubTags.includes(tag.toLowerCase()))
    })
    return {
      ...hub,
      postCount: matchingPosts.length,
    }
  })

  // Generate schemas
  const itemListSchema = generateItemListSchema({
    name: 'Topic Hubs',
    description: 'Curated collections of articles organized by subject area',
    items: topicStats.map((hub, index) => ({
      url: `${baseUrl}/topics/${hub.slug}`,
      name: hub.title,
      description: hub.description,
      position: index + 1,
    })),
  })

  const collectionPageSchema = generateCollectionPageSchema({
    name: 'Topic Hubs - Curated Learning Collections',
    description: 'Explore our curated topic hubs for comprehensive learning on various subjects.',
    url: `${baseUrl}/topics`,
    dateModified: new Date().toISOString(),
    items: topicStats.map((hub, index) => ({
      url: `${baseUrl}/topics/${hub.slug}`,
      name: hub.title,
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
        <h1 className="mb-4 text-4xl font-black tracking-tight text-gray-900 dark:text-gray-100">
          Topic Hubs
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Explore our curated collections of articles organized by subject. Each hub brings together
          related content to help you master a specific topic.
        </p>
      </div>

      {/* Topic Hub Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {topicStats.map((hub) => (
          <Link
            key={hub.slug}
            href={`/topics/${hub.slug}`}
            className="group block p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all hover:shadow-lg"
          >
            <div className="flex items-start gap-4">
              <span className="text-4xl">{hub.icon}</span>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {hub.title}
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{hub.description}</p>
                <div className="mt-4 flex items-center gap-4 text-sm">
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    {hub.postCount} {hub.postCount === 1 ? 'article' : 'articles'}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500 dark:text-gray-500">
                    {hub.relatedTags.slice(0, 3).join(', ')}
                    {hub.relatedTags.length > 3 && '...'}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Additional Info */}
      <div className="mt-16 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          About Topic Hubs
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          Topic Hubs are curated collections designed to provide comprehensive coverage of specific
          subjects. Each hub aggregates articles that share common themes, making it easier for you
          to find all related content in one place. Whether you&apos;re starting your learning journey
          or looking to deepen your expertise, our topic hubs provide structured paths through our
          content library.
        </p>
      </div>

      {/* Link to categories */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Looking for more structured content?
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/categories"
            className="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Browse Categories
          </Link>
          <Link
            href="/guides"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Guides
          </Link>
        </div>
      </div>
    </section>
  )
}
