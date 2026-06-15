import { calculateReadingTime, getBlogPosts } from 'app/blog/utils'
import { PostCard } from 'app/components/post-card'
import { baseUrl } from 'app/sitemap'
import Link from 'next/link'
import { Metadata } from 'next'
import { getLocale, getTranslations } from 'next-intl/server'
import {
  getAbsoluteLocalizedAlternates,
  getCanonicalUrl,
  localizePath,
} from 'app/lib/i18n-paths'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'Metadata' })

  return {
    title: t('searchTitle'),
    description: t('searchDescription'),
    alternates: {
      canonical: getCanonicalUrl('/search', locale, baseUrl),
      languages: getAbsoluteLocalizedAlternates('/search', baseUrl),
    },
    robots: {
      index: false,
      follow: true,
    },
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'SearchPage' })
  const common = await getTranslations({ locale, namespace: 'Common' })
  const q = typeof searchParams.q === 'string' ? searchParams.q : ''
  const posts = getBlogPosts()

  const filteredPosts = posts
    .filter((post) => {
      if (!q) return false
      const searchContent =
        `${post.metadata.title} ${post.metadata.summary} ${post.content}`.toLowerCase()
      return searchContent.includes(q.toLowerCase())
    })
    .sort(
      (left, right) =>
        new Date(right.metadata.publishedAt).getTime() - new Date(left.metadata.publishedAt).getTime()
    )

  return (
    <section className="mx-auto max-w-6xl space-y-8">
      <div className="surface-panel px-6 py-8 md:px-8 md:py-10">
        <p className="section-kicker">{t('kicker')}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white md:text-5xl">
          {t('title')}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 theme-dark:text-slate-300 md:text-lg">
          {t('intro')}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {q ? (
            <span className="meta-chip normal-case tracking-normal">{t('query', { query: q })}</span>
          ) : (
            <span className="meta-chip normal-case tracking-normal">{t('noQuery')}</span>
          )}
          <span className="meta-chip normal-case tracking-normal">
            {common('articles', { count: filteredPosts.length })}
          </span>
        </div>
      </div>

      {!q ? (
        <div className="surface-panel px-6 py-12 text-center md:px-8">
          <p className="section-kicker">{t('readyKicker')}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
            {t('readyTitle')}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
            {t('readyBody')}
          </p>
          <div className="mt-6">
            <Link href={localizePath('/blog', locale)} className="editorial-link justify-center">
              {t('openJournal')}
            </Link>
          </div>
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="space-y-6">
          {filteredPosts.map((post) => (
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
      ) : (
        <div className="surface-panel px-6 py-12 text-center md:px-8">
          <p className="section-kicker">{t('noMatchKicker')}</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
            {t('noMatchTitle', { query: q })}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
            {t('noMatchBody')}
          </p>
          <Link href={localizePath('/blog', locale)} className="mt-6 inline-flex editorial-link justify-center">
            {t('browseAll')}
          </Link>
        </div>
      )}
    </section>
  )
}
