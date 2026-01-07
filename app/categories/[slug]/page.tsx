import { getBlogPostsMetadata } from 'app/blog/utils'
import { notFound } from 'next/navigation'
import { categories, getCategorySlug } from 'app/lib/categories'
import { PostCard } from 'app/components/post-card'
import type { Metadata } from 'next'
import { baseUrl } from 'app/sitemap'

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

  return {
    title: `${category.name} - Blog Category`,
    description: `Read the latest articles about ${category.name}.`,
    alternates: {
      canonical: `${baseUrl}/categories/${normalizedSlug}`,
    },
  }
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const normalizedSlug = normalizeCategorySlug(params.slug)
  const allPosts = getBlogPostsMetadata()
  
  // Find the category configuration that matches the URL slug
  const category = categories.find(cat =>
    getCategorySlug(cat.name) === normalizedSlug
  )

  if (!category) {
    notFound()
  }

  // Filter posts that belong to this category
  const posts = allPosts.filter(post => post.metadata.category === category.name)

  return (
    <section>
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-black tracking-tight text-gray-900 dark:text-gray-100 flex items-center justify-center gap-3">
          <span className="text-5xl">{category.emoji}</span>
          {category.name}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {posts.length} {posts.length === 1 ? 'article' : 'articles'} in this collection
        </p>
      </div>

      <div className="space-y-6">
        {posts
          .sort((a, b) => {
            if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
              return -1
            }
            return 1
          })
          .map((post) => (
            <PostCard key={post.slug} post={post} />
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
