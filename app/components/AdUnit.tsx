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
 * Google AdSense 骞垮憡鍗曞厓缁勪欢
 *
 * 浣跨敤鏂规硶:
 * <AdUnit slot="浣犵殑骞垮憡浣岻D" format="auto" responsive />
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
      // 鎺ㄩ€佸箍鍛婂埌 AdSense
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      }
    } catch (err) {
      console.error('AdSense 鍔犺浇閿欒:', err)
    }
  }, [])

  return (
    <ins
      className={`adsbygoogle ${className}`}
      style={style}
      data-ad-client="ca-pub-8944496077703633"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? 'true' : 'false'}
    />
  )
}

/**
 * 鏂囩珷鍐呭箍鍛?(閫傚悎鏂囩珷鍐呭涓棿)
 */
export function InArticleAd({ slot }: { slot: string }) {
  return (
    <div className="my-8 flex justify-center">
      <AdUnit
        slot={slot}
        format="fluid"
        style={{ display: 'block', textAlign: 'center', minHeight: '250px' }}
        className="in-article-ad"
      />
    </div>
  )
}

/**
 * 渚ц竟鏍忓箍鍛?
 */
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

/**
 * 妯箙骞垮憡 (閫傚悎椤甸潰椤堕儴/搴曢儴)
 */
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

/**
 * 灞曠ず骞垮憡 (閫氱敤鐭╁舰骞垮憡)
 */
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
