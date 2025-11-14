'use client'

import { useEffect } from 'react'

interface AdUnitProps {
  slot: string
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal'
  responsive?: boolean
  style?: React.CSSProperties
  className?: string
}

/**
 * Google AdSense Ad Unit Component
 *
 * Usage:
 * <AdUnit slot="YOUR_SLOT_ID" format="auto" responsive />
 */
export function AdUnit({
  slot,
  format = 'auto',
  responsive = true,
  style = { display: 'block' },
  className = ''
}: AdUnitProps) {
  useEffect(() => {
    try {
      // Push ad to AdSense
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      }
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [])

  const adClient = process.env.NEXT_PUBLIC_ADSENSE_ID

  if (!adClient) {
    return null // Don't render if AdSense is not configured
  }

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={style}
      data-ad-client={adClient}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? 'true' : 'false'}
    />
  )
}

/**
 * In-Article Ad Unit (适合文章内容中)
 */
export function InArticleAd({ slot }: { slot: string }) {
  return (
    <div className="my-8 flex justify-center">
      <AdUnit
        slot={slot}
        format="fluid"
        style={{ display: 'block', textAlign: 'center' }}
        className="in-article-ad"
      />
    </div>
  )
}

/**
 * Sidebar Ad Unit (适合侧边栏)
 */
export function SidebarAd({ slot }: { slot: string }) {
  return (
    <div className="sticky top-4 mb-8">
      <AdUnit
        slot={slot}
        format="auto"
        style={{ display: 'block' }}
        className="sidebar-ad"
      />
    </div>
  )
}

/**
 * Banner Ad Unit (适合顶部/底部横幅)
 */
export function BannerAd({ slot }: { slot: string }) {
  return (
    <div className="w-full my-4">
      <AdUnit
        slot={slot}
        format="horizontal"
        style={{ display: 'block' }}
        className="banner-ad"
      />
    </div>
  )
}
