'use client'

import { useEffect, useRef, useState } from 'react'

type GoogleConsentState = {
  ad_storage?: 'granted' | 'denied'
}

type AdSenseWindow = Window & {
  adsbygoogle?: Record<string, never>[]
  __tolearnGoogleConsent?: GoogleConsentState
}

interface AdUnitProps {
  slot: string
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal'
  responsive?: boolean
  style?: React.CSSProperties
  className?: string
}

function getAdSenseClient() {
  const configuredClient = process.env.NEXT_PUBLIC_ADSENSE_ID?.trim() || ''
  return configuredClient.startsWith('ca-') ? configuredClient : `ca-${configuredClient}`
}

export function AdUnit({
  slot,
  format = 'auto',
  responsive = true,
  style = { display: 'block' },
  className = ''
}: AdUnitProps) {
  const client = getAdSenseClient()
  const [hasAdStorageConsent, setHasAdStorageConsent] = useState(false)
  const requestedRef = useRef(false)

  useEffect(() => {
    const syncConsent = () => {
      const adsenseWindow = window as AdSenseWindow
      setHasAdStorageConsent(adsenseWindow.__tolearnGoogleConsent?.ad_storage === 'granted')
    }

    syncConsent()
    window.addEventListener('tolearn:google-consent-update', syncConsent)

    return () => {
      window.removeEventListener('tolearn:google-consent-update', syncConsent)
    }
  }, [])

  useEffect(() => {
    if (!hasAdStorageConsent) {
      return
    }

    const requestAd = () => {
      const adsenseWindow = window as AdSenseWindow
      if (
        requestedRef.current ||
        adsenseWindow.__tolearnGoogleConsent?.ad_storage !== 'granted' ||
        !adsenseWindow.adsbygoogle
      ) {
        return
      }

      try {
        adsenseWindow.adsbygoogle.push({})
        requestedRef.current = true
      } catch (error) {
        console.error('Unable to request the AdSense unit:', error)
      }
    }

    requestAd()
    window.addEventListener('tolearn:adsense-ready', requestAd)

    return () => {
      window.removeEventListener('tolearn:adsense-ready', requestAd)
    }
  }, [hasAdStorageConsent])

  if (!/^ca-pub-\d+$/.test(client) || !/^\d+$/.test(slot)) {
    return null
  }

  if (!hasAdStorageConsent) {
    return <div aria-hidden="true" className={className} style={style} />
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={style}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? 'true' : 'false'}
    />
  )
}

/** A single, reserved-space placement inside long-form English articles. */
export function InArticleAd({ slot }: { slot: string }) {
  return (
    <aside className="my-10" aria-label="Sponsored content">
      <p className="mb-3 text-center text-xs uppercase tracking-[0.18em] text-slate-500 theme-dark:text-slate-400">
        Advertisement
      </p>
      <AdUnit
        slot={slot}
        format="fluid"
        style={{ display: 'block', textAlign: 'center', minHeight: '250px' }}
        className="in-article-ad"
      />
    </aside>
  )
}

/** Optional sidebar format. Not used in the current SEO-first layout. */
export function SidebarAd({ slot }: { slot: string }) {
  return (
    <div className="sticky top-4 mb-8">
      <AdUnit
        slot={slot}
        format="auto"
        style={{ display: 'block', minHeight: '600px' }}
        className="sidebar-ad"
      />
    </div>
  )
}

/** Optional horizontal format. Not used in the current SEO-first layout. */
export function BannerAd({ slot }: { slot: string }) {
  return (
    <div className="w-full my-4">
      <AdUnit
        slot={slot}
        format="horizontal"
        style={{ display: 'block', minHeight: '90px' }}
        className="banner-ad"
      />
    </div>
  )
}

/** Optional fixed display format. Not used in the current SEO-first layout. */
export function DisplayAd({ slot }: { slot: string }) {
  return (
    <div className="my-6 flex justify-center">
      <AdUnit
        slot={slot}
        format="rectangle"
        style={{ display: 'inline-block', width: '300px', height: '250px' }}
        className="display-ad"
      />
    </div>
  )
}
