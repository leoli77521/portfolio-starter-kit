'use client'

import { useEffect } from 'react'

interface SearchConsoleProps {
  googleSiteVerification?: string
  yandexVerification?: string
  bingVerification?: string
}

export default function SearchConsoleVerification({
  googleSiteVerification,
  yandexVerification,
  bingVerification
}: SearchConsoleProps) {
  useEffect(() => {
    // 动态添加验证meta标签
    const addVerificationTag = (name: string, content: string) => {
      if (!content) return
      
      // 检查是否已存在
      const existingTag = document.querySelector(`meta[name="${name}"]`)
      if (existingTag) return
      
      const meta = document.createElement('meta')
      meta.name = name
      meta.content = content
      document.head.appendChild(meta)
    }

    // 添加各种搜索引擎验证标签
    if (googleSiteVerification) {
      addVerificationTag('google-site-verification', googleSiteVerification)
    }
    
    if (yandexVerification) {
      addVerificationTag('yandex-verification', yandexVerification)
    }
    
    if (bingVerification) {
      addVerificationTag('msvalidate.01', bingVerification)
    }

    // 添加其他搜索引擎的验证标签
    const otherVerifications = [
      { name: 'baidu-site-verification', value: process.env.NEXT_PUBLIC_BAIDU_VERIFICATION },
      { name: 'naver-site-verification', value: process.env.NEXT_PUBLIC_NAVER_VERIFICATION },
      { name: 'facebook-domain-verification', value: process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION },
    ]

    otherVerifications.forEach(({ name, value }) => {
      if (value) addVerificationTag(name, value)
    })
  }, [googleSiteVerification, yandexVerification, bingVerification])

  return null
}

// 辅助函数：提交sitemap到各个搜索引擎
export function submitSitemapToSearchEngines(sitemapUrl: string) {
  const searchEngines = [
    `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
    `https://submissions.ask.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
  ]
  
  // 只在浏览器环境中执行
  if (typeof window === 'undefined') return
  
  console.log('Sitemap URLs for manual submission:')
  searchEngines.forEach(url => {
    console.log(url)
  })
  
  return searchEngines
}

// Search Console数据提交辅助函数
export function reportToSearchConsole(data: {
  url: string
  type: 'indexing' | 'error' | 'performance'
  details?: any
}) {
  // 这里可以实现向Google Search Console API提交数据的逻辑
  // 需要适当的API密钥和权限
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Search Console Report:', data)
  }
  
  // 实际实现需要使用Google Search Console API
  // fetch('/api/search-console', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data)
  // })
}