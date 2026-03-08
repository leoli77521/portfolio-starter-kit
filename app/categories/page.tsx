import Link from 'next/link'
import type { Metadata } from 'next'
import { getBlogPosts } from 'app/blog/utils'
import { categories, getCategoryColor, getCategorySlug } from 'app/lib/categories'
import { getCategoryDescription } from 'app/lib/category-descriptions'
import { baseUrl } from 'app/sitemap'

export const metadata: Metadata = {
  title: 'Categories',
  description:
    'Browse ToLearn by category, from AI systems and web development to search visibility and productivity.',
  alternates: {
    canonical: `${baseUrl}/categories`,
  },
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

export default function CategoriesPage() {
  const allPosts = getBlogPosts()
  const categoryCounts = allPosts.reduce((acc, post) => {
    const category = post.metadata.category
    if (category) {
      acc[category] = (acc[category] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  const categoryCards = categories
    .filter((category) => category.name !== 'All')
    .map((category) => {
      const details = getCategoryDescription(category.name)

      return {
        ...category,
        count: categoryCounts[category.name] || 0,
        description:
          details?.shortDescription || `Browse the latest writing about ${category.name}.`,
        featuredTopics: details?.featuredTopics.slice(0, 3) || [],
      }
    })
    .sort((a, b) => b.count - a.count)

  const totalPosts = allPosts.length
  const activeCategories = categoryCards.filter((category) => category.count > 0).length
  const topCategory = categoryCards[0]

  return (
    <section className="space-y-8">
      <div className="surface-panel px-6 py-8 md:px-8 md:py-10">
        <p className="section-kicker">Browse by category</p>
        <div className="mt-3 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.75fr)] lg:items-end">
          <div>
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white md:text-5xl">
              A cleaner map of the archive
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 theme-dark:text-slate-300 md:text-lg">
              Categories are the fastest way to jump into the parts of ToLearn that matter
              to you, whether you are following AI systems, search visibility, or day-to-day
              execution on the web.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="stat-pill">
              <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
                {activeCategories}
              </span>
              <span>active categories</span>
            </div>
            <div className="stat-pill">
              <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
                {totalPosts}
              </span>
              <span>posts in the archive</span>
            </div>
            <div className="stat-pill">
              <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
                {topCategory?.name || 'Archive'}
              </span>
              <span>largest collection</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {categoryCards.map((category) => {
          const slug = getCategorySlug(category.name)

          return (
            <Link
              key={category.name}
              href={`/categories/${slug}`}
              className="surface-card group block px-6 py-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="section-kicker">Category</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950 transition-colors group-hover:text-indigo-700 theme-dark:text-white theme-dark:group-hover:text-indigo-300">
                    {category.name}
                  </h2>
                </div>
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${categoryBadgeStyles[getCategoryColor(category.name)]}`}
                >
                  {category.count} posts
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                {category.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {category.featuredTopics.map((topic) => (
                  <span key={topic} className="meta-chip normal-case tracking-normal">
                    {topic}
                  </span>
                ))}
              </div>

              <div className="mt-6 editorial-link">
                Open category
                <span aria-hidden="true">/</span>
                <span>{slug}</span>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="surface-panel flex flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="section-kicker">Need a different way in?</p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
            If categories feel too broad, use topic hubs for curated paths or browse the full
            journal archive directly.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/topics" className="editorial-link">
            Explore topic hubs
          </Link>
          <Link href="/blog" className="editorial-link">
            Open the journal
          </Link>
        </div>
      </div>
    </section>
  )
}

