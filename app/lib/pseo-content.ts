import { getBlogPosts } from 'app/blog/utils'
import { guides } from 'app/lib/guides'
import { topicHubs } from 'app/lib/topic-hubs'

interface MatchOptions {
  categories?: string[]
  limit?: number
  terms: string[]
}

function normalizeTerms(terms: string[]): string[] {
  return Array.from(
    new Set(
      terms
        .flatMap((term) => term.split(','))
        .map((term) => term.trim().toLowerCase())
        .filter((term) => term.length >= 3)
    )
  )
}

function scoreCorpus(corpus: string, terms: string[]): number {
  return terms.reduce((score, term) => {
    if (!corpus.includes(term)) {
      return score
    }

    return score + (term.includes(' ') || term.length > 10 ? 2 : 1)
  }, 0)
}

function scoreCategories(
  contentCategories: string[],
  requestedCategories: string[] | undefined
): number {
  if (!requestedCategories?.length) {
    return 0
  }

  const normalizedContentCategories = contentCategories.map((category) => category.toLowerCase())

  return requestedCategories.reduce((score, category) => {
    return normalizedContentCategories.includes(category.toLowerCase()) ? score + 2 : score
  }, 0)
}

export function findRelevantGuides({ categories, limit = 3, terms }: MatchOptions) {
  const normalizedTerms = normalizeTerms(terms)

  return guides
    .map((guide) => {
      const corpus = [
        guide.title,
        guide.description,
        guide.longDescription,
        ...guide.relatedTags,
        ...guide.targetKeywords,
      ]
        .join(' ')
        .toLowerCase()

      return {
        guide,
        score:
          scoreCorpus(corpus, normalizedTerms) +
          scoreCategories(guide.relatedCategories, categories),
      }
    })
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map((item) => item.guide)
}

export function findRelevantTopicHubs({ categories, limit = 2, terms }: MatchOptions) {
  const normalizedTerms = normalizeTerms(terms)

  return topicHubs
    .map((hub) => {
      const corpus = [
        hub.title,
        hub.description,
        hub.longDescription,
        ...hub.relatedTags,
        ...hub.targetKeywords,
      ]
        .join(' ')
        .toLowerCase()

      return {
        hub,
        score:
          scoreCorpus(corpus, normalizedTerms) +
          scoreCategories(hub.relatedCategories, categories),
      }
    })
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map((item) => item.hub)
}

export function findRelevantPosts({ categories, limit = 4, terms }: MatchOptions) {
  const normalizedTerms = normalizeTerms(terms)

  return getBlogPosts()
    .map((post) => {
      const corpus = [
        post.metadata.title,
        post.metadata.summary,
        post.metadata.category,
        ...(post.metadata.tags || []),
        post.content.slice(0, 1400),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return {
        post,
        score:
          scoreCorpus(corpus, normalizedTerms) +
          scoreCategories(post.metadata.category ? [post.metadata.category] : [], categories),
      }
    })
    .filter((item) => item.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score
      }

      return (
        new Date(right.post.metadata.publishedAt).getTime() -
        new Date(left.post.metadata.publishedAt).getTime()
      )
    })
    .slice(0, limit)
    .map((item) => item.post)
}
