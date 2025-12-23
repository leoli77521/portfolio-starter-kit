'use client'

import { useState, useEffect, useCallback, RefObject } from 'react'

/**
 * Hook to detect if component is mounted on client side
 * Useful for avoiding hydration mismatches
 */
export function useClientMount(): boolean {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}

/**
 * Hook to detect clicks outside of a referenced element
 * @param ref - Reference to the element to monitor
 * @param onClickOutside - Callback function when click outside is detected
 * @param enabled - Whether the hook is active (default: true)
 */
export function useClickOutside(
  ref: RefObject<HTMLElement>,
  onClickOutside: () => void,
  enabled = true
): void {
  useEffect(() => {
    if (!enabled) return

    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, onClickOutside, enabled])
}

/**
 * Hook to manage dark mode theme
 * @returns [isDark, toggleTheme, setTheme]
 */
export function useDarkMode(): [
  boolean,
  () => void,
  (theme: 'light' | 'dark') => void
] {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme) {
      setIsDark(savedTheme === 'dark')
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    } else if (prefersDark) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const newDark = !prev
      localStorage.setItem('theme', newDark ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', newDark)
      return newDark
    })
  }, [])

  const setTheme = useCallback((theme: 'light' | 'dark') => {
    const dark = theme === 'dark'
    setIsDark(dark)
    localStorage.setItem('theme', theme)
    document.documentElement.classList.toggle('dark', dark)
  }, [])

  // Return false for isDark until mounted to avoid hydration mismatch
  return [mounted ? isDark : false, toggleTheme, setTheme]
}

/**
 * Hook to handle keyboard shortcuts
 * @param key - Key to listen for (e.g., 'Escape', 'k')
 * @param callback - Function to call when key is pressed
 * @param options - Options for the keyboard shortcut
 */
export function useKeyboard(
  key: string,
  callback: () => void,
  options: {
    ctrl?: boolean
    meta?: boolean
    shift?: boolean
    alt?: boolean
    enabled?: boolean
  } = {}
): void {
  const { ctrl, meta, shift, alt, enabled = true } = options

  useEffect(() => {
    if (!enabled) return

    function handleKeyDown(event: KeyboardEvent) {
      const matchKey = event.key.toLowerCase() === key.toLowerCase()
      const matchCtrl = ctrl ? event.ctrlKey : true
      const matchMeta = meta ? event.metaKey : true
      const matchShift = shift ? event.shiftKey : true
      const matchAlt = alt ? event.altKey : true

      // If any modifier is required, check for exact match
      const hasModifierRequirement = ctrl || meta || shift || alt
      if (hasModifierRequirement) {
        const modifiersMatch =
          (ctrl ? event.ctrlKey : !event.ctrlKey || meta) &&
          (meta ? event.metaKey : !event.metaKey || ctrl) &&
          (shift ? event.shiftKey : !event.shiftKey) &&
          (alt ? event.altKey : !event.altKey)

        if (matchKey && modifiersMatch) {
          event.preventDefault()
          callback()
        }
      } else if (matchKey) {
        callback()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [key, callback, ctrl, meta, shift, alt, enabled])
}

/**
 * Hook for Cmd/Ctrl + K shortcut (common for search)
 * @param callback - Function to call when shortcut is pressed
 * @param enabled - Whether the hook is active (default: true)
 */
export function useSearchShortcut(
  callback: () => void,
  enabled = true
): void {
  useEffect(() => {
    if (!enabled) return

    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        callback()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [callback, enabled])
}

/**
 * Hook to lock body scroll
 * @param locked - Whether scroll should be locked
 */
export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (locked) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [locked])
}

/**
 * Hook for async data fetching with loading and error states
 * @param asyncFunction - Async function to execute
 * @param immediate - Whether to execute immediately (default: true)
 */
export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true
): {
  data: T | null
  loading: boolean
  error: Error | null
  execute: () => Promise<void>
} {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await asyncFunction()
      setData(response)
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setLoading(false)
    }
  }, [asyncFunction])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { data, loading, error, execute }
}

/**
 * Hook to debounce a value
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds (default: 300)
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook to detect if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    function handleChange(event: MediaQueryListEvent) {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return prefersReducedMotion
}
