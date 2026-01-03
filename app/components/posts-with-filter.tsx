'use client'

import Link from 'next/link'
import { useState } from 'react'
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

  const filteredPosts = posts.filter(post => {
    // Category filter
    const categoryMatch = selectedCategory === 'All' || post.metadata.category === selectedCategory

    // Search filter
    if (!searchQuery.trim()) {
      return categoryMatch
    }

    const query = searchQuery.toLowerCase()
    const titleMatch = post.metadata.title.toLowerCase().includes(query)
    const summaryMatch = post.metadata.summary?.toLowerCase().includes(query)
    // Content search temporarily disabled for performance payload optimization
    // Phase 2 will implement full-text search via index
    
    return categoryMatch && (titleMatch || summaryMatch)
  })

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search articles by title, content, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
            aria-label="Search articles"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Clear search"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Found {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} matching "{searchQuery}"
          </p>
        )}
      </div>

      <CategoryFilter
        currentCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {filteredPosts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No articles found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery
              ? "Try adjusting your search query or clearing filters"
              : "Try selecting a different category"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPosts
            .sort((a, b) => {
              if (
                new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)
              ) {
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

