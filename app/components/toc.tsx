'use client'

import { useEffect, useState } from 'react'

type Heading = {
  level: number
  text: string
  slug: string
}

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '0% 0% -78% 0%' }
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.slug)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav
      aria-label="Table of contents"
      className="surface-panel max-h-[calc(100vh-8rem)] overflow-y-auto p-5"
    >
      <p className="section-kicker">On this page</p>
      <ul className="mt-5 space-y-1.5">
        {headings.map((heading) => {
          const isActive = activeId === heading.slug

          return (
            <li
              key={heading.slug}
              style={{ paddingLeft: `${Math.max(heading.level - 2, 0) * 0.85}rem` }}
            >
              <a
                href={`#${heading.slug}`}
                onClick={(event) => {
                  event.preventDefault()
                  document.getElementById(heading.slug)?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  })
                  setActiveId(heading.slug)
                }}
                className={`block rounded-[1.1rem] border px-3 py-3 text-sm leading-6 transition-colors ${
                  isActive
                    ? 'border-indigo-200/80 bg-indigo-50/80 text-indigo-700 theme-dark:border-indigo-900/80 theme-dark:bg-indigo-950/40 theme-dark:text-indigo-200'
                    : 'border-transparent text-slate-600 hover:border-slate-200/80 hover:bg-slate-100/80 hover:text-slate-950 theme-dark:text-slate-300 theme-dark:hover:border-slate-800 theme-dark:hover:bg-slate-900/80 theme-dark:hover:text-white'
                }`}
              >
                {heading.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

