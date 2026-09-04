export type AnalyticsEventMap = {
  newsletter_signup: {
    placement: 'footer' | 'page_cta'
  }
  guide_start: {
    guide_slug: string
    entry_point: 'guides_directory'
  }
  directory_entry_click: {
    directory: string
    entry_slug: string
    category: string
    destination: string
  }
  web_vital: {
    metric_id: string
    metric_name: string
    metric_value: number
    metric_rating: 'good' | 'needs-improvement' | 'poor' | 'unknown'
  }
}

export type AnalyticsEvent = keyof AnalyticsEventMap
export type AnalyticsEventParams<EventName extends AnalyticsEvent = AnalyticsEvent> =
  AnalyticsEventMap[EventName]

type AnalyticsContext = {
  locale: string
  page_path: string
}

type AnalyticsPayload<EventName extends AnalyticsEvent> =
  AnalyticsEventMap[EventName] & AnalyticsContext

type AnalyticsWindow = Window & {
  dataLayer?: unknown[]
  gtag?: (
    command: 'event',
    eventName: string,
    params?: Record<string, string | number | boolean>
  ) => void
  plausible?: (
    eventName: string,
    options?: { props?: Record<string, string | number | boolean> }
  ) => void
}

const supportedLocales = new Set(['zh', 'de', 'fr', 'th', 'pt'])

function getAnalyticsContext(): AnalyticsContext {
  const pagePath = window.location.pathname || '/'
  const firstSegment = pagePath.split('/').filter(Boolean)[0]

  return {
    locale: firstSegment && supportedLocales.has(firstSegment) ? firstSegment : 'en',
    page_path: pagePath,
  }
}

export function trackAnalyticsEvent<EventName extends AnalyticsEvent>(
  eventName: EventName,
  params: AnalyticsEventMap[EventName]
) {
  if (typeof window === 'undefined') return

  const analyticsWindow = window as AnalyticsWindow
  const payload: AnalyticsPayload<EventName> = {
    ...params,
    ...getAnalyticsContext(),
  }

  analyticsWindow.gtag?.('event', eventName, payload)
  analyticsWindow.plausible?.(eventName, { props: payload })
}
