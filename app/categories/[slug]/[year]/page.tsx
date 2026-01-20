import { getBlogPosts, calculateReadingTime } from 'app/blog/utils'
import { notFound } from 'next/navigation'
import { categories, getCategorySlug } from 'app/lib/categories'
import { getCategoryDescription } from 'app/lib/category-descriptions'
import { PostCard } from 'app/components/post-card'
import type { Metadata } from 'next'
import { baseUrl } from 'app/sitemap'
import Link from 'next/link'
import { generateItemListSchema, generateCollectionPageSchema, generateBreadcrumbSchema, schemaToJsonLd } from 'app/lib/schemas'

// Minimum posts required for a year page to be generated
const MIN_POSTS_FOR_YEAR_PAGE = 3

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
          year: year.toString(),
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

  const category = categories.find((cat) => getCategorySlug(cat.name) === normalizedSlug)

  if (!category || isNaN(year)) {
    return {
      title: 'Not Found',
    }
  }

  const categoryDesc = getCategoryDescription(category.name)
  const title = `${category.name} Articles from ${year}`
  const description = `Browse all ${category.name} articles published in ${year}. ${categoryDesc?.shortDescription || ''}`

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

  // Find the category
  const category = categories.find((cat) => getCategorySlug(cat.name) === normalizedSlug)

  if (!category || isNaN(year)) {
    notFound()
  }

  // Filter posts by category and year
  const posts = allPosts.filter((post) => {
    if (post.metadata.category !== category.name) return false
    const postYear = new Date(post.metadata.publishedAt).getFullYear()
    return postYear === year
  })

  // Check minimum posts requirement
  if (posts.length < MIN_POSTS_FOR_YEAR_PAGE) {
    notFound()
  }

  const sortedPosts = posts.sort(
    (a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
  )

  // Get all years with enough posts for navigation
  const allCategoryPosts = allPosts.filter((post) => post.metadata.category === category.name)
  const yearCounts: Record<number, number> = {}
  allCategoryPosts.forEach((post) => {
    const postYear = new Date(post.metadata.publishedAt).getFullYear()
    yearCounts[postYear] = (yearCounts[postYear] || 0) + 1
  })
  const availableYears = Object.entries(yearCounts)
    .filter(([, count]) => count >= MIN_POSTS_FOR_YEAR_PAGE)
    .map(([y]) => parseInt(y, 10))
    .sort((a, b) => b - a)

  // Calculate stats
  const totalReadingTime = posts.reduce((acc, post) => acc + calculateReadingTime(post.content), 0)

  // Get popular tags from posts in this year
  const tagCounts: Record<string, number> = {}
  posts.forEach((post) => {
    post.metadata.tags?.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })
  const popularTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag)

  // Generate schemas
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
    name: `${category.name} Articles from ${year}`,
    description: `Browse ${category.name} articles published in ${year}`,
    url: `${baseUrl}/categories/${normalizedSlug}/${year}`,
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
            <Link href="/categories" className="hover:text-blue-600 dark:hover:text-blue-400">
              Categories
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href={`/categories/${normalizedSlug}`}
              className="hover:text-blue-600 dark:hover:text-blue-400"
            >
              {category.name}
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 dark:text-gray-100 font-medium">{year}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-black tracking-tight text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3">
          <span className="text-5xl">{category.emoji}</span>
          {category.name} in {year}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {posts.length} {posts.length === 1 ? 'article' : 'articles'} published in {year}
        </p>
      </div>

      {/* Statistics */}
      <div className="mb-10 grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{posts.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Articles</div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{totalReadingTime}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Min Read Total</div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {Object.keys(tagCounts).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Topics Covered</div>
        </div>
      </div>

      {/* Year Navigation */}
      {availableYears.length > 1 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
            Browse Other Years
          </h2>
          <div className="flex flex-wrap gap-2">
            {availableYears.map((y) => (
              <Link
                key={y}
                href={`/categories/${normalizedSlug}/${y}`}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  y === year
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {y}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Popular Tags */}
      {popularTags.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
            Popular Topics in {year}
          </h2>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Back to category link */}
      <div className="mb-8">
        <Link
          href={`/categories/${normalizedSlug}`}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← View all {category.name} articles
        </Link>
      </div>

      {/* Articles List */}
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        All {year} Articles
      </h2>
      <div className="space-y-6">
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
    </section>
  )
}
