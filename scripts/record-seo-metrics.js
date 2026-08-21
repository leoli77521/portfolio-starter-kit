const fs = require('node:fs')
const path = require('node:path')

const storePath = path.join(process.cwd(), 'data', 'seo-monitoring.json')

function parseArgs() {
  const args = Object.fromEntries(
    process.argv.slice(2).map((arg) => {
      const separator = arg.indexOf('=')
      return separator === -1 ? [arg.replace(/^--/, ''), true] : [arg.slice(2, separator), arg.slice(separator + 1)]
    })
  )
  return args
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(filePath), 'utf8'))
}

function requireWindowMetrics(snapshot, group, windows) {
  for (const window of windows) {
    if (!snapshot[group] || !snapshot[group][window]) {
      throw new Error(`Snapshot is missing ${group}.${window}`)
    }
  }
}

function normalizeSnapshot(snapshot) {
  const normalized = {
    ...snapshot,
    capturedAt: snapshot.capturedAt || new Date().toISOString(),
    source: snapshot.source || 'import',
  }

  requireWindowMetrics(normalized, 'gsc', ['7d', '14d', '28d'])
  requireWindowMetrics(normalized, 'aiSearch', ['7d', '14d', '28d'])

  if (!normalized.indexCoverage || !normalized.conversions) {
    throw new Error('Snapshot must include indexCoverage and conversions')
  }

  return normalized
}

function main() {
  const args = parseArgs()
  if (!args.input) {
    throw new Error('Usage: node scripts/record-seo-metrics.js --input=path/to/snapshot.json')
  }

  const store = readJson(storePath)
  const snapshot = normalizeSnapshot(readJson(args.input))
  const duplicate = store.snapshots.find(
    (item) => item.capturedAt === snapshot.capturedAt && item.periodEnd === snapshot.periodEnd
  )

  if (duplicate) {
    throw new Error(`Snapshot already exists for ${snapshot.capturedAt} / ${snapshot.periodEnd}`)
  }

  store.snapshots = [...store.snapshots, snapshot].sort(
    (left, right) => new Date(left.capturedAt).getTime() - new Date(right.capturedAt).getTime()
  )
  store.updatedAt = snapshot.capturedAt
  fs.writeFileSync(storePath, `${JSON.stringify(store, null, 2)}\n`)
  console.log(`Recorded SEO metrics snapshot: ${snapshot.capturedAt}`)
}

try {
  main()
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}
