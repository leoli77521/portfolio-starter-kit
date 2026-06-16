const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const {test} = require('node:test')

const rootDirectory = process.cwd()
const sourceDirectories = [
  path.join(rootDirectory, 'app', 'blog', 'posts'),
  path.join(rootDirectory, 'app', 'blog', 'translations'),
]

const slugMappings = {
  SEO: 'seo-optimization-guide',
  'AI生成PPT': 'ai-generated-presentations',
  'AI-Revolution-Finance': 'ai-revolution-finance',
  'AI-Revolution-American-Workplaces': 'ai-revolution-american-workplaces',
}

const slugAliases = new Set(['seo'])

function createCleanSlug(filename) {
  const slug = filename.replace(/\.[^/.]+$/, '')

  if (slugMappings[slug]) {
    return slugMappings[slug]
  }

  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function collectMdxFiles(directory) {
  if (!fs.existsSync(directory)) {
    return []
  }

  return fs.readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      return collectMdxFiles(entryPath)
    }

    return entry.isFile() && path.extname(entry.name) === '.mdx' ? [entryPath] : []
  })
}

function getLineNumber(content, index) {
  return content.slice(0, index).split('\n').length
}

test('markdown links to blog posts point at existing slugs', () => {
  const sourceFiles = sourceDirectories.flatMap(collectMdxFiles)
  const knownSlugs = new Set(sourceFiles
    .filter((file) => file.includes(`${path.sep}posts${path.sep}`))
    .map((file) => createCleanSlug(path.basename(file))))

  slugAliases.forEach((slug) => knownSlugs.add(slug))

  const brokenLinks = []
  const blogLinkPattern = /(?<!!)\[[^\]]+\]\(\/blog\/([^)\s#?]+)[^)]*\)/g

  sourceFiles.forEach((file) => {
    const content = fs.readFileSync(file, 'utf8')

    for (const match of content.matchAll(blogLinkPattern)) {
      const slug = decodeURIComponent(match[1]).replace(/^\/+|\/+$/g, '')

      if (!knownSlugs.has(slug)) {
        brokenLinks.push(`${path.relative(rootDirectory, file)}:${getLineNumber(content, match.index)} -> /blog/${slug}`)
      }
    }
  })

  assert.deepEqual(brokenLinks, [])
})
