import { getBlogPosts, getBlogPostsMetadata, calculateReadingTime } from 'app/blog/utils'
import { notFound } from 'next/navigation'
import { categories, getCategorySlug, getCategoryEmoji } from 'app/lib/categories'
import { getCategoryDescription } from 'app/lib/category-descriptions'
import { PostCard } from 'app/components/post-card'
import type { Metadata } from 'next'
import { baseUrl } from 'app/sitemap'
import Link from 'next/link'
import { generateItemListSchema, generateCollectionPageSchema, schemaToJsonLd } from 'app/lib/schemas'
import { slugify } from 'app/lib/formatters'

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

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const normalizedSlug = normalizeCategorySlug(params.slug)
  const category = categories.find(cat =>
    getCategorySlug(cat.name) === normalizedSlug
  )

  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  const categoryDesc = getCategoryDescription(category.name)
  const description = categoryDesc?.shortDescription || `Read the latest articles about ${category.name}.`
  const keywords = categoryDesc?.keywords || [category.name]

  return {
    title: `${category.name} - Blog Category`,
    description,
    keywords,
    alternates: {
      canonical: `${baseUrl}/categories/${normalizedSlug}`,
    },
    openGraph: {
      title: `${category.name} Articles | ToLearn Blog`,
      description,
      url: `${baseUrl}/categories/${normalizedSlug}`,
      type: 'website',
    },
  }
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const normalizedSlug = normalizeCategorySlug(params.slug)
  const allPosts = getBlogPosts()

  // Find the category configuration that matches the URL slug
  const category = categories.find(cat =>
    getCategorySlug(cat.name) === normalizedSlug
  )

  if (!category) {
    notFound()
  }

  // Filter posts that belong to this category
  const posts = allPosts.filter(post => post.metadata.category === category.name)
  const sortedPosts = posts.sort((a, b) =>
    new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
  )

  // Get category description
  const categoryDesc = getCategoryDescription(category.name)

  // Calculate statistics
  const totalReadingTime = posts.reduce((acc, post) => acc + calculateReadingTime(post.content), 0)

  // Get popular tags from this category
  const tagCounts: Record<string, number> = {}
  posts.forEach(post => {
    post.metadata.tags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })
  const popularTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag]) => tag)

  // Get years with posts in this category
  const yearsWithPosts = Array.from(
    new Set(posts.map(post => new Date(post.metadata.publishedAt).getFullYear()))
  ).sort((a, b) => b - a)

  // Get related categories
  const relatedCategories = categoryDesc?.relatedCategories || []
  const otherCategories = categories.filter(
    cat => cat.name !== 'All' && cat.name !== category.name && relatedCategories.includes(cat.name)
  )

  // Generate schemas
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
    name: `${category.name} - Blog Category`,
    description: categoryDesc?.shortDescription || `Articles about ${category.name}`,
    url: `${baseUrl}/categories/${normalizedSlug}`,
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
          <span className="text-5xl">{category.emoji}</span>
          {category.name}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {posts.length} {posts.length === 1 ? 'article' : 'articles'} in this collection
        </p>
      </div>

      {/* Category Description */}
      {categoryDesc && (
        <div className="mb-10 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {categoryDesc.longDescription}
          </p>
        </div>
      )}

      {/* Statistics Card */}
      <div className="mb-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{posts.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Articles</div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{totalReadingTime}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Min Read Total</div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{Object.keys(tagCounts).length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Topics</div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{yearsWithPosts.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active Years</div>
        </div>
      </div>

      {/* Popular Tags */}
      {popularTags.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Popular Topics</h2>
          <div className="flex flex-wrap gap-2">
            {popularTags.map(tag => (
              <Link
                key={tag}
                href={`/tags/${slugify(tag)}`}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Year Navigation */}
      {yearsWithPosts.length > 1 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Browse by Year</h2>
          <div className="flex flex-wrap gap-2">
            {yearsWithPosts.map(year => {
              const yearPostCount = posts.filter(
                post => new Date(post.metadata.publishedAt).getFullYear() === year
              ).length
              return (
                <Link
                  key={year}
                  href={`/categories/${normalizedSlug}/${year}`}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {year} ({yearPostCount})
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Related Categories */}
      {otherCategories.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Related Categories</h2>
          <div className="flex flex-wrap gap-3">
            {otherCategories.map(cat => (
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
        All {category.name} Articles
      </h2>
      <div className="space-y-6">
        {sortedPosts.map((post) => (
          <PostCard key={post.slug} post={{ slug: post.slug, metadata: post.metadata, readingTime: calculateReadingTime(post.content) }} />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-600 dark:text-gray-400">
            No articles found in this category yet.
          </p>
        </div>
      )}
    </section>
  )
}
