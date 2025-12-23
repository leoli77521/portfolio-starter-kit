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

// Re-export from formatters for backward compatibility
export { slugify } from '@/app/lib/formatters'
export type { Heading } from '@/app/types'

type Metadata = BlogMetadata

const slugAliasMappings: Record<string, string> = {
  'seo': 'seo-optimization-guide',
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
  let frontmatterRegex = /---\s*([\s\S]*?)\s*---/
  let match = frontmatterRegex.exec(fileContent)
  let frontMatterBlock = match![1]
  let content = fileContent.replace(frontmatterRegex, '').trim()
  let frontMatterLines = frontMatterBlock.trim().split('\n')
  let metadata: Partial<Metadata> = {}

  frontMatterLines.forEach((line) => {
    let [key, ...valueArr] = line.split(': ')
    let value = valueArr.join(': ').trim()
    value = value.replace(/^['"](.*)['"]$/, '$1') // Remove quotes

    const trimmedKey = key.trim() as keyof Metadata
    if (trimmedKey === 'tags') {
      // 处理标签数组，支持JSON数组格式
      try {
        // 如果是JSON数组格式，直接解析
        if (value.startsWith('[') && value.endsWith(']')) {
          metadata[trimmedKey] = JSON.parse(value) as any
        } else {
          // 否则按逗号分割
          metadata[trimmedKey] = value.split(',').map(tag => tag.trim()) as any
        }
      } catch (e) {
        // 如果解析失败，按逗号分割
        metadata[trimmedKey] = value.split(',').map(tag => tag.trim()) as any
      }
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

export function calculateReadingTime(content: string): number {
  return calculateReadingTimeUtil(content)
}

export function formatDate(date: string, includeRelative = false): string {
  return formatDateUtil(date, includeRelative)
}

export function getHeadings(content: string): Heading[] {
  return getHeadingsUtil(content)
}
