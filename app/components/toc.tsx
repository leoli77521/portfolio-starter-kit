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
            { rootMargin: '0% 0% -80% 0%' }
        )

        headings.forEach((heading) => {
            const element = document.getElementById(heading.slug)
            if (element) {
                observer.observe(element)
            }
        })

        return () => {
            headings.forEach((heading) => {
                const element = document.getElementById(heading.slug)
                if (element) {
                    observer.unobserve(element)
                }
            })
        }
    }, [headings])

    if (headings.length === 0) return null

    return (
        <nav className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto hidden lg:block w-64">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4 uppercase tracking-wider">
                On this page
            </h4>
            <ul className="space-y-2 text-sm">
                {headings.map((heading) => (
                    <li
                        key={heading.slug}
                        style={{ paddingLeft: `${(heading.level - 1) * 1}rem` }}
                    >
                        <a
                            href={`#${heading.slug}`}
                            onClick={(e) => {
                                e.preventDefault()
                                document.getElementById(heading.slug)?.scrollIntoView({
                                    behavior: 'smooth',
                                })
                                setActiveId(heading.slug)
                            }}
                            className={`block transition-colors duration-200 border-l-2 pl-4 ${activeId === heading.slug
                                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-medium'
                                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-700'
                                }`}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
