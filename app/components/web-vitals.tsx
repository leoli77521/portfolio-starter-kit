'use client'

import { useReportWebVitals } from 'next/web-vitals'
import { trackAnalyticsEvent } from 'app/lib/analytics-events'

type VitalsMetric = {
  id: string
  name: string
  value: number
}

export type VitalsScore = 'good' | 'needs-improvement' | 'poor' | 'unknown'

export function WebVitals() {
  useReportWebVitals((metric) => {
    const rating = getVitalsScore(metric)

    if (process.env.NODE_ENV === 'development') {
      console.log(metric)
    }

    trackAnalyticsEvent('web_vital', {
      metric_id: metric.id,
      metric_name: metric.name,
      metric_value: Number(metric.value.toFixed(metric.name === 'CLS' ? 4 : 0)),
      metric_rating: rating,
    })

    if (process.env.NODE_ENV === 'production') {
      const body = JSON.stringify(metric)
      const url = '/api/vitals'

      if (navigator.sendBeacon) {
        navigator.sendBeacon(url, body)
      } else {
        fetch(url, {
          body,
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
        }).catch(console.error)
      }
    }
  })

  return null
}

export function getVitalsScore(metric: Pick<VitalsMetric, 'name' | 'value'>): VitalsScore {
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

export default WebVitals
