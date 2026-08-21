const fs = require('node:fs')
const path = require('node:path')

const ledgerPath = path.join(process.cwd(), 'data', 'benchmark-evidence-ledger.json')
const articlePath = path.join(process.cwd(), 'app', 'blog', 'posts', 'llm-coding-benchmark-comparison-2026.mdx')
const allowedSourceTypes = new Set([
  'vendor-report',
  'vendor-model-page',
  'vendor-model-card',
  'model-card',
  'third-party-leaderboard',
])
const editorialVerifiedStatuses = new Set([
  'verified-product-page',
  'verified-model-card',
  'verified-page-structure',
  'editorial-verified-qualified',
])

function audit() {
  const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'))
  const article = fs.readFileSync(articlePath, 'utf8')
  const errors = []
  const pending = []
  const ids = new Set()

  for (const row of ledger.rows) {
    if (ids.has(row.id)) errors.push(`duplicate row id: ${row.id}`)
    ids.add(row.id)
    for (const field of ['claim', 'modelVersion', 'benchmark', 'metric', 'sourceUrl', 'sourceType', 'testDate', 'scaffold', 'reproducibility', 'verificationStatus']) {
      if (row[field] === undefined || row[field] === '') errors.push(`${row.id} missing ${field}`)
    }
    if (row.value !== null && !row.sourceUrl) errors.push(`${row.id} has a numeric/value claim without a source URL`)
    if (!allowedSourceTypes.has(row.sourceType)) errors.push(`${row.id} has unsupported source type ${row.sourceType}`)
    if (!/^https:\/\//.test(row.sourceUrl)) errors.push(`${row.id} source URL must be HTTPS`)
    if (!editorialVerifiedStatuses.has(row.verificationStatus)) pending.push(row.id)
  }

  const unqualifiedPublicationBlockers = ledger.rows
    .filter((row) => row.reproducibility !== 'independently-reproduced')
    .map((row) => row.id)

  const numericClaims = (article.match(/\*\*\d+(?:\.\d+)?%\*\*/g) || []).length
  const report = {
    generatedAt: new Date().toISOString(),
    page: ledger.page,
    ledgerRows: ledger.rows.length,
    numericClaimsFoundInArticle: numericClaims,
    errors,
    editorialReviewPending: pending,
    readyForEditorialReview: errors.length === 0,
    readyForUnqualifiedPublication: errors.length === 0 && pending.length === 0 && unqualifiedPublicationBlockers.length === 0,
    unqualifiedPublicationBlockers,
    note: 'Editorial verification confirms the live source, date/context, version, metric, and caveat. It does not turn vendor or leaderboard results into independently reproduced benchmark data; publish those rows only with the recorded qualifications.',
  }

  console.log(JSON.stringify(report, null, 2))
  if (process.argv.includes('--strict') && (errors.length > 0 || pending.length > 0)) process.exitCode = 1
}

try {
  audit()
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}
