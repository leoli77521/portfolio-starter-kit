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

const translatedSlug = '2026-04-02-claw-code-ai-coding-agent-architecture'
const untranslatedSlug = '2025-08-15-ai-content-pipeline-seo'
const nonDefaultLocales = locales.filter((locale) => locale !== defaultLocale)

test('featured AI Coding Agent Stack posts have all first-batch translations', () => {
  assert.equal(featuredTranslatedPostSlugs.length, 5)

  for (const slug of featuredTranslatedPostSlugs) {
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
  assert.equal(getArticlePath(untranslatedSlug, 'zh'), `/blog/${untranslatedSlug}`)
})

test('available post locales and hreflang alternates reflect existing translation files', () => {
  assert.deepEqual(getAvailablePostLocales(translatedSlug), locales)
  assert.deepEqual(getAvailablePostLocales(untranslatedSlug), [defaultLocale])

  assert.deepEqual(getArticleAlternates(translatedSlug), {
    [localeLanguageTags.en]: `/blog/${translatedSlug}`,
    [localeLanguageTags.zh]: `/zh/blog/${translatedSlug}`,
    [localeLanguageTags.de]: `/de/blog/${translatedSlug}`,
    [localeLanguageTags.fr]: `/fr/blog/${translatedSlug}`,
    [localeLanguageTags.th]: `/th/blog/${translatedSlug}`,
    [localeLanguageTags.pt]: `/pt/blog/${translatedSlug}`,
    'x-default': `/blog/${translatedSlug}`,
  })

  assert.deepEqual(getArticleAlternates(untranslatedSlug), {
    [localeLanguageTags.en]: `/blog/${untranslatedSlug}`,
    'x-default': `/blog/${untranslatedSlug}`,
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
