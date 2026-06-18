const crypto = require('node:crypto')
const fs = require('node:fs')
const https = require('node:https')
const path = require('node:path')

const {
  defaultLocale,
  locales,
} = require('../app/lib/i18n-paths')
const {
  blogPostsDirectory,
  getPostSourcePath,
  getPostTranslationPath,
} = require('../app/lib/blog-i18n')

const targetLanguageCodes = {
  zh: 'zh-CN',
  de: 'de',
  fr: 'fr',
  th: 'th',
  pt: 'pt',
}

const translatedAt = process.env.TRANSLATED_AT || new Date().toISOString().slice(0, 10)
const nonDefaultLocales = locales.filter((locale) => locale !== defaultLocale)
const cachePath = path.join(process.cwd(), '.local', 'translation-cache.google.json')
const maxChunkLength = Number(process.env.TRANSLATE_MAX_CHUNK || 1200)
const maxConcurrentRequests = Number(process.env.TRANSLATE_CONCURRENCY || 6)

let activeRequests = 0
const waitQueue = []
const inFlight = new Map()
const cache = loadCache()

function loadCache() {
  try {
    return JSON.parse(fs.readFileSync(cachePath, 'utf8'))
  } catch {
    return {}
  }
}

function saveCache() {
  fs.mkdirSync(path.dirname(cachePath), {recursive: true})
  fs.writeFileSync(cachePath, JSON.stringify(cache))
}

function withLimit(task) {
  return new Promise((resolve, reject) => {
    const run = async () => {
      activeRequests += 1
      try {
        resolve(await task())
      } catch (error) {
        reject(error)
      } finally {
        activeRequests -= 1
        const next = waitQueue.shift()
        if (next) {
          next()
        }
      }
    }

    if (activeRequests < maxConcurrentRequests) {
      run()
    } else {
      waitQueue.push(run)
    }
  })
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

function parseFrontmatter(fileContent) {
  const match = /^---\s*([\s\S]*?)\s*---/.exec(fileContent)
  if (!match) {
    throw new Error('Missing frontmatter block')
  }

  const frontmatter = {}
  for (const line of match[1].trim().split('\n')) {
    const [key, ...valueParts] = line.split(': ')
    const trimmedKey = key.trim()
    if (!trimmedKey) {
      continue
    }

    const rawValue = valueParts.join(': ').trim()
    frontmatter[trimmedKey] = parseFrontmatterValue(rawValue)
  }

  return {
    metadata: frontmatter,
    content: fileContent.slice(match[0].length).trim(),
  }
}

function parseFrontmatterValue(value) {
  if (!value) {
    return ''
  }

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1)
  }

  if (value.startsWith('[') || value.startsWith('{')) {
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  }

  return value
}

function stringifyFrontmatterValue(value) {
  if (Array.isArray(value) || (value && typeof value === 'object')) {
    return JSON.stringify(value)
  }

  return JSON.stringify(String(value || ''))
}

function splitLongText(text) {
  if (text.length <= maxChunkLength) {
    return [text]
  }

  const parts = []
  let remaining = text

  while (remaining.length > maxChunkLength) {
    let splitAt = remaining.lastIndexOf('. ', maxChunkLength)
    if (splitAt < maxChunkLength * 0.45) {
      splitAt = remaining.lastIndexOf(' ', maxChunkLength)
    }
    if (splitAt < maxChunkLength * 0.45) {
      splitAt = maxChunkLength
    }

    parts.push(remaining.slice(0, splitAt + 1).trim())
    remaining = remaining.slice(splitAt + 1).trim()
  }

  if (remaining) {
    parts.push(remaining)
  }

  return parts
}

function shouldTranslate(text) {
  return /[A-Za-z]/.test(text)
}

