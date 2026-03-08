import { getGuide, guides } from 'app/lib/guides'
import { calculateReadingTime, getBlogPosts } from 'app/blog/utils'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { baseUrl } from 'app/sitemap'
import Link from 'next/link'
import { PostCard } from 'app/components/post-card'
import { categories, getCategoryColor, getCategorySlug } from 'app/lib/categories'
import {
  generateBreadcrumbSchema,
  generateCourseSchema,
  schemaToJsonLd,
} from 'app/lib/schemas'
import { slugify } from 'app/lib/formatters'

const difficultyBadgeStyles = {
  Beginner:
    'border-emerald-200/80 bg-emerald-50/90 text-emerald-700 theme-dark:border-emerald-900/80 theme-dark:bg-emerald-950/50 theme-dark:text-emerald-300',
  Intermediate:
    'border-amber-200/80 bg-amber-50/90 text-amber-700 theme-dark:border-amber-900/80 theme-dark:bg-amber-950/50 theme-dark:text-amber-300',
  Advanced:
    'border-rose-200/80 bg-rose-50/90 text-rose-700 theme-dark:border-rose-900/80 theme-dark:bg-rose-950/50 theme-dark:text-rose-300',
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
    title: guide.title,
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

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = getGuide(params.slug)

  if (!guide) {
    notFound()
  }

  const allPosts = getBlogPosts()
  const normalizedGuideTags = guide.relatedTags.map((tag) => tag.toLowerCase())
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

  const relatedCategoryConfigs = categories.filter(
    (category) => category.name !== 'All' && guide.relatedCategories.includes(category.name)
  )
  const otherGuides = guides.filter((item) => item.slug !== guide.slug).slice(0, 3)

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
    <section className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schemaToJsonLd([breadcrumbSchema, courseSchema, howToSchema]),
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
              href="/guides"
              className="transition-colors hover:text-slate-950 theme-dark:hover:text-white"
            >
              Guides
            </Link>
          </li>
          <li>/</li>
          <li className="truncate font-medium text-slate-900 theme-dark:text-slate-100">
            {guide.title}
          </li>
        </ol>
      </nav>

      <div className="surface-panel px-6 py-8 md:px-8 md:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="section-kicker">Learning guide</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${difficultyBadgeStyles[guide.difficulty]}`}
              >
                {guide.difficulty}
              </span>
              <span className="meta-chip normal-case tracking-normal">{guide.estimatedTime}</span>
              <span className="meta-chip normal-case tracking-normal">{guide.steps.length} steps</span>
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white md:text-5xl">
              {guide.title}
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600 theme-dark:text-slate-300 md:text-lg">
              {guide.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/guides" className="editorial-link">
              All guides
            </Link>
            <Link href="/topics" className="editorial-link">
              Topic hubs
            </Link>
          </div>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="stat-pill">
            <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
              {guide.steps.length}
            </span>
            <span>learning steps</span>
          </div>
          <div className="stat-pill">
            <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
              {guide.relatedTags.length}
            </span>
            <span>related tags</span>
          </div>
          <div className="stat-pill">
            <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
              {guide.prerequisites?.length || 0}
            </span>
            <span>prerequisites</span>
          </div>
          <div className="stat-pill">
            <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
              {relatedPosts.length}
            </span>
            <span>supporting articles</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <div className="surface-panel px-6 py-6 md:px-8">
            <p className="section-kicker">Overview</p>
            <p className="mt-4 text-sm leading-8 text-slate-600 theme-dark:text-slate-300 md:text-base">
              {guide.longDescription}
            </p>
          </div>

          <div className="surface-panel px-6 py-6 md:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="section-kicker">Roadmap</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
                  What you&apos;ll learn
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                Each step is a segment of the path, designed to move from concepts into practical
                implementation.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {guide.steps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-[1.5rem] border border-slate-200/80 bg-white/85 px-5 py-5 theme-dark:border-slate-800 theme-dark:bg-slate-950/80"
                >
                  <div className="flex gap-4">
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white theme-dark:bg-slate-100 theme-dark:text-slate-950">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-950 theme-dark:text-slate-100">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {relatedPosts.length > 0 ? (
            <div className="surface-panel px-6 py-6 md:px-8">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="section-kicker">Supporting reading</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
                    Related articles
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                  These posts cover parts of the same subject area and work well alongside the
                  guide.
                </p>
              </div>

              <div className="mt-6 space-y-6">
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
          ) : null}
        </div>

        <aside className="space-y-5">
          {guide.prerequisites && guide.prerequisites.length > 0 ? (
            <div className="surface-card px-5 py-5">
              <p className="section-kicker">Prerequisites</p>
              <div className="mt-4 space-y-3">
                {guide.prerequisites.map((prerequisite) => (
                  <div
                    key={prerequisite}
                    className="rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 theme-dark:border-slate-800 theme-dark:bg-slate-950/70 theme-dark:text-slate-300"
                  >
                    {prerequisite}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="surface-card px-5 py-5">
            <p className="section-kicker">Topics covered</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {guide.relatedTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${slugify(tag)}`}
                  className="meta-chip normal-case tracking-normal"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {relatedCategoryConfigs.length > 0 ? (
            <div className="surface-card px-5 py-5">
              <p className="section-kicker">Related categories</p>
              <div className="mt-4 space-y-3">
                {relatedCategoryConfigs.map((category) => {
                  const tone = getCategoryColor(category.name)

                  return (
                    <Link
                      key={category.name}
                      href={`/categories/${getCategorySlug(category.name)}`}
                      className="flex items-center justify-between rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 px-4 py-4 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:text-slate-950 theme-dark:border-slate-800 theme-dark:bg-slate-950/70 theme-dark:text-slate-300 theme-dark:hover:border-indigo-500/60 theme-dark:hover:text-white"
                    >
                      <span>{category.name}</span>
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${categoryBadgeStyles[tone]}`}
                      >
                        Category
                      </span>
                    </Link>
                  )
                })}
              </div>
            </div>
          ) : null}

          {otherGuides.length > 0 ? (
            <div className="surface-card px-5 py-5">
              <p className="section-kicker">Other guides</p>
              <div className="mt-4 space-y-3">
                {otherGuides.map((otherGuide) => (
                  <Link
                    key={otherGuide.slug}
                    href={`/guides/${otherGuide.slug}`}
                    className="block rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 px-4 py-4 transition-colors hover:border-indigo-300 theme-dark:border-slate-800 theme-dark:bg-slate-950/70 theme-dark:hover:border-indigo-500/60"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${difficultyBadgeStyles[otherGuide.difficulty]}`}
                      >
                        {otherGuide.difficulty}
                      </span>
                    </div>
                    <div className="mt-3 text-sm font-semibold text-slate-950 theme-dark:text-slate-100">
                      {otherGuide.title}
                    </div>
                    <div className="mt-2 text-sm leading-6 text-slate-600 theme-dark:text-slate-300">
                      {otherGuide.description}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  )
}

