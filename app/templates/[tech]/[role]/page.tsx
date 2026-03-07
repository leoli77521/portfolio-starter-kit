import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import pseoData from '@/data/pseo_data.json'
import { calculateReadingTime, getBlogPosts } from 'app/blog/utils'
import { PostCard } from 'app/components/post-card'
import { baseUrl } from 'app/sitemap'
import { generateBreadcrumbSchema, schemaToJsonLd } from 'app/lib/schemas'

interface Technology {
  slug: string
  name: string
  description: string
  features: string[]
  useCases: string[]
}

interface Role {
  slug: string
  name: string
  description: string
  keywords: string[]
  challenges: string[]
  goals: string[]
}

interface PageProps {
  params: { tech: string; role: string }
}

export async function generateStaticParams() {
  const params: { tech: string; role: string }[] = []

  for (const tech of pseoData.technologies as Technology[]) {
    for (const role of pseoData.roles as Role[]) {
      params.push({
        tech: tech.slug,
        role: role.slug,
      })
    }
  }

  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const technology = (pseoData.technologies as Technology[]).find((item) => item.slug === params.tech)
  const roleData = (pseoData.roles as Role[]).find((item) => item.slug === params.role)

  if (!technology || !roleData) {
    return { title: 'Template Not Found' }
  }

  const title = pseoData.templates.techRole.titlePattern
    .replace('{tech}', technology.name)
    .replace('{role}', roleData.name)

  const description = pseoData.templates.techRole.descriptionPattern
    .replace('{tech}', technology.name)
    .replace('{role}', roleData.name)
    .replace('{features}', technology.features.slice(0, 3).join(', '))

  return {
    title,
    description,
    keywords: [...technology.features, ...roleData.keywords],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${baseUrl}/templates/${params.tech}/${params.role}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${baseUrl}/templates/${params.tech}/${params.role}`,
    },
  }
}

function getRelatedPosts(technology: Technology, roleData: Role) {
  const allPosts = getBlogPosts()
  const relevantTags = [...technology.features, ...roleData.keywords].map((tag) => tag.toLowerCase())

  return allPosts
    .filter((post) => {
      const postTags = post.metadata.tags?.map((tag) => tag.toLowerCase()) || []
      return postTags.some((tag) =>
        relevantTags.some((relevantTag) => tag.includes(relevantTag) || relevantTag.includes(tag))
      )
    })
    .slice(0, 6)
}

function generateFAQs(technology: Technology, roleData: Role) {
  return [
    {
      question: `Why use ${technology.name} for a ${roleData.name} portfolio?`,
      answer: `${technology.name} fits ${roleData.name}s well because it supports ${technology.features
        .slice(0, 3)
        .join(', ')} and maps cleanly to goals like ${roleData.goals.slice(0, 2).join(' and ')}.`,
    },
    {
      question: `What does this ${technology.name} template emphasize?`,
      answer: `It emphasizes ${roleData.keywords.slice(0, 3).join(', ')} while keeping the portfolio easy to adapt for a specific hiring story.`,
    },
    {
      question: `Can this template be customized heavily?`,
      answer: `Yes. The structure is intended to be customized for content, styling, layout, and feature emphasis without changing the core publishing flow.`,
    },
  ]
}

export default function TechRoleTemplatePage({ params }: PageProps) {
  const technology = (pseoData.technologies as Technology[]).find((item) => item.slug === params.tech)
  const roleData = (pseoData.roles as Role[]).find((item) => item.slug === params.role)

  if (!technology || !roleData) {
    notFound()
  }

  const relatedPosts = getRelatedPosts(technology, roleData)
  const faqs = generateFAQs(technology, roleData)
  const otherTechs = (pseoData.technologies as Technology[])
    .filter((item) => item.slug !== params.tech)
    .slice(0, 3)
  const otherRoles = (pseoData.roles as Role[])
    .filter((item) => item.slug !== params.role)
    .slice(0, 3)

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: baseUrl },
    { name: 'Templates', url: `${baseUrl}/templates` },
    { name: technology.name, url: `${baseUrl}/templates/${params.tech}` },
    { name: roleData.name, url: `${baseUrl}/templates/${params.tech}/${params.role}` },
  ])

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${technology.name} Portfolio Template for ${roleData.name}s`,
    applicationCategory: 'WebApplication',
    operatingSystem: 'Web',
    description: `Build your ${roleData.name} portfolio with ${technology.name}`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  }

  return (
    <section className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schemaToJsonLd([breadcrumbSchema, faqSchema, softwareSchema]),
        }}
      />

      <nav className="text-sm" aria-label="Breadcrumb navigation">
        <ol className="flex flex-wrap items-center gap-2 text-slate-500 theme-dark:text-slate-400">
          <li>
            <Link href="/" className="transition-colors hover:text-slate-950 theme-dark:hover:text-white">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href="/templates"
              className="transition-colors hover:text-slate-950 theme-dark:hover:text-white"
            >
              Templates
            </Link>
          </li>
          <li>/</li>
          <li className="font-medium text-slate-900 theme-dark:text-slate-100">{technology.name}</li>
          <li>/</li>
          <li className="font-medium text-slate-900 theme-dark:text-slate-100">{roleData.name}</li>
        </ol>
      </nav>

      <div className="surface-panel px-6 py-8 md:px-8 md:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="section-kicker">Template combination</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="meta-chip normal-case tracking-normal">{technology.name}</span>
              <span className="meta-chip normal-case tracking-normal">{roleData.name}</span>
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white md:text-5xl">
              Best {technology.name} portfolio template for {roleData.name}s
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600 theme-dark:text-slate-300 md:text-lg">
              {technology.description} This angle works especially well for {roleData.name}s who
              want to {roleData.goals[0].toLowerCase()}.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/templates" className="editorial-link">
              All templates
            </Link>
            <Link href="/solutions" className="editorial-link">
              Browse by feature
            </Link>
          </div>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="stat-pill">
            <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
              {technology.features.length}
            </span>
            <span>core stack features</span>
          </div>
          <div className="stat-pill">
            <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
              {roleData.goals.length}
            </span>
            <span>role goals covered</span>
          </div>
          <div className="stat-pill">
            <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
              {technology.useCases.length}
            </span>
            <span>common use cases</span>
          </div>
          <div className="stat-pill">
            <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
              {relatedPosts.length}
            </span>
            <span>related articles</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <div className="surface-panel px-6 py-6 md:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="section-kicker">Why it fits</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
                  Matching the stack to the story
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                Good portfolio framing is partly technical and partly narrative. The page combines both.
              </p>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="surface-card px-5 py-5">
                <p className="section-kicker">Technology strengths</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {technology.features.map((feature) => (
                    <span key={feature} className="meta-chip normal-case tracking-normal">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="surface-card px-5 py-5">
                <p className="section-kicker">Role priorities</p>
                <div className="mt-4 space-y-3">
                  {roleData.goals.map((goal) => (
                    <div
                      key={goal}
                      className="rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 theme-dark:border-slate-800 theme-dark:bg-slate-950/70 theme-dark:text-slate-300"
                    >
                      {goal}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="surface-panel px-6 py-6 md:px-8">
            <p className="section-kicker">Role-specific considerations</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
              Built for {roleData.name}s
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
              {roleData.description}
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="surface-card px-5 py-5">
                <p className="section-kicker">Challenges</p>
                <div className="mt-4 space-y-3">
                  {roleData.challenges.map((challenge) => (
                    <div
                      key={challenge}
                      className="rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 theme-dark:border-slate-800 theme-dark:bg-slate-950/70 theme-dark:text-slate-300"
                    >
                      {challenge}
                    </div>
                  ))}
                </div>
              </div>

              <div className="surface-card px-5 py-5">
                <p className="section-kicker">Use cases</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {technology.useCases.map((useCase) => (
                    <span key={useCase} className="meta-chip normal-case tracking-normal">
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>
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
                  These posts overlap with the stack or role keywords for this combination.
                </p>
              </div>

              <div className="mt-6 space-y-6">
                {relatedPosts.slice(0, 4).map((post) => (
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

          <div className="surface-panel px-6 py-6 md:px-8">
            <p className="section-kicker">Questions</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
              Frequently asked questions
            </h2>

            <div className="mt-6 space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="rounded-[1.5rem] border border-slate-200/80 bg-white/85 px-5 py-4 theme-dark:border-slate-800 theme-dark:bg-slate-950/80"
                >
                  <summary className="cursor-pointer list-none text-base font-semibold text-slate-950 theme-dark:text-slate-100">
                    {faq.question}
                  </summary>
                  <p className="mt-3 border-t border-slate-200/70 pt-3 text-sm leading-7 text-slate-600 theme-dark:border-slate-800 theme-dark:text-slate-300">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="surface-card px-5 py-5">
            <p className="section-kicker">Other technologies</p>
            <div className="mt-4 space-y-3">
              {otherTechs.map((tech) => (
                <Link
                  key={tech.slug}
                  href={`/templates/${tech.slug}/${params.role}`}
                  className="block rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 px-4 py-4 transition-colors hover:border-indigo-300 theme-dark:border-slate-800 theme-dark:bg-slate-950/70 theme-dark:hover:border-indigo-500/60"
                >
                  <div className="text-sm font-semibold text-slate-950 theme-dark:text-slate-100">
                    {tech.name}
                  </div>
                  <div className="mt-2 text-sm text-slate-600 theme-dark:text-slate-300">
                    for {roleData.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="surface-card px-5 py-5">
            <p className="section-kicker">Other roles</p>
            <div className="mt-4 space-y-3">
              {otherRoles.map((role) => (
                <Link
                  key={role.slug}
                  href={`/templates/${params.tech}/${role.slug}`}
                  className="block rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 px-4 py-4 transition-colors hover:border-indigo-300 theme-dark:border-slate-800 theme-dark:bg-slate-950/70 theme-dark:hover:border-indigo-500/60"
                >
                  <div className="text-sm font-semibold text-slate-950 theme-dark:text-slate-100">
                    {technology.name}
                  </div>
                  <div className="mt-2 text-sm text-slate-600 theme-dark:text-slate-300">
                    for {role.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <div className="surface-panel px-6 py-6 text-center md:px-8">
        <p className="section-kicker">Next step</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
          Explore the features behind the templates
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
          If you want to browse by capability rather than by stack or role, switch to the solutions pages.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/solutions" className="editorial-link">
            Browse solutions
          </Link>
          <a
            href="https://github.com/vercel/next.js/tree/canary/examples/blog-starter"
            target="_blank"
            rel="noopener noreferrer"
            className="editorial-link"
          >
            View starter
          </a>
        </div>
      </div>
    </section>
  )
}