function protectInlineSyntax(text) {
  const values = []
  let protectedText = text

  const addToken = (value) => {
    const token = `987654321${String(values.length).padStart(4, '0')}123456789`
    values.push({token, value})
    return token
  }

  const patterns = [
    /`[^`\n]+`/g,
    /https?:\/\/[^\s)\]]+/g,
    /\/(?:blog|topics|guides|tags|categories|solutions|templates|about|contact|privacy|terms|search)[^\s)\]]*/g,
    /<[^>\n]+>/g,
    /\{[^}\n]+\}/g,
  ]

  for (const pattern of patterns) {
    protectedText = protectedText.replace(pattern, addToken)
  }

  return {protectedText, values}
}

function restoreInlineSyntax(text, values) {
  let restored = text

  for (const {token, value} of values) {
    const tokenPattern = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    restored = restored.replace(new RegExp(tokenPattern, 'gi'), value)
  }

  return restored
}

function createCacheKey(locale, text) {
  return crypto
    .createHash('sha1')
    .update(`${locale}\0${text}`)
    .digest('hex')
}

async function translateText(text, locale) {
  if (!shouldTranslate(text)) {
    return text
  }

  if (text.length > maxChunkLength) {
    const chunks = splitLongText(text)
    const translatedChunks = []
    for (const chunk of chunks) {
      translatedChunks.push(await translateText(chunk, locale))
    }
    return escapeMdxComparisons(translatedChunks.join(' '))
  }

  const {protectedText, values} = protectInlineSyntax(text)
  const cacheKey = createCacheKey(locale, protectedText)

  if (cache[cacheKey]) {
    return escapeMdxComparisons(restoreInlineSyntax(cache[cacheKey], values))
  }

  if (!inFlight.has(cacheKey)) {
    inFlight.set(
      cacheKey,
      withLimit(async () => {
        const translated = await requestWithChunkFallback(protectedText, locale)
        cache[cacheKey] = translated
        return translated
      }).finally(() => {
        inFlight.delete(cacheKey)
      })
    )
  }

  return escapeMdxComparisons(restoreInlineSyntax(await inFlight.get(cacheKey), values))
}

function escapeMdxComparisons(text) {
  return text.replace(/<(?=\d)/g, '&lt;')
}

async function requestWithChunkFallback(text, locale) {
  try {
    return await requestGoogleTranslate(text, locale)
  } catch (error) {
    if (text.length <= 280) {
      throw error
    }

    const midpoint = Math.floor(text.length / 2)
    let splitAt = text.lastIndexOf(' ', midpoint)
    if (splitAt < text.length * 0.25) {
      splitAt = midpoint
    }

    const left = text.slice(0, splitAt).trim()
    const right = text.slice(splitAt).trim()

    if (!left || !right) {
      throw error
    }

    const [leftTranslated, rightTranslated] = await Promise.all([
      requestWithChunkFallback(left, locale),
      requestWithChunkFallback(right, locale),
    ])

    return `${leftTranslated} ${rightTranslated}`
  }
}

function requestGoogleTranslate(text, locale, attempt = 1) {
  const target = targetLanguageCodes[locale]
  const searchParams = new URLSearchParams({
    client: 'gtx',
    sl: 'en',
    tl: target,
    dt: 't',
    q: text,
  })
  const requestUrl = `https://translate.googleapis.com/translate_a/single?${searchParams.toString()}`

  return new Promise((resolve, reject) => {
    https
      .get(requestUrl, {rejectUnauthorized: false}, (response) => {
        let body = ''
        response.setEncoding('utf8')
        response.on('data', (chunk) => {
          body += chunk
        })
        response.on('end', async () => {
          if (response.statusCode >= 400) {
            if (attempt < 6) {
              await sleep(650 * attempt * attempt)
              try {
                resolve(await requestGoogleTranslate(text, locale, attempt + 1))
              } catch (error) {
                reject(error)
              }
              return
            }

            reject(new Error(`Google Translate returned ${response.statusCode}: ${body.slice(0, 180)}`))
            return
          }

          try {
            const parsed = JSON.parse(body)
            resolve(parsed?.[0]?.map((item) => item[0]).join('') || text)
          } catch (error) {
            reject(error)
          }
        })
      })
      .on('error', async (error) => {
        if (attempt < 6) {
          await sleep(650 * attempt * attempt)
          try {
            resolve(await requestGoogleTranslate(text, locale, attempt + 1))
          } catch (retryError) {
            reject(retryError)
          }
          return
        }

        reject(error)
      })
  })
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function translateMetadata(sourceMetadata, locale) {
  const sourceUpdatedAt = sourceMetadata.updatedAt || sourceMetadata.publishedAt
  const [title, summary, seoTitle, seoDescription, faq, howto] = await Promise.all([
    translateText(sourceMetadata.title || '', locale),
    translateText(sourceMetadata.summary || '', locale),
    translateText(sourceMetadata.seoTitle || sourceMetadata.title || '', locale),
    translateText(sourceMetadata.seoDescription || sourceMetadata.summary || '', locale),
    translateFaq(sourceMetadata.faq, locale),
    translateHowTo(sourceMetadata.howto, locale),
  ])

  return {
    title,
    summary,
    seoTitle,
    seoDescription,
    faq,
    howto,
    sourceUpdatedAt,
    translatedAt,
  }
}

async function translateFaq(faq, locale) {
  if (!Array.isArray(faq)) {
    return []
  }

  return Promise.all(
    faq.map(async (item) => ({
      question: await translateText(item.question || '', locale),
      answer: await translateText(item.answer || '', locale),
    }))
  )
}

async function translateHowTo(howto, locale) {
  if (!Array.isArray(howto)) {
    return []
  }

  return Promise.all(
    howto.map(async (item) => ({
      name: await translateText(item.name || '', locale),
      text: await translateText(item.text || '', locale),
    }))
  )
}

async function translateMarkdownContent(content, locale) {
  const lines = content.split('\n')
  const output = []
  const tasks = []
  let index = 0

  const pushTranslated = (promise) => {
    const outputIndex = output.length
    output.push('')
    tasks.push(
      promise.then((translated) => {
        output[outputIndex] = translated
      })
    )
  }

  while (index < lines.length) {
    const line = lines[index]

    if (line.trim().startsWith('```')) {
      const block = [line]
      index += 1
      while (index < lines.length) {
        block.push(lines[index])
        const current = lines[index].trim()
        index += 1
        if (current.startsWith('```')) {
          break
        }
      }
      output.push(...block)
      continue
    }

    if (line.trim() === '') {
      output.push(line)
      index += 1
      continue
    }

    if (/^\s*<Image\b/.test(line)) {
      const block = [line]
      index += 1
      while (index < lines.length) {
        block.push(lines[index])
        const current = lines[index].trim()
        index += 1
        if (current.endsWith('/>') || current.endsWith('>')) {
          break
        }
      }
      output.push(...block)
      continue
    }

    if (isTableRow(line)) {
      const tableBlock = []
      while (index < lines.length && isTableRow(lines[index])) {
        tableBlock.push(lines[index])
        index += 1
      }
      for (const tableLine of tableBlock) {
        pushTranslated(translateTableRow(tableLine, locale))
      }
      continue
    }

    if (isStandaloneMarkdownLine(line) || isHtmlLikeLine(line)) {
      pushTranslated(translateMarkdownLine(line, locale))
      index += 1
      continue
    }

    const paragraph = [line.trim()]
    index += 1
    while (
      index < lines.length &&
      lines[index].trim() !== '' &&
      !lines[index].trim().startsWith('```') &&
      !isTableRow(lines[index]) &&
      !isStandaloneMarkdownLine(lines[index]) &&
      !isHtmlLikeLine(lines[index])
    ) {
      paragraph.push(lines[index].trim())
      index += 1
    }

    pushTranslated(translateText(paragraph.join(' '), locale))
  }

  await Promise.all(tasks)

  return output.join('\n').trim() + '\n'
}

function isStandaloneMarkdownLine(line) {
  return (
    /^\s{0,3}#{1,6}\s+/.test(line) ||
    /^\s*(?:[-*+]|\d+\.)\s+/.test(line) ||
    /^\s*>\s?/.test(line) ||
    /^\s*---\s*$/.test(line)
  )
}

function isHtmlLikeLine(line) {
  return /^\s*[<{]/.test(line) || /^\s*<\/[A-Za-z]/.test(line)
}

function isTableRow(line) {
  return line.includes('|') && !line.trim().startsWith('http')
}

async function translateMarkdownLine(line, locale) {
  if (/^\s*---\s*$/.test(line)) {
    return line
  }

  const match = /^(\s*(?:#{1,6}|[-*+]|\d+\.|>)\s+)([\s\S]+)$/.exec(line)
  if (!match) {
    return translateText(line, locale)
  }

  return `${match[1]}${await translateText(match[2], locale)}`
}

async function translateTableRow(line, locale) {
  if (/^\s*\|?[\s:-]+\|[\s|:-]*$/.test(line)) {
    return line
  }

  const startsWithPipe = line.trimStart().startsWith('|')
  const endsWithPipe = line.trimEnd().endsWith('|')
  const rawCells = line.split('|')
  const leading = startsWithPipe ? rawCells.shift() : ''
  const trailing = endsWithPipe ? rawCells.pop() : ''
  const translatedCells = await Promise.all(rawCells.map(async (cell) => {
    const prefix = /^\s*/.exec(cell)?.[0] || ''
    const suffix = /\s*$/.exec(cell)?.[0] || ''
    const trimmed = cell.trim()
    return `${prefix}${await translateText(trimmed, locale)}${suffix}`
  }))

  return `${leading}${startsWithPipe ? '|' : ''}${translatedCells.join('|')}${endsWithPipe ? '|' : trailing}`
}

function writeTranslationFile(slug, locale, metadata, content) {
  const frontmatter = [
    '---',
    `title: ${stringifyFrontmatterValue(metadata.title)}`,
    `summary: ${stringifyFrontmatterValue(metadata.summary)}`,
    `seoTitle: ${stringifyFrontmatterValue(metadata.seoTitle)}`,
    `seoDescription: ${stringifyFrontmatterValue(metadata.seoDescription)}`,
    `faq: ${stringifyFrontmatterValue(metadata.faq)}`,
    `howto: ${stringifyFrontmatterValue(metadata.howto)}`,
    `sourceUpdatedAt: ${stringifyFrontmatterValue(metadata.sourceUpdatedAt)}`,
    `translatedAt: ${stringifyFrontmatterValue(metadata.translatedAt)}`,
    '---',
    '',
  ].join('\n')

  const filePath = getPostTranslationPath(slug, locale)
  fs.mkdirSync(path.dirname(filePath), {recursive: true})
  fs.writeFileSync(filePath, `${frontmatter}${content}`)
}

function getSourcePosts() {
  return fs
    .readdirSync(blogPostsDirectory)
    .filter((file) => path.extname(file) === '.mdx')
    .map((file) => {
      const slug = createCleanSlug(file)
      const sourcePath = getPostSourcePath(slug)
      const {metadata, content} = parseFrontmatter(fs.readFileSync(sourcePath, 'utf8'))
      return {slug, metadata, content}
    })
    .sort((a, b) => a.slug.localeCompare(b.slug))
}

function parseArgs() {
  const args = process.argv.slice(2)
  const requestedSlugs = new Set()
  let requestedLocales = nonDefaultLocales

  for (const arg of args) {
    if (arg.startsWith('--slugs=')) {
      arg
        .slice('--slugs='.length)
        .split(',')
        .map((slug) => slug.trim())
        .filter(Boolean)
        .forEach((slug) => requestedSlugs.add(slug))
    }

    if (arg.startsWith('--locales=')) {
      requestedLocales = arg
        .slice('--locales='.length)
        .split(',')
        .map((locale) => locale.trim())
        .filter((locale) => nonDefaultLocales.includes(locale))
    }
  }

  return {requestedSlugs, requestedLocales}
}

async function main() {
  const {requestedSlugs, requestedLocales} = parseArgs()
  const sourcePosts = getSourcePosts().filter((post) => requestedSlugs.size === 0 || requestedSlugs.has(post.slug))

  if (sourcePosts.length === 0) {
    throw new Error('No source posts matched the requested slugs.')
  }

  console.log(
    `Translating ${sourcePosts.length} posts into ${requestedLocales.join(', ')}. Cache entries: ${Object.keys(cache).length}.`
  )

  let completed = 0
  const total = sourcePosts.length * requestedLocales.length

  for (const post of sourcePosts) {
    for (const locale of requestedLocales) {
      const metadata = await translateMetadata(post.metadata, locale)
      const content = await translateMarkdownContent(post.content, locale)
      writeTranslationFile(post.slug, locale, metadata, content)
      completed += 1
      if (completed % 10 === 0) {
        saveCache()
      }
      console.log(`[${completed}/${total}] ${locale}/${post.slug}`)
    }
  }

  saveCache()
  console.log('Translation files regenerated.')
}

main().catch((error) => {
  saveCache()
  console.error(error)
  process.exit(1)
})
