import { BlogPosts } from 'app/components/posts'
import { baseUrl } from './sitemap'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Vim Enthusiast Portfolio - Explore coding insights, AI developments, and web development best practices.',
  keywords: ['portfolio', 'vim', 'coding', 'AI', 'web development', 'programming'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Vim Enthusiast Portfolio: Coding Insights & AI Blog',
    description: 'Vim Enthusiast Portfolio - Explore coding insights, AI developments, and web development best practices.',
    url: baseUrl,
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
            '@type': 'Person',
            name: 'Vim Enthusiast Portfolio',
            jobTitle: 'Software Developer',
            description: 'Vim enthusiast and tab advocate, passionate about static typing and dark mode development.',
            url: baseUrl,
            sameAs: [baseUrl],
            knowsAbout: ['Vim', 'Programming', 'Web Development', 'AI', 'SEO'],
          }),
        }}
      />
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Vim Enthusiast Portfolio
      </h1>
      <p className="mb-4">
        {`I'm a Vim enthusiast and tab advocate, finding unmatched efficiency in
        Vim's keystroke commands and tabs' flexibility for personal viewing
        preferences. This extends to my support for static typing, where its
        early error detection ensures cleaner code, and my preference for dark
        mode, which eases long coding sessions by reducing eye strain.`}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}
