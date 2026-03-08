import type { Metadata } from 'next'
import Link from 'next/link'
import pseoData from '@/data/pseo_data.json'
import { baseUrl } from 'app/sitemap'
import {
  generateBreadcrumbSchema,
  generateCollectionPageSchema,
  schemaToJsonLd,
} from 'app/lib/schemas'

export const metadata: Metadata = {
  title: 'Solutions',
  description:
    'Browse portfolio template features such as dark mode, SEO, responsiveness, performance, and blog support.',
  keywords: ['portfolio features', 'dark mode portfolio', 'SEO portfolio', 'responsive portfolio'],
  alternates: {
    canonical: `${baseUrl}/solutions`,
  },
  openGraph: {
    title: 'Solutions | ToLearn Blog',
    description: 'Feature-driven entry points for the portfolio template library.',
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

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: baseUrl },
    { name: 'Solutions', url: `${baseUrl}/solutions` },
  ])

  const collectionSchema = generateCollectionPageSchema({
    name: 'Portfolio Solutions',
    description: 'Feature-driven pages for portfolio templates',
    url: `${baseUrl}/solutions`,
    items: features.map((feature, index) => ({
      url: `${baseUrl}/solutions/${feature.slug}`,
      name: feature.name,
      position: index + 1,
    })),
  })

  return (
    <section className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schemaToJsonLd([breadcrumbSchema, collectionSchema]),
        }}
      />

      <div className="surface-panel px-6 py-8 md:px-8 md:py-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.75fr)] lg:items-end">
          <div>
            <p className="section-kicker">Feature-driven browsing</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white md:text-5xl">
              Solutions pages explain what the templates actually do
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 theme-dark:text-slate-300 md:text-lg">
              Instead of starting from a stack or role, start from a capability such as dark mode,
              SEO, responsiveness, or performance and then move outward into the template combinations.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="stat-pill">
              <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
                {features.length}
              </span>
              <span>feature pages</span>
            </div>
            <div className="stat-pill">
              <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
                {features.reduce((sum, feature) => sum + feature.benefits.length, 0)}
              </span>
              <span>benefit points</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => (
          <Link
            key={feature.slug}
            href={`/solutions/${feature.slug}`}
            className="surface-card group block px-6 py-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="section-kicker">Feature</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950 transition-colors group-hover:text-indigo-700 theme-dark:text-white theme-dark:group-hover:text-indigo-300">
                  {feature.name}
                </h2>
              </div>
              <span className="meta-chip normal-case tracking-normal">
                {feature.benefits.length} benefits
              </span>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
              {feature.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {feature.benefits.slice(0, 3).map((benefit) => (
                <span key={benefit} className="meta-chip normal-case tracking-normal">
                  {benefit}
                </span>
              ))}
            </div>

            <div className="mt-6 editorial-link">Open feature page</div>
          </Link>
        ))}
      </div>

      <div className="surface-panel px-6 py-6 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="section-kicker">Move from feature to template</p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
              Once you know which capability matters most, switch back to the templates index to
              compare combinations by stack and role.
            </p>
          </div>
          <Link href="/templates" className="editorial-link">
            Browse template combinations
          </Link>
        </div>
      </div>
    </section>
  )
}

