'use client'

import { useEffect, useState } from 'react'
import { MoonStar, SunMedium } from 'lucide-react'

const LIGHT_THEME_COLOR = '#fafafa'
const DARK_THEME_COLOR = '#0b0f1a'

function getPreferredTheme(): 'light' | 'dark' {
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null

  if (savedTheme) {
    return savedTheme
  }

  if (document.documentElement.classList.contains('dark')) {
    return 'dark'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: 'light' | 'dark') {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.documentElement.style.colorScheme = theme

  const themeColorMeta = document.querySelector('meta[name="theme-color"]')
  if (themeColorMeta) {
    themeColorMeta.setAttribute('content', theme === 'dark' ? DARK_THEME_COLOR : LIGHT_THEME_COLOR)
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const syncTheme = () => {
      const nextTheme = getPreferredTheme()
      setTheme(nextTheme)
      applyTheme(nextTheme)
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleMediaChange = (event: MediaQueryListEvent) => {
      if (localStorage.getItem('theme')) {
        return
      }

      const nextTheme = event.matches ? 'dark' : 'light'
      setTheme(nextTheme)
      applyTheme(nextTheme)
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== 'theme') {
        return
      }

      syncTheme()
    }

    syncTheme()
    mediaQuery.addEventListener('change', handleMediaChange)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    localStorage.setItem('theme', nextTheme)
    applyTheme(nextTheme)
  }

  if (!mounted) {
    return <div className="h-11 w-11 animate-pulse rounded-full bg-slate-100 theme-dark:bg-slate-900" />
  }

  return (
    <button
      onClick={toggleTheme}
      className="utility-button h-11 w-11 p-0"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      type="button"
    >
      {theme === 'light' ? (
        <MoonStar className="h-4 w-4" />
      ) : (
        <SunMedium className="h-4 w-4" />
      )}
    </button>
  )
}

