import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import { baseUrl } from './constants'
import {
  getAbsoluteLocalizedAlternates,
  getCanonicalUrl,
  getLocaleOpenGraph,
} from './i18n-paths'

export async function withLocalizedMetadata(
  pathname: string,
  metadata: Metadata
): Promise<Metadata> {
  const locale = await getLocale()
  const canonicalUrl = getCanonicalUrl(pathname, locale, baseUrl)

  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      canonical: canonicalUrl,
      languages: getAbsoluteLocalizedAlternates(pathname, baseUrl),
    },
    openGraph: metadata.openGraph
      ? {
          ...metadata.openGraph,
          url: canonicalUrl,
          locale: getLocaleOpenGraph(locale),
        }
      : metadata.openGraph,
  }
}
