import { Metadata } from 'next'
import Link from 'next/link'
import pseoData from '@/data/pseo_data.json'
import { baseUrl } from 'app/sitemap'
import {
  generateBreadcrumbSchema,
  generateCollectionPageSchema,
  schemaToJsonLd,
} from 'app/lib/schemas'

export const metadata: Metadata = {
  title: 'Portfolio Solutions | Features for Developer Portfolios',
  description: 'Explore portfolio template features including dark mode, SEO optimization, responsive design, fast performance, and blog functionality.',
  keywords: ['portfolio features', 'dark mode portfolio', 'SEO portfolio', 'responsive portfolio'],
  alternates: {
    canonical: `${baseUrl}/solutions`,
  },
  openGraph: {
    title: 'Portfolio Solutions | Features for Developer Portfolios',
    description: 'Explore portfolio template features for modern developers.',
    type: 'website',
    url: `${baseUrl}/solutions`,
  },
}

interface Feature {
  slug: string
  name: string
  description: string
  benefits: string[]
}

export default function SolutionsPage() {
  const features = pseoData.features as Feature[]

  // Feature icons
  const featureIcons: Record<string, string> = {
    'dark-mode': '🌙',
    'seo-optimized': '🔍',
    'responsive-design': '📱',
    'fast-performance': '⚡',
    'blog-ready': '📝',
  }

  // Generate schemas
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: baseUrl },
    { name: 'Solutions', url: `${baseUrl}/solutions` },
  ])

  const collectionSchema = generateCollectionPageSchema({
    name: 'Portfolio Solutions',
    description: 'Features and solutions for developer portfolios',
    url: `${baseUrl}/solutions`,
    items: features.map((feature, i) => ({
      url: `${baseUrl}/solutions/${feature.slug}`,
      name: feature.name,
      position: i + 1,
    })),
  })

  return (
    <section>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schemaToJsonLd([breadcrumbSchema, collectionSchema]),
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
          <li className="text-gray-900 dark:text-gray-100 font-medium">Solutions</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-black tracking-tight text-gray-900 dark:text-gray-100">
          Portfolio Solutions
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Explore the features that make our portfolio templates stand out.
          Each solution is built with best practices and modern technologies.
        </p>
      </header>

      {/* Features Grid */}
      <div className="mb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(feature => (
            <Link
              key={feature.slug}
              href={`/solutions/${feature.slug}`}
              className="group p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
            >
              <div className="text-4xl mb-4">
                {featureIcons[feature.slug] || '✨'}
              </div>
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {feature.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {feature.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {feature.benefits.slice(0, 2).map((benefit, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
              <div className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-medium">
                Learn more →
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* All Features Summary */}
      <div className="mb-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 text-center">
          All Features Included
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {features.map(feature => (
            <div key={feature.slug} className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{feature.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Ready to Build Your Portfolio?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          All these features are included in our portfolio templates. Choose your technology and role.
        </p>
        <Link
          href="/templates"
          className="inline-block px-8 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 transition-colors"
        >
          Browse Templates
        </Link>
      </div>
    </section>
  )
}
