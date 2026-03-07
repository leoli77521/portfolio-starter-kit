'use client'

import Giscus from '@giscus/react'
import { useEffect, useState } from 'react'

type Repo = `${string}/${string}`
type ThemeMode = 'light' | 'dark'

function isRepo(value: string): value is Repo {
  return value.includes('/')
}

function resolveTheme(): ThemeMode {
  try {
    const storedTheme = window.localStorage.getItem('theme')
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme
    }
  } catch {
    // Ignore localStorage access issues and fall back to DOM/system state.
  }

  if (document.documentElement.classList.contains('dark')) {
    return 'dark'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function Comments() {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<ThemeMode>('light')

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const syncTheme = () => setTheme(resolveTheme())

    syncTheme()
    setMounted(true)

    const observer = new MutationObserver(syncTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'theme') {
        syncTheme()
      }
    }

    window.addEventListener('storage', handleStorage)
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', syncTheme)
    } else {
      mediaQuery.addListener(syncTheme)
    }

    return () => {
      observer.disconnect()
      window.removeEventListener('storage', handleStorage)
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', syncTheme)
      } else {
        mediaQuery.removeListener(syncTheme)
      }
    }
  }, [])

  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID

  if (!repo || !repoId || !isRepo(repo)) {
    return null
  }

  if (!mounted) {
    return <div className="surface-panel mt-16 min-h-[280px] animate-pulse" />
  }

  const hasCategory = Boolean(category && categoryId)

  return (
    <section className="surface-panel mt-16 overflow-hidden">
      <div className="border-b border-slate-200/70 px-6 py-5 theme-dark:border-slate-800">
        <p className="section-kicker">Discussion</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950 theme-dark:text-white">
          Continue the conversation
        </h2>
      </div>

      <div className="px-2 pb-3 pt-2 md:px-4">
        <Giscus
          key={theme}
          id="comments"
          repo={repo}
          repoId={repoId}
          category={hasCategory ? category : undefined}
          categoryId={hasCategory ? categoryId : undefined}
          mapping="pathname"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          theme={theme === 'dark' ? 'dark' : 'light'}
          lang="en"
          loading="lazy"
        />
      </div>
    </section>
  )
}

