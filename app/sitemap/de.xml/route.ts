import { buildLocalizedSitemap } from 'app/lib/localized-sitemap'

export const revalidate = 3600

export function GET() {
  return buildLocalizedSitemap('de')
}
