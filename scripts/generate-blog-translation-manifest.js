const fs = require('node:fs')
const path = require('node:path')
const {defaultLocale, locales} = require('../app/lib/i18n-paths')

const postsDirectory = path.join(process.cwd(), 'app', 'blog', 'posts')
const translationsDirectory = path.join(process.cwd(), 'app', 'blog', 'translations')
const manifestPath = path.join(process.cwd(), 'app', 'lib', 'blog-translation-manifest.js')

function getMdxSlugs(directory) {
  if (!fs.existsSync(directory)) {
    return []
  }

  return fs
    .readdirSync(directory)
    .filter((file) => path.extname(file) === '.mdx')
    .map((file) => path.basename(file, '.mdx'))
    .sort()
}

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

function buildManifest() {
  const sourceSlugs = new Set(getMdxSlugs(postsDirectory).map(createCleanSlug))

  return Object.fromEntries(
    locales
      .filter((locale) => locale !== defaultLocale)
      .map((locale) => {
        const localeDirectory = path.join(translationsDirectory, locale)
        const slugs = getMdxSlugs(localeDirectory).filter((slug) => sourceSlugs.has(slug))
        return [locale, slugs]
      })
  )
}

function formatManifest(manifest) {
  const localeBlocks = Object.entries(manifest)
    .map(([locale, slugs]) => {
      const entries = slugs.map((slug) => `    '${slug}',`).join('\n')
      return `  ${locale}: Object.freeze([\n${entries}\n  ]),`
    })
    .join('\n')

  return `const translatedPostSlugsByLocale = Object.freeze({\n${localeBlocks}\n})\n\nfunction hasKnownPostTranslation(slug, locale) {\n  return Boolean(translatedPostSlugsByLocale[locale]?.includes(String(slug || '').trim()))\n}\n\nmodule.exports = {\n  hasKnownPostTranslation,\n  translatedPostSlugsByLocale,\n}\n`
}

const manifest = buildManifest()
fs.writeFileSync(manifestPath, formatManifest(manifest))
console.log(
  `Generated blog translation manifest for ${Object.entries(manifest)
    .map(([locale, slugs]) => `${locale}:${slugs.length}`)
    .join(', ')}.`
)
