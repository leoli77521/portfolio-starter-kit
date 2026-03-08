import { slugify } from 'app/lib/formatters'

const canonicalTagNames: Record<string, string> = {
  ai: 'Artificial Intelligence',
  'ai coding assistant': 'AI Programming',
  'ai coding': 'AI Programming',
  'ai detection': 'AI Detection',
  'ai development': 'AI Development',
  'ai programming': 'AI Programming',
  'ai programming tools': 'AI Programming',
  'ai reasoning': 'AI Reasoning',
  'ai technology': 'Artificial Intelligence',
  'ai tools': 'AI Tools',
  'artificial intelligence': 'Artificial Intelligence',
  'claude ai': 'Claude',
  'developer productivity': 'Productivity',
  'developer tools': 'Developer Tools',
  'google gemini': 'Gemini',
  'machine learning': 'Machine Learning',
  programming: 'Programming',
  'search engine optimization': 'SEO Optimization',
  seo: 'SEO Optimization',
  'seo strategy': 'SEO Optimization',
  'website optimization': 'SEO Optimization',
}

function sanitizeTagToken(tag: string): string {
  return tag
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^[\[\]'"]+/, '')
    .replace(/[\[\]'"]+$/, '')
    .trim()
}

export function normalizeTagName(tag: string): string {
  const normalized = sanitizeTagToken(tag)
  if (!normalized) {
    return normalized
  }

  return canonicalTagNames[normalized.toLowerCase()] || normalized
}

export function toTagSlug(tag: string): string {
  const slug = slugify(normalizeTagName(tag))
  return slug || normalizeTagName(tag).trim().toLowerCase().replace(/\s+/g, '-')
}

export function normalizeTagSlug(value: string): string {
  try {
    return toTagSlug(decodeURIComponent(value))
  } catch {
    return toTagSlug(value)
  }
}
