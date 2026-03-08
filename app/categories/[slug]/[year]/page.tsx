import { calculateReadingTime, getBlogPosts } from 'app/blog/utils'
import { notFound } from 'next/navigation'
import { categories, getCategoryColor, getCategorySlug } from 'app/lib/categories'
import { getCategoryDescription } from 'app/lib/category-descriptions'
import { PostCard } from 'app/components/post-card'
import type { Metadata } from 'next'
import { baseUrl } from 'app/sitemap'
import Link from 'next/link'
import {
  generateBreadcrumbSchema,
  generateCollectionPageSchema,
  generateItemListSchema,
  schemaToJsonLd,
} from 'app/lib/schemas'

const MIN_POSTS_FOR_YEAR_PAGE = 3

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
  const allPosts = getBlogPosts()
  const params: { slug: string; year: string }[] = []

  categories.forEach((category) => {
    if (category.name === 'All') return

    const categoryPosts = allPosts.filter((post) => post.metadata.category === category.name)
    const yearCounts: Record<number, number> = {}

    categoryPosts.forEach((post) => {
      const year = new Date(post.metadata.publishedAt).getFullYear()
      yearCounts[year] = (yearCounts[year] || 0) + 1
    })

    Object.entries(yearCounts).forEach(([year, count]) => {
      if (count >= MIN_POSTS_FOR_YEAR_PAGE) {
        params.push({
          slug: getCategorySlug(category.name),
          year,
        })
      }
    })
  })

  return params
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; year: string }
}): Promise<Metadata> {
  const normalizedSlug = normalizeCategorySlug(params.slug)
  const year = parseInt(params.year, 10)
  const category = categories.find((item) => getCategorySlug(item.name) === normalizedSlug)

  if (!category || isNaN(year)) {
    return {
      title: 'Not Found',
    }
  }

  const categoryDesc = getCategoryDescription(category.name)
  const title = `${category.name} in ${year}`
  const description = `Browse ${category.name} articles published in ${year}. ${
    categoryDesc?.shortDescription || ''
  }`

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/categories/${normalizedSlug}/${year}`,
    },
    openGraph: {
      title: `${title} | ToLearn Blog`,
      description,
      url: `${baseUrl}/categories/${normalizedSlug}/${year}`,
      type: 'website',
    },
  }
}

export default function CategoryYearPage({
  params,
}: {
  params: { slug: string; year: string }
}) {
  const normalizedSlug = normalizeCategorySlug(params.slug)
  const year = parseInt(params.year, 10)
  const allPosts = getBlogPosts()
  const category = categories.find((item) => getCategorySlug(item.name) === normalizedSlug)

  if (!category || isNaN(year)) {
    notFound()
  }

  const posts = allPosts.filter((post) => {
    if (post.metadata.category !== category.name) return false
    return new Date(post.metadata.publishedAt).getFullYear() === year
  })

  if (posts.length < MIN_POSTS_FOR_YEAR_PAGE) {
    notFound()
  }

  const sortedPosts = posts.sort(
    (a, b) =>
      new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
  )

  const allCategoryPosts = allPosts.filter((post) => post.metadata.category === category.name)
  const yearCounts: Record<number, number> = {}
  allCategoryPosts.forEach((post) => {
    const postYear = new Date(post.metadata.publishedAt).getFullYear()
    yearCounts[postYear] = (yearCounts[postYear] || 0) + 1
  })

  const availableYears = Object.entries(yearCounts)
    .filter(([, count]) => count >= MIN_POSTS_FOR_YEAR_PAGE)
    .map(([currentYear]) => parseInt(currentYear, 10))
    .sort((a, b) => b - a)

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

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: baseUrl },
    { name: 'Categories', url: `${baseUrl}/categories` },
    { name: category.name, url: `${baseUrl}/categories/${normalizedSlug}` },
    { name: year.toString(), url: `${baseUrl}/categories/${normalizedSlug}/${year}` },
  ])

  const itemListSchema = generateItemListSchema({
    name: `${category.name} Articles from ${year}`,
    description: `${category.name} articles published in ${year}`,
    items: sortedPosts.map((post, index) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      name: post.metadata.title,
      description: post.metadata.summary,
      position: index + 1,
    })),
  })

  const collectionPageSchema = generateCollectionPageSchema({
    name: `${category.name} in ${year}`,
    description: `Browse ${category.name} articles published in ${year}`,
    url: `${baseUrl}/categories/${normalizedSlug}/${year}`,
    dateModified: new Date().toISOString(),
    items: sortedPosts.map((post, index) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      name: post.metadata.title,
      position: index + 1,
    })),
  })

  const categoryDesc = getCategoryDescription(category.name)
  const categoryTone = getCategoryColor(category.name)

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
              href="/categories"
              className="transition-colors hover:text-slate-950 theme-dark:hover:text-white"
            >
              Categories
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href={`/categories/${normalizedSlug}`}
              className="transition-colors hover:text-slate-950 theme-dark:hover:text-white"
            >
              {category.name}
            </Link>
          </li>
          <li>/</li>
          <li className="font-medium text-slate-900 theme-dark:text-slate-100">{year}</li>
        </ol>
      </nav>

      <div className="surface-panel px-6 py-8 md:px-8 md:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="section-kicker">Year archive</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${categoryBadgeStyles[categoryTone]}`}
              >
                {category.name}
              </span>
              <span className="meta-chip normal-case tracking-normal">{year}</span>
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white md:text-5xl">
              {category.name} in {year}
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600 theme-dark:text-slate-300 md:text-lg">
              {categoryDesc?.shortDescription ||
                `Browse all ${category.name} articles published in ${year}.`}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href={`/categories/${normalizedSlug}`} className="editorial-link">
              View full category
            </Link>
            <Link href="/categories" className="editorial-link">
              All categories
            </Link>
          </div>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <div className="stat-pill">
            <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
              {posts.length}
            </span>
            <span>articles in {year}</span>
          </div>
          <div className="stat-pill">
            <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
              {totalReadingTime}
            </span>
            <span>reading minutes</span>
          </div>
          <div className="stat-pill">
            <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
              {Object.keys(tagCounts).length}
            </span>
            <span>topics covered</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="surface-panel px-6 py-6 md:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="section-kicker">Archive</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
                All {year} Articles
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
              This yearly slice is only generated when the category has enough posts to be worth
              browsing as a standalone archive.
            </p>
          </div>

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
        </div>

        <aside className="space-y-5">
          {availableYears.length > 1 ? (
            <div className="surface-card px-5 py-5">
              <p className="section-kicker">Other years</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {availableYears.map((currentYear) => (
                  <Link
                    key={currentYear}
                    href={`/categories/${normalizedSlug}/${currentYear}`}
                    className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      currentYear === year
                        ? 'border-slate-900 bg-slate-900 text-white theme-dark:border-slate-100 theme-dark:bg-slate-100 theme-dark:text-slate-950'
                        : 'border-slate-200/80 bg-white/85 text-slate-700 hover:border-indigo-300 hover:text-slate-950 theme-dark:border-slate-800 theme-dark:bg-slate-950/80 theme-dark:text-slate-300 theme-dark:hover:border-indigo-500/60 theme-dark:hover:text-white'
                    }`}
                  >
                    {currentYear}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          {popularTags.length > 0 ? (
            <div className="surface-card px-5 py-5">
              <p className="section-kicker">Popular tags in {year}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {popularTags.map(([tag, count]) => (
                  <span key={tag} className="meta-chip normal-case tracking-normal">
                    {tag} ({count})
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  )
}

