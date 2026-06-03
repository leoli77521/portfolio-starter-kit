const fs = require('node:fs')
const path = require('node:path')

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

  if (!match) {
    return {
      content: raw,
      metadata: {},
    }
  }

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

  return {
    content: raw.replace(/^---[\s\S]*?---/, '').trim(),
    metadata,
  }
}

function parseTagCount(value) {
  if (!value) {
    return 0
  }

  const trimmed = String(value).trim()
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed.replace(/'/g, '"'))
      return Array.isArray(parsed) ? parsed.length : 0
    } catch {
      return trimmed
        .slice(1, -1)
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean).length
    }
  }

  return trimmed
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean).length
}

function getPosts(rootDir) {
  const postsDir = path.join(rootDir, 'app', 'blog', 'posts')

  return fs
    .readdirSync(postsDir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const parsed = parseFrontmatter(path.join(postsDir, file))
      const contentLinks = parsed.content.match(/\/(?:blog|topics|guides|categories|tags)\//g) || []

      return {
        ...parsed,
        file,
        slug: createSlug(file),
        internalLinkCount: contentLinks.length,
        tagCount: parseTagCount(parsed.metadata.tags),
        wordCount: parsed.content.split(/\s+/).filter(Boolean).length,
      }
    })
}

function buildIssue(type, severity, post, message) {
  return {
    type,
    severity,
    slug: post.slug,
    title: post.metadata.title || post.slug,
    message,
  }
}

function runAudit(options = {}) {
  const rootDir = options.rootDir || process.cwd()
  const clustersPath = path.join(rootDir, 'data', 'ai-topic-clusters.json')
  const clusters = JSON.parse(fs.readFileSync(clustersPath, 'utf8'))
  const hubSlugs = new Set(clusters.hubs.map((hub) => hub.slug))
  const posts = getPosts(rootDir)
  const aiPosts = posts.filter((post) => post.metadata.category === 'AI Technology')

  const issues = []

  for (const post of aiPosts) {
    const primaryHubSlug = clusters.primaryHubBySlug[post.slug]

    if (!primaryHubSlug) {
      issues.push(buildIssue('missing-primary-hub', 'high', post, 'No primary AI topic hub assigned.'))
    } else if (!hubSlugs.has(primaryHubSlug)) {
      issues.push(
        buildIssue(
          'unknown-primary-hub',
          'high',
          post,
          `Primary hub "${primaryHubSlug}" is not present in data/ai-topic-clusters.json.`
        )
      )
    }

    if (!post.metadata.image) {
      issues.push(buildIssue('missing-image', 'medium', post, 'No explicit frontmatter image.'))
    }

    if (post.tagCount < 3) {
      issues.push(buildIssue('weak-tags', 'medium', post, 'Fewer than 3 tags.'))
    }

    if (!post.metadata.summary || post.metadata.summary.length < 110) {
      issues.push(buildIssue('weak-summary', 'medium', post, 'Summary is missing or under 110 characters.'))
    }

    if (post.internalLinkCount < 2) {
      issues.push(
        buildIssue(
          'body-internal-links',
          'low',
          post,
          'Article body has fewer than 2 internal archive links; rendered hub links still provide fallback navigation.'
        )
      )
    }
  }

  const assignedAiPosts = aiPosts.filter((post) => clusters.primaryHubBySlug[post.slug]).length
  const primaryHubCoveragePercent =
    aiPosts.length === 0 ? 100 : Math.round((assignedAiPosts / aiPosts.length) * 100)

  const highPotentialRefreshQueue = aiPosts
    .map((post) => {
      const publishedAt = new Date(post.metadata.updatedAt || post.metadata.publishedAt)
      const ageDays = Number.isNaN(publishedAt.getTime())
        ? 0
        : Math.max(0, Math.round((Date.now() - publishedAt.getTime()) / (1000 * 60 * 60 * 24)))
      const postIssues = issues.filter((issue) => issue.slug === post.slug)
      const score =
        postIssues.filter((issue) => issue.severity === 'high').length * 10 +
        postIssues.filter((issue) => issue.severity === 'medium').length * 4 +
        postIssues.filter((issue) => issue.severity === 'low').length +
        Math.min(8, Math.floor(ageDays / 60))

      return {
        slug: post.slug,
        title: post.metadata.title || post.slug,
        primaryHub: clusters.primaryHubBySlug[post.slug] || null,
        score,
        ageDays,
        issueTypes: postIssues.map((issue) => issue.type),
      }
    })
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score || right.ageDays - left.ageDays)
    .slice(0, 12)

  const issuesByType = issues.reduce((acc, issue) => {
    acc[issue.type] = (acc[issue.type] || 0) + 1
    return acc
  }, {})

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      totalPosts: posts.length,
      aiPosts: aiPosts.length,
      assignedAiPosts,
      primaryHubCoveragePercent,
      missingImageCount: issuesByType['missing-image'] || 0,
      weakTagCount: issuesByType['weak-tags'] || 0,
      weakSummaryCount: issuesByType['weak-summary'] || 0,
      bodyInternalLinkCount: issuesByType['body-internal-links'] || 0,
    },
    issues,
    highPotentialRefreshQueue,
  }
}

module.exports = {
  runAudit,
}
