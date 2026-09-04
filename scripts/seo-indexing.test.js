const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = process.cwd()

test('legacy SEO targets use permanent redirects without a topic-hub loop', () => {
  const {getLegacyBlogRedirects} = require('../app/lib/legacy-blog-redirects')
  const redirects = getLegacyBlogRedirects()
  const topicRedirect = redirects.find((redirect) => redirect.source === '/topics/ai-model-comparisons')
  const localizedTopicRedirect = redirects.find((redirect) =>
    redirect.source.includes(':locale') && redirect.source.endsWith('/topics/ai-model-comparisons')
  )

  assert.deepEqual(topicRedirect, {
    source: '/topics/ai-model-comparisons',
    destination: '/ai-models',
    permanent: true,
  })
  assert.deepEqual(localizedTopicRedirect, {
    source: '/:locale(zh|de|fr|th|pt)/topics/ai-model-comparisons',
    destination: '/ai-models',
    permanent: true,
  })
  assert.ok(
    redirects.some((redirect) => redirect.source === '/blog/claude-ai-now-executes-code.html'),
    'deleted article extension aliases should redirect directly'
  )
  assert.ok(redirects.every((redirect) => redirect.permanent === true))
})

test('language sitemap and freshness policy are wired into the production surface', () => {
  const routePath = path.join(root, 'app', 'lib', 'localized-sitemap.ts')
  const route = fs.readFileSync(routePath, 'utf8')
  const robots = fs.readFileSync(path.join(root, 'app', 'robots.ts'), 'utf8')
  const i18n = fs.readFileSync(path.join(root, 'app', 'lib', 'blog-i18n.js'), 'utf8')

  assert.match(route, /getBlogPosts\(locale\)/)
  assert.match(route, /post\.isTranslated/)
  assert.match(route, /isPostTranslationReviewed/)
  assert.doesNotMatch(route, /new Date\(\)\.toISOString\(\)/)
  assert.ok(fs.existsSync(path.join(root, 'app', 'sitemap', 'zh.xml', 'route.ts')))
  assert.match(robots, /sitemap\/\$\{locale\}\.xml/)
  assert.match(i18n, /isPostTranslationFresh/)
  assert.match(i18n, /isPostTranslationReviewed/)
})

test('AI authority audit is closed for images, tags, body links, and hub assignments', () => {
  const audit = require('./audit-ai-seo.js').runAudit({rootDir: root})
  assert.equal(audit.summary.primaryHubCoveragePercent, 100)
  assert.equal(audit.summary.missingImageCount, 0)
  assert.equal(audit.summary.weakTagCount, 0)
  assert.equal(audit.summary.bodyInternalLinkCount, 0)
})

test('GSC review URLs are backed by deterministic decisions and sitemap exclusions', () => {
  const policy = require('../data/seo-indexing-decisions.json')
  const paths = policy.decisions.map((decision) => decision.path)
  const counts = policy.decisions.reduce((result, decision) => {
    result[decision.decision] = (result[decision.decision] || 0) + 1
    return result
  }, {})
  const sitemap = fs.readFileSync(path.join(root, 'app', 'sitemap.ts'), 'utf8')
  const template = fs.readFileSync(path.join(root, 'app', 'templates', '[tech]', '[role]', 'page.tsx'), 'utf8')
  const rss = fs.readFileSync(path.join(root, 'app', 'rss', 'route.ts'), 'utf8')

  assert.equal(new Set(paths).size, paths.length)
  assert.deepEqual(counts, {index: 12, noindex: 9})
  assert.match(sitemap, /shouldIndexTemplate/)
  assert.match(template, /getTemplateSeoDecision/)
  assert.match(rss, /X-Robots-Tag.*noindex/)
  assert.match(sitemap, /REDIRECTED_TOPIC_HUB_SLUGS/)
  assert.match(sitemap, /formatDateForSitemap\(guide\.updatedAt\)/)
  assert.doesNotMatch(sitemap, /statSync/)
})

test('indexing audit requires real GSC URL exports and reports their sources', () => {
  const audit = fs.readFileSync(path.join(root, 'scripts', 'audit-indexing-candidates.js'), 'utf8')

  assert.match(audit, /gsc-crawled-2026-08-21\.json/)
  assert.match(audit, /gsc-redirect-errors-2026-08-21\.json/)
  assert.match(audit, /empty indexing audits are not accepted/)
  assert.match(audit, /inputSources/)
  assert.doesNotMatch(audit, /if \(!inputPath\) return \[\]/)
})
