import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import pseoData from '@/data/pseo_data.json'
import { baseUrl } from 'app/sitemap'
import {
  generateBreadcrumbSchema,
  schemaToJsonLd,
} from 'app/lib/schemas'

// Types
interface Feature {
  slug: string
  name: string
  description: string
  benefits: string[]
  technicalDetails: string
}

interface Props {
  params: Promise<{ feature: string }>
}

// Static params generation
export async function generateStaticParams() {
  return (pseoData.features as Feature[]).map(feature => ({
    feature: feature.slug,
  }))
}

// Dynamic metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { feature } = await params

  const featureData = (pseoData.features as Feature[]).find(f => f.slug === feature)

  if (!featureData) {
    return { title: 'Feature Not Found' }
  }

  const title = pseoData.templates.feature.titlePattern
    .replace('{feature}', featureData.name)

  const description = pseoData.templates.feature.descriptionPattern
    .replace('{feature}', featureData.name)
    .replace('{benefits}', featureData.benefits.slice(0, 2).join(', '))

  return {
    title,
    description,
    keywords: [featureData.name, 'portfolio template', 'developer portfolio', ...featureData.benefits],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${baseUrl}/solutions/${feature}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${baseUrl}/solutions/${feature}`,
    },
  }
}

// Helper: Generate FAQs for feature
function generateFAQs(feature: Feature) {
  return [
    {
      question: `How does ${feature.name} work in this template?`,
      answer: feature.technicalDetails,
    },
    {
      question: `What are the benefits of ${feature.name}?`,
      answer: `${feature.name} provides: ${feature.benefits.join(', ')}.`,
    },
    {
      question: `Is ${feature.name} easy to customize?`,
      answer: `Yes! The ${feature.name} implementation is built with customization in mind. You can easily adjust colors, behavior, and preferences to match your personal brand.`,
    },
    {
      question: `Does ${feature.name} affect performance or SEO?`,
      answer: `${feature.name} is implemented following best practices for performance and SEO. It won't negatively impact your site speed or search rankings, and may even improve user engagement signals.`,
    },
  ]
}

// Main Page Component
export default async function FeaturePage({ params }: Props) {
  const { feature } = await params

  const featureData = (pseoData.features as Feature[]).find(f => f.slug === feature)

  if (!featureData) {
    notFound()
  }

  const faqs = generateFAQs(featureData)
  const otherFeatures = (pseoData.features as Feature[])
    .filter(f => f.slug !== feature)

  // Generate schemas
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: baseUrl },
    { name: 'Solutions', url: `${baseUrl}/solutions` },
    { name: featureData.name, url: `${baseUrl}/solutions/${feature}` },
  ])

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
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
    <section>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schemaToJsonLd([breadcrumbSchema, faqSchema, productSchema]),
        }}
      />

      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-600 dark:text-gray-400">
        <ol className="flex items-center gap-2 flex-wrap">
          <li>
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/solutions" className="hover:text-blue-600 dark:hover:text-blue-400">
              Solutions
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 dark:text-gray-100 font-medium">{featureData.name}</li>
        </ol>
      </nav>

      {/* Hero Section */}
      <header className="mb-12 text-center">
        <div className="text-6xl mb-4">
          {featureData.slug === 'dark-mode' && '🌙'}
          {featureData.slug === 'seo-optimized' && '🔍'}
          {featureData.slug === 'responsive-design' && '📱'}
          {featureData.slug === 'fast-performance' && '⚡'}
          {featureData.slug === 'blog-ready' && '📝'}
        </div>
        <h1 className="mb-4 text-4xl font-black tracking-tight text-gray-900 dark:text-gray-100">
          Portfolio Template with {featureData.name}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
          {featureData.description}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/blog"
            className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 transition-colors"
          >
            View Demo
          </Link>
          <a
            href="https://github.com/vercel/next.js/tree/canary/examples/blog-starter"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800 transition-colors"
          >
            Get Template
          </a>
        </div>
      </header>

      {/* Benefits Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Benefits of {featureData.name}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {featureData.benefits.map((benefit, i) => (
            <div
              key={i}
              className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg"
            >
              <div className="text-2xl mb-2">
                {['✨', '🚀', '💡', '⚡'][i % 4]}
              </div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">{benefit}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enhance your portfolio with this essential feature for a better user experience.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Implementation */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          How It Works
        </h2>
        <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {featureData.technicalDetails}
          </p>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Why {featureData.name} Matters
        </h2>
        <div className="space-y-4">
          <div className="flex gap-4 items-start p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
            <div className="text-green-500 text-xl">✓</div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">User Experience</h3>
              <p className="text-gray-600 dark:text-gray-400">{featureData.name} significantly improves how visitors interact with your portfolio.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
            <div className="text-green-500 text-xl">✓</div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Professional Image</h3>
              <p className="text-gray-600 dark:text-gray-400">Having {featureData.name} shows attention to detail and modern development practices.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
            <div className="text-green-500 text-xl">✓</div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Industry Standard</h3>
              <p className="text-gray-600 dark:text-gray-400">{featureData.name} is expected in modern web applications and portfolios.</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg group"
            >
              <summary className="font-semibold cursor-pointer text-gray-900 dark:text-gray-100 list-none flex justify-between items-center">
                {faq.question}
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-gray-700">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>

      {/* Other Features */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Other Features You'll Love
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {otherFeatures.map(f => (
            <Link
              key={f.slug}
              href={`/solutions/${f.slug}`}
              className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
            >
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">{f.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {f.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Related Templates */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Templates with {featureData.name}
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {(pseoData.technologies as {slug: string; name: string}[]).slice(0, 3).map(tech => (
            <Link
              key={tech.slug}
              href={`/templates/${tech.slug}/frontend-developer`}
              className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-blue-400 dark:hover:border-blue-600 transition-colors text-center"
            >
              <div className="font-semibold text-gray-900 dark:text-gray-100">{tech.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Portfolio Template</div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Ready to Use {featureData.name}?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xl mx-auto">
          Get our portfolio template with {featureData.name} built-in.
          Free, open-source, and ready to deploy.
        </p>
        <a
          href="https://github.com/vercel/next.js/tree/canary/examples/blog-starter"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 transition-colors"
        >
          Get Started Free
        </a>
      </div>
    </section>
  )
}
