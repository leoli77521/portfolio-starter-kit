import { notFound, permanentRedirect } from 'next/navigation'
import { PostCard } from 'app/components/post-card'
import type { Metadata } from 'next'
import { baseUrl } from 'app/sitemap'
import Link from 'next/link'
import { getRelatedTags, getTagDescription } from 'app/lib/tag-descriptions'
import {
  generateCollectionPageSchema,
  generateItemListSchema,
  schemaToJsonLd,
} from 'app/lib/schemas'
import { categories, getCategoryColor, getCategorySlug } from 'app/lib/categories'
import {
  getAllTags,
  getDisplayTag,
  getPostsForTag,
  getTagCountBySlug,
  normalizeTagSlug,
  shouldIndexTagPage,
  toTagSlug,
} from 'app/lib/tags'

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
  const tags = getAllTags()
  const tagSlugs = Array.from(new Set(tags.map(toTagSlug).filter(Boolean)))
  return tagSlugs.map((tag) => ({
    tag,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: { tag: string }
}): Promise<Metadata> {
  const allTags = getAllTags()
  const normalizedSlug = normalizeTagSlug(params.tag)
  const displayTag = getDisplayTag(normalizedSlug, allTags)
  const tagDesc = getTagDescription(displayTag)
  const tagCount = getTagCountBySlug(normalizedSlug)
  const shouldIndex = shouldIndexTagPage(tagCount)

  if (!normalizedSlug) {
    return {
      title: 'Tag Not Found',
    }
  }

  const description = tagDesc?.description || `Read articles tagged with ${displayTag}.`

  return {
    title: displayTag,
    description,
    alternates: {
      canonical: `${baseUrl}/tags/${normalizedSlug}`,
    },
    openGraph: {
      title: `${displayTag} | ToLearn Blog`,
      description,
      url: `${baseUrl}/tags/${normalizedSlug}`,
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

export default function TagPage({ params }: { params: { tag: string } }) {
  const normalizedSlug = normalizeTagSlug(params.tag)
  const allTags = getAllTags()
  const displayTag = getDisplayTag(normalizedSlug, allTags)
  const posts = getPostsForTag(normalizedSlug)
  const shouldIndex = shouldIndexTagPage(posts.length)

  if (!normalizedSlug || posts.length === 0) {
    notFound()
  }

  if (params.tag !== normalizedSlug) {
    permanentRedirect(`/tags/${normalizedSlug}`)
  }

  const sortedPosts = posts.sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
  )

  const tagDesc = getTagDescription(displayTag)
  const relatedTagNames = tagDesc?.relatedTags || getRelatedTags(displayTag)
  const validRelatedTags = relatedTagNames.filter((tag) =>
    allTags.some((currentTag) => toTagSlug(currentTag) === toTagSlug(tag))
  )

  const relatedCategory = tagDesc?.relatedCategory
  const categoryConfig = relatedCategory
    ? categories.find((category) => category.name === relatedCategory)
    : undefined

  const coTags: Record<string, number> = {}
  posts.forEach((post) => {
    post.metadata.tags?.forEach((tag) => {
      if (toTagSlug(tag) !== normalizedSlug) {
        coTags[tag] = (coTags[tag] || 0) + 1
      }
    })
  })
  const frequentCoTags = Object.entries(coTags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

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
    name: `${displayTag} Tag`,
    description: tagDesc?.description || `Articles tagged with ${displayTag}`,
    url: `${baseUrl}/tags/${normalizedSlug}`,
    dateModified: sortedPosts[0]?.metadata.updatedAt || sortedPosts[0]?.metadata.publishedAt,
    items: sortedPosts.map((post, index) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      name: post.metadata.title,
      position: index + 1,
    })),
  })

  const hasSidebar = Boolean(categoryConfig) || validRelatedTags.length > 0 || frequentCoTags.length > 0
  const categoryTone = categoryConfig ? getCategoryColor(categoryConfig.name) : null

  return (
    <section className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd([itemListSchema, collectionPageSchema]) }}
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
              href="/tags"
              className="transition-colors hover:text-slate-950 theme-dark:hover:text-white"
            >
              Tags
            </Link>
          </li>
          <li>/</li>
          <li className="font-medium text-slate-900 theme-dark:text-slate-100">{displayTag}</li>
        </ol>
      </nav>

      <div className="surface-panel px-6 py-8 md:px-8 md:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="section-kicker">Tag archive</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="meta-chip normal-case tracking-normal">{displayTag}</span>
              {categoryConfig && categoryTone ? (
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${categoryBadgeStyles[categoryTone]}`}
                >
                  {categoryConfig.name}
                </span>
              ) : null}
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white md:text-5xl">
              {displayTag}
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600 theme-dark:text-slate-300 md:text-lg">
              {tagDesc?.description || `Browse all writing tagged with ${displayTag}.`}
            </p>
            {!shouldIndex ? (
              <p className="mt-3 text-sm leading-7 text-slate-500 theme-dark:text-slate-400">
                This is a narrow reference tag with a small number of matching posts, so it stays
                browsable but is intentionally de-emphasized for search indexing.
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/tags" className="editorial-link">
              All tags
            </Link>
            <Link href="/blog" className="editorial-link">
              Open journal
            </Link>
          </div>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <div className="stat-pill">
            <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
              {posts.length}
            </span>
            <span>articles with this tag</span>
          </div>
          <div className="stat-pill">
            <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
              {validRelatedTags.length}
            </span>
            <span>related tags</span>
          </div>
          <div className="stat-pill">
            <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
              {frequentCoTags.length}
            </span>
            <span>common pairings</span>
          </div>
        </div>
      </div>

      <div className={`grid gap-6 ${hasSidebar ? 'lg:grid-cols-[minmax(0,1fr)_20rem]' : ''}`}>
        <div className="surface-panel px-6 py-6 md:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="section-kicker">Archive</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
                All {displayTag} Articles
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
              This is the narrowest archive slice in the system, useful when you want a specific
              concept or tool rather than a broad subject area.
            </p>
          </div>

          <div className="mt-6 space-y-6">
            {sortedPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>

        {hasSidebar ? (
          <aside className="space-y-5">
            {categoryConfig && categoryTone ? (
              <div className="surface-card px-5 py-5">
                <p className="section-kicker">Category link</p>
                <div className="mt-4">
                  <Link
                    href={`/categories/${getCategorySlug(categoryConfig.name)}`}
                    className="flex items-center justify-between rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 px-4 py-4 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:text-slate-950 theme-dark:border-slate-800 theme-dark:bg-slate-950/70 theme-dark:text-slate-300 theme-dark:hover:border-indigo-500/60 theme-dark:hover:text-white"
                  >
                    <span>{categoryConfig.name}</span>
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${categoryBadgeStyles[categoryTone]}`}
                    >
                      Category
                    </span>
                  </Link>
                </div>
              </div>
            ) : null}

            {validRelatedTags.length > 0 ? (
              <div className="surface-card px-5 py-5">
                <p className="section-kicker">Related tags</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {validRelatedTags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tags/${toTagSlug(tag)}`}
                      className="meta-chip normal-case tracking-normal"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {frequentCoTags.length > 0 ? (
              <div className="surface-card px-5 py-5">
                <p className="section-kicker">Often used with</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {frequentCoTags.map(([tag, count]) => (
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
          </aside>
        ) : null}
      </div>
    </section>
  )
}

