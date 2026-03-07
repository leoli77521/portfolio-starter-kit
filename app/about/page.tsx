import Link from 'next/link'
import { getBlogPosts } from 'app/blog/utils'
import { guides } from 'app/lib/guides'
import { topicHubs } from 'app/lib/topic-hubs'
import { categories } from 'app/lib/categories'
import { baseUrl } from 'app/sitemap'

export const metadata = {
  title: 'About | ToLearn',
  description:
    'Learn what ToLearn covers, how the archive is structured, and what kind of work the site is for.',
}

const principles = [
  {
    title: 'Signal first',
    description:
      'We optimize for clear takeaways, not trend summaries or recycled talking points.',
  },
  {
    title: 'Practical by default',
    description:
      'The best content here should help someone ship, debug, decide, or learn with less noise.',
  },
  {
    title: 'Structure matters',
    description:
      'The site is organized so readers can move between journal posts, topic hubs, categories, and guides with intent.',
  },
]

const coverageAreas = [
  {
    title: 'AI systems',
    description:
      'Notes on agents, tooling, model workflows, and where AI actually changes product work.',
  },
  {
    title: 'Search visibility',
    description:
      'SEO execution, indexing behavior, content strategy, and technical choices that affect discovery.',
  },
  {
    title: 'Modern web execution',
    description:
      'Frontend quality, performance, architecture, and practical workflow decisions for builders.',
  },
]

export default function AboutPage() {
  const allPosts = getBlogPosts()
  const totalTags = new Set(allPosts.flatMap((post) => post.metadata.tags || [])).size
  const activeCategories = categories.filter((category) => category.name !== 'All').length

  const organization = {
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: 'ToLearn Blog',
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/favicon.ico`,
      width: 32,
      height: 32,
    },
  }

  const aboutSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    '@id': `${baseUrl}/about/#about`,
    url: `${baseUrl}/about`,
    name: 'About ToLearn',
    description:
      'Learn what ToLearn covers, how the archive is structured, and what kind of work the site is for.',
    mainEntity: organization,
  }

  return (
    <section className="space-y-8">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutSchema),
        }}
      />

      <div className="surface-panel px-6 py-8 md:px-8 md:py-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.75fr)] lg:items-end">
          <div>
            <p className="section-kicker">About the project</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white md:text-5xl">
              ToLearn is a working notebook for builders
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 theme-dark:text-slate-300 md:text-lg">
              The goal is simple: publish useful writing about AI systems, search visibility, and
              modern web execution without turning the site into a generic content mill.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="stat-pill">
              <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
                {allPosts.length}
              </span>
              <span>published articles</span>
            </div>
            <div className="stat-pill">
              <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
                {guides.length}
              </span>
              <span>structured guides</span>
            </div>
            <div className="stat-pill">
              <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
                {topicHubs.length}
              </span>
              <span>topic hubs</span>
            </div>
            <div className="stat-pill">
              <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
                {totalTags}
              </span>
              <span>tracked tags</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.75fr)]">
        <div className="surface-panel px-6 py-6 md:px-8">
          <p className="section-kicker">What the site is for</p>
          <p className="mt-4 text-sm leading-8 text-slate-600 theme-dark:text-slate-300 md:text-base">
            ToLearn sits between a personal blog and a documentation site. It covers technical
            decisions, implementation patterns, and content architecture with an editorial layer
            that helps readers navigate a growing archive. The aim is not volume. It is to make
            the archive easier to trust and easier to use.
          </p>
        </div>

        <div className="surface-card px-5 py-5">
          <p className="section-kicker">Archive structure</p>
          <div className="mt-4 space-y-3 text-sm text-slate-600 theme-dark:text-slate-300">
            <div className="rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 px-4 py-4 theme-dark:border-slate-800 theme-dark:bg-slate-950/70">
              Journal for the full stream of writing.
            </div>
            <div className="rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 px-4 py-4 theme-dark:border-slate-800 theme-dark:bg-slate-950/70">
              Categories for broad sections.
            </div>
            <div className="rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 px-4 py-4 theme-dark:border-slate-800 theme-dark:bg-slate-950/70">
              Topic hubs for curated learning paths.
            </div>
            <div className="rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 px-4 py-4 theme-dark:border-slate-800 theme-dark:bg-slate-950/70">
              Guides for structured step-by-step progression.
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-6">
          <p className="section-kicker">Coverage</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
            What you can expect to find here
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {coverageAreas.map((area) => (
            <div key={area.title} className="surface-card px-6 py-6">
              <h3 className="text-xl font-semibold text-slate-950 theme-dark:text-white">{area.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                {area.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker">Principles</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
              How the work is approached
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
            These are the constraints that keep the site from drifting back into generic tech-blog behavior.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {principles.map((principle) => (
            <div key={principle.title} className="surface-card px-6 py-6">
              <h3 className="text-xl font-semibold text-slate-950 theme-dark:text-white">
                {principle.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="surface-panel px-6 py-6 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="section-kicker">Where to go next</p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
              Start with the journal, browse {activeCategories} active categories, or get in touch
              if you want to discuss the work directly.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/blog" className="editorial-link">
              Open the journal
            </Link>
            <Link href="/guides" className="editorial-link">
              Browse guides
            </Link>
            <Link href="/contact" className="editorial-link">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

