'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { GoogleAnalytics as NextGoogleAnalytics, sendGAEvent } from '@next/third-parties/google'

const GA_MEASUREMENT_ID_PATTERN = /^G-[A-Z0-9]+$/

export default function GoogleAnalytics() {
  const pathname = usePathname()
  const previousPathname = useRef(pathname)
  const measurementId = process.env.NEXT_PUBLIC_GA_ID?.trim() || ''
  const isConfigured = GA_MEASUREMENT_ID_PATTERN.test(measurementId)

  useEffect(() => {
    if (!isConfigured || previousPathname.current === pathname) {
      previousPathname.current = pathname
      return
    }

    sendGAEvent('event', 'page_view', {
      page_location: window.location.href,
      page_path: pathname,
      page_title: document.title,
    })
    previousPathname.current = pathname
  }, [isConfigured, pathname])

  return isConfigured ? <NextGoogleAnalytics gaId={measurementId} /> : null
}
