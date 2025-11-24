import fs from 'fs'
import path from 'path'

type Metadata = {
  title: string
  publishedAt: string
  summary: string
  image?: string
  category?: string
  tags?: string[]
}

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

function getMDXFiles(dir) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === '.mdx')
}

function readMDXFile(filePath) {
  let rawContent = fs.readFileSync(filePath, 'utf-8')
  return parseFrontmatter(rawContent)
}

function createCleanSlug(filename: string): string {
  // 移除文件扩展名
  let slug = path.basename(filename, path.extname(filename))

  // 对于特殊文件名，创建SEO友好的URL
  const slugMappings: { [key: string]: string } = {
    'SEO': 'seo-optimization-guide',
    'AI生成PPT': 'ai-generated-presentations',
    'AI-Revolution-Finance': 'ai-revolution-finance',
    'AI-Revolution-American-Workplaces': 'ai-revolution-american-workplaces'
  }

  // 如果有自定义映射，使用映射值
  if (slugMappings[slug]) {
    return slugMappings[slug]
  }

  // 否则进行标准化处理
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9\-]/g, '-') // 替换非字母数字字符为连字符
    .replace(/-+/g, '-') // 合并多个连字符
    .replace(/^-|-$/g, '') // 移除开头和结尾的连字符
}

function getMDXData(dir) {
  let mdxFiles = getMDXFiles(dir)
  return mdxFiles.map((file) => {
    let { metadata, content } = readMDXFile(path.join(dir, file))
    let slug = createCleanSlug(file)

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
  // 平均阅读速度：每分钟200-250个单词
  const wordsPerMinute = 225
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return minutes
}

export function formatDate(date: string, includeRelative = false) {
  // 处理无效日期
  if (!date || typeof date !== 'string') {
    return 'Unknown Date'
  }

  let currentDate = new Date()

  // 标准化日期格式
  let normalizedDate = date
  if (!date.includes('T')) {
    normalizedDate = `${date}T00:00:00`
  }

  let targetDate = new Date(normalizedDate)

  // 检查日期是否有效
  if (isNaN(targetDate.getTime())) {
    // 尝试其他日期格式
    targetDate = new Date(date)
    if (isNaN(targetDate.getTime())) {
      return 'Invalid Date'
    }
  }

  // 计算时间差（毫秒）
  let timeDiff = currentDate.getTime() - targetDate.getTime()
  let daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24))

  let formattedDate = ''

  if (daysDiff < 0) {
    formattedDate = 'Future'
  } else if (daysDiff === 0) {
    formattedDate = 'Today'
  } else if (daysDiff < 30) {
    formattedDate = `${daysDiff}d ago`
  } else if (daysDiff < 365) {
    let monthsDiff = Math.floor(daysDiff / 30)
    formattedDate = `${monthsDiff}mo ago`
  } else {
    let yearsDiff = Math.floor(daysDiff / 365)
    formattedDate = `${yearsDiff}y ago`
  }

  let fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  if (!includeRelative) {
    return fullDate
  }

  return `${fullDate} (${formattedDate})`
}

export type Heading = {
  level: number
  text: string
  slug: string
}

function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

export function getHeadings(content: string): Heading[] {
  // Match headings: # Heading, ## Heading, etc.
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const headings: Heading[] = []

  const lines = content.split('\n')
  let inCodeBlock = false

  lines.forEach(line => {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock
      return
    }

    if (inCodeBlock) return

    const match = headingRegex.exec(line)
    // Reset lastIndex because we are calling exec on different strings (lines) 
    // actually regex.exec on a string without global flag or with new string doesn't use lastIndex like that, 
    // but since we are iterating lines, we can just use string.match or regex.exec.
    // However, since we defined headingRegex with 'g' and outside the loop, we need to be careful.
    // Better to use line.match for simple line check.

    const lineMatch = line.match(/^(#{1,6})\s+(.+)$/)
    if (lineMatch) {
      const level = lineMatch[1].length
      const text = lineMatch[2].trim()
      const slug = slugify(text)
      headings.push({ level, text, slug })
    }
  })

  return headings
}
