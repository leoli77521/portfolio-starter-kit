import { calculateReadingTime, getBlogPosts } from 'app/blog/utils'
import { notFound } from 'next/navigation'
import { categories, getCategoryColor, getCategorySlug } from 'app/lib/categories'
import { getCategoryDescription } from 'app/lib/category-descriptions'
import { PostCard } from 'app/components/post-card'
import type { Metadata } from 'next'
import { baseUrl } from 'app/sitemap'
import Link from 'next/link'
import {
  generateCollectionPageSchema,
  generateItemListSchema,
  schemaToJsonLd,
} from 'app/lib/schemas'
import { slugify } from 'app/lib/formatters'

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

const normalizeCategorySlug = (value: string) => {
  try {
    return getCategorySlug(decodeURIComponent(value))
  } catch {
    return getCategorySlug(value)
  }
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: getCategorySlug(category.name),
  }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const normalizedSlug = normalizeCategorySlug(params.slug)
  const category = categories.find((item) => getCategorySlug(item.name) === normalizedSlug)

  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  const categoryDesc = getCategoryDescription(category.name)
  const description =
    categoryDesc?.shortDescription || `Read the latest articles about ${category.name}.`
  const keywords = categoryDesc?.keywords || [category.name]

  return {
    title: category.name,
    description,
    keywords,
    alternates: {
      canonical: `${baseUrl}/categories/${normalizedSlug}`,
    },
    openGraph: {
      title: `${category.name} | ToLearn Blog`,
      description,
      url: `${baseUrl}/categories/${normalizedSlug}`,
      type: 'website',
    },
  }
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const normalizedSlug = normalizeCategorySlug(params.slug)
  const allPosts = getBlogPosts()
  const category = categories.find((item) => getCategorySlug(item.name) === normalizedSlug)

  if (!category) {
    notFound()
  }

  const posts = allPosts.filter((post) => post.metadata.category === category.name)
  const sortedPosts = posts.sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
  )

  const categoryDesc = getCategoryDescription(category.name)
  const totalReadingTime = posts.reduce(
    (sum, post) => sum + calculateReadingTime(post.content),
    0
  )

  const tagCounts: Record<string, number> = {}
  posts.forEach((post) => {
    post.metadata.tags?.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })
  const popularTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([tag]) => tag)

  const yearsWithPosts = Array.from(
    new Set(posts.map((post) => new Date(post.metadata.publishedAt).getFullYear()))
  ).sort((a, b) => b - a)

  const relatedCategories = categoryDesc?.relatedCategories || []
  const otherCategories = categories.filter(
    (item) =>
      item.name !== 'All' &&
      item.name !== category.name &&
      relatedCategories.includes(item.name)
  )

  const itemListSchema = generateItemListSchema({
    name: `${category.name} Articles`,
    description: categoryDesc?.shortDescription || `Articles about ${category.name}`,
    items: sortedPosts.slice(0, 10).map((post, index) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      name: post.metadata.title,
      description: post.metadata.summary,
      position: index + 1,
    })),
  })

  const collectionPageSchema = generateCollectionPageSchema({
    name: `${category.name} Collection`,
    description: categoryDesc?.shortDescription || `Articles about ${category.name}`,
    url: `${baseUrl}/categories/${normalizedSlug}`,
    dateModified: new Date().toISOString(),
    items: sortedPosts.map((post, index) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      name: post.metadata.title,
      position: index + 1,
    })),
  })

  const categoryTone = getCategoryColor(category.name)
  const hasSidebar =
    popularTags.length > 0 || yearsWithPosts.length > 1 || otherCategories.length > 0

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
              href="/categories"
              className="transition-colors hover:text-slate-950 theme-dark:hover:text-white"
            >
              Categories
            </Link>
          </li>
          <li>/</li>
          <li className="font-medium text-slate-900 theme-dark:text-slate-100">{category.name}</li>
        </ol>
      </nav>

      <div className="surface-panel px-6 py-8 md:px-8 md:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="section-kicker">Category archive</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${categoryBadgeStyles[categoryTone]}`}
              >
                {category.name}
              </span>
              {yearsWithPosts[0] ? (
                <span className="meta-chip normal-case tracking-normal">
                  Latest year: {yearsWithPosts[0]}
                </span>
              ) : null}
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white md:text-5xl">
              {category.name}
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600 theme-dark:text-slate-300 md:text-lg">
              {categoryDesc?.shortDescription ||
                `Browse every article filed under ${category.name}.`}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/categories" className="editorial-link">
              All categories
            </Link>
            <Link href="/blog" className="editorial-link">
              Open journal
            </Link>
          </div>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="stat-pill">
            <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
              {posts.length}
            </span>
            <span>articles in this category</span>
          </div>
          <div className="stat-pill">
            <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
              {totalReadingTime}
            </span>
            <span>total reading minutes</span>
          </div>
          <div className="stat-pill">
            <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
              {Object.keys(tagCounts).length}
            </span>
            <span>recurring topics</span>
          </div>
          <div className="stat-pill">
            <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
              {yearsWithPosts.length}
            </span>
            <span>active publishing years</span>
          </div>
        </div>
      </div>

      <div className={`grid gap-6 ${hasSidebar ? 'lg:grid-cols-[minmax(0,1fr)_20rem]' : ''}`}>
        <div className="space-y-6">
          {categoryDesc ? (
            <div className="surface-panel px-6 py-6 md:px-8">
              <p className="section-kicker">Overview</p>
              <p className="mt-4 text-sm leading-8 text-slate-600 theme-dark:text-slate-300 md:text-base">
                {categoryDesc.longDescription}
              </p>
            </div>
          ) : null}

          <div className="surface-panel px-6 py-6 md:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="section-kicker">Archive</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
                  {category.name === 'All' ? 'All Articles' : `${category.name} Articles`}
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                Articles are sorted from newest to oldest so the latest additions surface first.
              </p>
            </div>

            {sortedPosts.length > 0 ? (
              <div className="mt-6 space-y-6">
                {sortedPosts.map((post) => (
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
                  No articles have been filed under this category yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {hasSidebar ? (
          <aside className="space-y-5">
            {popularTags.length > 0 ? (
              <div className="surface-card px-5 py-5">
                <p className="section-kicker">Popular tags</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tags/${slugify(tag)}`}
                      className="meta-chip normal-case tracking-normal"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {yearsWithPosts.length > 1 ? (
              <div className="surface-card px-5 py-5">
                <p className="section-kicker">Browse by year</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {yearsWithPosts.map((year) => {
                    const yearCount = posts.filter(
                      (post) => new Date(post.metadata.publishedAt).getFullYear() === year
                    ).length

                    return (
                      <Link
                        key={year}
                        href={`/categories/${normalizedSlug}/${year}`}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:text-slate-950 theme-dark:border-slate-800 theme-dark:bg-slate-950/80 theme-dark:text-slate-300 theme-dark:hover:border-indigo-500/60 theme-dark:hover:text-white"
                      >
                        <span>{year}</span>
                        <span className="meta-chip normal-case tracking-normal">{yearCount}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ) : null}

            {otherCategories.length > 0 ? (
              <div className="surface-card px-5 py-5">
                <p className="section-kicker">Related categories</p>
                <div className="mt-4 space-y-3">
                  {otherCategories.map((item) => (
                    <Link
                      key={item.name}
                      href={`/categories/${getCategorySlug(item.name)}`}
                      className="flex items-center justify-between rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:text-slate-950 theme-dark:border-slate-800 theme-dark:bg-slate-950/70 theme-dark:text-slate-300 theme-dark:hover:border-indigo-500/60 theme-dark:hover:text-white"
                    >
                      <span>{item.name}</span>
                      <span className="text-slate-400">/</span>
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

