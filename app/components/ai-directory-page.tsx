import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { TrackedLink } from 'app/components/tracked-link'
import { calculateReadingTime, getBlogPosts } from 'app/blog/utils'
import { PostCard } from 'app/components/post-card'
import type { AiDirectoryConfig } from 'app/lib/ai-directories'
import { baseUrl } from 'app/sitemap'
import {
  generateBreadcrumbSchema,
  generateCollectionPageSchema,
  generateItemListSchema,
  schemaToJsonLd,
} from 'app/lib/schemas'
import { getTopicHub, postBelongsToTopicHub } from 'app/lib/topic-hubs'

export function AiDirectoryPage({ config }: { config: AiDirectoryConfig }) {
  const allPosts = getBlogPosts()
  const hubs = config.hubSlugs.map((slug) => getTopicHub(slug)).filter(Boolean)
  const hubPosts = allPosts
    .filter((post) => hubs.some((hub) => hub && postBelongsToTopicHub(post, hub)))
    .sort(
      (left, right) =>
        new Date(right.metadata.publishedAt).getTime() -
        new Date(left.metadata.publishedAt).getTime()
    )
  const featuredSlugs = hubs.flatMap((hub) => hub?.featuredArticleSlugs || [])
  const featuredPosts = featuredSlugs.length
    ? featuredSlugs
        .map((slug) => hubPosts.find((post) => post.slug === slug))
        .filter((post): post is (typeof hubPosts)[number] => Boolean(post))
        .slice(0, 5)
    : hubPosts.slice(0, 5)
  const supportingPosts = hubPosts
    .filter((post) => !featuredPosts.some((featuredPost) => featuredPost.slug === post.slug))
    .slice(0, 6)
  const totalReadingTime = hubPosts.reduce(
    (sum, post) => sum + calculateReadingTime(post.content),
    0
  )

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: baseUrl },
    { name: config.title, url: `${baseUrl}${config.canonicalPath}` },
  ])
  const itemListSchema = generateItemListSchema({
    name: config.title,
    description: config.description,
    items: featuredPosts.map((post, index) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      name: post.metadata.title,
      description: post.metadata.summary,
      position: index + 1,
    })),
  })
  const collectionSchema = generateCollectionPageSchema({
    name: config.title,
    description: config.description,
    url: `${baseUrl}${config.canonicalPath}`,
    dateModified: hubPosts[0]?.metadata.updatedAt || hubPosts[0]?.metadata.publishedAt,
    items: hubPosts.map((post, index) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      name: post.metadata.title,
      position: index + 1,
    })),
  })

  return (
    <section className="mx-auto max-w-6xl space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schemaToJsonLd([breadcrumbSchema, itemListSchema, collectionSchema]),
        }}
      />

      <div className="surface-panel px-6 py-8 md:px-8 md:py-10">
        <p className="section-kicker">AI directory</p>
        <div className="mt-3 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.75fr)] lg:items-end">
          <div>
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white md:text-5xl">
              {config.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 theme-dark:text-slate-300 md:text-lg">
              {config.description}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="stat-pill">
              <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
                {hubPosts.length}
              </span>
              <span>cluster articles</span>
            </div>
            <div className="stat-pill">
              <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
                {hubs.length}
              </span>
              <span>connected hubs</span>
            </div>
            <div className="stat-pill">
              <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
                {totalReadingTime}
              </span>
              <span>reading minutes</span>
            </div>
          </div>
        </div>
      </div>

      <section className="surface-panel px-6 py-7 md:px-8">
        <p className="section-kicker">Use this directory</p>
        <p className="mt-4 max-w-4xl text-sm leading-8 text-slate-600 theme-dark:text-slate-300 md:text-base">
          {config.longDescription}
        </p>

        <div className="mt-6 rounded-[1.5rem] border border-indigo-200/80 bg-indigo-50/70 px-5 py-5 theme-dark:border-indigo-900/70 theme-dark:bg-indigo-950/30">
          <p className="section-kicker">Page role</p>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-700 theme-dark:text-slate-200 md:text-base">
            {config.pageRole}
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {config.decisionCards.map((card) => (
            <div key={card.title} className="surface-card px-5 py-5">
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950 theme-dark:text-white">
                {card.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="surface-panel px-6 py-7 md:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker">Direct paths</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
              Start with the page that answers your question
            </h2>
          </div>
          <Link href="/blog" className="editorial-link">
            Browse the full archive
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {config.entryLinks.map((entry) => (
            <TrackedLink
              key={entry.href}
              href={entry.href}
              className="surface-card group block px-5 py-5"
              eventName="directory_entry_click"
              eventParams={{
                directory: config.slug,
                entry_slug: entry.href.split('/').filter(Boolean).at(-1) || config.slug,
                category: config.slug,
                destination: entry.href,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-950 transition-colors group-hover:text-indigo-700 theme-dark:text-white theme-dark:group-hover:text-indigo-300">
                  {entry.label}
                </h3>
                <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                {entry.description}
              </p>
            </TrackedLink>
          ))}
        </div>
      </section>

      {hubs.length > 0 ? (
        <section className="surface-panel px-6 py-7 md:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="section-kicker">Topic hub layer</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
                Continue into the curated hub
              </h2>
            </div>
            <Link href="/topics" className="editorial-link">
              All topic hubs
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {hubs.map((hub) =>
              hub ? (
                    <div key={hub.slug} className="surface-card px-5 py-5">
                      <p className="section-kicker">Hub</p>
                      <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950 theme-dark:text-white">
                        {hub.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                        {hub.description}
                      </p>
                      {config.hubLink === null ? (
                        <p className="mt-5 text-sm font-semibold text-indigo-700 theme-dark:text-indigo-300">
                          This directory is the canonical entry point for this comparison layer.
                        </p>
                      ) : (
                        <Link href={config.hubLink || `/topics/${hub.slug}`} className="mt-5 editorial-link">
                          Open hub
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  ) : null
            )}
          </div>
        </section>
      ) : null}

      <section className="surface-panel px-6 py-7 md:px-8">
        <p className="section-kicker">Start here</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
          Pillar reads
        </h2>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {featuredPosts.map((post) => (
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
      </section>

      {supportingPosts.length > 0 ? (
        <section>
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="section-kicker">Supporting analysis</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
                More from this cluster
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
              These articles deepen the directory without turning it into a thin generated list.
            </p>
          </div>

          <div className="space-y-6">
            {supportingPosts.map((post) => (
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
        </section>
      ) : null}
    </section>
  )
}
