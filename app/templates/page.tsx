import { Metadata } from 'next'
import Link from 'next/link'
import pseoData from '@/data/pseo_data.json'
import { baseUrl } from 'app/sitemap'
import {
  generateBreadcrumbSchema,
  generateCollectionPageSchema,
  schemaToJsonLd,
} from 'app/lib/schemas'

export const metadata: Metadata = {
  title: 'Portfolio Templates | Developer Portfolio Starter Kits',
  description: 'Browse our collection of portfolio templates built with Next.js, React, TypeScript, and Tailwind CSS. Perfect for frontend developers, backend developers, and software engineers.',
  keywords: ['portfolio template', 'developer portfolio', 'nextjs template', 'react portfolio'],
  alternates: {
    canonical: `${baseUrl}/templates`,
  },
  openGraph: {
    title: 'Portfolio Templates | Developer Portfolio Starter Kits',
    description: 'Browse our collection of portfolio templates built with modern technologies.',
    type: 'website',
    url: `${baseUrl}/templates`,
  },
}

interface Technology {
  slug: string
  name: string
  description: string
  features: string[]
  icon?: string
}

interface Role {
  slug: string
  name: string
  description: string
}

export default function TemplatesPage() {
  const technologies = pseoData.technologies as Technology[]
  const roles = pseoData.roles as Role[]

  const totalCombinations = technologies.length * roles.length

  // Generate schemas
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: baseUrl },
    { name: 'Templates', url: `${baseUrl}/templates` },
  ])

  const collectionSchema = generateCollectionPageSchema({
    name: 'Portfolio Templates',
    description: 'Collection of developer portfolio templates',
    url: `${baseUrl}/templates`,
    items: technologies.map((tech, i) => ({
      url: `${baseUrl}/templates/${tech.slug}`,
      name: `${tech.name} Templates`,
      position: i + 1,
    })),
  })

  return (
    <section>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: schemaToJsonLd([breadcrumbSchema, collectionSchema]),
        }}
      />

      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-600 dark:text-gray-400">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="text-gray-900 dark:text-gray-100 font-medium">Templates</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-black tracking-tight text-gray-900 dark:text-gray-100">
          Portfolio Templates
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Find the perfect portfolio template for your role. Built with modern technologies
          like Next.js, React, and TypeScript.
        </p>
        <div className="mt-4 text-sm text-gray-500">
          {totalCombinations} template combinations available
        </div>
      </header>

      {/* Technologies */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Browse by Technology
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technologies.map(tech => (
            <div
              key={tech.slug}
              className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                {tech.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {tech.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {tech.features.slice(0, 3).map((feature, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs"
                  >
                    {feature}
                  </span>
                ))}
              </div>
              <div className="space-y-2">
                {roles.slice(0, 3).map(role => (
                  <Link
                    key={role.slug}
                    href={`/templates/${tech.slug}/${role.slug}`}
                    className="block text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    → {tech.name} for {role.name}s
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roles */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Browse by Role
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map(role => (
            <div
              key={role.slug}
              className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg"
            >
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                {role.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {role.description}
              </p>
              <div className="space-y-2">
                {technologies.slice(0, 3).map(tech => (
                  <Link
                    key={tech.slug}
                    href={`/templates/${tech.slug}/${role.slug}`}
                    className="block text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    → {tech.name} for {role.name}s
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All Combinations */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          All Template Combinations
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="p-3 text-left text-gray-900 dark:text-gray-100 font-semibold">
                  Technology / Role
                </th>
                {roles.map(role => (
                  <th
                    key={role.slug}
                    className="p-3 text-left text-gray-900 dark:text-gray-100 font-semibold"
                  >
                    {role.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {technologies.map(tech => (
                <tr key={tech.slug} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="p-3 font-medium text-gray-900 dark:text-gray-100">
                    {tech.name}
                  </td>
                  {roles.map(role => (
                    <td key={role.slug} className="p-3">
                      <Link
                        href={`/templates/${tech.slug}/${role.slug}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                      >
                        View →
                      </Link>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Features CTA */}
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Looking for Specific Features?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Browse templates by features like dark mode, SEO optimization, and more.
        </p>
        <Link
          href="/solutions"
          className="inline-block px-8 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 transition-colors"
        >
          Browse by Feature
        </Link>
      </div>
    </section>
  )
}
