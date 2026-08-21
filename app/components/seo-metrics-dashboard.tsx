'use client'

import { useEffect, useState } from 'react'

type WindowMetric = {
  clicks?: number | null
  impressions?: number | null
  ctr?: number | null
  position?: number | null
  benchmarkPageImpressions?: number | null
}

type MetricsResponse = {
  updatedAt: string
  snapshotCount: number
  latest: {
    capturedAt: string
    source: string
    gsc: Record<string, WindowMetric>
    aiSearch: Record<string, WindowMetric>
    indexCoverage: {
      indexedUrls?: number | null
      crawledNotIndexed?: number | null
      decisionCounts?: Record<string, number>
    }
    conversions: {corePageConversions?: number | null; source?: string}
    experiments?: Record<string, Record<string, string | number | null>>
  } | null
  notes: string[]
}

function MetricValue({value, suffix = ''}: {value?: number | null; suffix?: string}) {
  return <span>{value === null || value === undefined ? '待导入' : `${value}${suffix}`}</span>
}

export default function SeoMetricsDashboard() {
  const [data, setData] = useState<MetricsResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/seo-metrics')
      .then((response) => {
        if (!response.ok) throw new Error('Metrics endpoint failed')
        return response.json()
      })
      .then(setData)
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'Unknown error'))
  }, [])

  if (error) return <section className="surface-panel p-8">无法读取 SEO 指标：{error}</section>
  if (!data?.latest) return <section className="surface-panel p-8">正在加载 SEO 指标…</section>

  const windows = ['7d', '14d', '28d']
  const latest = data.latest

  return (
    <section className="space-y-8">
      <div className="surface-panel px-6 py-8 md:px-8">
        <p className="section-kicker">Internal operations</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
          SEO performance dashboard
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
          Latest snapshot: {latest.capturedAt} · source: {latest.source} · {data.snapshotCount} saved snapshots
        </p>
      </div>

      <div className="surface-panel overflow-x-auto px-6 py-6 md:px-8">
        <h2 className="text-2xl font-semibold text-slate-950 theme-dark:text-white">GSC performance</h2>
        <table className="mt-5 min-w-full text-left text-sm">
          <thead><tr className="border-b border-slate-200/80 theme-dark:border-slate-800"><th className="py-3 pr-6">Window</th><th className="py-3 pr-6">Clicks</th><th className="py-3 pr-6">Impressions</th><th className="py-3 pr-6">CTR</th><th className="py-3">Position</th></tr></thead>
          <tbody>{windows.map((window) => { const metric = latest.gsc[window] || {}; return <tr key={window} className="border-b border-slate-100 theme-dark:border-slate-900"><td className="py-3 pr-6 font-medium">{window}</td><td className="py-3 pr-6"><MetricValue value={metric.clicks} /></td><td className="py-3 pr-6"><MetricValue value={metric.impressions} /></td><td className="py-3 pr-6"><MetricValue value={metric.ctr} suffix="%" /></td><td className="py-3"><MetricValue value={metric.position} /></td></tr> })}</tbody>
        </table>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface-panel px-6 py-6 md:px-8">
          <h2 className="text-2xl font-semibold text-slate-950 theme-dark:text-white">AI search visibility</h2>
          <div className="mt-5 space-y-4 text-sm">
            {windows.map((window) => { const metric = latest.aiSearch[window] || {}; return <div key={window} className="flex items-center justify-between border-b border-slate-100 pb-3 theme-dark:border-slate-900"><span>{window}</span><span><MetricValue value={metric.impressions} /> impressions · <MetricValue value={metric.clicks} /> clicks</span></div> })}
          </div>
          <p className="mt-5 text-xs leading-6 text-slate-500 theme-dark:text-slate-400">28d benchmark page baseline: <MetricValue value={latest.aiSearch['28d']?.benchmarkPageImpressions} /> impressions.</p>
        </div>

        <div className="surface-panel px-6 py-6 md:px-8">
          <h2 className="text-2xl font-semibold text-slate-950 theme-dark:text-white">Index coverage & conversions</h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div className="flex justify-between"><dt>Indexed URLs</dt><dd><MetricValue value={latest.indexCoverage.indexedUrls} /></dd></div>
            <div className="flex justify-between"><dt>Crawled, not indexed</dt><dd><MetricValue value={latest.indexCoverage.crawledNotIndexed} /></dd></div>
            <div className="flex justify-between"><dt>Core page conversions</dt><dd><MetricValue value={latest.conversions.corePageConversions} /></dd></div>
          </dl>
          <p className="mt-5 text-xs leading-6 text-slate-500 theme-dark:text-slate-400">Unpopulated fields remain visible as “待导入” so missing connectors cannot be mistaken for zero performance.</p>
        </div>
      </div>

      <div className="surface-panel px-6 py-6 md:px-8">
        <h2 className="text-2xl font-semibold text-slate-950 theme-dark:text-white">Data contract</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">{data.notes.map((note) => <li key={note}>{note}</li>)}</ul>
      </div>
    </section>
  )
}
