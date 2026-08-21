import type { Metadata } from 'next'
import SeoMetricsDashboard from 'app/components/seo-metrics-dashboard'

export const metadata: Metadata = {
  title: 'SEO Metrics Dashboard',
  description: 'Internal SEO performance and experiment monitoring dashboard.',
  robots: {index: false, follow: false},
}

export default function SeoDashboardPage() {
  return <SeoMetricsDashboard />
}
