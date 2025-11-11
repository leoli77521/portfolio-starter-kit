import { getBlogPosts } from 'app/blog/utils'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const posts = getBlogPosts().map((post) => ({
      slug: post.slug,
      title: post.metadata.title,
      summary: post.metadata.summary,
      publishedAt: post.metadata.publishedAt,
    }))

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching posts for search:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}
