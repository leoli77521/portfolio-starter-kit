import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import pseoData from '@/data/pseo_data.json'
import { getBlogPosts, calculateReadingTime } from 'app/blog/utils'
import { baseUrl } from 'app/sitemap'
import { PostCard } from 'app/components/post-card'
import {
  generateBreadcrumbSchema,
  schemaToJsonLd,
} from 'app/lib/schemas'

// Types
interface Technology {
  slug: string
  name: string
  description: string
  features: string[]
  useCases: string[]
  relatedPosts: string[]
  icon?: string
}

interface Role {
  slug: string
  name: string
  description: string
  keywords: string[]
  challenges: string[]
  goals: string[]
}

interface Props {
  params: Promise<{ tech: string; role: string }>
}

// Static params generation for SSG
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

// Dynamic metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tech, role } = await params

  const technology = (pseoData.technologies as Technology[]).find(t => t.slug === tech)
  const roleData = (pseoData.roles as Role[]).find(r => r.slug === role)

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
      url: `${baseUrl}/templates/${tech}/${role}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${baseUrl}/templates/${tech}/${role}`,
    },
  }
}

// Helper: Get related blog posts
function getRelatedPosts(technology: Technology, roleData: Role) {
  const allPosts = getBlogPosts()
  const relevantTags = [...technology.features, ...roleData.keywords].map(t => t.toLowerCase())

  return allPosts
    .filter(post => {
      const postTags = post.metadata.tags?.map(t => t.toLowerCase()) || []
      return postTags.some(tag =>
        relevantTags.some(rt => tag.includes(rt.toLowerCase()) || rt.toLowerCase().includes(tag))
      )
    })
    .slice(0, 6)
}

// Helper: Generate FAQs
function generateFAQs(technology: Technology, roleData: Role) {
  return [
    {
      question: `Why is ${technology.name} great for ${roleData.name}s?`,
      answer: `${technology.name} is perfect for ${roleData.name}s because it offers ${technology.features.slice(0, 3).join(', ')}. This helps address common challenges like ${roleData.challenges.slice(0, 2).join(' and ')}.`,
    },
    {
      question: `What features does this ${technology.name} portfolio template include?`,
      answer: `This template includes: ${technology.features.join(', ')}. It's optimized to help you ${roleData.goals.slice(0, 2).join(' and ')}.`,
    },
    {
      question: `Is this template suitable for ${roleData.name}s?`,
      answer: `Absolutely! This template is specifically designed for ${roleData.name}s, focusing on ${roleData.keywords.slice(0, 3).join(', ')}. It helps you ${roleData.goals[0]}.`,
    },
    {
      question: `How do I customize this ${technology.name} template?`,
      answer: `The template is fully customizable using ${technology.name}'s component system. You can modify colors, layouts, and content to match your personal brand and showcase your ${roleData.keywords[0]} skills.`,
    },
  ]
}

// Main Page Component
export default async function TechRoleTemplatePage({ params }: Props) {
  const { tech, role } = await params

  const technology = (pseoData.technologies as Technology[]).find(t => t.slug === tech)
  const roleData = (pseoData.roles as Role[]).find(r => r.slug === role)

  if (!technology || !roleData) {
    notFound()
  }

  const relatedPosts = getRelatedPosts(technology, roleData)
  const faqs = generateFAQs(technology, roleData)

  // Get other technologies and roles for cross-linking
  const otherTechs = (pseoData.technologies as Technology[])
    .filter(t => t.slug !== tech)
    .slice(0, 3)
  const otherRoles = (pseoData.roles as Role[])
    .filter(r => r.slug !== role)
    .slice(0, 3)

  // Generate schemas
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: baseUrl },
    { name: 'Templates', url: `${baseUrl}/templates` },
    { name: technology.name, url: `${baseUrl}/templates/${tech}` },
    { name: roleData.name, url: `${baseUrl}/templates/${tech}/${role}` },
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
    <section>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schemaToJsonLd([breadcrumbSchema, faqSchema, softwareSchema]),
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
            <Link href="/templates" className="hover:text-blue-600 dark:hover:text-blue-400">
              Templates
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href={`/templates/${tech}`} className="hover:text-blue-600 dark:hover:text-blue-400">
              {technology.name}
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 dark:text-gray-100 font-medium">{roleData.name}</li>
        </ol>
      </nav>

      {/* Hero Section */}
      <header className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-black tracking-tight text-gray-900 dark:text-gray-100">
          Best {technology.name} Portfolio Template for {roleData.name}s
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
          {technology.description} Perfect for {roleData.name}s who want to {roleData.goals[0]}.
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

      {/* Features Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Why {technology.name} for Your {roleData.name} Portfolio?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technology.features.map((feature, i) => (
            <div
              key={i}
              className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg"
            >
              <div className="text-2xl mb-2">
                {['⚡', '🚀', '🎨', '📱', '🔍', '🛠️'][i % 6]}
              </div>
              <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">{feature}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Essential for {roleData.name}s building a professional portfolio.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Role-specific Benefits */}
      <div className="mb-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Built for {roleData.name}s
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {roleData.description}
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {roleData.goals.map((goal, i) => (
            <div
              key={i}
              className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <span className="text-green-500 mr-2">✓</span>
              {goal}
            </div>
          ))}
        </div>
      </div>

      {/* Use Cases */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Perfect For
        </h2>
        <div className="flex flex-wrap gap-3">
          {technology.useCases.map((useCase, i) => (
            <span
              key={i}
              className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
            >
              {useCase}
            </span>
          ))}
        </div>
      </div>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Related Articles
          </h2>
          <div className="space-y-4">
            {relatedPosts.slice(0, 4).map(post => (
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
      )}

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

      {/* Cross-linking Section */}
      <div className="mb-12 grid md:grid-cols-2 gap-8">
        {/* Other Technologies */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Other {roleData.name} Templates
          </h3>
          <div className="space-y-2">
            {otherTechs.map(t => (
              <Link
                key={t.slug}
                href={`/templates/${t.slug}/${role}`}
                className="block p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
              >
                <span className="font-medium text-gray-900 dark:text-gray-100">{t.name}</span>
                <span className="text-gray-500 dark:text-gray-400"> for {roleData.name}s</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Other Roles */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            {technology.name} for Other Roles
          </h3>
          <div className="space-y-2">
            {otherRoles.map(r => (
              <Link
                key={r.slug}
                href={`/templates/${tech}/${r.slug}`}
                className="block p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
              >
                <span className="font-medium text-gray-900 dark:text-gray-100">{technology.name}</span>
                <span className="text-gray-500 dark:text-gray-400"> for {r.name}s</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Ready to Build Your {roleData.name} Portfolio?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-xl mx-auto">
          Start with our {technology.name} template and launch your professional portfolio today.
          Free, open-source, and ready to customize.
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
