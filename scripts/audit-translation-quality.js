const fs = require('node:fs')
const path = require('node:path')

const {defaultLocale, locales} = require('../app/lib/i18n-paths')
const {getPostSourcePath, getPostTranslationPath, getTranslatedPostSlugsForLocale} = require('../app/lib/blog-i18n')

const ratioMinimums = {zh: 0.25, de: 0.45, fr: 0.45, th: 0.45, pt: 0.45}
const languageSignals = {
  zh: /[\u4e00-\u9fff]/,
  th: /[\u0e00-\u0e7f]/,
  de: /\b(?:der|die|das|und|ist|für|mit|von)\b/i,
  fr: /\b(?:le|la|les|des|une|avec|pour|est)\b/i,
  pt: /\b(?:de|para|uma|que|com|não|está)\b/i,
}

function parseFrontmatter(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8')
  const match = raw.match(/^---\s*([\s\S]*?)\s*---/)
  const metadata = {}
  for (const line of (match?.[1] || '').split('\n')) {
    const separator = line.indexOf(': ')
    if (separator >= 0) {
      const key = line.slice(0, separator).trim()
      const value = line.slice(separator + 2).trim().replace(/^(['"])(.*)\1$/, '$2')
      metadata[key] = value
    }
  }
  return {metadata, content: raw.replace(/^---[\s\S]*?---/, '').trim()}
}

function audit() {
  const failures = []
  let checked = 0

  for (const locale of locales.filter((value) => value !== defaultLocale)) {
    for (const slug of getTranslatedPostSlugsForLocale(locale)) {
      const source = parseFrontmatter(getPostSourcePath(slug))
      const translation = parseFrontmatter(getPostTranslationPath(slug, locale))
      const ratio = translation.content.length / Math.max(1, source.content.length)
      const urls = source.content.match(/https?:\/\/[^\s)\]]+/g) || []
      const missingUrls = urls.filter((url) => !translation.content.includes(url))
      const brokenMarkdownLinks = translation.content.match(/\]\s+\(/g) || []
      const issues = []
      checked += 1

      if (!fs.existsSync(getPostSourcePath(slug))) issues.push('unknown source slug')
      if (ratio < (ratioMinimums[locale] || 0.45)) issues.push(`short content ratio ${ratio.toFixed(2)}`)
      if (source.metadata.updatedAt && translation.metadata.sourceUpdatedAt !== source.metadata.updatedAt) issues.push('sourceUpdatedAt mismatch')
      if (missingUrls.length > 0) issues.push(`missing ${missingUrls.length} source URL(s)`)
      if (brokenMarkdownLinks.length > 0) issues.push(`broken Markdown link spacing in ${brokenMarkdownLinks.length} link(s)`)
      if (languageSignals[locale] && !languageSignals[locale].test(translation.content)) issues.push('weak target-language signal')
      for (const hazard of [/987654321/, /XQZ/, /className="[^\"]*h-autorounded/, /<图片/]) {
        if (hazard.test(translation.content)) issues.push(`translation hazard ${hazard}`)
      }

      if (issues.length > 0) failures.push({locale, slug, issues})
    }
  }

  const report = {
    generatedAt: new Date().toISOString(),
    checked,
    automatedFailures: failures.length,
    automatedPasses: checked - failures.length,
    humanReviewRequired: checked,
    humanReviewNote: 'Automated checks cover freshness, completeness, URL preservation, Markdown link syntax, hazards, and coarse language signals. They do not replace native-speaker review of tone, terminology, or factual nuance.',
    failures,
  }
  console.log(JSON.stringify(report, null, 2))
  if (process.argv.includes('--strict') && failures.length > 0) process.exitCode = 1
}

audit()
