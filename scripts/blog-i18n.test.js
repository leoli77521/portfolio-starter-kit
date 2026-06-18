const assert = require('node:assert/strict')
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

test('translation audit reports fresh first-batch sources', () => {
  const report = validatePostTranslations(featuredTranslatedPostSlugs)
  assert.equal(report.missing.length, 0)
  assert.equal(report.stale.length, 0)
})

test('all published posts have translations for every non-default locale', () => {
  assert.equal(allPostSlugs.length, 44)

  for (const locale of nonDefaultLocales) {
    assert.deepEqual(getTranslatedPostSlugsForLocale(locale).sort(), allPostSlugs)
  }

  for (const slug of allPostSlugs) {
    assert.deepEqual(getAvailablePostLocales(slug), locales)
  }

  const report = validatePostTranslations(allPostSlugs)
  assert.equal(report.missing.length, 0)
  assert.equal(report.stale.length, 0)
})

test('middleware translation manifest matches translation files', () => {
  for (const locale of nonDefaultLocales) {
    assert.deepEqual(translatedPostSlugsByLocale[locale].slice().sort(), getTranslatedPostSlugsForLocale(locale).sort())

    for (const slug of allPostSlugs) {
      assert.equal(hasKnownPostTranslation(slug, locale), true)
    }
  }
})
