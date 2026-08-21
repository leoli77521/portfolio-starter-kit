const fs = require('node:fs')
const path = require('node:path')

const storePath = path.join(process.cwd(), 'data', 'seo-monitoring.json')
const requiredPaths = [
  ['gsc', 'clicks'],
  ['gsc', 'impressions'],
  ['gsc', 'ctr'],
  ['aiSearch', 'impressions'],
  ['aiSearch', 'clicks'],
]
const windows = ['7d', '14d', '28d']

function getPath(object, pathParts) {
  return pathParts.reduce((value, key) => value?.[key], object)
}

function audit() {
  const store = JSON.parse(fs.readFileSync(storePath, 'utf8'))
  const latest = store.snapshots.at(-1)
  if (!latest) {
    throw new Error('SEO metrics store has no snapshots')
  }

  const missing = []
  for (const window of windows) {
    for (const pathParts of requiredPaths) {
      if (getPath(latest, [pathParts[0], window, pathParts[1]]) === null || getPath(latest, [pathParts[0], window, pathParts[1]]) === undefined) {
        missing.push(`${pathParts[0]}.${window}.${pathParts[1]}`)
      }
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    latestCapturedAt: latest.capturedAt,
    snapshotCount: store.snapshots.length,
    missing,
    readyForDashboard: true,
    readyForDecisionMaking: missing.length === 0,
    notes: missing.length
      ? 'Dashboard is valid, but missing values are intentionally shown as pending until an authenticated GSC/AI-search export is imported.'
      : 'All required performance fields are populated for the latest snapshot.',
  }

  console.log(JSON.stringify(report, null, 2))
  if (process.argv.includes('--strict') && missing.length > 0) {
    process.exitCode = 1
  }
}

try {
  audit()
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}
