const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')

const storePath = path.join(process.cwd(), 'data', 'seo-monitoring.json')
const tokenUrl = 'https://oauth2.googleapis.com/token'
const searchAnalyticsUrl = 'https://searchconsole.googleapis.com/webmasters/v3/sites'

function base64Url(value) {
  return Buffer.from(value).toString('base64url')
}

function getServiceAccount() {
  const raw = process.env.GSC_SERVICE_ACCOUNT_JSON ||
    (process.env.GSC_SERVICE_ACCOUNT_FILE && fs.readFileSync(process.env.GSC_SERVICE_ACCOUNT_FILE, 'utf8'))
  if (!raw) throw new Error('Set GSC_SERVICE_ACCOUNT_JSON or GSC_SERVICE_ACCOUNT_FILE')
  return JSON.parse(raw)
}

async function getAccessToken(account) {
  const now = Math.floor(Date.now() / 1000)
  const unsigned = `${base64Url(JSON.stringify({alg: 'RS256', typ: 'JWT'}))}.${base64Url(JSON.stringify({
    iss: account.client_email,
    scope: 'https://www.googleapis.com/auth/webmasters.readonly',
    aud: tokenUrl,
    iat: now,
    exp: now + 3600,
  }))}`
  const signature = crypto.createSign('RSA-SHA256').update(unsigned).sign(account.private_key, 'base64url')
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${signature}`}),
  })
  if (!response.ok) throw new Error(`Google OAuth token request failed: ${response.status}`)
  return (await response.json()).access_token
}

async function queryWindow({token, siteUrl, startDate, endDate}) {
  const encodedSite = encodeURIComponent(siteUrl)
  const response = await fetch(`${searchAnalyticsUrl}/${encodedSite}/searchAnalytics/query`, {
    method: 'POST',
    headers: {authorization: `Bearer ${token}`, 'content-type': 'application/json'},
    body: JSON.stringify({startDate, endDate, dataState: 'final', rowLimit: 1}),
  })
  if (!response.ok) throw new Error(`GSC Search Analytics request failed for ${startDate}: ${response.status}`)
  const row = (await response.json()).rows?.[0] || {}
  return {
    clicks: row.clicks ?? null,
    impressions: row.impressions ?? null,
    ctr: row.ctr === undefined ? null : Number((row.ctr * 100).toFixed(2)),
    position: row.position ?? null,
  }
}

function dateOnly(date) {
  return date.toISOString().slice(0, 10)
}

function parseArgs() {
  return Object.fromEntries(process.argv.slice(2).map((arg) => {
    const index = arg.indexOf('=')
    return index === -1 ? [arg.replace(/^--/, ''), true] : [arg.slice(2, index), arg.slice(index + 1)]
  }))
}

async function main() {
  const args = parseArgs()
  const account = getServiceAccount()
  const token = await getAccessToken(account)
  const siteUrl = process.env.GSC_SITE_URL || 'sc-domain:tolearn.blog'
  const end = args.end || dateOnly(new Date(Date.now() - 86400000))
  const endDate = new Date(`${end}T00:00:00Z`)
  const gsc = {}

  for (const days of [7, 14, 28]) {
    const startDate = dateOnly(new Date(endDate.getTime() - (days - 1) * 86400000))
    gsc[`${days}d`] = await queryWindow({token, siteUrl, startDate, endDate: end})
  }

  const store = JSON.parse(fs.readFileSync(storePath, 'utf8'))
  const previous = store.snapshots.at(-1) || {}
  const snapshot = {
    capturedAt: new Date().toISOString(),
    source: 'google-search-console-api',
    periodEnd: end,
    gsc,
    aiSearch: previous.aiSearch || {"7d": {clicks: null, impressions: null}, "14d": {clicks: null, impressions: null}, "28d": {clicks: null, impressions: null}},
    indexCoverage: previous.indexCoverage || {indexedUrls: null, crawledNotIndexed: null},
    conversions: previous.conversions || {corePageConversions: null, source: 'not connected'},
  }
  const outputPath = args.output ? path.resolve(args.output) : path.join(process.cwd(), '.local', 'seo-metrics-snapshot.json')
  fs.mkdirSync(path.dirname(outputPath), {recursive: true})
  fs.writeFileSync(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`)
  console.log(`Wrote GSC snapshot to ${outputPath}`)
  if (args.record) {
    store.snapshots = [...store.snapshots, snapshot]
    store.updatedAt = snapshot.capturedAt
    fs.writeFileSync(storePath, `${JSON.stringify(store, null, 2)}\n`)
    console.log('Recorded snapshot in data/seo-monitoring.json')
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
