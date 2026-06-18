const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const {
  defaultLocale,
  locales,
} = require('../app/lib/i18n-paths')
const {
  getPostSourcePath,
  getPostTranslationPath,
  getTranslatedPostSlugsForLocale,
  validatePostTranslations,
} = require('../app/lib/blog-i18n')
const {
  translatedPostSlugsByLocale,
} = require('../app/lib/blog-translation-manifest')

const nonDefaultLocales = locales.filter((locale) => locale !== defaultLocale)
const englishIndex = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'search-index.en.json'), 'utf8'))
const allPostSlugs = englishIndex.map((post) => post.slug).sort()
const minimumContentLengthRatioByLocale = {
  zh: 0.25,
  de: 0.45,
  fr: 0.45,
  th: 0.45,
  pt: 0.45,
}
const scaffoldPhrasesByLocale = {
  zh: ['原文结构地图', '这篇中文译文围绕'],
  de: ['Struktur der Originalanalyse', 'Diese deutsche Fassung ordnet'],
  fr: ['Structure de l’article original', 'Cette version française présente'],
  th: ['โครงสร้างจากบทความต้นฉบับ', 'ฉบับภาษาไทยนี้สรุป'],
  pt: ['Mapa do artigo original', 'Esta versão em português do Brasil apresenta'],
}

function readSearchIndex(locale) {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', `search-index.${locale}.json`), 'utf8'))
}

function readContentWithoutFrontmatter(filePath) {
  return fs
    .readFileSync(filePath, 'utf8')
    .replace(/^---[\s\S]*?---/, '')
    .trim()
}

for (const locale of nonDefaultLocales) {
  const translatedSlugs = getTranslatedPostSlugsForLocale(locale).sort()
  assert.deepEqual(translatedSlugs, allPostSlugs, `${locale} translation files must cover every post`)
  assert.deepEqual(translatedPostSlugsByLocale[locale].slice().sort(), allPostSlugs, `${locale} manifest must cover every post`)

  const index = readSearchIndex(locale)
  assert.equal(index.length, allPostSlugs.length, `${locale} search index must include every post`)

  for (const entry of index) {
    assert.equal(entry.locale, locale, `${locale}/${entry.slug} search entry must use localized locale`)
    assert.equal(entry.isTranslated, true, `${locale}/${entry.slug} search entry must be marked translated`)
    assert.ok(entry.href.startsWith(`/${locale}/blog/`), `${locale}/${entry.slug} search href must be localized`)
    assert.ok(entry.title, `${locale}/${entry.slug} search title must be present`)
    assert.ok(entry.summary, `${locale}/${entry.slug} search summary must be present`)
    assert.ok(entry.content, `${locale}/${entry.slug} search content must be present`)
  }

  for (const slug of allPostSlugs) {
    const sourceContent = readContentWithoutFrontmatter(getPostSourcePath(slug))
    const translationContent = readContentWithoutFrontmatter(getPostTranslationPath(slug, locale))
    const contentRatio = translationContent.length / sourceContent.length
    const minimumContentLengthRatio = minimumContentLengthRatioByLocale[locale] || 0.45

    assert.ok(
      contentRatio >= minimumContentLengthRatio,
      `${locale}/${slug} translation looks incomplete (${contentRatio.toFixed(2)} of source length)`
    )

    for (const phrase of scaffoldPhrasesByLocale[locale] || []) {
      assert.equal(
        translationContent.includes(phrase),
        false,
        `${locale}/${slug} still contains scaffold copy: ${phrase}`
      )
    }

    const mdxHazards = [
      /<图片/,
      /className="[^"]*h-autorounded/,
      /className="[^"]*round-lg/,
      /Shadow-lg/,
      /<\d/,
      /987654321/,
      /XQZ/,
    ]

    for (const hazard of mdxHazards) {
      assert.equal(
        hazard.test(translationContent),
        false,
        `${locale}/${slug} contains MDX hazard matching ${hazard}`
      )
    }
  }
}

const report = validatePostTranslations(allPostSlugs)
assert.deepEqual(report.missing, [], 'translation audit must not report missing translations')
assert.deepEqual(report.stale, [], 'translation audit must not report stale translations')

console.log(`Translation audit passed for ${allPostSlugs.length} posts across ${nonDefaultLocales.length} locales.`)
