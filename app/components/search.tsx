'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface SearchResult {
  slug: string
  title: string
  summary: string
  publishedAt: string
}

export function Search() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [allPosts, setAllPosts] = useState<SearchResult[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // 加载所有文章（通过 API）
  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await fetch('/api/search')
        if (response.ok) {
          const posts = await response.json()
          setAllPosts(posts)
        }
      } catch (error) {
        console.error('Failed to load posts for search:', error)
      }
    }
    loadPosts()
  }, [])

  // 处理搜索
  useEffect(() => {
    if (query.trim() === '') {
      setResults([])
      return
    }

    const searchQuery = query.toLowerCase()
    const filtered = allPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery) ||
        post.summary.toLowerCase().includes(searchQuery)
    )
    setResults(filtered.slice(0, 5)) // 最多显示5个结果
  }, [query, allPosts])

  // 点击外部关闭
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setQuery('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // 快捷键 Cmd/Ctrl + K
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setIsOpen(true)
        inputRef.current?.focus()
      }
      if (event.key === 'Escape') {
        setIsOpen(false)
        setQuery('')
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // 打开搜索时聚焦输入框
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  return (
    <div ref={searchRef} className="relative">
      {/* 搜索按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
        aria-label="Search articles"
        title="Search (⌘K)"
      >
        <svg
          className="w-5 h-5 text-gray-700 dark:text-gray-300"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* 搜索下拉框 */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
          role="dialog"
          aria-label="Search articles"
          aria-modal="true"
        >
          {/* 搜索输入框 */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full px-4 py-2.5 pl-10 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                aria-label="Search articles"
                aria-describedby="search-hint"
                aria-controls="search-results"
                aria-expanded={results.length > 0}
                autoComplete="off"
              />
              <svg
                className="absolute left-3 top-3 w-5 h-5 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div id="search-hint" className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Press Esc to close</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* 搜索结果 */}
          <div id="search-results" className="max-h-96 overflow-y-auto" role="region" aria-label="Search results" aria-live="polite">
            {query.trim() === '' ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <svg
                  className="w-12 h-12 mx-auto mb-3 opacity-50"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-sm">Start typing to search articles...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <svg
                  className="w-12 h-12 mx-auto mb-3 opacity-50"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm">No articles found for "{query}"</p>
              </div>
            ) : (
              <ul className="py-2" role="listbox" aria-label="Search results">
                {results.map((post, index) => (
                  <li key={post.slug} role="option" aria-selected={index === 0}>
                    <Link
                      href={`/blog/${post.slug}`}
                      onClick={() => {
                        setIsOpen(false)
                        setQuery('')
                      }}
                      className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-800"
                    >
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-1">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {post.summary}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-500 mt-1 block">
                        {post.publishedAt}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 底部提示 */}
          {results.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <Link
                href="/blog"
                onClick={() => {
                  setIsOpen(false)
                  setQuery('')
                }}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
              >
                View all articles →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
