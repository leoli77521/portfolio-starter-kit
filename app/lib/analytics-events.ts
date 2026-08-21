export type AnalyticsEventParams = Record<string, string | number | boolean | undefined>

type AnalyticsWindow = Window & {
  dataLayer?: unknown[]
  gtag?: (command: 'event', eventName: string, params?: AnalyticsEventParams) => void
  plausible?: (eventName: string, options?: { props?: AnalyticsEventParams }) => void
}

export function trackAnalyticsEvent(
  eventName: string,
  params: AnalyticsEventParams = {}
) {
  if (typeof window === 'undefined') return

  const analyticsWindow = window as AnalyticsWindow
  analyticsWindow.gtag?.('event', eventName, params)
  analyticsWindow.plausible?.(eventName, { props: params })
}
