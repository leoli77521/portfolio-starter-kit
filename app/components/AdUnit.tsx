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
 * Google AdSense 广告单元组件
 *
 * 使用方法:
 * <AdUnit slot="你的广告位ID" format="auto" responsive />
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
      // 推送广告到 AdSense
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      }
    } catch (err) {
      console.error('AdSense 加载错误:', err)
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
 * 文章内广告 (适合文章内容中间)
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
 * 侧边栏广告
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
 * 横幅广告 (适合页面顶部/底部)
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
 * 展示广告 (通用矩形广告)
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
