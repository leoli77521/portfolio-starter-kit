'use client'

import { useState } from 'react'

export type Category = 'All' | 'AI Technology' | 'Web Development' | 'SEO & Marketing' | 'Productivity'

interface CategoryFilterProps {
  onCategoryChange: (category: Category) => void
  currentCategory: Category
}

const categories: { name: Category; color: string; emoji: string }[] = [
  { name: 'All', color: 'gray', emoji: '📚' },
  { name: 'AI Technology', color: 'blue', emoji: '🤖' },
  { name: 'Web Development', color: 'green', emoji: '💻' },
  { name: 'SEO & Marketing', color: 'purple', emoji: '📈' },
  { name: 'Productivity', color: 'orange', emoji: '⚡' },
]

const colorStyles = {
  gray: {
    active: 'bg-gray-600 text-white border-gray-600',
    inactive: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500',
  },
  blue: {
    active: 'bg-blue-600 text-white border-blue-600',
    inactive: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-blue-300 dark:border-blue-600/50 hover:border-blue-400 dark:hover:border-blue-500',
  },
  green: {
    active: 'bg-green-600 text-white border-green-600',
    inactive: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-green-300 dark:border-green-600/50 hover:border-green-400 dark:hover:border-green-500',
  },
  purple: {
    active: 'bg-purple-600 text-white border-purple-600',
    inactive: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-purple-300 dark:border-purple-600/50 hover:border-purple-400 dark:hover:border-purple-500',
  },
  orange: {
    active: 'bg-orange-600 text-white border-orange-600',
    inactive: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-orange-300 dark:border-orange-600/50 hover:border-orange-400 dark:hover:border-orange-500',
  },
}

export function CategoryFilter({ onCategoryChange, currentCategory }: CategoryFilterProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => {
          const isActive = currentCategory === category.name
          const styles = colorStyles[category.color as keyof typeof colorStyles]

          return (
            <button
              key={category.name}
              onClick={() => onCategoryChange(category.name)}
              className={`
                px-4 py-2.5 rounded-full text-sm font-medium border-2
                transition-all duration-300 transform hover:scale-105
                flex items-center gap-2 shadow-sm hover:shadow-md
                ${isActive ? styles.active : styles.inactive}
              `}
            >
              <span className="text-base">{category.emoji}</span>
              <span>{category.name}</span>
              {isActive && currentCategory !== 'All' && (
                <span className="ml-1 text-xs opacity-90">✓</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function getCategoryColor(category: string): string {
  const found = categories.find(c => c.name === category)
  return found?.color || 'gray'
}

export function getCategoryEmoji(category: string): string {
  const found = categories.find(c => c.name === category)
  return found?.emoji || '📄'
}
