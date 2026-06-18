const fs = require('fs')
const path = require('path')
const {
  defaultLocale,
  isLocale,
  locales,
  localeLanguageTags,
  localizePath,
} = require('./i18n-paths')
const { translatedPostSlugsByLocale } = require('./blog-translation-manifest')

const blogPostsDirectory = path.join(process.cwd(), 'app', 'blog', 'posts')
const blogTranslationsDirectory = path.join(process.cwd(), 'app', 'blog', 'translations')

const featuredTranslatedPostSlugs = Object.freeze([...translatedPostSlugsByLocale.zh])

function createCleanSlug(filename) {
  const slug = filename.replace(/\.[^/.]+$/, '')
  const slugMappings = {
    SEO: 'seo-optimization-guide',
    'AI生成PPT': 'ai-generated-presentations',
    'AI-Revolution-Finance': 'ai-revolution-finance',
    'AI-Revolution-American-Workplaces': 'ai-revolution-american-workplaces',
  }

  if (slugMappings[slug]) {
    return slugMappings[slug]
  }

  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function normalizeSlug(value) {
  return String(value || '').trim()
}

function getSourcePostMap() {
  if (!fs.existsSync(blogPostsDirectory)) {
    return new Map()
  }

  return new Map(
    fs
      .readdirSync(blogPostsDirectory)
      .filter((file) => path.extname(file) === '.mdx')
      .map((file) => [createCleanSlug(file), path.join(blogPostsDirectory, file)])
  )
}

function getPostSourcePath(slug) {
  return getSourcePostMap().get(normalizeSlug(slug)) || path.join(blogPostsDirectory, `${normalizeSlug(slug)}.mdx`)
}

function getTranslationDirectory(locale) {
  return path.join(blogTranslationsDirectory, locale)
}

function getPostTranslationPath(slug, locale) {
  return path.join(getTranslationDirectory(locale), `${normalizeSlug(slug)}.mdx`)
}

function hasSourcePost(slug) {
  return getSourcePostMap().has(normalizeSlug(slug))
}

function hasPostTranslation(slug, locale) {
  if (!isLocale(locale) || locale === defaultLocale) {
    return false
  }

  return fs.existsSync(getPostTranslationPath(slug, locale))
}

function getTranslatedPostSlugsForLocale(locale) {
  if (!isLocale(locale) || locale === defaultLocale) {
    return []
  }

  const directory = getTranslationDirectory(locale)
  if (!fs.existsSync(directory)) {
    return []
  }

  return fs
    .readdirSync(directory)
    .filter((file) => path.extname(file) === '.mdx')
    .map((file) => path.basename(file, '.mdx'))
    .filter(hasSourcePost)
    .sort()
}

function getAvailablePostLocales(slug) {
  const safeSlug = normalizeSlug(slug)
  if (!safeSlug || !hasSourcePost(safeSlug)) {
    return []
  }

  return locales.filter((locale) => locale === defaultLocale || hasPostTranslation(safeSlug, locale))
}

function getArticlePath(slug, locale = defaultLocale) {
  const safeSlug = normalizeSlug(slug)
  const pathName = `/blog/${encodeURIComponent(safeSlug)}`

  if (locale === defaultLocale || !hasPostTranslation(safeSlug, locale)) {
    return pathName
  }

  return localizePath(pathName, locale)
}

function getArticleAlternates(slug) {
  const safeSlug = normalizeSlug(slug)
  const alternates = {}

  getAvailablePostLocales(safeSlug).forEach((locale) => {
    alternates[localeLanguageTags[locale]] = getArticlePath(safeSlug, locale)
  })

  alternates['x-default'] = getArticlePath(safeSlug, defaultLocale)
  return alternates
}

function getAbsoluteArticleAlternates(slug, baseUrl) {
  return Object.fromEntries(
    Object.entries(getArticleAlternates(slug)).map(([language, pathname]) => [
      language,
      `${baseUrl}${pathname === '/' ? '' : pathname}`,
    ])
  )
}

function parseFrontmatter(fileContent) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  const match = frontmatterRegex.exec(fileContent)

  if (!match) {
    return {}
  }

  const metadata = {}
  match[1]
    .trim()
    .split('\n')
    .forEach((line) => {
      const [key, ...valueParts] = line.split(': ')
      const trimmedKey = key.trim()

      if (!trimmedKey) {
        return
      }

      metadata[trimmedKey] = valueParts.join(': ').trim().replace(/^['"](.*)['"]$/, '$1')
    })

  return metadata
}

function readMetadata(filePath) {
  try {
    return parseFrontmatter(fs.readFileSync(filePath, 'utf8'))
  } catch {
    return {}
  }
}

function validatePostTranslations(slugs = featuredTranslatedPostSlugs) {
  const missing = []
  const stale = []
  const nonDefaultLocales = locales.filter((locale) => locale !== defaultLocale)

  slugs.forEach((slug) => {
    const sourceMetadata = readMetadata(getPostSourcePath(slug))
    const sourceUpdatedAt = sourceMetadata.updatedAt || sourceMetadata.publishedAt

    nonDefaultLocales.forEach((locale) => {
      if (!hasPostTranslation(slug, locale)) {
        missing.push({slug, locale})
        return
      }

      const translationMetadata = readMetadata(getPostTranslationPath(slug, locale))
      if (
        sourceUpdatedAt &&
        translationMetadata.sourceUpdatedAt &&
        translationMetadata.sourceUpdatedAt !== sourceUpdatedAt
      ) {
        stale.push({
          slug,
          locale,
          sourceUpdatedAt,
          translationSourceUpdatedAt: translationMetadata.sourceUpdatedAt,
        })
      }
    })
  })

  return {missing, stale}
}

module.exports = {
  blogPostsDirectory,
  blogTranslationsDirectory,
  featuredTranslatedPostSlugs,
  getArticleAlternates,
  getAbsoluteArticleAlternates,
  getArticlePath,
  getAvailablePostLocales,
  getPostSourcePath,
  getPostTranslationPath,
  getTranslatedPostSlugsForLocale,
  hasPostTranslation,
  validatePostTranslations,
}
