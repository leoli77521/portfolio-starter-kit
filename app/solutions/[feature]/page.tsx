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

interface Feature {
  slug: string
  name: string
  description: string
  benefits: string[]
  technicalDetails: string
}

interface Technology {
  slug: string
  name: string
}

interface Role {
  slug: string
  name: string
}

interface PageProps {
  params: { feature: string }
}

const featurePlaybooks: Record<
  string,
  {
    angle: string
    checkpoints: string[]
    templateCombos: Array<{ reason: string; role: string; tech: string }>
  }
> = {
  'dark-mode': {
    angle: 'readers spend time in long-form content and switch between bright and low-light environments.',
    checkpoints: [
      'Respect saved preference, system preference, and browser theme color together.',
      'Keep contrast stable across cards, long-form copy, code blocks, and embeds.',
      'Treat dark mode as a readability system, not a cosmetic inversion.',
    ],
    templateCombos: [
      { tech: 'tailwindcss', role: 'frontend-developer', reason: 'good fit for design tokens and stateful UI polish' },
      { tech: 'nextjs', role: 'frontend-developer', reason: 'strong when theme state needs to survive SSR and route changes' },
      { tech: 'react', role: 'fullstack-developer', reason: 'useful when the portfolio mixes interactive widgets with content' },
    ],
  },
  'seo-optimized': {
    angle: 'the portfolio needs to earn discovery from search, answer engines, and social sharing.',
    checkpoints: [
      'Give every key route honest titles, canonicals, and preview images.',
      'Use structured data only where the page can genuinely support the schema.',
      'Build internal links so supporting pages reinforce the main conversion pages.',
    ],
    templateCombos: [
      { tech: 'nextjs', role: 'fullstack-developer', reason: 'best fit when routing, metadata, and content scale together' },
      { tech: 'mdx', role: 'software-engineer', reason: 'strong when the portfolio doubles as a content engine' },
      { tech: 'typescript', role: 'software-engineer', reason: 'useful when maintainability matters as much as traffic growth' },
    ],
  },
  'responsive-design': {
    angle: 'the same projects need to read clearly on mobile, tablet, and desktop without layout drift.',
    checkpoints: [
      'Design hero sections and case studies to collapse cleanly on narrow screens.',
      'Use spacing, typography, and imagery that scale without losing hierarchy.',
      'Test navigation, touch targets, and scrolling behavior on real mobile breakpoints.',
    ],
    templateCombos: [
      { tech: 'tailwindcss', role: 'frontend-developer', reason: 'ideal when responsiveness is a first-class design constraint' },
      { tech: 'react', role: 'frontend-developer', reason: 'useful for portfolios with interactive components and demos' },
      { tech: 'nextjs', role: 'fullstack-developer', reason: 'good when marketing pages and project pages share one system' },
    ],
  },
  'fast-performance': {
    angle: 'the site has to feel immediate, especially on content-heavy pages and shared project detail views.',
    checkpoints: [
      'Prioritize image, font, and script loading so the first screen stabilizes quickly.',
      'Keep bundle weight visible and justify every client-side dependency.',
      'Tie performance work back to conversion paths, not just Lighthouse scores.',
    ],
    templateCombos: [
      { tech: 'nextjs', role: 'software-engineer', reason: 'strong default when SSR, caching, and media optimization matter' },
      { tech: 'typescript', role: 'fullstack-developer', reason: 'useful for controlling regression risk as the site grows' },
      { tech: 'react', role: 'frontend-developer', reason: 'good when interaction cost needs active management' },
    ],
  },
  'blog-ready': {
    angle: 'the portfolio also needs a publishing layer that can support thought leadership and ongoing search growth.',
    checkpoints: [
      'Treat the blog as a supporting proof system, not a disconnected content area.',
      'Keep tags, categories, guides, and RSS working together as one discovery layer.',
      'Make article templates strong enough to support future editorial depth.',
    ],
    templateCombos: [
      { tech: 'mdx', role: 'fullstack-developer', reason: 'best fit when posts and projects live in the same system' },
      { tech: 'nextjs', role: 'frontend-developer', reason: 'strong for editorial pages that still need polished UX' },
      { tech: 'tailwindcss', role: 'software-engineer', reason: 'useful when content design and component reuse need to move quickly' },
    ],
  },
}

function getFeatureTerms(feature: Feature): string[] {
  return [feature.name, feature.slug, feature.description, ...feature.benefits, feature.technicalDetails]
}

