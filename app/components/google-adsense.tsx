'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const ADSENSE_SRC = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
const ADSENSE_CLIENT_PATTERN = /^ca-pub-\d+$/
const LOAD_TIMEOUT_MS = 8000

type AdSenseConsentWindow = Window & {
  __tolearnGoogleConsent?: {
    ad_storage?: 'granted' | 'denied'
  }
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
  cancelIdleCallback?: (id: number) => void
}

function getAdSenseClient() {
  const configuredClient = process.env.NEXT_PUBLIC_ADSENSE_ID?.trim() || ''
  return configuredClient.startsWith('ca-') ? configuredClient : `ca-${configuredClient}`
}

function isEnglishArticlePath(pathname: string) {
  return /^\/blog\/[^/]+$/.test(pathname)
}

const injectScript = (client: string) => {
  if (typeof document === 'undefined') {
    return
  }

  const existingScript = document.querySelector<HTMLScriptElement>(
    `script[data-ad-client="${client}"]`
  )

  if (existingScript) {
    if (existingScript.dataset.loaded === 'true') {
      window.dispatchEvent(new Event('tolearn:adsense-ready'))
    }
    return
  }

  const script = document.createElement('script')
  script.src = `${ADSENSE_SRC}?client=${client}`
  script.async = true
  script.crossOrigin = 'anonymous'
  script.setAttribute('data-ad-client', client)
  script.addEventListener('load', () => {
    script.dataset.loaded = 'true'
    window.dispatchEvent(new Event('tolearn:adsense-ready'))
  }, { once: true })
  document.head.appendChild(script)
}

const GoogleAdSense = () => {
  const pathname = usePathname()

  useEffect(() => {
    const client = getAdSenseClient()
    if (
      typeof window === 'undefined' ||
      !ADSENSE_CLIENT_PATTERN.test(client) ||
      !isEnglishArticlePath(pathname)
    ) {
      return
    }

    let cancelScheduledLoad: (() => void) | null = null

    const cancelLoad = () => {
      cancelScheduledLoad?.()
      cancelScheduledLoad = null
    }

    const syncConsent = () => {
      const consentWindow = window as AdSenseConsentWindow
      if (consentWindow.__tolearnGoogleConsent?.ad_storage !== 'granted') {
        cancelLoad()
        return
      }

      if (cancelScheduledLoad || document.querySelector(`script[data-ad-client="${client}"]`)) {
        return
      }

      const idleWindow = window as AdSenseConsentWindow
      if (typeof idleWindow.requestIdleCallback === 'function') {
        const idleId = idleWindow.requestIdleCallback(() => injectScript(client), {
          timeout: LOAD_TIMEOUT_MS,
        })
        cancelScheduledLoad = () => {
          idleWindow.cancelIdleCallback?.(idleId)
        }
      } else {
        const timeoutId = globalThis.setTimeout(() => injectScript(client), LOAD_TIMEOUT_MS)
        cancelScheduledLoad = () => globalThis.clearTimeout(timeoutId)
      }
    }

    syncConsent()
    window.addEventListener('tolearn:google-consent-update', syncConsent)

    return () => {
      window.removeEventListener('tolearn:google-consent-update', syncConsent)
      cancelLoad()
    }
  }, [pathname])

  return null
}

export default GoogleAdSense
