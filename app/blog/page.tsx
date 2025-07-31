import { BlogPosts } from 'app/components/posts'
import type { Metadata } from 'next'
import { baseUrl } from 'app/sitemap'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read my thoughts on software development, AI, SEO, and web development best practices.',
  keywords: ['blog', 'software development', 'AI', 'SEO', 'web development', 'programming'],
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
  openGraph: {
    title: 'Blog - Vim Enthusiast Portfolio',
    description: 'Read my thoughts on software development, AI, SEO, and web development best practices.',
    url: `${baseUrl}/blog`,
    type: 'website',
  },
}

export default function Page() {
  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Vim Enthusiast Blog',
            description: 'Read thoughts on software development, AI, SEO, and web development best practices.',
            url: `${baseUrl}/blog`,
            author: {
              '@type': 'Person',
              name: 'Vim Enthusiast Portfolio',
              url: baseUrl
            },
            publisher: {
              '@type': 'Organization',
              name: 'Vim Enthusiast Portfolio',
              logo: {
                '@type': 'ImageObject',
                url: `${baseUrl}/logo.png`,
                width: 150,
                height: 150
              }
            },
            inLanguage: 'en-US',
            keywords: ['software development', 'AI', 'SEO', 'web development', 'programming', 'vim']
          }),
        }}
      />
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">My Blog</h1>
      <BlogPosts />
    </section>
  )
}
