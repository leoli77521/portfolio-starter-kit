const fs = require('node:fs')
const path = require('node:path')

const rootDir = process.cwd()
const postsDir = path.join(rootDir, 'app', 'blog', 'posts')
const {getLegacyBlogRedirects, legacyBlogRedirects} = require('../app/lib/legacy-blog-redirects')
const {
  getTranslatedPostSlugsForLocale,
  isPostTranslationFresh,
  isPostTranslationReviewed,
} = require('../app/lib/blog-i18n')
const {locales, defaultLocale} = require('../app/lib/i18n-paths')
const auditAiSeo = require('./audit-ai-seo')
const indexingPolicy = require('../data/seo-indexing-decisions.json')

const slugMappings = {
  SEO: 'seo-optimization-guide',
  'AI生成PPT': 'ai-generated-presentations',
  'AI-Revolution-Finance': 'ai-revolution-finance',
  'AI-Revolution-American-Workplaces': 'ai-revolution-american-workplaces',
}

function createSlug(fileName) {
  const rawSlug = fileName.replace(/\.[^/.]+$/, '')
  if (slugMappings[rawSlug]) return slugMappings[rawSlug]
  return rawSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

function createTagSlug(tag) {
  return String(tag)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function readPosts() {
  return fs
    .readdirSync(postsDir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const source = fs.readFileSync(path.join(postsDir, file), 'utf8')
      const frontmatter = source.match(/^---\s*([\s\S]*?)\s*---/)
      const metadata = {}
      for (const line of (frontmatter?.[1] || '').split('\n')) {
        const separator = line.indexOf(': ')
        if (separator === -1) continue
        metadata[line.slice(0, separator).trim()] = line
          .slice(separator + 2)
          .trim()
          .replace(/^['"](.*)['"]$/, '$1')
      }
      const tagsLine = source.match(/^tags:\s*\[(.*)\]\s*$/m)?.[1] || ''
      const tags = tagsLine
        .split(',')
        .map((tag) => tag.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
      return {slug: createSlug(file), metadata, tags}
    })
}

function readInputUrls() {
  const defaultInputPaths = [
    path.join(rootDir, '.local', 'gsc-crawled-2026-08-21.json'),
    path.join(rootDir, '.local', 'gsc-redirect-errors-2026-08-21.json'),
  ].filter((inputPath) => fs.existsSync(inputPath))
  const inputPaths = process.argv.slice(2).map((inputPath) => path.resolve(inputPath))
  const resolvedInputPaths = inputPaths.length > 0 ? inputPaths : defaultInputPaths

  if (resolvedInputPaths.length === 0) {
    throw new Error(
      'No GSC URL export found. Pass one or more JSON files; empty indexing audits are not accepted.'
    )
  }

  const urls = resolvedInputPaths.flatMap((inputPath) => {
    if (!fs.existsSync(inputPath)) {
      throw new Error(`GSC input file does not exist: ${inputPath}`)
    }

    const parsed = JSON.parse(fs.readFileSync(inputPath, 'utf8'))
    const values = Array.isArray(parsed) ? parsed : parsed.urls
    if (!Array.isArray(values)) {
      throw new Error(`GSC input must be an array or an object with a urls array: ${inputPath}`)
    }

    return values.map((value) => (typeof value === 'string' ? value : value.url)).filter(Boolean)
  })

  return {
    sources: resolvedInputPaths.map((inputPath) => path.relative(rootDir, inputPath)),
    urls: [...new Set(urls)],
  }
}

const posts = readPosts()
const postBySlug = new Map(posts.map((post) => [post.slug, post]))
const tagCounts = posts.reduce((counts, post) => {
  for (const tag of post.tags) {
    const tagSlug = createTagSlug(tag)
    counts.set(tagSlug, (counts.get(tagSlug) || 0) + 1)
  }
  return counts
}, new Map())
const translatedCounts = Object.fromEntries(
  locales
    .filter((locale) => locale !== defaultLocale)
    .map((locale) => [locale, getTranslatedPostSlugsForLocale(locale).length])
)
const aiAudit = auditAiSeo.runAudit({rootDir})
const lowValueTagPattern = /^\/tags\/([^/]+)$/
const redirectSources = new Set(
  getLegacyBlogRedirects()
    .filter((redirect) => !redirect.source.includes(':'))
    .map((redirect) => redirect.source)
)
const reviewedDecisions = new Map(indexingPolicy.decisions.map((decision) => [decision.path, decision]))

function classify(rawUrl) {
  let pathname = rawUrl
  try {
    pathname = new URL(rawUrl, 'https://tolearn.blog').pathname
  } catch {
    pathname = rawUrl.split('?')[0]
  }
  pathname = pathname.replace(/\/$/, '') || '/'

  const reviewedDecision = reviewedDecisions.get(pathname)
  if (reviewedDecision) {
    return {
      url: rawUrl,
      decision: reviewedDecision.decision,
      target: reviewedDecision.target,
      reason: reviewedDecision.rationale,
      nextAction: reviewedDecision.nextAction,
    }
  }

  if (redirectSources.has(pathname) || /^\/(?:posts|articles|article)\//.test(pathname)) {
    const redirect = legacyBlogRedirects.find((item) => item.source === pathname)
    return {
      url: rawUrl,
      decision: 'redirect',
      target: redirect?.destination || '/blog',
      reason: 'Legacy URL has a permanent canonical destination.',
    }
  }

  const localizedArticleMatch = pathname.match(/^\/(zh|de|fr|th|pt)\/blog\/([^/]+)$/)
  if (localizedArticleMatch) {
    const [, locale, slug] = localizedArticleMatch
    const fresh = isPostTranslationFresh(slug, locale)
    const reviewed = isPostTranslationReviewed(slug, locale)
    return {
      url: rawUrl,
      decision: fresh && reviewed ? 'index' : fresh ? 'review' : 'noindex',
      target: fresh ? pathname : `/blog/${slug}`,
      reason: fresh && reviewed
        ? 'Translation is current and has completed human review.'
        : fresh
          ? 'Translation is current but remains out of localized sitemaps until human review is recorded.'
        : 'Translation is missing or stale; keep the page accessible but out of the index until reviewed.',
    }
  }

  const articleMatch = pathname.match(/^\/blog\/([^/]+)$/)
  if (articleMatch && postBySlug.has(articleMatch[1])) {
    return {url: rawUrl, decision: 'index', target: pathname, reason: 'English editorial article.'}
  }

  const tagMatch = pathname.match(lowValueTagPattern)
  if (tagMatch) {
    const tagSlug = tagMatch[1]
    const tagCount = tagCounts.get(tagSlug) || 0
    return {
      url: rawUrl,
      decision: tagCount >= 2 ? 'index' : 'noindex',
      target: pathname,
      reason: tagCount >= 2 ? 'Tag has enough supporting articles.' : 'Narrow tag archive is browsable but not indexable.',
    }
  }

  if (/^\/(?:search|seo-audit|og)(?:\/|$)/.test(pathname)) {
    return {url: rawUrl, decision: 'noindex', target: pathname, reason: 'Utility or internal audit route.'}
  }

  if (/^\/templates\/[^/]+\/[^/]+$/.test(pathname)) {
    return {
      url: rawUrl,
      decision: indexingPolicy.defaults.templateDetail,
      target: pathname,
      reason: 'Unlisted generated template combination defaults to noindex until it earns a reviewed search intent.',
    }
  }

  if (/^\/(?:zh|de|fr|th|pt)\/(?:blog|topics|guides|categories|tags)/.test(pathname)) {
    return {url: rawUrl, decision: 'review', target: pathname, reason: 'Localized collection route needs language-quality review.'}
  }

  if (/^\/(?:ai-models|ai-tools|ai-coding-agents|topics|guides|categories|blog)$/.test(pathname)) {
    return {url: rawUrl, decision: 'index', target: pathname, reason: 'Curated English directory or archive entry point.'}
  }

  return {url: rawUrl, decision: 'review', target: pathname, reason: 'URL is not covered by a deterministic repository policy.'}
}

const input = readInputUrls()
const inputUrls = input.urls
const classified = inputUrls.map(classify)
const counts = classified.reduce((acc, item) => {
  acc[item.decision] = (acc[item.decision] || 0) + 1
  return acc
}, {})

const report = {
  generatedAt: new Date().toISOString(),
  inputSources: input.sources,
  inputUrlCount: inputUrls.length,
  counts,
  translationCoverage: translatedCounts,
  aiContentAudit: aiAudit.summary,
  policy: {
    permanentRedirects: redirectSources.size,
    staleLocalizedArticles: locales
      .filter((locale) => locale !== defaultLocale)
      .flatMap((locale) =>
        getTranslatedPostSlugsForLocale(locale)
          .filter((slug) => !isPostTranslationFresh(slug, locale))
          .map((slug) => `/${locale}/blog/${slug}`)
      ).length,
    pendingLocalizedArticles: locales
      .filter((locale) => locale !== defaultLocale)
      .flatMap((locale) =>
        getTranslatedPostSlugsForLocale(locale)
          .filter((slug) => !isPostTranslationReviewed(slug, locale))
          .map((slug) => `/${locale}/blog/${slug}`)
      ).length,
    reviewedDecisionCount: indexingPolicy.decisions.length,
    unresolvedReviewCount: classified.filter((item) => item.decision === 'review').length,
  },
  urls: classified,
}

console.log(JSON.stringify(report, null, 2))
