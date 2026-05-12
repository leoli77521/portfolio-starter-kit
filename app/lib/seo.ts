import { baseUrl } from './constants'

const ABSOLUTE_URL_PATTERN = /^https?:\/\//i

export const siteName = 'ToLearn Blog'
export const defaultOgImage = `${baseUrl}/og`
const metadataTitleSuffix = ` | ${siteName}`
const DEFAULT_SEO_TITLE_LENGTH = 60 - metadataTitleSuffix.length
const DEFAULT_SOCIAL_TITLE_LENGTH = 72 - metadataTitleSuffix.length
const BREAKPOINT_SEPARATORS = [': ', ' - ', ' | ', ' -- ']
const TRAILING_CONNECTORS = /(?:\b(?:a|an|and|at|by|for|from|in|into|of|on|or|the|to|vs|with)\b\s*)+$/i

export function buildSocialTitle(title: string): string {
  return `${title} | ${siteName}`
}

function cleanTrailingFragment(value: string): string {
  return value
    .replace(TRAILING_CONNECTORS, '')
    .replace(/[\s:;|,-]+$/, '')
    .trim()
}

function trimTitleToLength(title: string, maxLength: number): string {
  const compactTitle = title.replace(/\s+/g, ' ').trim()

  if (compactTitle.length <= maxLength) {
    return compactTitle
  }

  for (const separator of BREAKPOINT_SEPARATORS) {
    const segments = compactTitle.split(separator)
    if (segments.length <= 1) {
      continue
    }

    const leadingSegment = cleanTrailingFragment(segments[0] || '')
    if (leadingSegment.length >= Math.floor(maxLength * 0.55) && leadingSegment.length <= maxLength) {
      return leadingSegment
    }
  }

  const truncated = compactTitle.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  const candidate = lastSpace > Math.floor(maxLength * 0.55)
    ? truncated.slice(0, lastSpace)
    : truncated

  return cleanTrailingFragment(candidate) || cleanTrailingFragment(compactTitle.slice(0, maxLength))
}

export function trimSeoTitle(
  title: string | undefined,
  maxLength = DEFAULT_SEO_TITLE_LENGTH
): string {
  const fallbackTitle = 'Tech Article'
  const safeTitle = (title || fallbackTitle).trim()
  return trimTitleToLength(safeTitle, maxLength)
}

export function trimSocialTitle(
  title: string | undefined,
  maxLength = DEFAULT_SOCIAL_TITLE_LENGTH
): string {
  const fallbackTitle = 'Tech Article'
  const safeTitle = (title || fallbackTitle).trim()
  return trimTitleToLength(safeTitle, maxLength)
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
