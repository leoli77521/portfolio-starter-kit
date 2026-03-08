import { getBlogPosts, getBlogPostsMetadata } from 'app/blog/utils'
import { normalizeTagName, normalizeTagSlug, toTagSlug } from 'app/lib/tag-utils'

export const MIN_POSTS_FOR_INDEXED_TAG_PAGE = 2
export { normalizeTagName, normalizeTagSlug, toTagSlug } from 'app/lib/tag-utils'

export function getTagCounts(): Record<string, number> {
  return getBlogPosts().reduce((acc, post) => {
    for (const tag of post.metadata.tags || []) {
      const normalizedTag = normalizeTagName(tag)
      if (!normalizedTag) continue
      acc[normalizedTag] = (acc[normalizedTag] || 0) + 1
    }

    return acc
  }, {} as Record<string, number>)
}

export function getAllTags(): string[] {
  return Object.keys(getTagCounts())
}

export function getTagCountBySlug(tagSlug: string): number {
  const counts = getTagCounts()
  const match = Object.entries(counts).find(([tag]) => toTagSlug(tag) === tagSlug)
  return match ? match[1] : 0
}

export function getDisplayTag(tagSlug: string, tags: string[]): string {
  const match = tags.find((tag) => toTagSlug(tag) === tagSlug)
  return match || tagSlug
}

export function getPostsForTag(tagSlug: string) {
  return getBlogPostsMetadata().filter(
    (post) => post.metadata.tags && post.metadata.tags.some((tag) => toTagSlug(tag) === tagSlug)
  )
}

export function shouldIndexTagPage(postCount: number): boolean {
  return postCount >= MIN_POSTS_FOR_INDEXED_TAG_PAGE
}
