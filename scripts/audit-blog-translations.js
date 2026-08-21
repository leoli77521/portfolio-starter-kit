const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const {defaultLocale, locales} = require('../app/lib/i18n-paths')
const {
  getPostSourcePath,
  getPostTranslationPath,
  getTranslatedPostSlugsForLocale,
  isPostTranslationFresh,
  validatePostTranslations,
} = require('../app/lib/blog-i18n')

const nonDefaultLocales = locales.filter((locale) => locale !== defaultLocale)
const strictMode = process.argv.includes('--strict')
const englishIndex = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'public', 'search-index.en.json'), 'utf8')
)
const allPostSlugs = englishIndex.map((post) => post.slug).sort()
const minimumContentLengthRatioByLocale = {zh: 0.25, de: 0.45, fr: 0.45, th: 0.45, pt: 0.45}
const scaffoldPhrasesByLocale = {
  zh: ['原文结构地图', '这篇中文译文围绕'],
  de: ['Struktur der Originalanalyse', 'Diese deutsche Fassung ordnet'],
  fr: ['Structure de l’article original', 'Cette version française présente'],
  th: ['โครงสร้างจากบทความต้นฉบับ', 'ฉบับภาษาไทยนี้สรุป'],
  pt: ['Mapa do artigo original', 'Esta versão em português do Brasil apresenta'],
}

function readSearchIndex(locale) {
  return JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public', `search-index.${locale}.json`), 'utf8')
  )
}

function readContentWithoutFrontmatter(filePath) {
  return fs.readFileSync(filePath, 'utf8').replace(/^---[\s\S]*?---/, '').trim()
}

const report = {}

for (const locale of nonDefaultLocales) {
  const translatedSlugs = getTranslatedPostSlugsForLocale(locale).sort()
  const missingSlugs = allPostSlugs.filter((slug) => !translatedSlugs.includes(slug))
  const extraSlugs = translatedSlugs.filter((slug) => !allPostSlugs.includes(slug))
  const index = readSearchIndex(locale)
  const entriesBySlug = new Map(index.map((entry) => [entry.slug, entry]))

  assert.equal(extraSlugs.length, 0, `${locale} contains translations for unknown posts`)
  assert.equal(index.length, allPostSlugs.length, `${locale} search index must include every English post`)

  for (const slug of allPostSlugs) {
    const entry = entriesBySlug.get(slug)
    assert.ok(entry, `${locale}/${slug} must exist in the search index`)
    assert.equal(entry.locale, locale, `${locale}/${slug} search entry must use localized locale`)
    assert.equal(
      entry.isTranslated,
      translatedSlugs.includes(slug) && isPostTranslationFresh(slug, locale),
      `${locale}/${slug} translation flag is wrong`
    )
    assert.ok(entry.title, `${locale}/${slug} search title must be present`)
    assert.ok(entry.summary, `${locale}/${slug} search summary must be present`)
    assert.ok(entry.content, `${locale}/${slug} search content must be present`)
  }

  for (const slug of translatedSlugs) {
    if (!isPostTranslationFresh(slug, locale)) {
      continue
    }

    const sourceContent = readContentWithoutFrontmatter(getPostSourcePath(slug))
    const translationContent = readContentWithoutFrontmatter(getPostTranslationPath(slug, locale))
    const contentRatio = translationContent.length / sourceContent.length
    const minimumContentLengthRatio = minimumContentLengthRatioByLocale[locale] || 0.45

    assert.ok(
      contentRatio >= minimumContentLengthRatio,
      `${locale}/${slug} translation looks incomplete (${contentRatio.toFixed(2)} of source length)`
    )

    for (const phrase of scaffoldPhrasesByLocale[locale] || []) {
      assert.equal(translationContent.includes(phrase), false, `${locale}/${slug} still contains scaffold copy`)
    }

    for (const hazard of [
      /<图片/,
      /className="[^"]*h-autorounded/,
      /className="[^"]*round-lg/,
      /Shadow-lg/,
      /<\d/,
      /987654321/,
      /XQZ/,
    ]) {
      assert.equal(hazard.test(translationContent), false, `${locale}/${slug} contains an MDX hazard`)
    }
  }

  const freshness = validatePostTranslations(translatedSlugs)
  const localeStale = freshness.stale.filter((item) => item.locale === locale)
  const localeMissing = freshness.missing.filter((item) => item.locale === locale)
  report[locale] = {
    translated: translatedSlugs.length,
    awaitingTranslation: missingSlugs.length,
    stale: localeStale.length,
    missing: localeMissing.length,
    staleSlugs: [...new Set(localeStale.map((item) => item.slug))],
  }
}

const awaitingTranslation = Object.values(report).reduce((sum, item) => sum + item.awaitingTranslation, 0)
const staleTranslations = Object.values(report).reduce((sum, item) => sum + item.stale, 0)
const missingFiles = Object.values(report).reduce((sum, item) => sum + item.missing, 0)

if (strictMode) {
  assert.equal(awaitingTranslation, 0, 'strict translation audit must not report untranslated posts')
  assert.equal(staleTranslations, 0, 'strict translation audit must not report stale translations')
  assert.equal(missingFiles, 0, 'strict translation audit must not report missing translation files')
}

console.log(
  `${strictMode ? 'Strict ' : ''}translation audit passed: ${allPostSlugs.length} English posts, ` +
    `${awaitingTranslation} locale copies awaiting translation, ${staleTranslations} stale locale copies.`
)
console.log(JSON.stringify(report, null, 2))
