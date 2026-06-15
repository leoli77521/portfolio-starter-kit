import type { Metadata } from 'next'
import Link from 'next/link'
import { runAudit } from 'app/lib/seo-audit'

export const metadata: Metadata = {
  title: 'AI SEO Audit',
  description: 'Internal AI content authority audit for ToLearn Blog.',
  robots: {
    index: false,
    follow: false,
  },
}

const severityStyles: Record<string, string> = {
  high: 'border-rose-200/80 bg-rose-50/90 text-rose-700 theme-dark:border-rose-900/80 theme-dark:bg-rose-950/50 theme-dark:text-rose-300',
  medium:
    'border-amber-200/80 bg-amber-50/90 text-amber-700 theme-dark:border-amber-900/80 theme-dark:bg-amber-950/50 theme-dark:text-amber-300',
  low: 'border-slate-200/80 bg-slate-100/90 text-slate-600 theme-dark:border-slate-800 theme-dark:bg-slate-900 theme-dark:text-slate-300',
}

export default function SeoAuditPage() {
  const report = runAudit()
  const topIssues = report.issues.slice(0, 24)

  return (
    <section className="mx-auto max-w-6xl space-y-8">
      <div className="surface-panel px-6 py-8 md:px-8 md:py-10">
        <p className="section-kicker">Internal SEO dashboard</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white md:text-5xl">
          AI content authority audit
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 theme-dark:text-slate-300 md:text-lg">
          This noindex page summarizes AI cluster coverage, refresh opportunities, and article
          completeness signals so the next editorial pass starts from evidence.
        </p>
        <p className="mt-4 text-sm text-slate-500 theme-dark:text-slate-400">
          Generated at {new Date(report.generatedAt).toLocaleString('en-US')}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="AI posts" value={report.summary.aiPosts} />
        <MetricCard
          label="Primary hub coverage"
          value={`${report.summary.primaryHubCoveragePercent}%`}
        />
        <MetricCard label="Missing images" value={report.summary.missingImageCount} />
        <MetricCard label="Body link gaps" value={report.summary.bodyInternalLinkCount} />
      </div>

      <section className="surface-panel px-6 py-7 md:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-kicker">Refresh queue</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
              Highest priority AI posts
            </h2>
          </div>
          <Link href="/topics" className="editorial-link">
            Review topic hubs
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {report.highPotentialRefreshQueue.map((item) => (
            <Link
              key={item.slug}
              href={`/blog/${item.slug}`}
              className="surface-card block px-5 py-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="meta-chip normal-case tracking-normal">
                  Score {item.score}
                </span>
                {item.primaryHub ? (
                  <span className="meta-chip normal-case tracking-normal">{item.primaryHub}</span>
                ) : null}
              </div>
              <h3 className="mt-3 text-xl font-semibold text-slate-950 theme-dark:text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
                {item.issueTypes.join(', ') || 'No issue type recorded'}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="surface-panel px-6 py-7 md:px-8">
        <p className="section-kicker">Open issues</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
          Latest audit findings
        </h2>

        <div className="mt-6 space-y-3">
          {topIssues.map((issue) => (
            <div
              key={`${issue.slug}-${issue.type}`}
              className="rounded-[1.25rem] border border-slate-200/80 bg-white/85 px-4 py-4 theme-dark:border-slate-800 theme-dark:bg-slate-950/70"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${severityStyles[issue.severity] || severityStyles.low}`}
                >
                  {issue.severity}
                </span>
                <span className="meta-chip normal-case tracking-normal">{issue.type}</span>
              </div>
              <div className="mt-3 text-sm font-semibold text-slate-950 theme-dark:text-slate-100">
                {issue.title}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600 theme-dark:text-slate-300">
                {issue.message}
              </p>
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}

function MetricCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="stat-pill">
      <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">{value}</span>
      <span>{label}</span>
    </div>
  )
}
