import fs from 'fs'
import path from 'path'
import type { BlogMetadata, Heading } from '@/app/types'
import {
  formatDate as formatDateUtil,
  calculateReadingTime as calculateReadingTimeUtil,
  slugify,
  getHeadings as getHeadingsUtil,
  createCleanSlug as createCleanSlugUtil,
} from '@/app/lib/formatters'
import { normalizeTagName } from 'app/lib/tag-utils'

// Re-export from formatters for backward compatibility
export { slugify } from '@/app/lib/formatters'
export type { Heading } from '@/app/types'

type Metadata = BlogMetadata

const slugAliasMappings: Record<string, string> = {
  seo: 'seo-optimization-guide',
}

function parseTagList(value: string): string[] {
  const normalizedValue = value.trim()
  if (!normalizedValue) {
    return []
  }

  if (normalizedValue.startsWith('[') && normalizedValue.endsWith(']')) {
    try {
      const parsed = JSON.parse(normalizedValue)
      if (Array.isArray(parsed)) {
        return parsed.map((tag) => normalizeTagName(String(tag))).filter(Boolean)
      }
    } catch {
      return normalizedValue
        .slice(1, -1)
        .split(',')
        .map((tag) => normalizeTagName(tag))
        .filter(Boolean)
    }
  }

  return normalizedValue
    .split(',')
    .map((tag) => normalizeTagName(tag))
    .filter(Boolean)
}

export function resolveBlogSlug(requestedSlug: string) {
  const trimmedSlug = requestedSlug.trim()
  if (!trimmedSlug) {
    return trimmedSlug
  }

  const directMatch = slugAliasMappings[trimmedSlug]
  if (directMatch) {
    return directMatch
  }

  const lowerCased = trimmedSlug.toLowerCase()
  return slugAliasMappings[lowerCased] || lowerCased
}

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  const match = frontmatterRegex.exec(fileContent)
  const frontMatterBlock = match![1]
  const content = fileContent.replace(frontmatterRegex, '').trim()
  const frontMatterLines = frontMatterBlock.trim().split('\n')
  const metadata: Partial<Metadata> = {}

  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(': ')
    let value = valueArr.join(': ').trim()
    value = value.replace(/^['"](.*)['"]$/, '$1')

    const trimmedKey = key.trim() as keyof Metadata
    if (trimmedKey === 'tags') {
      metadata[trimmedKey] = parseTagList(value) as any
    } else {
      metadata[trimmedKey] = value as any
    }
  })

  return { metadata: metadata as Metadata, content }
}

function getMDXFiles(dir: string): string[] {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx')
}

function readMDXFile(filePath: string): { metadata: Metadata; content: string } {
  const rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}

function createCleanSlug(filename: string): string {
  return createCleanSlugUtil(path.basename(filename, path.extname(filename)))
}

type BlogPost = {
  metadata: Metadata
  slug: string
  content: string
}

function getMDXData(dir: string): BlogPost[] {
  const mdxFiles = getMDXFiles(dir)
  return mdxFiles.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir, file))
    const slug = createCleanSlug(file)

    return {
      metadata,
      slug,
      content,
    }
  })
}

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), 'app', 'blog', 'posts'))
}

export function getBlogPostsMetadata() {
  const posts = getBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
    metadata: post.metadata,
    readingTime: calculateReadingTime(post.content),
  }))
}

export function calculateReadingTime(content: string): number {
  return calculateReadingTimeUtil(content)
}

export function formatDate(date: string, includeRelative = false): string {
  return formatDateUtil(date, includeRelative)
}

export function getHeadings(content: string): Heading[] {
  return getHeadingsUtil(content)
}
