import { guides, getGuide } from 'app/lib/guides'
import { getBlogPosts, calculateReadingTime } from 'app/blog/utils'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { baseUrl } from 'app/sitemap'
import Link from 'next/link'
import { PostCard } from 'app/components/post-card'
import { categories, getCategorySlug } from 'app/lib/categories'
import {
  generateCourseSchema,
  generateBreadcrumbSchema,
  schemaToJsonLd,
} from 'app/lib/schemas'
import { slugify } from 'app/lib/formatters'

export async function generateStaticParams() {
  return guides.map((guide) => ({
    slug: guide.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const guide = getGuide(params.slug)

  if (!guide) {
    return {
      title: 'Guide Not Found',
    }
  }

  return {
    title: `${guide.title} - Learning Guide`,
    description: guide.description,
    keywords: guide.targetKeywords,
    alternates: {
      canonical: `${baseUrl}/guides/${guide.slug}`,
    },
    openGraph: {
      title: `${guide.title} | ToLearn Blog`,
      description: guide.description,
      url: `${baseUrl}/guides/${guide.slug}`,
      type: 'website',
    },
  }
}

const difficultyColors = {
  Beginner: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
  Intermediate: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
  Advanced: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = getGuide(params.slug)

  if (!guide) {
    notFound()
  }

  const allPosts = getBlogPosts()

  // Find posts related to this guide
  const normalizedGuideTags = guide.relatedTags.map((t) => t.toLowerCase())
  const relatedPosts = allPosts
    .filter((post) => {
      if (!post.metadata.tags) return false
      return post.metadata.tags.some((tag) => normalizedGuideTags.includes(tag.toLowerCase()))
    })
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime()
    )
    .slice(0, 6)

  // Get related categories
  const relatedCategoryConfigs = categories.filter(
    (cat) => cat.name !== 'All' && guide.relatedCategories.includes(cat.name)
  )

  // Get other guides
  const otherGuides = guides.filter((g) => g.slug !== guide.slug).slice(0, 3)

  // Generate schemas
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: baseUrl },
    { name: 'Guides', url: `${baseUrl}/guides` },
    { name: guide.title, url: `${baseUrl}/guides/${guide.slug}` },
  ])

  const courseSchema = generateCourseSchema({
    name: guide.title,
    description: guide.longDescription,
    url: `${baseUrl}/guides/${guide.slug}`,
    educationalLevel: guide.difficulty,
    duration: guide.estimatedTime,
    topics: guide.relatedTags,
    dateModified: new Date().toISOString(),
  })

  // HowTo schema for the steps
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: guide.title,
    description: guide.description,
    totalTime: guide.estimatedTime,
    step: guide.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.description,
    })),
  }

  return (
    <section>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schemaToJsonLd([breadcrumbSchema, courseSchema, howToSchema]),
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
            <Link href="/guides" className="hover:text-blue-600 dark:hover:text-blue-400">
              Guides
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 dark:text-gray-100 font-medium truncate max-w-[200px]">
            {guide.title}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-6xl">{guide.icon}</span>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-sm ${difficultyColors[guide.difficulty]}`}>
                {guide.difficulty}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-500">
                {guide.estimatedTime}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-gray-100">
              {guide.title}
            </h1>
          </div>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400">{guide.description}</p>
      </div>

      {/* Long Description */}
      <div className="mb-10 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{guide.longDescription}</p>
      </div>

      {/* Prerequisites */}
      {guide.prerequisites && guide.prerequisites.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Prerequisites
          </h2>
          <ul className="space-y-2">
            {guide.prerequisites.map((prereq, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-gray-600 dark:text-gray-400"
              >
                <span className="text-blue-500 mt-1">✓</span>
                {prereq}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Steps */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
          What You&apos;ll Learn
        </h2>
        <div className="space-y-4">
          {guide.steps.map((step, index) => (
            <div
              key={index}
              className="flex gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{step.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Related Tags */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          Topics Covered
        </h2>
        <div className="flex flex-wrap gap-2">
          {guide.relatedTags.map((tag) => (
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

      {/* Related Categories */}
      {relatedCategoryConfigs.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
            Related Categories
          </h2>
          <div className="flex flex-wrap gap-3">
            {relatedCategoryConfigs.map((cat) => (
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

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
            Related Articles
          </h2>
          <div className="space-y-4">
            {relatedPosts.map((post) => (
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
      )}

      {/* Other Guides */}
      {otherGuides.length > 0 && (
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
            Explore More Guides
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {otherGuides.map((otherGuide) => (
              <Link
                key={otherGuide.slug}
                href={`/guides/${otherGuide.slug}`}
                className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{otherGuide.icon}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${difficultyColors[otherGuide.difficulty]}`}
                  >
                    {otherGuide.difficulty}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {otherGuide.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                  {otherGuide.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Back to guides */}
      <div className="mt-8 text-center">
        <Link
          href="/guides"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← View All Guides
        </Link>
      </div>
    </section>
  )
}
