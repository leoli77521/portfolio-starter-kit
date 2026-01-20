import type { BlogMetadata } from '@/app/types'

export interface PostForSimilarity {
  slug: string
  metadata: BlogMetadata
  readingTime?: number
}

export interface SimilarityResult {
  post: PostForSimilarity
  score: number
  reasons: string[]
}

// Weights for different similarity factors
const WEIGHTS = {
  tagOverlap: 0.4,
  sameCategory: 0.3,
  readingTimeSimilar: 0.2,
  timeProximity: 0.1,
}

/**
 * Calculate tag overlap score between two posts
 * Returns a value between 0 and 1
 */
function calculateTagOverlap(tags1: string[] | undefined, tags2: string[] | undefined): number {
  if (!tags1?.length || !tags2?.length) return 0

  const set1 = new Set(tags1.map((t) => t.toLowerCase()))
  const set2 = new Set(tags2.map((t) => t.toLowerCase()))

  let intersection = 0
  set1.forEach((tag) => {
    if (set2.has(tag)) intersection++
  })

  // Jaccard similarity coefficient
  const union = set1.size + set2.size - intersection
  return union > 0 ? intersection / union : 0
}

/**
 * Calculate category similarity
 * Returns 1 if same category, 0 otherwise
 */
function calculateCategorySimilarity(
  category1: string | undefined,
  category2: string | undefined
): number {
  if (!category1 || !category2) return 0
  return category1.toLowerCase() === category2.toLowerCase() ? 1 : 0
}

/**
 * Calculate reading time similarity
 * Returns a value between 0 and 1 based on how similar reading times are
 */
function calculateReadingTimeSimilarity(time1: number | undefined, time2: number | undefined): number {
  if (!time1 || !time2) return 0.5 // Neutral if unknown

  const diff = Math.abs(time1 - time2)
  const maxDiff = Math.max(time1, time2)

  if (maxDiff === 0) return 1
  // Score decreases as difference increases
  return Math.max(0, 1 - diff / maxDiff)
}

/**
 * Calculate time proximity score
 * Returns a value between 0 and 1 based on how close publication dates are
 */
function calculateTimeProximity(date1: string, date2: string): number {
  const d1 = new Date(date1).getTime()
  const d2 = new Date(date2).getTime()

  const diffDays = Math.abs(d1 - d2) / (1000 * 60 * 60 * 24)

  // Score decreases as time difference increases
  // Full score within 30 days, decreasing after
  if (diffDays <= 30) return 1
  if (diffDays <= 90) return 0.8
  if (diffDays <= 180) return 0.5
  if (diffDays <= 365) return 0.3
  return 0.1
}

/**
 * Get shared tags between two posts
 */
function getSharedTags(tags1: string[] | undefined, tags2: string[] | undefined): string[] {
  if (!tags1?.length || !tags2?.length) return []

  const set2 = new Set(tags2.map((t) => t.toLowerCase()))
  return tags1.filter((tag) => set2.has(tag.toLowerCase()))
}

/**
 * Calculate similarity score between two posts
 */
export function calculateSimilarity(
  post1: PostForSimilarity,
  post2: PostForSimilarity
): SimilarityResult {
  const reasons: string[] = []

  // Calculate individual scores
  const tagScore = calculateTagOverlap(post1.metadata.tags, post2.metadata.tags)
  const categoryScore = calculateCategorySimilarity(
    post1.metadata.category,
    post2.metadata.category
  )
  const readingTimeScore = calculateReadingTimeSimilarity(post1.readingTime, post2.readingTime)
  const timeScore = calculateTimeProximity(
    post1.metadata.publishedAt,
    post2.metadata.publishedAt
  )

  // Build reasons
  const sharedTags = getSharedTags(post1.metadata.tags, post2.metadata.tags)
  if (sharedTags.length > 0) {
    reasons.push(`Shared topics: ${sharedTags.slice(0, 3).join(', ')}${sharedTags.length > 3 ? '...' : ''}`)
  }

  if (categoryScore > 0) {
    reasons.push(`Same category: ${post2.metadata.category}`)
  }

  if (readingTimeScore > 0.7 && post1.readingTime && post2.readingTime) {
    reasons.push('Similar reading time')
  }

  if (timeScore > 0.7) {
    reasons.push('Published around the same time')
  }

  // Calculate weighted total score
  const totalScore =
    tagScore * WEIGHTS.tagOverlap +
    categoryScore * WEIGHTS.sameCategory +
    readingTimeScore * WEIGHTS.readingTimeSimilar +
    timeScore * WEIGHTS.timeProximity

  return {
    post: post2,
    score: totalScore,
    reasons,
  }
}

/**
 * Find most similar posts to a given post
 */
export function findSimilarPosts(
  currentPost: PostForSimilarity,
  allPosts: PostForSimilarity[],
  limit: number = 3
): SimilarityResult[] {
  // Filter out the current post
  const otherPosts = allPosts.filter((p) => p.slug !== currentPost.slug)

  // Calculate similarity for each post
  const similarities = otherPosts.map((post) => calculateSimilarity(currentPost, post))

  // Sort by score descending and take top results
  return similarities
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .filter((result) => result.score > 0.1) // Filter out very low scores
}

/**
 * Get similarity breakdown for debugging/display
 */
export function getSimilarityBreakdown(
  post1: PostForSimilarity,
  post2: PostForSimilarity
): {
  tagOverlap: number
  categoryMatch: boolean
  readingTimeSimilarity: number
  timeProximity: number
  totalScore: number
  sharedTags: string[]
} {
  const tagOverlap = calculateTagOverlap(post1.metadata.tags, post2.metadata.tags)
  const categoryMatch = calculateCategorySimilarity(post1.metadata.category, post2.metadata.category) > 0
  const readingTimeSimilarity = calculateReadingTimeSimilarity(post1.readingTime, post2.readingTime)
  const timeProximity = calculateTimeProximity(post1.metadata.publishedAt, post2.metadata.publishedAt)
  const sharedTags = getSharedTags(post1.metadata.tags, post2.metadata.tags)

  const totalScore =
    tagOverlap * WEIGHTS.tagOverlap +
    (categoryMatch ? 1 : 0) * WEIGHTS.sameCategory +
    readingTimeSimilarity * WEIGHTS.readingTimeSimilar +
    timeProximity * WEIGHTS.timeProximity

  return {
    tagOverlap,
    categoryMatch,
    readingTimeSimilarity,
    timeProximity,
    totalScore,
    sharedTags,
  }
}
