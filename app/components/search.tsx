'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Command, Search as SearchIcon, X } from 'lucide-react'

interface SearchResult {
  slug: string
  title: string
  summary: string
  publishedAt: string
  content?: string
}

export function Search() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [totalMatches, setTotalMatches] = useState(0)
  const [allPosts, setAllPosts] = useState<SearchResult[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function loadPosts() {
      if (allPosts.length > 0) return

      try {
        const response = await fetch('/search-index.json')
        if (response.ok) {
          const posts = await response.json()
          setAllPosts(posts)
        }
      } catch (error) {
        console.error('Failed to load search index:', error)
      }
    }

    if (isOpen) {
      loadPosts()
    }
  }, [allPosts.length, isOpen])

  useEffect(() => {
    if (query.trim() === '') {
      setResults([])
      setTotalMatches(0)
      return
    }

    const searchQuery = query.toLowerCase()
    const filtered = allPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery) ||
        post.summary.toLowerCase().includes(searchQuery) ||
        (post.content && post.content.toLowerCase().includes(searchQuery))
    )

    setTotalMatches(filtered.length)
    setResults(filtered.slice(0, 8))
  }, [allPosts, query])

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

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  return (
    <div ref={searchRef} className="relative">
      <button
        onClick={() => setIsOpen((open) => !open)}
        className="utility-button px-3"
        aria-label="Search articles"
        title="Search articles"
        type="button"
      >
        <SearchIcon className="h-4 w-4" />
        <span className="hidden text-sm font-medium md:inline">Search</span>
        <span className="hidden items-center gap-1 rounded-full border border-slate-200/80 px-2 py-1 text-[0.68rem] text-slate-500 theme-dark:border-slate-800 theme-dark:text-slate-400 xl:inline-flex">
          <Command className="h-3 w-3" />
          K
        </span>
      </button>

      {isOpen ? (
        <div
          className="surface-panel absolute right-0 z-50 mt-3 w-[min(92vw,30rem)] overflow-hidden"
          role="dialog"
          aria-label="Search articles"
          aria-modal="true"
        >
          <div className="border-b border-slate-200/70 p-4 theme-dark:border-slate-800">
            <div className="flex items-center gap-3 rounded-full border border-slate-200/80 bg-white/90 px-4 py-3 theme-dark:border-slate-800 theme-dark:bg-slate-950/90">
              <SearchIcon className="h-4 w-4 text-slate-400" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search titles, summaries, and indexed content"
                className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 theme-dark:text-slate-100 theme-dark:placeholder:text-slate-500"
                aria-label="Search articles"
                autoComplete="off"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:text-slate-700 theme-dark:hover:text-slate-200"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 theme-dark:text-slate-400">
              <span>Press Esc to close</span>
              <span>Cmd/Ctrl + K</span>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {query.trim() === '' ? (
              <div className="px-5 py-10 text-center">
                <p className="section-kicker">Start typing</p>
                <p className="mt-3 text-sm leading-6 text-slate-600 theme-dark:text-slate-300">
                  Search the archive by title, summary, or indexed post content.
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="section-kicker">No results</p>
                <p className="mt-3 text-sm leading-6 text-slate-600 theme-dark:text-slate-300">
                  No articles matched "{query}".
                </p>
              </div>
            ) : (
              <ul className="p-2">
                {results.map((post, index) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      onClick={() => {
                        setIsOpen(false)
                        setQuery('')
                      }}
                      className="group block rounded-[1.25rem] px-4 py-4 transition-colors hover:bg-slate-100/80 theme-dark:hover:bg-slate-900/80"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-950 theme-dark:text-slate-100">
                            {post.title}
                          </p>
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 theme-dark:text-slate-300">
                            {post.summary}
                          </p>
                          <span className="mt-3 inline-flex text-xs uppercase tracking-[0.16em] text-slate-500 theme-dark:text-slate-400">
                            {post.publishedAt}
                          </span>
                        </div>
                        <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200/80 text-slate-400 transition-colors group-hover:border-indigo-300 group-hover:text-indigo-700 theme-dark:border-slate-800 theme-dark:group-hover:border-indigo-500/60 theme-dark:group-hover:text-indigo-300">
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </div>
                    </Link>
                    {index < results.length - 1 ? (
                      <div className="mx-4 border-t border-slate-200/70 theme-dark:border-slate-800" />
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {results.length > 0 ? (
            <div className="border-t border-slate-200/70 px-4 py-3 theme-dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 theme-dark:text-slate-400">
                  {totalMatches > results.length
                    ? `Showing ${results.length} of ${totalMatches} results`
                    : `${totalMatches} ${totalMatches === 1 ? 'result' : 'results'}`}
                </span>
                <Link
                  href="/blog"
                  onClick={() => {
                    setIsOpen(false)
                    setQuery('')
                  }}
                  className="editorial-link"
                >
                  Open the full archive
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

