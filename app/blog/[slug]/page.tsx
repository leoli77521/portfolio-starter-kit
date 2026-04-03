import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowUpRight, CalendarDays, Clock3, FileText, Layers3 } from 'lucide-react'
import { CustomMDX } from 'app/components/mdx'
import { TableOfContents } from 'app/components/toc'
import {
  formatDate,
  getBlogPosts,
  resolveBlogSlug,
  getHeadings,
  calculateReadingTime,
} from 'app/blog/utils'
import { baseUrl } from 'app/sitemap'
import { RelatedPosts } from 'app/components/related-posts'
import { SocialShare } from 'app/components/SocialShare'
import { InArticleAd } from 'app/components/AdUnit'
import Comments from 'app/components/comments'
import type { FAQItem, HowToStep } from 'app/types'
import { getCategorySlug } from 'app/lib/categories'
import { buildSocialTitle, resolveOgImage, trimSeoTitle } from 'app/lib/seo'
import { findRelevantGuides } from 'app/lib/pseo-content'
import { postMatchesTopicHub, topicHubs } from 'app/lib/topic-hubs'
import { normalizeTagName, toTagSlug } from 'app/lib/tags'

function parseJsonArray(value: unknown): unknown[] | null {
  if (!value) return null
  if (Array.isArray(value)) return value
  if (typeof value !== 'string') return null

  const trimmed = value.trim()
  if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) return null

  try {
    const parsed = JSON.parse(trimmed)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

function normalizeFaqItems(value: unknown): FAQItem[] {
  const rawItems = parseJsonArray(value)
  if (!rawItems) return []

  return rawItems
    .map((item) => {
      if (!item || typeof item !== 'object') return null

      const record = item as Record<string, unknown>
      const question =
        typeof record.question === 'string'
          ? record.question
          : typeof record.q === 'string'
            ? record.q
            : null
      const answer =
        typeof record.answer === 'string'
          ? record.answer
          : typeof record.a === 'string'
            ? record.a
            : null

      if (!question || !answer) return null

      return {
        question: question.trim(),
        answer: answer.trim(),
      }
    })
    .filter((item): item is FAQItem => Boolean(item))
}

function normalizeHowToSteps(value: unknown): HowToStep[] {
  const rawItems = parseJsonArray(value)
  if (!rawItems) return []

  return rawItems.reduce<HowToStep[]>((acc, item, index) => {
    if (typeof item === 'string') {
      const text = item.trim()
      if (text) {
        acc.push({ name: `Step ${index + 1}`, text })
      }
      return acc
    }

    if (!item || typeof item !== 'object') return acc

    const record = item as Record<string, unknown>
    const textValue =
      typeof record.text === 'string'
        ? record.text
        : typeof record.step === 'string'
          ? record.step
          : typeof record.description === 'string'
            ? record.description
            : null

    if (!textValue || !textValue.trim()) return acc

    const nameValue =
      typeof record.name === 'string'
        ? record.name
        : typeof record.title === 'string'
          ? record.title
          : undefined

    acc.push({
      name: nameValue,
      text: textValue.trim(),
    })

    return acc
  }, [])
}

export async function generateStaticParams() {
  const posts = getBlogPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

interface PageProps {
  params: { slug: string }
}

function buildDescription(
  category: string | undefined,
  summary: string | undefined,
  title: string | undefined
): string {
  const safeSummary = summary || 'Professional technology insights and practical solutions.'
  const lowerTitle = title?.toLowerCase() || ''
  const lowerCategory = category?.toLowerCase() || ''

  let prefix = ''
  if (lowerTitle.includes('comparison') || lowerTitle.includes('showdown') || lowerTitle.includes('vs')) {
    prefix = 'Which option stands out? '
  } else if (lowerTitle.includes('benchmark')) {
    prefix = 'Real data shows: '
  } else if (lowerTitle.includes('guide') || lowerTitle.includes('tutorial') || lowerTitle.includes('how to')) {
    prefix = 'Learn how to: '
  } else if (lowerCategory.includes('ai')) {
    prefix = '2026 update: '
  }

  const suffixes: Record<string, string> = {
    'ai technology': ' | Read the full analysis',
    'ai & seo': ' | Read the full analysis',
    'seo optimization': ' | Get the strategies',
    programming: ' | See the code examples',
    'web development': ' | Start building today',
  }

  const suffix = suffixes[lowerCategory] || ' | Read more'
  const maxSummaryLength = Math.max(40, 155 - prefix.length - suffix.length)

  let optimizedSummary = safeSummary
  if (optimizedSummary.length > maxSummaryLength) {
    const truncated = optimizedSummary.slice(0, maxSummaryLength)
    const lastPeriod = truncated.lastIndexOf('.')
    const lastQuestion = truncated.lastIndexOf('?')
    const lastSentence = Math.max(lastPeriod, lastQuestion)

    if (lastSentence > maxSummaryLength * 0.6) {
      optimizedSummary = truncated.slice(0, lastSentence + 1)
    } else {
      const lastSpace = truncated.lastIndexOf(' ')
      optimizedSummary = `${truncated.slice(0, lastSpace > 0 ? lastSpace : maxSummaryLength)}...`
    }
  }

  return `${prefix}${optimizedSummary}${suffix}`
}

export function generateMetadata({ params }: PageProps): Metadata {
  const allPosts = getBlogPosts()
  const requestedSlug = params.slug
  const normalizedSlug = resolveBlogSlug(requestedSlug)

  let post = allPosts.find((item) => item.slug === normalizedSlug)

  if (!post) {
    try {
      const decodedSlug = decodeURIComponent(requestedSlug)
      const decodedNormalizedSlug = resolveBlogSlug(decodedSlug)
      post = allPosts.find((item) => item.slug === decodedNormalizedSlug)
    } catch {
      return {}
    }
  }

  if (!post) {
    return {}
  }

  const {
    title,
    publishedAt: publishedTime,
    updatedAt,
    summary: description,
    image,
  } = post.metadata

  const seoTitle = trimSeoTitle(title)
  const socialTitle = buildSocialTitle(seoTitle)
  const modifiedTime = updatedAt || publishedTime
  const ogImage = resolveOgImage(image, title)
  const canonicalUrl = `${baseUrl}/blog/${post.slug}`
  const optimizedDescription = buildDescription(post.metadata.category, description, title)

  return {
    title: seoTitle,
    description: optimizedDescription,
    authors: [{ name: 'ToLearn Blog' }],
    creator: 'ToLearn Blog',
    publisher: 'ToLearn Blog',
    category: 'Technology Articles',
    openGraph: {
      title: socialTitle,
      description: optimizedDescription,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: ['ToLearn Blog'],
      section: 'Technology Articles',
      url: canonicalUrl,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description: optimizedDescription,
      images: [ogImage],
      creator: '@tolearn_blog',
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default function Blog({ params }: PageProps) {
  const allPosts = getBlogPosts()
  const requestedSlug = params.slug
  const normalizedSlug = resolveBlogSlug(requestedSlug)

  let post = allPosts.find((item) => item.slug === normalizedSlug)

  if (post && requestedSlug !== post.slug) {
    redirect(`/blog/${post.slug}`)
  }

  if (!post) {
    try {
      const decodedSlug = decodeURIComponent(requestedSlug)
      const decodedNormalizedSlug = resolveBlogSlug(decodedSlug)
      post = allPosts.find((item) => item.slug === decodedNormalizedSlug)

      if (post && requestedSlug !== post.slug) {
        redirect(`/blog/${post.slug}`)
      }
    } catch {
      notFound()
    }
  }

  if (!post) {
    notFound()
  }

  const cleanSlug = post.slug
  const headings = getHeadings(post.content)
  const readingTime = calculateReadingTime(post.content)
  const wordCount = post.content.trim().split(/\s+/).filter(Boolean).length
  const modifiedTime = post.metadata.updatedAt || post.metadata.publishedAt
  const faqItems = normalizeFaqItems(post.metadata.faq)
  const howToSteps = normalizeHowToSteps(post.metadata.howto)
  const tags = post.metadata.tags?.map(normalizeTagName).filter(Boolean) || []
  const normalizedTagSet = new Set(tags.map((tag) => normalizeTagName(tag).toLowerCase()))
  const currentCategory = post.metadata.category
  const categoryHref = currentCategory
    ? `/categories/${getCategorySlug(currentCategory)}`
    : null
  const relatedGuides = findRelevantGuides({
    terms: [post.metadata.title, post.metadata.summary, currentCategory || '', ...tags],
    categories: currentCategory ? [currentCategory] : undefined,
    limit: 3,
  })
  const relatedTopicHubs = topicHubs
    .map((hub) => {
      const normalizedHubTags = hub.relatedTags.map((tag) => normalizeTagName(tag).toLowerCase())
      const tagMatchCount = normalizedHubTags.filter((tag) => normalizedTagSet.has(tag)).length
      const categoryMatch = Boolean(
        currentCategory && hub.relatedCategories.some((category) => category === currentCategory)
      )

      if (tagMatchCount === 0 && !categoryMatch && !postMatchesTopicHub(tags, hub)) {
        return null
      }

      return {
        hub,
        score: tagMatchCount * 10 + (categoryMatch ? 1 : 0),
      }
    })
    .filter(
      (
        entry
      ): entry is {
        hub: (typeof topicHubs)[number]
        score: number
      } => entry !== null
    )
    .sort((left, right) => right.score - left.score || left.hub.title.localeCompare(right.hub.title))
    .slice(0, 3)
    .map(({ hub }) => hub)

  const organization = {
    '@type': 'Organization',
    '@id': `${baseUrl}/#organization`,
    name: 'ToLearn Blog',
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/favicon.ico`,
      width: 32,
      height: 32,
    },
  }

  const structuredData: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `${baseUrl}/blog/${cleanSlug}#article`,
      headline: post.metadata.title,
      description: post.metadata.summary,
      image: {
        '@type': 'ImageObject',
        url: resolveOgImage(post.metadata.image, post.metadata.title),
        width: 1200,
        height: 630,
      },
      datePublished: post.metadata.publishedAt,
      dateModified: modifiedTime,
      author: {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'ToLearn Blog',
        url: baseUrl,
      },
      publisher: organization,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${baseUrl}/blog/${cleanSlug}`,
      },
      url: `${baseUrl}/blog/${cleanSlug}`,
      isPartOf: {
        '@id': `${baseUrl}/blog/#blog`,
      },
      wordCount,
      timeRequired: `PT${readingTime}M`,
      keywords: post.metadata.tags?.length
        ? post.metadata.tags
        : ['programming technology', 'AI artificial intelligence', 'SEO optimization', 'web development'],
      articleSection: post.metadata.category || 'Technology Articles',
      inLanguage: 'en-US',
      isAccessibleForFree: true,
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['article', 'h1', '.prose'],
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: baseUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: `${baseUrl}/blog`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.metadata.title,
          item: `${baseUrl}/blog/${cleanSlug}`,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${cleanSlug}`,
      url: `${baseUrl}/blog/${cleanSlug}`,
      name: post.metadata.title,
      description: post.metadata.summary,
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: baseUrl,
        name: 'ToLearn Blog',
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: resolveOgImage(post.metadata.image, post.metadata.title),
      },
    },
  ]

  if (faqItems.length > 0) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${baseUrl}/blog/${cleanSlug}#faq`,
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    })
  }

  if (howToSteps.length > 0) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      '@id': `${baseUrl}/blog/${cleanSlug}#howto`,
      name: post.metadata.title,
      description: post.metadata.summary,
      step: howToSteps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name || `Step ${index + 1}`,
        text: step.text,
      })),
      inLanguage: 'en-US',
    })
  }

  const relatedPostsData = allPosts.map((item) => ({
    slug: item.slug,
    title: item.metadata.title || 'Untitled',
    summary: item.metadata.summary || 'No summary available',
    category: item.metadata.category,
    tags: item.metadata.tags,
    publishedAt: item.metadata.publishedAt,
    readingTime: calculateReadingTime(item.content),
  }))

  const currentPostData = {
    slug: cleanSlug,
    title: post.metadata.title || 'Untitled',
    summary: post.metadata.summary || 'No summary available',
    category: post.metadata.category,
    tags,
    publishedAt: post.metadata.publishedAt,
    readingTime,
  }

  return (
    <section className="page-enter pb-24">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <div className="surface-panel relative overflow-hidden px-6 py-8 md:px-10 md:py-10">
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.2),transparent_70%)] theme-dark:bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.28),transparent_72%)]" />

        <div className="relative">
          <nav className="text-sm" aria-label="Breadcrumb navigation">
            <ol className="flex flex-wrap items-center gap-2 text-slate-500 theme-dark:text-slate-400">
              <li>
                <Link href="/" className="transition-colors hover:text-slate-950 theme-dark:hover:text-white">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/blog" className="transition-colors hover:text-slate-950 theme-dark:hover:text-white">
                  Blog
                </Link>
              </li>
              <li>/</li>
              <li className="max-w-xl truncate text-slate-900 theme-dark:text-slate-100" title={post.metadata.title}>
                {post.metadata.title}
              </li>
            </ol>
          </nav>

          <div className="mt-8 max-w-4xl">
            <div className="flex flex-wrap items-center gap-3">
              {categoryHref && post.metadata.category ? (
                <Link href={categoryHref} className="meta-chip">
                  {post.metadata.category}
                </Link>
              ) : null}
              {tags.slice(0, 2).map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${toTagSlug(tag)}`}
                  className="meta-chip normal-case tracking-[0.04em]"
                >
                  {tag}
                </Link>
              ))}
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-slate-950 theme-dark:text-white md:text-5xl">
              {post.metadata.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 theme-dark:text-slate-300">
              {post.metadata.summary}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="stat-pill">
                <span className="inline-flex items-center gap-2 text-slate-700 theme-dark:text-slate-200">
                  <CalendarDays className="h-4 w-4" />
                  Published
                </span>
                <span className="text-base font-semibold text-slate-950 theme-dark:text-white">
                  {formatDate(post.metadata.publishedAt, false)}
                </span>
              </div>
              <div className="stat-pill">
                <span className="inline-flex items-center gap-2 text-slate-700 theme-dark:text-slate-200">
                  <Clock3 className="h-4 w-4" />
                  Reading time
                </span>
                <span className="text-base font-semibold text-slate-950 theme-dark:text-white">
                  {readingTime} min read
                </span>
              </div>
              <div className="stat-pill">
                <span className="inline-flex items-center gap-2 text-slate-700 theme-dark:text-slate-200">
                  <FileText className="h-4 w-4" />
                  Word count
                </span>
                <span className="text-base font-semibold text-slate-950 theme-dark:text-white">
                  {wordCount.toLocaleString()} words
                </span>
              </div>
              <div className="stat-pill">
                <span className="inline-flex items-center gap-2 text-slate-700 theme-dark:text-slate-200">
                  <Layers3 className="h-4 w-4" />
                  Topics
                </span>
                <span className="text-base font-semibold text-slate-950 theme-dark:text-white">
                  {tags.length > 0 ? `${tags.length} linked tags` : 'Article briefing'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-8">
          {post.metadata.image ? (
            <div className="surface-panel overflow-hidden p-2 md:p-3">
              <Image
                src={post.metadata.image}
                alt={post.metadata.title}
                width={1024}
                height={1024}
                priority
                sizes="(max-width: 1280px) 100vw, 900px"
                className="h-auto w-full rounded-[1.6rem] border border-slate-200/70 object-cover theme-dark:border-slate-800/80"
              />
            </div>
          ) : null}

          <article className="surface-panel px-6 py-8 md:px-10 md:py-10">
            <div className="prose max-w-none">
              <CustomMDX source={post.content} />
            </div>
          </article>

          {howToSteps.length > 0 ? (
            <section className="surface-card px-6 py-7 md:px-8">
              <p className="section-kicker">Action checklist</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
                Implementation steps
              </h2>
              <div className="mt-6 grid gap-4">
                {howToSteps.map((step, index) => (
                  <div
                    key={`${step.name || step.text}-${index}`}
                    className="rounded-[1.5rem] border border-slate-200/80 bg-white/86 px-5 py-5 theme-dark:border-slate-800 theme-dark:bg-slate-950/80"
                  >
                    <p className="section-kicker">Step {index + 1}</p>
                    <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950 theme-dark:text-white">
                      {step.name || `Step ${index + 1}`}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {faqItems.length > 0 ? (
            <section className="surface-panel px-6 py-7 md:px-8">
              <p className="section-kicker">FAQ</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
                Common questions
              </h2>
              <div className="mt-6 grid gap-4">
                {faqItems.map((item) => (
                  <div
                    key={item.question}
                    className="rounded-[1.5rem] border border-slate-200/80 bg-white/86 px-5 py-5 theme-dark:border-slate-800 theme-dark:bg-slate-950/80"
                  >
                    <h3 className="text-lg font-semibold tracking-[-0.03em] text-slate-950 theme-dark:text-white">
                      {item.question}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {relatedGuides.length > 0 || relatedTopicHubs.length > 0 ? (
            <section className="surface-panel px-6 py-7 md:px-8">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="section-kicker">Continue in the archive</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
                    Related guides and topic hubs
                  </h2>
                </div>
                <p className="max-w-2xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                  These links turn a single article into a stronger learning path and help the archive behave more like a topic cluster.
                </p>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-2">
                {relatedGuides.length > 0 ? (
                  <div className="surface-card px-5 py-5">
                    <p className="section-kicker">Guides</p>
                    <div className="mt-4 space-y-3">
                      {relatedGuides.map((guide) => (
                        <Link
                          key={guide.slug}
                          href={`/guides/${guide.slug}`}
                          className="block rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 px-4 py-4 transition-colors hover:border-indigo-300 theme-dark:border-slate-800 theme-dark:bg-slate-950/70 theme-dark:hover:border-indigo-500/60"
                        >
                          <div className="text-sm font-semibold text-slate-950 theme-dark:text-slate-100">
                            {guide.title}
                          </div>
                          <div className="mt-2 text-sm leading-6 text-slate-600 theme-dark:text-slate-300">
                            {guide.description}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}

                {relatedTopicHubs.length > 0 ? (
                  <div className="surface-card px-5 py-5">
                    <p className="section-kicker">Topic hubs</p>
                    <div className="mt-4 space-y-3">
                      {relatedTopicHubs.map((hub) => (
                        <Link
                          key={hub.slug}
                          href={`/topics/${hub.slug}`}
                          className="block rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 px-4 py-4 transition-colors hover:border-indigo-300 theme-dark:border-slate-800 theme-dark:bg-slate-950/70 theme-dark:hover:border-indigo-500/60"
                        >
                          <div className="text-sm font-semibold text-slate-950 theme-dark:text-slate-100">
                            {hub.title}
                          </div>
                          <div className="mt-2 text-sm leading-6 text-slate-600 theme-dark:text-slate-300">
                            {hub.description}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}

          <div className="surface-card px-6 py-6">
            <p className="section-kicker">Support</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950 theme-dark:text-white">
              Sponsored placement
            </h2>
            <div className="mt-5">
              <InArticleAd slot="YOUR_AD_SLOT_ID" />
            </div>
          </div>

          <SocialShare
            title={post.metadata.title}
            url={`${baseUrl}/blog/${cleanSlug}`}
            summary={post.metadata.summary}
          />

          <RelatedPosts
            currentSlug={cleanSlug}
            posts={relatedPostsData}
            currentPost={currentPostData}
          />

          <Comments />
        </div>

        <aside className="hidden xl:block">
          <div className="sticky top-24 space-y-4">
            <section className="surface-panel p-5">
              <p className="section-kicker">Article facts</p>
              <dl className="mt-5 space-y-4 text-sm text-slate-600 theme-dark:text-slate-300">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 theme-dark:text-slate-400">
                    Published
                  </dt>
                  <dd className="mt-1 text-base font-semibold text-slate-950 theme-dark:text-white">
                    {formatDate(post.metadata.publishedAt, false)}
                  </dd>
                </div>
                {post.metadata.updatedAt ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 theme-dark:text-slate-400">
                      Updated
                    </dt>
                    <dd className="mt-1 text-base font-semibold text-slate-950 theme-dark:text-white">
                      {formatDate(post.metadata.updatedAt, false)}
                    </dd>
                  </div>
                ) : null}
                {categoryHref && post.metadata.category ? (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 theme-dark:text-slate-400">
                      Category
                    </dt>
                    <dd className="mt-2">
                      <Link href={categoryHref} className="editorial-link">
                        {post.metadata.category}
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </dd>
                  </div>
                ) : null}
              </dl>

              {tags.length > 0 ? (
                <div className="mt-6 border-t border-slate-200/70 pt-5 theme-dark:border-slate-800">
                  <p className="section-kicker">Tagged with</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/tags/${toTagSlug(tag)}`}
                        className="meta-chip normal-case tracking-[0.04em]"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>

            <TableOfContents headings={headings} />
          </div>
        </aside>
      </div>
    </section>
  )
}

