import { getTopicHub, postMatchesTopicHub, topicHubs } from 'app/lib/topic-hubs'
import { calculateReadingTime, getBlogPosts } from 'app/blog/utils'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { baseUrl } from 'app/sitemap'
import Link from 'next/link'
import { PostCard } from 'app/components/post-card'
import { categories, getCategoryColor, getCategorySlug } from 'app/lib/categories'
import {
  generateBreadcrumbSchema,
  generateCollectionPageSchema,
  generateItemListSchema,
  schemaToJsonLd,
} from 'app/lib/schemas'
import { toTagSlug } from 'app/lib/tags'

function getMatchingPostsForHub(hub: NonNullable<ReturnType<typeof getTopicHub>>) {
  const allPosts = getBlogPosts()

  return allPosts
    .filter((post) => postMatchesTopicHub(post.metadata.tags || [], hub))
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
    )
}

const categoryBadgeStyles = {
  gray: 'border-slate-200/80 bg-slate-100/90 text-slate-600 theme-dark:border-slate-800 theme-dark:bg-slate-900 theme-dark:text-slate-300',
  blue: 'border-sky-200/80 bg-sky-50/90 text-sky-700 theme-dark:border-sky-900/80 theme-dark:bg-sky-950/50 theme-dark:text-sky-300',
  green:
    'border-emerald-200/80 bg-emerald-50/90 text-emerald-700 theme-dark:border-emerald-900/80 theme-dark:bg-emerald-950/50 theme-dark:text-emerald-300',
  purple:
    'border-violet-200/80 bg-violet-50/90 text-violet-700 theme-dark:border-violet-900/80 theme-dark:bg-violet-950/50 theme-dark:text-violet-300',
  orange:
    'border-amber-200/80 bg-amber-50/90 text-amber-700 theme-dark:border-amber-900/80 theme-dark:bg-amber-950/50 theme-dark:text-amber-300',
}

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

  const matchingPosts = getMatchingPostsForHub(hub)
  const shouldIndex = matchingPosts.length > 0

  return {
    title: hub.title,
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
    robots: {
      index: shouldIndex,
      follow: true,
      googleBot: {
        index: shouldIndex,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default function TopicHubPage({ params }: { params: { slug: string } }) {
  const hub = getTopicHub(params.slug)

  if (!hub) {
    notFound()
  }

  const matchingPosts = getMatchingPostsForHub(hub)
  const shouldIndex = matchingPosts.length > 0
  const featuredPosts = (hub.featuredArticleSlugs?.length
    ? hub.featuredArticleSlugs
        .map((slug) => matchingPosts.find((post) => post.slug === slug))
        .filter((post): post is (typeof matchingPosts)[number] => Boolean(post))
    : matchingPosts.slice(0, 4))
  const learningGoals = hub.learningGoals || []

  const totalReadingTime = matchingPosts.reduce(
    (sum, post) => sum + calculateReadingTime(post.content),
    0
  )

  const tagCounts: Record<string, number> = {}
  matchingPosts.forEach((post) => {
    post.metadata.tags?.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })
  const sortedTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)

  const relatedCategoryConfigs = categories.filter(
    (category) => category.name !== 'All' && hub.relatedCategories.includes(category.name)
  )
  const otherHubs = topicHubs.filter((currentHub) => currentHub.slug !== hub.slug).slice(0, 3)

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
    name: `${hub.title} Hub`,
    description: hub.longDescription,
    url: `${baseUrl}/topics/${hub.slug}`,
    dateModified: matchingPosts[0]?.metadata.updatedAt || matchingPosts[0]?.metadata.publishedAt,
    items: matchingPosts.map((post, index) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      name: post.metadata.title,
      position: index + 1,
    })),
  })

  return (
    <section className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schemaToJsonLd([breadcrumbSchema, itemListSchema, collectionPageSchema]),
        }}
      />

      <nav className="text-sm" aria-label="Breadcrumb navigation">
        <ol className="flex items-center gap-2 text-slate-500 theme-dark:text-slate-400">
          <li>
            <Link href="/" className="transition-colors hover:text-slate-950 theme-dark:hover:text-white">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href="/topics"
              className="transition-colors hover:text-slate-950 theme-dark:hover:text-white"
            >
              Topics
            </Link>
          </li>
          <li>/</li>
          <li className="font-medium text-slate-900 theme-dark:text-slate-100">{hub.title}</li>
        </ol>
      </nav>

      <div className="surface-panel px-6 py-8 md:px-8 md:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="section-kicker">Topic hub</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {hub.relatedCategories.slice(0, 2).map((category) => {
                const tone = getCategoryColor(category)
                return (
                  <span
                    key={category}
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${categoryBadgeStyles[tone]}`}
                  >
                    {category}
                  </span>
                )
              })}
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white md:text-5xl">
              {hub.title}
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600 theme-dark:text-slate-300 md:text-lg">
              {hub.description}
            </p>
            {!shouldIndex ? (
              <p className="mt-3 text-sm leading-7 text-slate-500 theme-dark:text-slate-400">
                This hub currently acts as a planning layer rather than a fully populated archive,
                so it remains accessible but is intentionally excluded from search indexing for now.
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/topics" className="editorial-link">
              All topic hubs
            </Link>
            <Link href="/guides" className="editorial-link">
              Read guides
            </Link>
          </div>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="stat-pill">
            <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
              {matchingPosts.length}
            </span>
            <span>matching articles</span>
          </div>
          <div className="stat-pill">
            <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
              {totalReadingTime}
            </span>
            <span>reading minutes</span>
          </div>
          <div className="stat-pill">
            <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
              {hub.relatedTags.length}
            </span>
            <span>seed tags in this hub</span>
          </div>
          <div className="stat-pill">
            <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
              {hub.relatedCategories.length}
            </span>
            <span>connected categories</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <div className="surface-panel px-6 py-6 md:px-8">
            <p className="section-kicker">Overview</p>
            <p className="mt-4 text-sm leading-8 text-slate-600 theme-dark:text-slate-300 md:text-base">
              {hub.longDescription}
            </p>
          </div>

          {featuredPosts.length > 0 || learningGoals.length > 0 ? (
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]">
              {featuredPosts.length > 0 ? (
                <div className="surface-panel px-6 py-6 md:px-8">
                  <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="section-kicker">Start here</p>
                      <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
                        Recommended Reading Order
                      </h2>
                    </div>
                    <p className="max-w-xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                      Follow these featured reads to move from architecture basics to migration
                      discipline without losing the thread.
                    </p>
                  </div>

                  <ol className="mt-6 space-y-4">
                    {featuredPosts.map((post, index) => (
                      <li key={post.slug}>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="block rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 px-5 py-5 transition-colors hover:border-indigo-300 hover:bg-white theme-dark:border-slate-800 theme-dark:bg-slate-950/70 theme-dark:hover:border-indigo-500/60 theme-dark:hover:bg-slate-950"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <span className="meta-chip normal-case tracking-normal">
                              Step {index + 1}
                            </span>
                            <span className="text-xs uppercase tracking-[0.16em] text-slate-500 theme-dark:text-slate-400">
                              {calculateReadingTime(post.content)} min read
                            </span>
                          </div>
                          <div className="mt-3 text-lg font-semibold text-slate-950 theme-dark:text-slate-100">
                            {post.metadata.title}
                          </div>
                          <p className="mt-2 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                            {post.metadata.summary}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </div>
              ) : null}

              {learningGoals.length > 0 ? (
                <div className="surface-panel px-6 py-6 md:px-8">
                  <p className="section-kicker">Learning goals</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
                    What You'll Learn
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                    This hub is designed for developers who want to understand how coding agents
                    work as systems, not just as model demos.
                  </p>
                  <ul className="mt-6 space-y-3">
                    {learningGoals.map((goal) => (
                      <li
                        key={goal}
                        className="rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 px-4 py-4 text-sm leading-7 text-slate-700 theme-dark:border-slate-800 theme-dark:bg-slate-950/70 theme-dark:text-slate-200"
                      >
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="surface-panel px-6 py-6 md:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="section-kicker">Archive</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
                  All Articles in This Hub
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                Topic hubs sit between categories and tags: more curated than one label, less
                rigid than a formal guide.
              </p>
            </div>

            {matchingPosts.length > 0 ? (
              <div className="mt-6 space-y-6">
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
              <div className="mt-6 rounded-[1.5rem] border border-slate-200/80 bg-slate-50/80 px-6 py-10 text-center theme-dark:border-slate-800 theme-dark:bg-slate-950/70">
                <p className="section-kicker">No entries yet</p>
                <p className="mt-3 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                  No articles match this topic hub yet.
                </p>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-5">
          {sortedTags.length > 0 ? (
            <div className="surface-card px-5 py-5">
              <p className="section-kicker">Topics covered</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {sortedTags.map(([tag, count]) => (
                  <Link
                    key={tag}
                    href={`/tags/${toTagSlug(tag)}`}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:text-slate-950 theme-dark:border-slate-800 theme-dark:bg-slate-950/80 theme-dark:text-slate-300 theme-dark:hover:border-indigo-500/60 theme-dark:hover:text-white"
                  >
                    <span>{tag}</span>
                    <span className="meta-chip normal-case tracking-normal">{count}</span>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          {relatedCategoryConfigs.length > 0 ? (
            <div className="surface-card px-5 py-5">
              <p className="section-kicker">Related categories</p>
              <div className="mt-4 space-y-3">
                {relatedCategoryConfigs.map((category) => {
                  const tone = getCategoryColor(category.name)

                  return (
                    <Link
                      key={category.name}
                      href={`/categories/${getCategorySlug(category.name)}`}
                      className="flex items-center justify-between rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 px-4 py-4 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:text-slate-950 theme-dark:border-slate-800 theme-dark:bg-slate-950/70 theme-dark:text-slate-300 theme-dark:hover:border-indigo-500/60 theme-dark:hover:text-white"
                    >
                      <span>{category.name}</span>
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${categoryBadgeStyles[tone]}`}
                      >
                        Category
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ) : null}

          {otherHubs.length > 0 ? (
            <div className="surface-card px-5 py-5">
              <p className="section-kicker">Other hubs</p>
              <div className="mt-4 space-y-3">
                {otherHubs.map((otherHub) => (
                  <Link
                    key={otherHub.slug}
                    href={`/topics/${otherHub.slug}`}
                    className="block rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 px-4 py-4 transition-colors hover:border-indigo-300 theme-dark:border-slate-800 theme-dark:bg-slate-950/70 theme-dark:hover:border-indigo-500/60"
                  >
                    <div className="text-sm font-semibold text-slate-950 theme-dark:text-slate-100">
                      {otherHub.title}
                    </div>
                    <div className="mt-2 text-sm leading-6 text-slate-600 theme-dark:text-slate-300">
                      {otherHub.description}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  )
}

