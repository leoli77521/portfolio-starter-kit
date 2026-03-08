import { guides } from 'app/lib/guides'
import type { Metadata } from 'next'
import { baseUrl } from 'app/sitemap'
import Link from 'next/link'
import {
  generateCollectionPageSchema,
  generateItemListSchema,
  schemaToJsonLd,
} from 'app/lib/schemas'

export const metadata: Metadata = {
  title: 'Guides',
  description:
    'Structured learning guides covering AI development, SEO, performance, and practical web execution.',
  alternates: {
    canonical: `${baseUrl}/guides`,
  },
  openGraph: {
    title: 'Guides | ToLearn Blog',
    description:
      'Structured learning guides for builders working on AI systems, search, and the modern web.',
    url: `${baseUrl}/guides`,
    type: 'website',
  },
}

const difficultyBadgeStyles = {
  Beginner:
    'border-emerald-200/80 bg-emerald-50/90 text-emerald-700 theme-dark:border-emerald-900/80 theme-dark:bg-emerald-950/50 theme-dark:text-emerald-300',
  Intermediate:
    'border-amber-200/80 bg-amber-50/90 text-amber-700 theme-dark:border-amber-900/80 theme-dark:bg-amber-950/50 theme-dark:text-amber-300',
  Advanced:
    'border-rose-200/80 bg-rose-50/90 text-rose-700 theme-dark:border-rose-900/80 theme-dark:bg-rose-950/50 theme-dark:text-rose-300',
}

export default function GuidesPage() {
  const beginnerGuides = guides.filter((guide) => guide.difficulty === 'Beginner')
  const intermediateGuides = guides.filter((guide) => guide.difficulty === 'Intermediate')
  const advancedGuides = guides.filter((guide) => guide.difficulty === 'Advanced')
  const totalSteps = guides.reduce((sum, guide) => sum + guide.steps.length, 0)
  const coveredCategories = new Set(
    guides.flatMap((guide) => guide.relatedCategories).filter((category) => category !== 'All')
  )

  const itemListSchema = generateItemListSchema({
    name: 'Learning Guides',
    description: 'Structured learning guides for developers',
    items: guides.map((guide, index) => ({
      url: `${baseUrl}/guides/${guide.slug}`,
      name: guide.title,
      description: guide.description,
      position: index + 1,
    })),
  })

  const collectionPageSchema = generateCollectionPageSchema({
    name: 'Guides',
    description: 'Structured learning guides covering AI, SEO, web development, and more.',
    url: `${baseUrl}/guides`,
    dateModified: new Date().toISOString(),
    items: guides.map((guide, index) => ({
      url: `${baseUrl}/guides/${guide.slug}`,
      name: guide.title,
      position: index + 1,
    })),
  })

  return (
    <section className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaToJsonLd([itemListSchema, collectionPageSchema]) }}
      />

      <div className="surface-panel px-6 py-8 md:px-8 md:py-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.75fr)] lg:items-end">
          <div>
            <p className="section-kicker">Structured learning paths</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white md:text-5xl">
              Guides for people who want more than scattered tutorials
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 theme-dark:text-slate-300 md:text-lg">
              Each guide turns a topic into a progression. Instead of isolated articles, you get
              a path with steps, supporting posts, and a clear sense of what to learn next.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="stat-pill">
              <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
                {guides.length}
              </span>
              <span>published guides</span>
            </div>
            <div className="stat-pill">
              <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
                {totalSteps}
              </span>
              <span>total learning steps</span>
            </div>
            <div className="stat-pill">
              <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
                {coveredCategories.size}
              </span>
              <span>connected categories</span>
            </div>
          </div>
        </div>
      </div>

      <GuideSection
        title="Getting started"
        description="Beginner-friendly guides for getting oriented quickly."
        guides={beginnerGuides}
      />

      <GuideSection
        title="Level up your skills"
        description="Intermediate guides for sharpening execution and technical range."
        guides={intermediateGuides}
      />

      <GuideSection
        title="Advanced tracks"
        description="Longer, more complex paths for deeper implementation work."
        guides={advancedGuides}
      />

      <div className="surface-panel flex flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="section-kicker">Need a different route?</p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
            Guides are the most structured layer. If you want broader browsing instead, switch to
            topic hubs, categories, or the full journal.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/topics" className="editorial-link">
            Topic hubs
          </Link>
          <Link href="/categories" className="editorial-link">
            Categories
          </Link>
          <Link href="/blog" className="editorial-link">
            Journal
          </Link>
        </div>
      </div>
    </section>
  )
}

function GuideSection({
  title,
  description,
  guides,
}: {
  title: string
  description: string
  guides: typeof import('app/lib/guides').guides
}) {
  if (guides.length === 0) {
    return null
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-kicker">Guide collection</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
            {title}
          </h2>
        </div>
        <p className="max-w-2xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
          {description}
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            href={`/guides/${guide.slug}`}
            className="surface-card group block px-6 py-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${difficultyBadgeStyles[guide.difficulty]}`}
                  >
                    {guide.difficulty}
                  </span>
                  <span className="meta-chip normal-case tracking-normal">
                    {guide.estimatedTime}
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-slate-950 transition-colors group-hover:text-indigo-700 theme-dark:text-white theme-dark:group-hover:text-indigo-300">
                  {guide.title}
                </h3>
              </div>
              <span className="meta-chip normal-case tracking-normal">{guide.steps.length} steps</span>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
              {guide.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {guide.relatedTags.slice(0, 3).map((tag) => (
                <span key={tag} className="meta-chip normal-case tracking-normal">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 editorial-link">Open guide</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

