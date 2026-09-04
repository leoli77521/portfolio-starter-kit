const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = process.cwd()
const focusPages = [
  {
    file: 'app/blog/posts/llm-coding-benchmark-comparison-2026.mdx',
    primaryKeyword: 'llm benchmark scores',
    expectedUpdatedAt: '2026-08-21',
  },
  {
    file: 'app/blog/posts/2026-04-02-claw-code-ai-coding-agent-architecture.mdx',
    primaryKeyword: 'claw code',
  },
  {
    file: 'app/blog/posts/ai-agent-tools-comparison-2026.mdx',
    primaryKeyword: 'ai agent tools comparison',
  },
  {
    file: 'app/blog/posts/ai-chatbot-detection-methods-2025.mdx',
    primaryKeyword: 'ai chatbot detection',
  },
  {
    file: 'app/blog/posts/SEO.mdx',
    primaryKeyword: 'seo optimization guide',
  },
  {
    file: 'app/blog/posts/mcp-model-context-protocol-guide.mdx',
    primaryKeyword: 'mcp protocol',
  },
  {
    file: 'app/blog/posts/2025-10-10-ai-search-rewriting-web-traffic-map.mdx',
    primaryKeyword: 'ai search seo',
  },
  {
    file: 'app/blog/posts/AI-Tools-SEO-Optimization.mdx',
    primaryKeyword: 'ai tools for seo',
  },
]

function parsePage(relativePath) {
  const source = fs.readFileSync(path.join(root, relativePath), 'utf8')
  const frontmatter = source.match(/^---\s*([\s\S]*?)\s*---/)
  assert.ok(frontmatter, `${relativePath} must have frontmatter`)

  const metadata = {}
  for (const line of frontmatter[1].trim().split('\n')) {
    const separator = line.indexOf(': ')
    if (separator === -1) continue

    const key = line.slice(0, separator)
    metadata[key] = line
      .slice(separator + 2)
      .trim()
      .replace(/^['"](.*)['"]$/, '$1')
  }

  return {
    metadata,
    content: source.replace(/^---[\s\S]*?---/, '').trim(),
  }
}

test('priority SEO pages have concise metadata, one rendered H1, and internal paths', () => {
  for (const page of focusPages) {
    const {metadata, content} = parsePage(page.file)
    const pageLabel = path.basename(page.file)

    assert.equal(metadata.updatedAt, page.expectedUpdatedAt || '2026-08-20', `${pageLabel} should record this content refresh`)
    assert.ok(metadata.image, `${pageLabel} should have an explicit social image`)
    assert.ok(metadata.seoTitle.length >= 30, `${pageLabel} SEO title should be descriptive`)
    assert.ok(metadata.seoTitle.length <= 45, `${pageLabel} SEO title must fit the site title template`)
    assert.ok(metadata.seoDescription.length >= 120, `${pageLabel} meta description is too short`)
    assert.ok(metadata.seoDescription.length <= 160, `${pageLabel} meta description is too long`)
    assert.ok(
      `${metadata.title} ${metadata.seoTitle} ${metadata.seoDescription}`
        .toLowerCase()
        .includes(page.primaryKeyword),
      `${pageLabel} must keep its mapped primary keyword in visible metadata`
    )
    assert.equal(/^#\s+/m.test(content), false, `${pageLabel} should rely on the page shell's single H1`)
    assert.ok(
      (content.match(/\]\(\/(?:blog|topics|guides|categories|tags)\//g) || []).length >= 2,
      `${pageLabel} should link to at least two related internal pages`
    )
  }
})

test('sitemap prioritizes English editorial canonicals while translations are reviewed', () => {
  const sitemap = fs.readFileSync(path.join(root, 'app/sitemap.ts'), 'utf8')

  assert.match(sitemap, /const INDEXABLE_SITEMAP_LOCALES = \[defaultLocale\]/)
  assert.match(sitemap, /const INCLUDE_TRANSLATED_ARTICLES_IN_SITEMAP = false/)
  assert.match(sitemap, /return INDEXABLE_SITEMAP_LOCALES\.map/)
})

test('high-opportunity SEO pages use the planned title and actionable performance evidence', () => {
  const topicHubs = fs.readFileSync(path.join(root, 'app/lib/topic-hubs.ts'), 'utf8')
  const guides = fs.readFileSync(path.join(root, 'app/lib/guides.ts'), 'utf8')
  const guidePage = fs.readFileSync(path.join(root, 'app/guides/[slug]/page.tsx'), 'utf8')

  assert.match(
    topicHubs,
    /seoTitle: 'SEO Fundamentals: Google SEO Basics Checklist \(2026\)'/
  )
  assert.match(guides, /metric: 'LCP'[\s\S]*target: '≤ 2\.5 seconds'/)
  assert.match(guides, /metric: 'INP'[\s\S]*target: '≤ 200 milliseconds'/)
  assert.match(guides, /Total Blocking Time: 1\.78 seconds/)
  assert.match(guides, /NEXT_PUBLIC_IN_ARTICLE_AD_SLOT|Load one reserved in-article ad/)
  assert.match(guidePage, /guide\.updatedAt \|\| '2026-08-20'/)
  assert.doesNotMatch(guidePage, /dateModified: new Date\(\)\.toISOString\(\)/)
})
