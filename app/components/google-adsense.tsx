'use client'

import { useEffect } from 'react'

const ADSENSE_SRC = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_ID || ''
const USER_INTERACTION_EVENTS: Array<[keyof DocumentEventMap, AddEventListenerOptions]> = [
  ['pointerdown', { once: true }],
  ['keydown', { once: true }],
  ['scroll', { once: true, passive: true }],
]
const LOAD_TIMEOUT_MS = 5000

const injectScript = () => {
  if (typeof document === 'undefined') {
    return
  }

  const existingScript = document.querySelector<HTMLScriptElement>(
    `script[data-ad-client="${ADSENSE_CLIENT}"]`
  )

  if (existingScript) {
    return
  }

  const script = document.createElement('script')
  script.src = `${ADSENSE_SRC}?client=${ADSENSE_CLIENT}`
  script.async = true
  script.crossOrigin = 'anonymous'
  script.setAttribute('data-ad-client', ADSENSE_CLIENT)
  document.head.appendChild(script)
}

const GoogleAdSense = () => {
  useEffect(() => {
    // Don't load if AdSense ID is not configured
    if (typeof window === 'undefined' || !ADSENSE_CLIENT) {
      return
    }

    let loaded = false

    const loadOnce = () => {
      if (loaded) {
        return
      }
      loaded = true
      injectScript()
    }

    const cancelIdle = 'requestIdleCallback' in window
      ? (() => {
        const idleId = (window as Window & typeof globalThis & { requestIdleCallback?: any; cancelIdleCallback?: any }).requestIdleCallback?.(loadOnce, {
          timeout: LOAD_TIMEOUT_MS,
        })
        return () => {
          if (idleId && (window as any).cancelIdleCallback) {
            (window as any).cancelIdleCallback(idleId)
          }
        }
      })()
      : null

    const timeoutId = window.setTimeout(loadOnce, LOAD_TIMEOUT_MS)

    const listeners = USER_INTERACTION_EVENTS.map(([event, options]) => {
      const handler = () => loadOnce()
      window.addEventListener(event, handler, options)
      return () => window.removeEventListener(event, handler)
    })

    return () => {
      cancelIdle?.()
      window.clearTimeout(timeoutId)
      listeners.forEach((cleanup) => cleanup())
    }
  }, [])

  return null
}

export default GoogleAdSense
