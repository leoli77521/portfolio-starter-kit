import { getBlogPosts } from 'app/blog/utils'
import { NextResponse } from 'next/server'
import type { SearchResult } from '@/app/types'

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes in milliseconds

// In-memory cache
let cachedPosts: SearchResult[] | null = null
let cacheTimestamp: number | null = null

function isCacheValid(): boolean {
  if (!cachedPosts || !cacheTimestamp) return false
  return Date.now() - cacheTimestamp < CACHE_TTL
}

function getCachedPosts(): SearchResult[] {
  if (isCacheValid() && cachedPosts) {
    return cachedPosts
  }

  // Refresh cache
  const posts = getBlogPosts().map((post) => ({
    slug: post.slug,
    title: post.metadata.title,
    summary: post.metadata.summary,
    publishedAt: post.metadata.publishedAt,
  }))

  cachedPosts = posts
  cacheTimestamp = Date.now()

  return posts
}

export async function GET() {
  try {
    const posts = getCachedPosts()

    return NextResponse.json(posts, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Error fetching posts for search:', error)

    // Clear cache on error
    cachedPosts = null
    cacheTimestamp = null

    return NextResponse.json(
      { error: 'Failed to fetch posts. Please try again later.' },
      { status: 500 }
    )
  }
}

// Function to invalidate cache (can be called internally or via revalidation)
function invalidateSearchCache(): void {
  cachedPosts = null
  cacheTimestamp = null
}

// POST endpoint to manually invalidate cache (protected)
export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization')
  const expectedToken = process.env.CACHE_INVALIDATION_TOKEN

  if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  invalidateSearchCache()
  return new Response('Cache invalidated', { status: 200 })
}
