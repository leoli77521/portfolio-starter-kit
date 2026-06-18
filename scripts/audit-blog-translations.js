const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const {
  defaultLocale,
  locales,
} = require('../app/lib/i18n-paths')
const {
  getTranslatedPostSlugsForLocale,
  validatePostTranslations,
} = require('../app/lib/blog-i18n')
const {
  translatedPostSlugsByLocale,
} = require('../app/lib/blog-translation-manifest')

const nonDefaultLocales = locales.filter((locale) => locale !== defaultLocale)
const englishIndex = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'search-index.en.json'), 'utf8'))
const allPostSlugs = englishIndex.map((post) => post.slug).sort()

function readSearchIndex(locale) {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', `search-index.${locale}.json`), 'utf8'))
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
}

const report = validatePostTranslations(allPostSlugs)
assert.deepEqual(report.missing, [], 'translation audit must not report missing translations')
assert.deepEqual(report.stale, [], 'translation audit must not report stale translations')

console.log(`Translation audit passed for ${allPostSlugs.length} posts across ${nonDefaultLocales.length} locales.`)
