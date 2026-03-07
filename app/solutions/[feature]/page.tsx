import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import pseoData from '@/data/pseo_data.json'
import { baseUrl } from 'app/sitemap'
import { generateBreadcrumbSchema, schemaToJsonLd } from 'app/lib/schemas'

interface Feature {
  slug: string
  name: string
  description: string
  benefits: string[]
  technicalDetails: string
}

interface PageProps {
  params: { feature: string }
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
  const description = pseoData.templates.feature.descriptionPattern
    .replace('{feature}', featureData.name)
    .replace('{benefits}', featureData.benefits.slice(0, 2).join(', '))

  return {
    title,
    description,
    keywords: [featureData.name, 'portfolio template', ...featureData.benefits],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${baseUrl}/solutions/${params.feature}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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

  const faqs = generateFAQs(featureData)
  const otherFeatures = (pseoData.features as Feature[]).filter(
    (feature) => feature.slug !== params.feature
  )
  const starterTemplates = (pseoData.technologies as { slug: string; name: string }[]).slice(0, 3)

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

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${featureData.name} Portfolio Template`,
    description: featureData.description,
    brand: {
      '@type': 'Organization',
      name: 'ToLearn Blog',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <section className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schemaToJsonLd([breadcrumbSchema, faqSchema, productSchema]),
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
                    This is one of the concrete reasons the feature improves the browsing or publishing experience.
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-panel px-6 py-6 md:px-8">
            <p className="section-kicker">Implementation</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
              How it works
            </h2>
            <p className="mt-4 text-sm leading-8 text-slate-600 theme-dark:text-slate-300 md:text-base">
              {featureData.technicalDetails}
            </p>
          </div>

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
                  key={technology.slug}
                  href={`/templates/${technology.slug}/frontend-developer`}
                  className="block rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 px-4 py-4 transition-colors hover:border-indigo-300 theme-dark:border-slate-800 theme-dark:bg-slate-950/70 theme-dark:hover:border-indigo-500/60"
                >
                  <div className="text-sm font-semibold text-slate-950 theme-dark:text-slate-100">
                    {technology.name}
                  </div>
                  <div className="mt-2 text-sm text-slate-600 theme-dark:text-slate-300">
                    Portfolio template
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

