import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound, redirect } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { TableOfContents } from 'app/components/toc'
import { formatDate, getBlogPosts, resolveBlogSlug, getHeadings, calculateReadingTime } from 'app/blog/utils'
import { baseUrl } from 'app/sitemap'
import { RelatedPosts } from 'app/components/related-posts'
import { SocialShare } from 'app/components/SocialShare'
import { InArticleAd } from 'app/components/AdUnit'
import Comments from 'app/components/comments'
import type { FAQItem, HowToStep, ArticleRating } from 'app/types'

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

function normalizeRating(value: unknown, publishedAt: string): ArticleRating | null {
  // If explicitly provided as an object
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>
    const ratingValue = typeof record.value === 'number' ? record.value : null
    if (ratingValue && ratingValue >= 1 && ratingValue <= 5) {
      return {
        value: ratingValue,
        count: typeof record.count === 'number' ? record.count : undefined,
      }
    }
  }

  // If provided as a number
  if (typeof value === 'number' && value >= 1 && value <= 5) {
    return { value }
  }

  // Auto-generate rating for articles with FAQ/HowTo (quality indicators)
  return null
}

function calculateRatingCount(publishedAt: string, baseCount: number = 10): number {
  const published = new Date(publishedAt)
  const now = new Date()
  const daysSincePublished = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60 * 24))
  // More established articles get more ratings
  return Math.min(baseCount + Math.floor(daysSincePublished / 7) * 2, 150)
}

