import { topicHubs } from 'app/lib/topic-hubs'
import { getBlogPosts } from 'app/blog/utils'
import type { Metadata } from 'next'
import { baseUrl } from 'app/sitemap'
import Link from 'next/link'
import {
  generateCollectionPageSchema,
  generateItemListSchema,
  schemaToJsonLd,
} from 'app/lib/schemas'

export const metadata: Metadata = {
  title: 'Topic Hubs',
  description:
    'Explore curated topic hubs that group ToLearn articles into clearer learning paths.',
  alternates: {
    canonical: `${baseUrl}/topics`,
  },
  openGraph: {
    title: 'Topic Hubs | ToLearn Blog',
    description:
      'Curated collections of articles organized into practical learning paths for builders.',
    url: `${baseUrl}/topics`,
    type: 'website',
  },
}

export default function TopicsPage() {
  const allPosts = getBlogPosts()
  const topicStats = topicHubs.map((hub) => {
    const normalizedHubTags = hub.relatedTags.map((tag) => tag.toLowerCase())
    const matchingPosts = allPosts.filter((post) => {
      if (!post.metadata.tags) return false

      return post.metadata.tags.some((tag) => normalizedHubTags.includes(tag.toLowerCase()))
    })

    return {
      ...hub,
      postCount: matchingPosts.length,
    }
  })

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
    name: 'Topic Hubs',
    description: 'Curated topic collections for structured learning.',
    url: `${baseUrl}/topics`,
    dateModified: new Date().toISOString(),
    items: topicStats.map((hub, index) => ({
      url: `${baseUrl}/topics/${hub.slug}`,
      name: hub.title,
      position: index + 1,
    })),
  })

  const totalLinkedPosts = topicStats.reduce((sum, hub) => sum + hub.postCount, 0)

  return (
    <section className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd([itemListSchema, collectionPageSchema]) }}
      />

      <div className="surface-panel px-6 py-8 md:px-8 md:py-10">
        <p className="section-kicker">Curated learning paths</p>
        <div className="mt-3 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.75fr)] lg:items-end">
          <div>
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white md:text-5xl">
              Topic hubs turn the archive into guided tracks
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 theme-dark:text-slate-300 md:text-lg">
              When categories are too broad and tags are too granular, topic hubs provide the
              middle layer: curated groupings that bring related ideas together into clearer
              paths through the archive.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="stat-pill">
              <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
                {topicStats.length}
              </span>
              <span>curated hubs</span>
            </div>
            <div className="stat-pill">
              <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
                {totalLinkedPosts}
              </span>
              <span>linked post matches</span>
            </div>
            <div className="stat-pill">
              <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
                {topicStats[0]?.title || 'Archive'}
              </span>
              <span>first recommended hub</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {topicStats.map((hub, index) => (
          <Link
            key={hub.slug}
            href={`/topics/${hub.slug}`}
            className="surface-card group block px-6 py-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="section-kicker">Path {String(index + 1).padStart(2, '0')}</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950 transition-colors group-hover:text-indigo-700 theme-dark:text-white theme-dark:group-hover:text-indigo-300">
                  {hub.title}
                </h2>
              </div>
              <span className="meta-chip normal-case tracking-normal">
                {hub.postCount} posts
              </span>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
              {hub.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {hub.relatedCategories.map((category) => (
                <span key={category} className="meta-chip normal-case tracking-normal">
                  {category}
                </span>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {hub.relatedTags.slice(0, 4).map((tag) => (
                <span key={tag} className="rounded-full border border-slate-200/80 px-3 py-1 text-xs font-medium text-slate-600 theme-dark:border-slate-800 theme-dark:text-slate-300">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 editorial-link">Open learning path</div>
          </Link>
        ))}
      </div>

      <div className="surface-panel px-6 py-6 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker">Use the right entry point</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
              Categories, tags, and topic hubs each do a different job
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/categories" className="editorial-link">
              Browse categories
            </Link>
            <Link href="/guides" className="editorial-link">
              Read guides
            </Link>
          </div>
        </div>

        <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
          Use categories for broad sections, tags for precise concepts, and topic hubs when you
          want a curated path through a cluster of related material.
        </p>
      </div>
    </section>
  )
}

