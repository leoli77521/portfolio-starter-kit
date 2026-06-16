import type { Metadata } from 'next'
import { baseUrl, organization } from 'app/lib/constants'
import { getBlogPostsMetadata } from 'app/blog/utils'
import { PostsWithFilter } from 'app/components/posts-with-filter'
import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'
import {
  getAbsoluteLocalizedAlternates,
  getCanonicalUrl,
  getLocaleLanguageTag,
  localizePath,
} from 'app/lib/i18n-paths'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'Metadata' })
  const title = t('blogTitle')
  const description = t('blogDescription')
  const canonicalUrl = getCanonicalUrl('/blog', locale, baseUrl)

  return {
    title,
    description,
    keywords: [
      'AI systems archive',
      'coding agents analysis',
      'search visibility',
      'technical SEO',
      'modern web execution',
      'developer workflows',
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: getAbsoluteLocalizedAlternates('/blog', baseUrl),
    },
    openGraph: {
      title: `${title} | ToLearn Blog`,
      description,
      url: canonicalUrl,
      type: 'website',
    },
  }
}

export default async function Page() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'Blog' })
  const common = await getTranslations({ locale, namespace: 'Common' })
  const posts = getBlogPostsMetadata(locale)
  const canonicalUrl = getCanonicalUrl('/blog', locale, baseUrl)
  const hrefFor = (href: string) => localizePath(href, locale)


  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${baseUrl}/blog/#blog`,
    name: 'ToLearn Technology Blog',
    description: t('intro'),
    url: canonicalUrl,
    author: organization,
    publisher: organization,
    isPartOf: {
      '@id': `${baseUrl}/#website`,
    },
    inLanguage: getLocaleLanguageTag(locale),
    keywords: ['AI systems', 'coding agents', 'search visibility', 'technical SEO', 'modern web execution']
  }
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: posts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${baseUrl}${post.href || `/blog/${post.slug}`}`,
      name: post.metadata.title,
    })),
  }
  const structuredData = [blogSchema, itemListSchema]

  return (
    <section className="max-w-6xl mx-auto">
      <nav className="mb-6 text-sm" aria-label={t('breadcrumbLabel')}>
        <ol className="flex items-center space-x-2 text-slate-500 theme-dark:text-slate-400">
          <li>
            <Link
              href={hrefFor('/')}
              className="transition-colors hover:text-indigo-600 theme-dark:hover:text-indigo-400"
              title={t('homeTitle')}
            >
              {common('home')}
            </Link>
          </li>
          <li className="text-slate-400 theme-dark:text-slate-600">/</li>
          <li className="font-medium text-slate-900 theme-dark:text-slate-100">{t('title')}</li>
        </ol>
      </nav>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <div className="surface-panel mb-10 px-6 py-8 md:px-8 md:py-10">
        <p className="section-kicker">{t('fullArchive')}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white md:text-5xl">
          {t('title')}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 theme-dark:text-slate-300 md:text-lg">
          {t('intro')}
        </p>
      </div>

      <div className="surface-panel mb-8 px-6 py-6 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker">{t('entryKicker')}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
              {t('entryTitle')}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
              {t('entryBody')}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Link href={hrefFor('/#start-here')} className="surface-card block px-5 py-5">
            <p className="section-kicker">{t('newHere')}</p>
            <h3 className="mt-3 text-xl font-semibold text-slate-950 theme-dark:text-white">
              {t('startEssentials')}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
              {t('startEssentialsBody')}
            </p>
          </Link>

          <Link href={hrefFor('/topics')} className="surface-card block px-5 py-5">
            <p className="section-kicker">{t('needStructure')}</p>
            <h3 className="mt-3 text-xl font-semibold text-slate-950 theme-dark:text-white">
              {t('browseHubs')}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
              {t('browseHubsBody')}
            </p>
          </Link>

          <Link href={hrefFor('/guides')} className="surface-card block px-5 py-5">
            <p className="section-kicker">{t('wantProgression')}</p>
            <h3 className="mt-3 text-xl font-semibold text-slate-950 theme-dark:text-white">
              {t('readGuides')}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
              {t('readGuidesBody')}
            </p>
          </Link>
        </div>
      </div>

      <PostsWithFilter posts={posts} />
    </section>
  )
}
