import { guides } from 'app/lib/guides'
import type { Metadata } from 'next'
import { baseUrl } from 'app/sitemap'
import Link from 'next/link'
import { generateItemListSchema, generateCollectionPageSchema, schemaToJsonLd } from 'app/lib/schemas'

export const metadata: Metadata = {
  title: 'Guides - Comprehensive Learning Paths',
  description:
    'Explore our comprehensive guides and tutorials. From AI development to SEO optimization, find structured learning paths to master new skills.',
  alternates: {
    canonical: `${baseUrl}/guides`,
  },
  openGraph: {
    title: 'Guides | ToLearn Blog',
    description:
      'Comprehensive guides and tutorials covering AI development, SEO, web development, and more. Start your learning journey today.',
    url: `${baseUrl}/guides`,
    type: 'website',
  },
}

const difficultyColors = {
  Beginner: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
  Intermediate: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
  Advanced: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
}

export default function GuidesPage() {
  // Group guides by difficulty
  const beginnerGuides = guides.filter((g) => g.difficulty === 'Beginner')
  const intermediateGuides = guides.filter((g) => g.difficulty === 'Intermediate')
  const advancedGuides = guides.filter((g) => g.difficulty === 'Advanced')

  // Generate schemas
  const itemListSchema = generateItemListSchema({
    name: 'Learning Guides',
    description: 'Comprehensive guides and tutorials for developers',
    items: guides.map((guide, index) => ({
      url: `${baseUrl}/guides/${guide.slug}`,
      name: guide.title,
      description: guide.description,
      position: index + 1,
    })),
  })

  const collectionPageSchema = generateCollectionPageSchema({
    name: 'Guides - Comprehensive Learning Paths',
    description: 'Explore our comprehensive guides and tutorials covering AI, SEO, web development, and more.',
    url: `${baseUrl}/guides`,
    dateModified: new Date().toISOString(),
    items: guides.map((guide, index) => ({
      url: `${baseUrl}/guides/${guide.slug}`,
      name: guide.title,
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
        <h1 className="mb-4 text-4xl font-black tracking-tight text-gray-900 dark:text-gray-100">
          Learning Guides
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Comprehensive, step-by-step guides to help you master new skills. Each guide provides
          structured learning paths from fundamentals to advanced concepts.
        </p>
      </div>

      {/* Difficulty Legend */}
      <div className="mb-10 flex justify-center gap-4 flex-wrap">
        <span className={`px-3 py-1 rounded-full text-sm ${difficultyColors.Beginner}`}>
          Beginner
        </span>
        <span className={`px-3 py-1 rounded-full text-sm ${difficultyColors.Intermediate}`}>
          Intermediate
        </span>
        <span className={`px-3 py-1 rounded-full text-sm ${difficultyColors.Advanced}`}>
          Advanced
        </span>
      </div>

      {/* Beginner Guides */}
      {beginnerGuides.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span className="text-green-500">●</span> Getting Started
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {beginnerGuides.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        </div>
      )}

      {/* Intermediate Guides */}
      {intermediateGuides.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span className="text-yellow-500">●</span> Level Up Your Skills
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {intermediateGuides.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        </div>
      )}

      {/* Advanced Guides */}
      {advancedGuides.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span className="text-red-500">●</span> Advanced Topics
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {advancedGuides.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} />
            ))}
          </div>
        </div>
      )}

      {/* Additional Resources */}
      <div className="mt-16 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          Looking for More?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Our guides are designed to provide comprehensive coverage of specific topics. For more
          focused content, check out our topic hubs or browse articles by category.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/topics"
            className="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Browse Topic Hubs
          </Link>
          <Link
            href="/categories"
            className="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            View Categories
          </Link>
          <Link
            href="/blog"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            All Articles
          </Link>
        </div>
      </div>
    </section>
  )
}

function GuideCard({ guide }: { guide: (typeof guides)[0] }) {
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="group block p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all hover:shadow-lg"
    >
      <div className="flex items-start gap-4">
        <span className="text-4xl">{guide.icon}</span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${difficultyColors[guide.difficulty]}`}
            >
              {guide.difficulty}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-500">{guide.estimatedTime}</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {guide.title}
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {guide.description}
          </p>
          <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
            <span>{guide.steps.length} steps</span>
            <span>•</span>
            <span>{guide.relatedTags.slice(0, 2).join(', ')}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