function buildFeatureDescription(feature: Feature): string {
  return `${feature.name} templates for developers who care about ${feature.benefits
    .slice(0, 3)
    .join(', ')} and want a portfolio system that can support those outcomes in production.`
}

function buildBenefitCopy(feature: Feature, benefit: string, angle: string): string {
  return `${benefit} matters when ${angle} ${feature.name} is more valuable when it supports that exact browsing or publishing context.`
}

export async function generateStaticParams() {
  return (pseoData.features as Feature[]).map((feature) => ({
    feature: feature.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const featureData = (pseoData.features as Feature[]).find((item) => item.slug === params.feature)

  if (!featureData) {
    return { title: 'Feature Not Found' }
  }

  const title = pseoData.templates.feature.titlePattern.replace('{feature}', featureData.name)
  const seoTitle = trimSeoTitle(title)
  const description = buildFeatureDescription(featureData)
  const socialTitle = buildSocialTitle(seoTitle)
  const ogImage = resolveOgImage(undefined, seoTitle)

  return {
    title: seoTitle,
    description,
    keywords: [featureData.name, 'portfolio template', ...featureData.benefits],
    openGraph: {
      title: socialTitle,
      description,
      type: 'website',
      url: `${baseUrl}/solutions/${params.feature}`,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `${baseUrl}/solutions/${params.feature}`,
    },
  }
}

function generateFAQs(feature: Feature) {
  return [
    {
      question: `How is ${feature.name} implemented?`,
      answer: feature.technicalDetails,
    },
    {
      question: `Why does ${feature.name} matter?`,
      answer: `${feature.name} improves the portfolio through ${feature.benefits.join(', ')}.`,
    },
    {
      question: `Can the ${feature.name} behavior be adjusted?`,
      answer:
        'Yes. The implementation is meant to be customized to fit the brand, preferences, and content structure of the site.',
    },
  ]
}

export default function FeaturePage({ params }: PageProps) {
  const featureData = (pseoData.features as Feature[]).find((item) => item.slug === params.feature)

  if (!featureData) {
    notFound()
  }

  const playbook = featurePlaybooks[featureData.slug]
  const featureTerms = getFeatureTerms(featureData)
  const relatedGuides = findRelevantGuides({ terms: featureTerms, limit: 2 })
  const relatedTopicHubs = findRelevantTopicHubs({ terms: featureTerms, limit: 2 })
  const relatedPosts = findRelevantPosts({ terms: featureTerms, limit: 4 })
  const faqs = generateFAQs(featureData)
  const otherFeatures = (pseoData.features as Feature[]).filter(
    (feature) => feature.slug !== params.feature
  )
  const technologies = pseoData.technologies as Technology[]
  const roles = pseoData.roles as Role[]
  const starterTemplates = (playbook?.templateCombos || [])
    .map((combo) => {
      const technology = technologies.find((item) => item.slug === combo.tech)
      const role = roles.find((item) => item.slug === combo.role)

      if (!technology || !role) {
        return null
      }

      return {
        href: `/templates/${technology.slug}/${role.slug}`,
        reason: combo.reason,
        roleName: role.name,
        techName: technology.name,
      }
    })
    .filter(Boolean) as Array<{ href: string; reason: string; roleName: string; techName: string }>

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: baseUrl },
    { name: 'Solutions', url: `${baseUrl}/solutions` },
    { name: featureData.name, url: `${baseUrl}/solutions/${params.feature}` },
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

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${featureData.name} portfolio templates`,
    description: buildFeatureDescription(featureData),
    url: `${baseUrl}/solutions/${params.feature}`,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${baseUrl}/#website`,
    },
    about: featureData.name,
  }

  return (
    <section className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schemaToJsonLd([breadcrumbSchema, faqSchema, webPageSchema]),
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
              href="/solutions"
              className="transition-colors hover:text-slate-950 theme-dark:hover:text-white"
            >
              Solutions
            </Link>
          </li>
          <li>/</li>
          <li className="font-medium text-slate-900 theme-dark:text-slate-100">{featureData.name}</li>
        </ol>
      </nav>

      <div className="surface-panel px-6 py-8 md:px-8 md:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="section-kicker">Feature page</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="meta-chip normal-case tracking-normal">{featureData.name}</span>
              <span className="meta-chip normal-case tracking-normal">
                {featureData.benefits.length} benefits
              </span>
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white md:text-5xl">
              Portfolio template with {featureData.name}
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600 theme-dark:text-slate-300 md:text-lg">
              {featureData.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/solutions" className="editorial-link">
              All solutions
            </Link>
            <Link href="/templates" className="editorial-link">
              Browse templates
            </Link>
          </div>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <div className="stat-pill">
            <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
              {featureData.benefits.length}
            </span>
            <span>core benefits</span>
          </div>
          <div className="stat-pill">
            <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
              {otherFeatures.length}
            </span>
            <span>other feature pages</span>
          </div>
          <div className="stat-pill">
            <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
              {starterTemplates.length}
            </span>
            <span>starter stacks linked below</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-6">
          <div className="surface-panel px-6 py-6 md:px-8">
            <p className="section-kicker">Benefits</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
              Why this feature matters
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {featureData.benefits.map((benefit) => (
                <div key={benefit} className="surface-card px-5 py-5">
                  <h3 className="text-lg font-semibold text-slate-950 theme-dark:text-slate-100">
                    {benefit}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                    {buildBenefitCopy(featureData, benefit, playbook?.angle || 'the portfolio needs a stronger delivery system.')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {playbook ? (
            <div className="surface-panel px-6 py-6 md:px-8">
              <p className="section-kicker">Where it earns its keep</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
                When this feature matters most
              </h2>
              <p className="mt-4 text-sm leading-8 text-slate-600 theme-dark:text-slate-300 md:text-base">
                This page is strongest when {playbook.angle}
              </p>

              <div className="mt-6 grid gap-5 md:grid-cols-3">
                {playbook.checkpoints.map((checkpoint) => (
                  <div key={checkpoint} className="surface-card px-5 py-5">
                    <p className="section-kicker">Checkpoint</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                      {checkpoint}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="surface-panel px-6 py-6 md:px-8">
            <p className="section-kicker">Implementation</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
              How it works
            </h2>
            <p className="mt-4 text-sm leading-8 text-slate-600 theme-dark:text-slate-300 md:text-base">
              {featureData.technicalDetails}
            </p>
          </div>

          {relatedGuides.length > 0 ? (
            <div className="surface-panel px-6 py-6 md:px-8">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="section-kicker">Supporting guides</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
                    Guides that reinforce this feature
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                  These guides add the implementation detail that a thin feature page usually lacks.
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
                    Broader archives connected to this feature
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                  These hubs make the feature page part of a broader search and browsing path instead of a dead-end landing page.
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
                  <p className="section-kicker">Related articles</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
                    Reading to support the feature page
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                  Internal reading keeps these landing pages closer to a real topic cluster instead of isolated pSEO entries.
                </p>
              </div>

              <div className="mt-6 space-y-6">
                {relatedPosts.slice(0, 3).map((post) => (
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
            <p className="section-kicker">Other features</p>
            <div className="mt-4 space-y-3">
              {otherFeatures.slice(0, 4).map((feature) => (
                <Link
                  key={feature.slug}
                  href={`/solutions/${feature.slug}`}
                  className="block rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 px-4 py-4 transition-colors hover:border-indigo-300 theme-dark:border-slate-800 theme-dark:bg-slate-950/70 theme-dark:hover:border-indigo-500/60"
                >
                  <div className="text-sm font-semibold text-slate-950 theme-dark:text-slate-100">
                    {feature.name}
                  </div>
                  <div className="mt-2 text-sm leading-6 text-slate-600 theme-dark:text-slate-300">
                    {feature.description}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="surface-card px-5 py-5">
            <p className="section-kicker">Template starting points</p>
            <div className="mt-4 space-y-3">
              {starterTemplates.map((technology) => (
                <Link
                  key={technology.href}
                  href={technology.href}
                  className="block rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 px-4 py-4 transition-colors hover:border-indigo-300 theme-dark:border-slate-800 theme-dark:bg-slate-950/70 theme-dark:hover:border-indigo-500/60"
                >
                  <div className="text-sm font-semibold text-slate-950 theme-dark:text-slate-100">
                    {technology.techName}
                  </div>
                  <div className="mt-2 text-sm font-medium text-slate-700 theme-dark:text-slate-200">
                    {technology.roleName}
                  </div>
                  <div className="mt-2 text-sm text-slate-600 theme-dark:text-slate-300">
                    {technology.reason}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

