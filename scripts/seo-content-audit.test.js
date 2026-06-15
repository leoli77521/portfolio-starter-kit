const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = process.cwd()
const postsDir = path.join(root, 'app', 'blog', 'posts')
const clustersPath = path.join(root, 'data', 'ai-topic-clusters.json')

const slugMappings = {
  SEO: 'seo-optimization-guide',
  'AI生成PPT': 'ai-generated-presentations',
  'AI-Revolution-Finance': 'ai-revolution-finance',
  'AI-Revolution-American-Workplaces': 'ai-revolution-american-workplaces',
}

function createSlug(fileName) {
  const rawSlug = fileName.replace(/\.[^/.]+$/, '')

  if (slugMappings[rawSlug]) {
    return slugMappings[rawSlug]
  }

  return rawSlug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function parseFrontmatter(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8')
  const match = /^---\s*([\s\S]*?)\s*---/.exec(raw)
  assert.ok(match, `${filePath} must have frontmatter`)

  const metadata = {}
  for (const line of match[1].trim().split('\n')) {
    const separatorIndex = line.indexOf(': ')
    if (separatorIndex === -1) continue

    const key = line.slice(0, separatorIndex).trim()
    const value = line
      .slice(separatorIndex + 2)
      .trim()
      .replace(/^['"](.*)['"]$/, '$1')
    metadata[key] = value
  }

  const content = raw.replace(/^---[\s\S]*?---/, '').trim()
  return { metadata, content }
}

function getPosts() {
  return fs
    .readdirSync(postsDir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const parsed = parseFrontmatter(path.join(postsDir, file))
      return {
        ...parsed,
        file,
        slug: createSlug(file),
      }
    })
}

function loadClusters() {
  assert.ok(fs.existsSync(clustersPath), 'data/ai-topic-clusters.json should exist')
  return JSON.parse(fs.readFileSync(clustersPath, 'utf8'))
}

test('AI topic cluster data covers every AI Technology article with one primary hub', () => {
  const clusters = loadClusters()
  const hubSlugs = new Set(clusters.hubs.map((hub) => hub.slug))
  const requiredHubs = [
    'ai-coding-agent-stack',
    'ai-tools-for-developers',
    'ai-model-comparisons',
    'ai-search-geo',
    'enterprise-ai-governance',
  ]

  for (const slug of requiredHubs) {
    assert.ok(hubSlugs.has(slug), `missing AI hub: ${slug}`)
  }

  const assignments = clusters.primaryHubBySlug
  const aiPosts = getPosts().filter((post) => post.metadata.category === 'AI Technology')
  const missingAssignments = aiPosts
    .filter((post) => !assignments[post.slug])
    .map((post) => post.slug)

  assert.deepEqual(missingAssignments, [])

  for (const post of aiPosts) {
    assert.ok(
      hubSlugs.has(assignments[post.slug]),
      `${post.slug} points to an unknown hub: ${assignments[post.slug]}`
    )
  }
})

test('SEO audit script reports the core AI authority checks', () => {
  const auditScript = path.join(root, 'scripts', 'audit-ai-seo.js')
  assert.ok(fs.existsSync(auditScript), 'scripts/audit-ai-seo.js should exist')

  const audit = require(auditScript)
  assert.equal(typeof audit.runAudit, 'function')

  const report = audit.runAudit({ rootDir: root })
  assert.equal(report.summary.aiPosts, 37)
  assert.ok(report.summary.primaryHubCoveragePercent >= 100)
  assert.ok(Array.isArray(report.issues))
  assert.ok(Array.isArray(report.highPotentialRefreshQueue))
})

test('top AI authority posts have explicit share images', () => {
  const postsBySlug = new Map(getPosts().map((post) => [post.slug, post]))
  const pillarSlugs = [
    '2026-04-02-claw-code-ai-coding-agent-architecture',
    'ai-agent-tools-comparison-2026',
    'llm-coding-benchmark-comparison-2026',
    '2026-03-15-microsoft-agent-365-control-plane',
    'ai-search-vs-traditional-search-reliability',
  ]

  const missingImages = pillarSlugs.filter((slug) => !postsBySlug.get(slug)?.metadata.image)
  assert.deepEqual(missingImages, [])
})

test('AI directory pages exist for the main editorial entry points', () => {
  const directories = [
    'app/ai-coding-agents/page.tsx',
    'app/ai-tools/page.tsx',
    'app/ai-models/page.tsx',
  ]

  for (const directoryPage of directories) {
    assert.ok(fs.existsSync(path.join(root, directoryPage)), `${directoryPage} should exist`)
  }
})
