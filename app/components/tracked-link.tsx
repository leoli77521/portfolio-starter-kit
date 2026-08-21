'use client'

import Link, { type LinkProps } from 'next/link'
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react'
import { trackAnalyticsEvent, type AnalyticsEventParams } from 'app/lib/analytics-events'

interface TrackedLinkProps
  extends LinkProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'> {
  eventName: string
  eventParams?: AnalyticsEventParams
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
  children: ReactNode
}

export function TrackedLink({
  eventName,
  eventParams,
  onClick,
  children,
  ...props
}: TrackedLinkProps) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) {
          trackAnalyticsEvent(eventName, eventParams)
        }
      }}
    >
      {children}
    </Link>
  )
}
