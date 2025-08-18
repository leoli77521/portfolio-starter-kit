import type { Metadata } from 'next'
import { baseUrl } from './sitemap'

export const metadata: Metadata = {
  title: '404 - Page Not Found | ToLearn Blog',
  description: 'The page you are looking for does not exist. Return to ToLearn Blog to explore our AI insights, SEO guides, and programming tutorials.',
  alternates: {
    canonical: `${baseUrl}/404`,
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFound() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        404 - Page Not Found
      </h1>
      <p className="mb-4">The page you are looking for does not exist.</p>
    </section>
  )
}