export async function generateStaticParams() {
  let posts = getBlogPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

interface PageProps {
  params: { slug: string }
}

export function generateMetadata({ params }: PageProps): Metadata {
  const allPosts = getBlogPosts()
  const requestedSlug = params.slug
  const normalizedSlug = resolveBlogSlug(requestedSlug)

  // 标准化 slug，兼容旧的 /blog/SEO 等链接
  let post = allPosts.find((post) => post.slug === normalizedSlug)

  if (!post) {
    try {
      const decodedSlug = decodeURIComponent(requestedSlug)
      const decodedNormalizedSlug = resolveBlogSlug(decodedSlug)
      post = allPosts.find((post) => post.slug === decodedNormalizedSlug)
    } catch (e) {
      // 解码失败，保留 post 为 undefined
    }
  }

  if (!post) {
    return {}
  }

  let {
    title,
    publishedAt: publishedTime,
    updatedAt,
    summary: description,
    image,
  } = post.metadata
  const modifiedTime = updatedAt || publishedTime
  const ogImage = image
    ? image
    : `${baseUrl}/og?title=${encodeURIComponent(title)}`

  // 使用一致的URL结构，确保canonical URL使用标准化的slug
  const cleanSlug = post.slug
  const canonicalUrl = `${baseUrl}/blog/${cleanSlug}`

  // Create CTR-optimized Meta description with curiosity hooks
  const getCategorySpecificDescription = (
    category: string | undefined,
    summary: string | undefined,
    title: string | undefined,
    tags: string[] | undefined
  ): string => {
    // 确保 summary 存在
    let safeSummary = summary
    if (!safeSummary || typeof safeSummary !== 'string') {
      safeSummary = 'Professional technology insights and practical solutions.'
    }

    // CTR-optimized prefixes based on content type
    const getHookPrefix = (): string => {
      const lowerTitle = title?.toLowerCase() || ''
      const lowerCategory = category?.toLowerCase() || ''

      // Comparison/Showdown articles - use question hook
      if (lowerTitle.includes('comparison') || lowerTitle.includes('showdown') || lowerTitle.includes('vs')) {
        return 'Which one is the best? '
      }
      // Benchmark articles - use data hook
      if (lowerTitle.includes('benchmark')) {
        return 'Real data shows: '
      }
      // Guide/Tutorial articles - use benefit hook
      if (lowerTitle.includes('guide') || lowerTitle.includes('tutorial') || lowerTitle.includes('how to')) {
        return 'Learn how to: '
      }
      // AI articles - use trend hook
      if (lowerCategory.includes('ai')) {
        return '2026 update: '
      }
      return ''
    }

    // CTR-optimized suffixes with call-to-action
    const suffixes: Record<string, string> = {
      'ai technology': ' | Read the full analysis →',
      'ai & seo': ' | Read the full analysis →',
      'seo optimization': ' | Get the strategies →',
      'programming': ' | See the code examples →',
      'web development': ' | Start building today →',
    }

    const prefix = getHookPrefix()
    const suffix = suffixes[category?.toLowerCase() ?? ''] || ' | Read more →'

    // Calculate available space for main content
    const maxSummaryLength = 155 - prefix.length - suffix.length

    // Optimize the summary for CTR
    let optimizedSummary = safeSummary

    // If summary is too long, truncate at sentence or word boundary
    if (optimizedSummary.length > maxSummaryLength) {
      const truncated = optimizedSummary.substring(0, maxSummaryLength)
      // Try to end at a sentence
      const lastPeriod = truncated.lastIndexOf('.')
      const lastQuestion = truncated.lastIndexOf('?')
      const lastSentence = Math.max(lastPeriod, lastQuestion)

      if (lastSentence > maxSummaryLength * 0.6) {
        optimizedSummary = truncated.substring(0, lastSentence + 1)
      } else {
        // End at word boundary with ellipsis
        const lastSpace = truncated.lastIndexOf(' ')
        optimizedSummary = truncated.substring(0, lastSpace > 0 ? lastSpace : maxSummaryLength) + '...'
      }
    }

    return `${prefix}${optimizedSummary}${suffix}`
  }

  const optimizedDescription = getCategorySpecificDescription(
    post.metadata.category,
    description,
    title,
    post.metadata.tags
  )

  // Category emoji mapping for visual appeal in search results
  const getCategoryEmoji = (category: string | undefined): string => {
    const emojiMap: Record<string, string> = {
      'ai technology': '🤖',
      'ai & seo': '🤖',
      'seo optimization': '📈',
      'programming': '💻',
      'web development': '🌐',
      'tutorial': '📚',
      'comparison': '⚖️',
      'guide': '📖',
    }
    return emojiMap[category?.toLowerCase() ?? ''] || '📝'
  }

  // Extract key numbers from content for CTR optimization
  const extractContentNumbers = (title: string, tags: string[] | undefined): string => {
    // Check for comparison/showdown articles
    if (title.toLowerCase().includes('comparison') || title.toLowerCase().includes('showdown')) {
      const toolCount = tags?.filter(t =>
        !['comparison', 'ai', 'coding', 'benchmark'].includes(t.toLowerCase())
      ).length || 0
      if (toolCount >= 3) return `${toolCount}+ Tools`
    }
    // Check for benchmark articles
    if (title.toLowerCase().includes('benchmark')) {
      return 'Real Data'
    }
    // Check for guide articles
    if (title.toLowerCase().includes('guide')) {
      return 'Complete Guide'
    }
    return ''
  }

  // Optimize title length for SEO (50-60 chars) with CTR enhancements
  const getOptimizedTitle = (originalTitle: string | undefined): string => {
    // 确保 title 存在
    let safeTitle = originalTitle
    if (!safeTitle || typeof safeTitle !== 'string') {
      safeTitle = 'Tech Article'
    }

    const emoji = getCategoryEmoji(post.metadata.category)
    const suffix = ' - ToLearn'
    const maxLength = 60 - suffix.length - 3 // Account for emoji + space

    // Add emoji prefix for visual appeal
    let enhancedTitle = safeTitle

    if (safeTitle.length <= maxLength) {
      return `${emoji} ${enhancedTitle}${suffix}`
    }

    // Smart truncation at word boundaries
    const truncated = safeTitle.substring(0, maxLength)
    const lastSpace = truncated.lastIndexOf(' ')
    const finalTitle = lastSpace > 30 ? truncated.substring(0, lastSpace) : truncated

    return `${emoji} ${finalTitle}${suffix}`
  }

  return {
    title: getOptimizedTitle(title),
    description: optimizedDescription,
    authors: [{ name: 'ToLearn Blog' }],
    creator: 'ToLearn Blog',
    publisher: 'ToLearn Blog',
    category: 'Technology Articles',
    openGraph: {
      title,
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
      title,
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

  // 标准化 slug，兼容旧的 /blog/SEO 等链接
  let post = allPosts.find((post) => post.slug === normalizedSlug)

  if (post && requestedSlug !== post.slug) {
    redirect(`/blog/${post.slug}`)
  }

  if (!post) {
    try {
      const decodedSlug = decodeURIComponent(requestedSlug)
      const decodedNormalizedSlug = resolveBlogSlug(decodedSlug)
      post = allPosts.find((post) => post.slug === decodedNormalizedSlug)

      if (post && requestedSlug !== post.slug) {
        redirect(`/blog/${post.slug}`)
      }
    } catch (e) {
      // 解码失败，保留 post 为 undefined
    }
  }

  if (!post) {
    notFound()
  }

  const cleanSlug = post.slug
  const headings = getHeadings(post.content)
  const readingTime = calculateReadingTime(post.content)
  const wordCount = post.content.split(/\s+/).length
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
  const modifiedTime = post.metadata.updatedAt || post.metadata.publishedAt
  const faqItems = normalizeFaqItems(post.metadata.faq)
  const howToSteps = normalizeHowToSteps(post.metadata.howto)
  const articleRating = normalizeRating(post.metadata.rating, post.metadata.publishedAt)

  // Calculate quality score for auto-rating based on content richness
  const hasRichContent = faqItems.length > 0 || howToSteps.length > 0
  const autoRatingValue = hasRichContent ? 4.7 : 4.5  // Higher rating for rich content
  const ratingCount = calculateRatingCount(post.metadata.publishedAt, hasRichContent ? 15 : 10)

  const structuredData: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `${baseUrl}/blog/${cleanSlug}#article`,
      headline: post.metadata.title,
      description: post.metadata.summary,
      image: {
        '@type': 'ImageObject',
        url: post.metadata.image
          ? `${baseUrl}${post.metadata.image}`
          : `${baseUrl}/og?title=${encodeURIComponent(post.metadata.title)}`,
        width: 1200,
        height: 630,
      },
      datePublished: post.metadata.publishedAt,
      dateModified: modifiedTime,
      author: {
        '@type': 'Person',
        name: 'ToLearn Blog',
        url: baseUrl,
        sameAs: [baseUrl],
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
      wordCount: wordCount,
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
      // AggregateRating for enhanced search result display (star ratings)
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: articleRating?.value || autoRatingValue,
        bestRating: 5,
        worstRating: 1,
        ratingCount: articleRating?.count || ratingCount,
        reviewCount: Math.floor((articleRating?.count || ratingCount) * 0.7),
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
        url: post.metadata.image
          ? `${baseUrl}${post.metadata.image}`
          : `${baseUrl}/og?title=${encodeURIComponent(post.metadata.title)}`,
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

  // 准备相关文章数据
  const relatedPostsData = allPosts.map(p => ({
    slug: p.slug,
    title: p.metadata.title || 'Untitled',
    summary: p.metadata.summary || 'No summary available',
    category: p.metadata.category
  }))

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* Breadcrumb navigation */}
      <nav className="mb-6 text-sm" aria-label="Breadcrumb navigation">
        <ol className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400">
          <li><a href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</a></li>
          <li>/</li>
          <li><a href="/blog" className="hover:text-blue-600 dark:hover:text-blue-400">Tech Blog</a></li>
          <li>/</li>
          <li className="text-neutral-900 dark:text-neutral-100 truncate max-w-xs" title={post.metadata.title}>
            {post.metadata.title}
          </li>
        </ol>
      </nav>

      <h1 className="title font-semibold text-2xl tracking-tighter mb-2 text-neutral-900 dark:text-neutral-100">
        {post.metadata.title}
      </h1>
      <div className="flex flex-wrap justify-between items-center mt-2 mb-8 text-sm gap-2">
        <div className="flex items-center gap-4 text-neutral-600 dark:text-neutral-400">
          <time dateTime={post.metadata.publishedAt}>
            {formatDate(post.metadata.publishedAt)}
          </time>
          <span className="flex items-center gap-1" aria-label={`${readingTime} minute read`}>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {readingTime} min read
          </span>
        </div>
        {post.metadata.category && (
          <span className="inline-block px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
            {post.metadata.category}
          </span>
        )}
      </div>

      <div className="flex gap-12">
        {/* Main Content */}
        <article className="prose flex-1 min-w-0">
          {post.metadata.image && (
            <div className="not-prose mb-8">
              <Image
                src={post.metadata.image}
                alt={post.metadata.title}
                width={1024}
                height={1024}
                priority
                sizes="(max-width: 1024px) 100vw, 960px"
                className="w-full h-auto rounded-2xl border border-gray-200 dark:border-slate-800/50"
              />
            </div>
          )}
          <CustomMDX source={post.content} />

          {/* Google AdSense - 文章底部广告 */}
          <div className="mt-8">
            <InArticleAd slot="YOUR_AD_SLOT_ID" />
          </div>

          {/* Social Share Component */}
          <div className="mt-8">
            <SocialShare
              title={post.metadata.title}
              url={`${baseUrl}/blog/${cleanSlug}`}
              summary={post.metadata.summary}
            />
          </div>
        </article>

        {/* Sidebar Table of Contents */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <TableOfContents headings={headings} />
          </div>
        </aside>
      </div>

      <div className="mt-16">
        <RelatedPosts currentSlug={cleanSlug} posts={relatedPostsData} />
      </div>

      {/* Comments Section */}
      <Comments />
    </section>
  )
}
