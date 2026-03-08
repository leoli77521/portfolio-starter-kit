import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import pseoData from '@/data/pseo_data.json'
import { calculateReadingTime } from 'app/blog/utils'
import { PostCard } from 'app/components/post-card'
import { findRelevantGuides, findRelevantPosts, findRelevantTopicHubs } from 'app/lib/pseo-content'
import { baseUrl } from 'app/sitemap'
import { generateBreadcrumbSchema, schemaToJsonLd } from 'app/lib/schemas'
import { buildSocialTitle, resolveOgImage, trimSeoTitle } from 'app/lib/seo'

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

function getTemplateTerms(technology: Technology, roleData: Role): string[] {
  return [
    technology.name,
    technology.slug,
    ...technology.features,
    ...technology.useCases,
    roleData.name,
    ...roleData.keywords,
    ...roleData.challenges,
    ...roleData.goals,
  ]
}

function getTemplateCategories(technology: Technology, roleData: Role): string[] {
  const categories = new Set<string>(['Technology'])

  if (['nextjs', 'react', 'tailwindcss', 'mdx'].includes(technology.slug)) {
    categories.add('Web Development')
  }

  if (technology.slug === 'mdx') {
    categories.add('SEO & Marketing')
  }

  if (roleData.slug === 'frontend-developer') {
    categories.add('Web Development')
  }

  return Array.from(categories)
}

function buildTemplateDescription(technology: Technology, roleData: Role): string {
  const featuredGoals = roleData.goals.slice(0, 2).join(' and ').toLowerCase()
  const featuredChallenges = roleData.challenges.slice(0, 2).join(' and ')
  const featuredFeatures = technology.features.slice(0, 2).join(', ')

  return `A ${technology.name} portfolio template for ${roleData.name}s who need to ${featuredGoals}, address ${featuredChallenges}, and frame their work around ${featuredFeatures}.`
}

function buildRoleSignals(technology: Technology, roleData: Role) {
  return [
    {
      title: 'Lead with proof, not the stack',
      description: `Open with projects that make ${roleData.goals[0].toLowerCase()} obvious, then let ${technology.name} support the story instead of becoming the whole story.`,
    },
    {
      title: 'Answer the hiring concern early',
      description: `Use the layout to show how you handle ${roleData.challenges
        .slice(0, 2)
        .join(' and ')}, because that is more persuasive than listing responsibilities.`,
    },
    {
      title: 'Choose projects that fit the role',
      description: `${technology.useCases.slice(0, 2).join(' and ')} are strong anchors for a ${roleData.name.toLowerCase()} portfolio when you want to spotlight ${technology.features
        .slice(0, 2)
        .join(' and ')}.`,
    },
  ]
}

function buildProofChecklist(technology: Technology, roleData: Role) {
  return [
    `One project that proves you can ${roleData.goals[0].toLowerCase()}.`,
    `One case study that explains how you approached ${roleData.challenges[0]}.`,
    `A short technical note on ${technology.features[0].toLowerCase()} and why it mattered.`,
    `A summary of how ${technology.useCases[0].toLowerCase()} shaped the final delivery.`,
  ]
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
  const seoTitle = trimSeoTitle(title)
  const description = buildTemplateDescription(technology, roleData)
  const socialTitle = buildSocialTitle(seoTitle)
  const ogImage = resolveOgImage(undefined, seoTitle)

  return {
    title: seoTitle,
    description,
    keywords: [
      technology.name,
      roleData.name,
      ...technology.features,
      ...roleData.keywords,
      ...roleData.challenges,
    ],
    openGraph: {
      title: socialTitle,
      description,
      type: 'website',
      url: `${baseUrl}/templates/${params.tech}/${params.role}`,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `${baseUrl}/templates/${params.tech}/${params.role}`,
    },
  }
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

  const templateTerms = getTemplateTerms(technology, roleData)
  const templateCategories = getTemplateCategories(technology, roleData)
  const relatedPosts = findRelevantPosts({
    terms: templateTerms,
    categories: templateCategories,
    limit: 6,
  })
  const relatedGuides = findRelevantGuides({
    terms: templateTerms,
    categories: templateCategories,
    limit: 2,
  })
  const relatedTopicHubs = findRelevantTopicHubs({
    terms: templateTerms,
    categories: templateCategories,
    limit: 2,
  })
  const roleSignals = buildRoleSignals(technology, roleData)
  const proofChecklist = buildProofChecklist(technology, roleData)
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
    {
      name: `${technology.name} for ${roleData.name}s`,
      url: `${baseUrl}/templates/${params.tech}/${params.role}`,
    },
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

      <div className="surface-panel px-6 py-6 md:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker">What this version should prove</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
              A stronger angle for this exact combination
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
            The point is not just to use {technology.name}. It is to make the stack serve a
            hiring story that fits {roleData.name}s.
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {roleSignals.map((signal) => (
            <div key={signal.title} className="surface-card px-5 py-5">
              <p className="section-kicker">Signal</p>
              <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-slate-950 theme-dark:text-slate-100">
                {signal.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                {signal.description}
              </p>
            </div>
          ))}
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

            <div className="mt-6 surface-card px-5 py-5">
              <p className="section-kicker">Proof checklist</p>
              <div className="mt-4 space-y-3">
                {proofChecklist.map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 theme-dark:border-slate-800 theme-dark:bg-slate-950/70 theme-dark:text-slate-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {relatedGuides.length > 0 ? (
            <div className="surface-panel px-6 py-6 md:px-8">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="section-kicker">Guides to pair with it</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
                    Supporting guides
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                  These guides add implementation depth that makes the template page feel more actionable.
                </p>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {relatedGuides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    className="surface-card block px-5 py-5"
                  >
                    <p className="section-kicker">{guide.difficulty}</p>
                    <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-slate-950 theme-dark:text-slate-100">
                      {guide.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                      {guide.description}
                    </p>
                    <p className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-slate-500 theme-dark:text-slate-400">
                      {guide.estimatedTime}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

          {relatedTopicHubs.length > 0 ? (
            <div className="surface-panel px-6 py-6 md:px-8">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="section-kicker">Topic hubs</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
                    Broader archives around this template
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                  These hubs connect the landing page to broader themes so the template route behaves more like part of a learning cluster.
                </p>
              </div>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {relatedTopicHubs.map((hub) => (
                  <Link
                    key={hub.slug}
                    href={`/topics/${hub.slug}`}
                    className="surface-card block px-5 py-5"
                  >
                    <p className="section-kicker">Topic hub</p>
                    <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-slate-950 theme-dark:text-slate-100">
                      {hub.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                      {hub.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}

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
          Keep the research path on-site
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
          If this template angle is close to what you need, continue with related guides or browse the full journal to collect stronger project evidence.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/solutions" className="editorial-link">
            Browse solutions
          </Link>
          <Link href="/guides" className="editorial-link">
            Read guides
          </Link>
        </div>
      </div>
    </section>
  )
}

