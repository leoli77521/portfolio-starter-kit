import type { Metadata } from 'next'
import { BlogArticle, generateArticleMetadata } from 'app/blog/[slug]/page'
import { defaultLocale, locales } from 'app/lib/i18n-paths'
import { getTranslatedPostSlugsForLocale } from 'app/lib/blog-i18n'

interface PageProps {
  params: {
    locale: string
    slug: string
  }
}

export function generateStaticParams() {
  return locales
    .filter((locale) => locale !== defaultLocale)
    .flatMap((locale) =>
      getTranslatedPostSlugsForLocale(locale).map((slug) => ({
        locale,
        slug,
      }))
    )
}

export function generateMetadata({ params }: PageProps): Metadata {
  return generateArticleMetadata({ params })
}

export default function LocalizedBlogArticle({ params }: PageProps) {
  return <BlogArticle params={params} />
}
