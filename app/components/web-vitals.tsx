'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // 开发环境下在控制台输出
    if (process.env.NODE_ENV === 'development') {
      console.log(metric)
    }
    
    // 生产环境发送到分析服务
    if (process.env.NODE_ENV === 'production') {
      const body = JSON.stringify(metric)
      const url = '/api/vitals'
      
      // 使用sendBeacon发送（如果可用），否则使用fetch
      if (navigator.sendBeacon) {
        navigator.sendBeacon(url, body)
      } else {
        fetch(url, { body, method: 'POST' }).catch(console.error)
      }
    }
  })

  return null
}

// 辅助函数：性能评分
export function getVitalsScore(metric: any) {
  const { name, value } = metric
  
  switch (name) {
    case 'FCP':
      return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor'
    case 'LCP':
      return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor'
    case 'CLS':
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor'
    case 'FID':
      return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor'
    case 'TTFB':
      return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor'
    case 'INP':
      return value <= 200 ? 'good' : value <= 500 ? 'needs-improvement' : 'poor'
    default:
      return 'unknown'
  }
}

// 性能监控钩子
export function usePerformanceMonitoring() {
  const reportWebVital = (metric: any) => {
    const score = getVitalsScore(metric)
    
    // 记录到Google Analytics（如果设置了GA）
    if (typeof window !== 'undefined' && 'gtag' in window) {
      ;(window as any).gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
        custom_map: {
          score: score
        }
      })
    }
    
    // 记录到Vercel Analytics（如果设置了）
    if (typeof window !== 'undefined' && 'va' in window) {
      ;(window as any).va('track', metric.name, {
        value: metric.value,
        score: score
      })
    }
  }

  return { reportWebVital }
}

export default WebVitals