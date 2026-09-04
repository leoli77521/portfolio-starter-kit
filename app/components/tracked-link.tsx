'use client'

import Link, { type LinkProps } from 'next/link'
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react'
import {
  trackAnalyticsEvent,
  type AnalyticsEvent,
  type AnalyticsEventParams,
} from 'app/lib/analytics-events'

type TrackedLinkProps<EventName extends AnalyticsEvent> = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'> & {
  eventName: EventName
  eventParams: AnalyticsEventParams<EventName>
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
  children: ReactNode
}

export function TrackedLink<EventName extends AnalyticsEvent>({
  eventName,
  eventParams,
  onClick,
  children,
  ...props
}: TrackedLinkProps<EventName>) {
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
