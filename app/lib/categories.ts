import type { CategoryConfig, CategoryColor } from '@/app/types'

export const categories: CategoryConfig[] = [
  { name: 'All', color: 'gray', emoji: '📚' },
  { name: 'AI Technology', color: 'blue', emoji: '🤖' },
  { name: 'Web Development', color: 'green', emoji: '💻' },
  { name: 'SEO & Marketing', color: 'purple', emoji: '📈' },
  { name: 'Technology', color: 'blue', emoji: '🔌' },
  { name: 'Productivity', color: 'orange', emoji: '⚡' },
]

export function getCategoryColor(category: string): CategoryColor {
  const found = categories.find((c) => c.name === category)
  return (found?.color as CategoryColor) || 'gray'
}

export function getCategoryEmoji(category: string): string {
  const found = categories.find((c) => c.name === category)
  return found?.emoji || '📄'
}
