import { BlogPosts } from 'app/components/posts'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Read my thoughts on software development, AI, SEO, and web development best practices.',
  keywords: ['blog', 'software development', 'AI', 'SEO', 'web development', 'programming'],
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Blog - Vim Enthusiast Portfolio',
    description: 'Read my thoughts on software development, AI, SEO, and web development best practices.',
    type: 'website',
  },
}

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">My Blog</h1>
      <BlogPosts />
    </section>
  )
}
