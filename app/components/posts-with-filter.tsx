'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { CategoryFilter, type Category } from './category-filter'
import { PostCard } from './post-card'

interface Post {
  slug: string
  metadata: {
    title: string
    publishedAt: string
    summary?: string
    category?: string
  }
  readingTime?: number
}

interface PostsWithFilterProps {
  posts: Post[]
}

export function PostsWithFilter({ posts }: PostsWithFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = posts.filter((post) => {
    const categoryMatch = selectedCategory === 'All' || post.metadata.category === selectedCategory

    if (!searchQuery.trim()) {
      return categoryMatch
    }

    const query = searchQuery.toLowerCase()
    const titleMatch = post.metadata.title.toLowerCase().includes(query)
    const summaryMatch = post.metadata.summary?.toLowerCase().includes(query)

    return categoryMatch && (titleMatch || summaryMatch)
  })

  return (
    <div>
      <div className="surface-panel mb-8 px-5 py-5 md:px-6 md:py-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="section-kicker">Search and filter</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950 theme-dark:text-white">
              Narrow the archive without losing context
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 theme-dark:text-slate-300">
              Filter by topic or search by title and summary. The archive stays readable
              even when the result set gets small.
            </p>
          </div>

          <div className="w-full max-w-xl">
            <label htmlFor="post-search" className="sr-only">
              Search articles
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="post-search"
                type="text"
                placeholder="Search titles and summaries"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-slate-200/80 bg-white/90 py-3 pl-11 pr-12 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-300 theme-dark:border-slate-800 theme-dark:bg-slate-950/80 theme-dark:text-slate-100 theme-dark:placeholder:text-slate-500 theme-dark:focus:border-indigo-500/60"
                aria-label="Search articles"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition-colors hover:text-slate-700 theme-dark:hover:text-slate-200"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-5 border-t border-slate-200/70 pt-5 theme-dark:border-slate-800">
          <CategoryFilter
            currentCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 theme-dark:text-slate-400">
            <span>
              Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
            </span>
            {searchQuery ? (
              <span className="meta-chip normal-case tracking-normal">Search: {searchQuery}</span>
            ) : null}
            {selectedCategory !== 'All' ? (
              <span className="meta-chip normal-case tracking-normal">
                Category: {selectedCategory}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="surface-panel px-6 py-14 text-center">
          <p className="section-kicker">No matching entries</p>
          <h3 className="mt-3 text-2xl font-semibold text-slate-950 theme-dark:text-white">
            No articles found
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 theme-dark:text-slate-300">
            {searchQuery
              ? 'Try adjusting your search query or clearing filters.'
              : 'Try selecting a different category.'}
          </p>
          <div className="mt-6">
            <Link href="/blog" className="editorial-link justify-center">
              Reset in the full archive
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPosts
            .sort((a, b) => {
              if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
                return -1
              }

              return 1
            })
            .map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
        </div>
      )}
    </div>
  )
}

