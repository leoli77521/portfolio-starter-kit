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
  title: 'Templates',
  description:
    'Browse portfolio template combinations by technology and role, with feature-driven entry points.',
  keywords: ['portfolio template', 'developer portfolio', 'nextjs template', 'react portfolio'],
  alternates: {
    canonical: `${baseUrl}/templates`,
  },
  openGraph: {
    title: 'Templates | ToLearn Blog',
    description:
      'Portfolio template combinations for developers, organized by stack and role.',
    type: 'website',
    url: `${baseUrl}/templates`,
  },
}

interface Technology {
  slug: string
  name: string
  description: string
  features: string[]
}

interface Role {
  slug: string
  name: string
  description: string
  keywords: string[]
  goals: string[]
}

export default function TemplatesPage() {
  const technologies = pseoData.technologies as Technology[]
  const roles = pseoData.roles as Role[]
  const totalCombinations = technologies.length * roles.length

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: baseUrl },
    { name: 'Templates', url: `${baseUrl}/templates` },
  ])

  const collectionSchema = generateCollectionPageSchema({
    name: 'Portfolio Templates',
    description: 'Portfolio template combinations by technology and role',
    url: `${baseUrl}/templates`,
    items: technologies.map((tech, index) => ({
      url: `${baseUrl}/templates/${tech.slug}/${roles[0]?.slug || 'frontend-developer'}`,
      name: `${tech.name} Templates`,
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
            <p className="section-kicker">Template library</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white md:text-5xl">
              Portfolio templates organized by stack and role
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 theme-dark:text-slate-300 md:text-lg">
              Use templates as another entry point into the project. The pages below are grouped
              by technology and by role so the archive feels navigable instead of generically
              programmatic.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="stat-pill">
              <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
                {technologies.length}
              </span>
              <span>technologies</span>
            </div>
            <div className="stat-pill">
              <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
                {roles.length}
              </span>
              <span>role profiles</span>
            </div>
            <div className="stat-pill">
              <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
                {totalCombinations}
              </span>
              <span>template combinations</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker">By technology</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
              Start from the stack
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
            Useful when you already know the framework or tooling context and want matching role variants.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {technologies.map((tech) => (
            <div key={tech.slug} className="surface-card px-6 py-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="section-kicker">Technology</p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950 theme-dark:text-white">
                    {tech.name}
                  </h3>
                </div>
                <span className="meta-chip normal-case tracking-normal">
                  {roles.length} roles
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                {tech.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {tech.features.slice(0, 3).map((feature) => (
                  <span key={feature} className="meta-chip normal-case tracking-normal">
                    {feature}
                  </span>
                ))}
              </div>

              <div className="mt-6 space-y-2">
                {roles.slice(0, 3).map((role) => (
                  <Link
                    key={role.slug}
                    href={`/templates/${tech.slug}/${role.slug}`}
                    className="editorial-link"
                  >
                    {tech.name} for {role.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker">By role</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
              Start from the hiring narrative
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
            Useful when the role framing matters more than the stack itself.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {roles.map((role) => (
            <div key={role.slug} className="surface-card px-6 py-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="section-kicker">Role</p>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950 theme-dark:text-white">
                    {role.name}
                  </h3>
                </div>
                <span className="meta-chip normal-case tracking-normal">
                  {technologies.length} stacks
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                {role.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {role.keywords.slice(0, 3).map((keyword) => (
                  <span key={keyword} className="meta-chip normal-case tracking-normal">
                    {keyword}
                  </span>
                ))}
              </div>

              <div className="mt-5 space-y-2">
                {role.goals.slice(0, 2).map((goal) => (
                  <div
                    key={goal}
                    className="rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 theme-dark:border-slate-800 theme-dark:bg-slate-950/70 theme-dark:text-slate-300"
                  >
                    {goal}
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2">
                {technologies.slice(0, 3).map((tech) => (
                  <Link
                    key={tech.slug}
                    href={`/templates/${tech.slug}/${role.slug}`}
                    className="editorial-link"
                  >
                    {tech.name} for {role.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="surface-panel px-6 py-6 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="section-kicker">Need feature-driven browsing?</p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
              If stack and role are not enough, switch to the solutions pages to browse templates
              by feature such as dark mode, SEO, responsiveness, or performance.
            </p>
          </div>
          <Link href="/solutions" className="editorial-link">
            Browse feature pages
          </Link>
        </div>
      </div>
    </section>
  )
}

