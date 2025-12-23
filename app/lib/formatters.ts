import type { Heading } from '@/app/types'

/**
 * Format a date string to a human-readable format
 * @param date - Date string in ISO format (e.g., "2025-01-15" or "2025-01-15T00:00:00")
 * @param includeRelative - Whether to include relative time (e.g., "2 days ago")
 * @returns Formatted date string
 */
export function formatDate(date: string, includeRelative = false): string {
  if (!date || typeof date !== 'string') {
    return 'Unknown Date'
  }

  const currentDate = new Date()

  // Normalize date format
  let normalizedDate = date
  if (!date.includes('T')) {
    normalizedDate = `${date}T00:00:00`
  }

  let targetDate = new Date(normalizedDate)

  // Check if date is valid
  if (isNaN(targetDate.getTime())) {
    targetDate = new Date(date)
    if (isNaN(targetDate.getTime())) {
      return 'Invalid Date'
    }
  }

  // Calculate time difference in milliseconds
  const timeDiff = currentDate.getTime() - targetDate.getTime()
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24))

  let formattedDate = ''

  if (daysDiff < 0) {
    formattedDate = 'Future'
  } else if (daysDiff === 0) {
    formattedDate = 'Today'
  } else if (daysDiff < 30) {
    formattedDate = `${daysDiff}d ago`
  } else if (daysDiff < 365) {
    const monthsDiff = Math.floor(daysDiff / 30)
    formattedDate = `${monthsDiff}mo ago`
  } else {
    const yearsDiff = Math.floor(daysDiff / 365)
    formattedDate = `${yearsDiff}y ago`
  }

  const fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  if (!includeRelative) {
    return fullDate
  }

  return `${fullDate} (${formattedDate})`
}

/**
 * Calculate reading time for content
 * @param content - Text content to calculate reading time for
 * @param wordsPerMinute - Average reading speed (default: 225 words per minute)
 * @returns Estimated reading time in minutes
 */
export function calculateReadingTime(
  content: string,
  wordsPerMinute = 225
): number {
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return minutes
}

/**
 * Convert a string to a URL-friendly slug
 * @param str - String to slugify
 * @returns URL-friendly slug
 */
export function slugify(str: string): string {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/&/g, '-and-')     // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')   // Remove all non-word characters except for -
    .replace(/\-\-+/g, '-')     // Replace multiple - with single -
    .replace(/^-|-$/g, '')      // Remove leading and trailing -
}

/**
 * Truncate a summary to a maximum length
 * @param summary - Text to truncate
 * @param maxLength - Maximum length (default: 160 characters)
 * @returns Truncated text with ellipsis if needed
 */
export function truncateSummary(summary: string, maxLength = 160): string {
  if (!summary) return ''
  if (summary.length <= maxLength) return summary
  return summary.slice(0, maxLength).replace(/\s+\S*$/, '') + '...'
}

/**
 * Extract headings from MDX content for table of contents
 * @param content - MDX content string
 * @returns Array of headings with level, text, and slug
 */
export function getHeadings(content: string): Heading[] {
  const headings: Heading[] = []
  const lines = content.split('\n')
  let inCodeBlock = false

  lines.forEach((line) => {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock
      return
    }

    if (inCodeBlock) return

    const lineMatch = line.match(/^(#{1,6})\s+(.+)$/)
    if (lineMatch) {
      const level = lineMatch[1].length
      const text = lineMatch[2].trim()
      const slug = slugify(text)
      headings.push({ level, text, slug })
    }
  })

  return headings
}

/**
 * Create a clean SEO-friendly slug from a filename
 * @param filename - Original filename
 * @returns Clean slug
 */
export function createCleanSlug(filename: string): string {
  // Remove file extension
  const slug = filename.replace(/\.[^/.]+$/, '')

  // Custom mappings for special filenames
  const slugMappings: Record<string, string> = {
    'SEO': 'seo-optimization-guide',
    'AI生成PPT': 'ai-generated-presentations',
    'AI-Revolution-Finance': 'ai-revolution-finance',
    'AI-Revolution-American-Workplaces': 'ai-revolution-american-workplaces',
  }

  if (slugMappings[slug]) {
    return slugMappings[slug]
  }

  // Standard normalization
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9\-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Format number with appropriate suffix (K, M, B)
 * @param num - Number to format
 * @returns Formatted string
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1) + 'B'
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M'
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K'
  }
  return num.toString()
}
