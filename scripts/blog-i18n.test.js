const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const {test} = require('node:test')

const {
  defaultLocale,
  locales,
  localeLanguageTags,
} = require('../app/lib/i18n-paths')
const {
  featuredTranslatedPostSlugs,
  getArticleAlternates,
  getArticlePath,
  getAvailablePostLocales,
  getTranslatedPostSlugsForLocale,
  hasPostTranslation,
  validatePostTranslations,
} = require('../app/lib/blog-i18n')
const {
  hasKnownPostTranslation,
  translatedPostSlugsByLocale,
} = require('../app/lib/blog-translation-manifest')

const translatedSlug = '2026-04-02-claw-code-ai-coding-agent-architecture'
const missingSlug = 'not-a-real-post'
const nonDefaultLocales = locales.filter((locale) => locale !== defaultLocale)
const allPostSlugs = require('../public/search-index.en.json').map((post) => post.slug).sort()
const sitemapSource = fs.readFileSync(path.join(process.cwd(), 'app', 'sitemap.ts'), 'utf8')
const translatedArticlesAreInSitemap = /const INCLUDE_TRANSLATED_ARTICLES_IN_SITEMAP = true/.test(sitemapSource)
const firstBatchSlugs = [
  '2026-04-02-claw-code-ai-coding-agent-architecture',
  '2026-04-02-rust-python-ai-agent-runtime-architecture',
  '2026-04-02-tooling-permissions-mcp-coding-agents',
  '2026-04-02-hooks-plugins-sessions-ai-agents',
  '2026-04-02-clean-room-rewrites-parity-audits-ai-agents',
]

test('featured AI Coding Agent Stack posts have all first-batch translations', () => {
  assert.ok(featuredTranslatedPostSlugs.length >= firstBatchSlugs.length)

  for (const slug of firstBatchSlugs) {
    assert.ok(featuredTranslatedPostSlugs.includes(slug), `${slug} should remain in the translated slug list`)
    for (const locale of nonDefaultLocales) {
      assert.equal(
        hasPostTranslation(slug, locale),
        true,
        `${slug} should have a ${locale} translation`
      )
    }
  }
})

test('article paths localize only when a real translation exists', () => {
  assert.equal(getArticlePath(translatedSlug, 'en'), `/blog/${translatedSlug}`)
  assert.equal(getArticlePath(translatedSlug, 'zh'), `/zh/blog/${translatedSlug}`)
  assert.equal(getArticlePath(translatedSlug, 'pt'), `/pt/blog/${translatedSlug}`)
  assert.equal(getArticlePath(missingSlug, 'zh'), `/blog/${missingSlug}`)
})

test('available post locales and hreflang alternates reflect existing translation files', () => {
  assert.deepEqual(getAvailablePostLocales(translatedSlug), locales)
  assert.deepEqual(getAvailablePostLocales(missingSlug), [])

  assert.deepEqual(getArticleAlternates(translatedSlug), {
    [localeLanguageTags.en]: `/blog/${translatedSlug}`,
    [localeLanguageTags.zh]: `/zh/blog/${translatedSlug}`,
    [localeLanguageTags.de]: `/de/blog/${translatedSlug}`,
    [localeLanguageTags.fr]: `/fr/blog/${translatedSlug}`,
    [localeLanguageTags.th]: `/th/blog/${translatedSlug}`,
    [localeLanguageTags.pt]: `/pt/blog/${translatedSlug}`,
    'x-default': `/blog/${translatedSlug}`,
  })

  assert.deepEqual(getArticleAlternates(missingSlug), {
    'x-default': `/blog/${missingSlug}`,
  })
})

test('localized static params are generated from real translation files', () => {
  for (const locale of nonDefaultLocales) {
    assert.deepEqual(getTranslatedPostSlugsForLocale(locale).sort(), featuredTranslatedPostSlugs.slice().sort())
  }
})

test('translation freshness is required before translated articles are returned to the sitemap', () => {
  const report = validatePostTranslations(featuredTranslatedPostSlugs)
  assert.equal(report.missing.length, 0)

  if (translatedArticlesAreInSitemap) {
    assert.equal(report.stale.length, 0)
  } else {
    assert.ok(Array.isArray(report.stale))
  }
})

test('translation manifests match available files while English-first pages may await translation', () => {
  assert.ok(allPostSlugs.length > 0)

  for (const locale of nonDefaultLocales) {
    const translatedSlugs = getTranslatedPostSlugsForLocale(locale).sort()
    assert.deepEqual(translatedSlugs, translatedPostSlugsByLocale[locale].slice().sort())

    for (const slug of translatedSlugs) {
      assert.deepEqual(getAvailablePostLocales(slug), locales)
    }

    const report = validatePostTranslations(translatedSlugs)
    assert.equal(report.missing.length, 0)

    if (translatedArticlesAreInSitemap) {
      assert.equal(report.stale.length, 0)
    }
  }

  const untranslatedSlugs = allPostSlugs.filter((slug) => !hasPostTranslation(slug, nonDefaultLocales[0]))
  for (const slug of untranslatedSlugs) {
    assert.deepEqual(getAvailablePostLocales(slug), [defaultLocale])
  }
})

test('middleware translation manifest matches translation files', () => {
  for (const locale of nonDefaultLocales) {
    assert.deepEqual(translatedPostSlugsByLocale[locale].slice().sort(), getTranslatedPostSlugsForLocale(locale).sort())

    for (const slug of getTranslatedPostSlugsForLocale(locale)) {
      assert.equal(hasKnownPostTranslation(slug, locale), true)
    }
  }
})
