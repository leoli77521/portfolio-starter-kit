import { baseUrl } from './constants'

const ABSOLUTE_URL_PATTERN = /^https?:\/\//i

export const siteName = 'ToLearn Blog'
export const defaultOgImage = `${baseUrl}/og`
const metadataTitleSuffix = ` | ${siteName}`

export function buildSocialTitle(title: string): string {
  return `${title} | ${siteName}`
}

export function trimSeoTitle(
  title: string | undefined,
  maxLength = 60 - metadataTitleSuffix.length
): string {
  const fallbackTitle = 'Tech Article'
  const safeTitle = (title || fallbackTitle).trim()

  if (safeTitle.length <= maxLength) {
    return safeTitle
  }

  const truncated = safeTitle.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  const compactTitle = lastSpace > 30 ? truncated.slice(0, lastSpace) : truncated

  return compactTitle.replace(/[\s:;|,-]+$/, '')
}

export function resolveOgImage(image: string | undefined, fallbackTitle?: string): string {
  if (!image) {
    return fallbackTitle
      ? `${defaultOgImage}?title=${encodeURIComponent(fallbackTitle)}`
      : defaultOgImage
  }

  if (ABSOLUTE_URL_PATTERN.test(image)) {
    return image
  }

  if (image.startsWith('/')) {
    return `${baseUrl}${image}`
  }

  return `${baseUrl}/${image}`
}

export function getDescriptiveImageAlt(alt: string | undefined, src: string | undefined): string {
  const normalizedAlt = alt?.trim()
  if (normalizedAlt) {
    return normalizedAlt
  }

  if (!src) {
    return 'Content image'
  }

  const cleanPath = src.split(/[?#]/)[0]
  const fileName = decodeURIComponent(cleanPath.split('/').pop() || '')
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!fileName) {
    return 'Content image'
  }

  return fileName.charAt(0).toUpperCase() + fileName.slice(1)
}

export function getMostRecentIsoString(
  values: Array<string | Date | undefined>,
  fallback: string
): string {
  const latest = values
    .map((value) => {
      if (!value) {
        return null
      }

      const candidate = typeof value === 'string' ? new Date(value) : value
      return Number.isNaN(candidate.getTime()) ? null : candidate
    })
    .filter((value): value is Date => value instanceof Date)
    .sort((left, right) => right.getTime() - left.getTime())[0]

  return latest ? latest.toISOString() : fallback
}
