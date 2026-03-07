'use client'

import { categories, getCategoryColor } from '../lib/categories'
import type { Category, ColorStylesMap } from '../types'

export { categories, getCategoryColor, getCategoryEmoji, getCategorySlug } from '../lib/categories'
export type { Category } from '../types'

const colorStyles: ColorStylesMap = {
  gray: {
    active:
      'border-slate-900 bg-slate-900 text-white shadow-sm theme-dark:border-slate-100 theme-dark:bg-slate-100 theme-dark:text-slate-950',
    inactive:
      'border-slate-200/80 bg-white/80 text-slate-600 hover:border-slate-300 hover:text-slate-950 theme-dark:border-slate-800 theme-dark:bg-slate-950/80 theme-dark:text-slate-300 theme-dark:hover:border-slate-700 theme-dark:hover:text-white',
  },
  blue: {
    active:
      'border-sky-500 bg-sky-500 text-white shadow-sm theme-dark:border-sky-400 theme-dark:bg-sky-400 theme-dark:text-slate-950',
    inactive:
      'border-sky-200/80 bg-sky-50/90 text-sky-700 hover:border-sky-300 hover:text-sky-900 theme-dark:border-sky-900/80 theme-dark:bg-sky-950/50 theme-dark:text-sky-300 theme-dark:hover:border-sky-700 theme-dark:hover:text-sky-100',
  },
  green: {
    active:
      'border-emerald-500 bg-emerald-500 text-white shadow-sm theme-dark:border-emerald-400 theme-dark:bg-emerald-400 theme-dark:text-slate-950',
    inactive:
      'border-emerald-200/80 bg-emerald-50/90 text-emerald-700 hover:border-emerald-300 hover:text-emerald-900 theme-dark:border-emerald-900/80 theme-dark:bg-emerald-950/50 theme-dark:text-emerald-300 theme-dark:hover:border-emerald-700 theme-dark:hover:text-emerald-100',
  },
  purple: {
    active:
      'border-violet-500 bg-violet-500 text-white shadow-sm theme-dark:border-violet-400 theme-dark:bg-violet-400 theme-dark:text-slate-950',
    inactive:
      'border-violet-200/80 bg-violet-50/90 text-violet-700 hover:border-violet-300 hover:text-violet-900 theme-dark:border-violet-900/80 theme-dark:bg-violet-950/50 theme-dark:text-violet-300 theme-dark:hover:border-violet-700 theme-dark:hover:text-violet-100',
  },
  orange: {
    active:
      'border-amber-500 bg-amber-500 text-white shadow-sm theme-dark:border-amber-400 theme-dark:bg-amber-400 theme-dark:text-slate-950',
    inactive:
      'border-amber-200/80 bg-amber-50/90 text-amber-700 hover:border-amber-300 hover:text-amber-900 theme-dark:border-amber-900/80 theme-dark:bg-amber-950/50 theme-dark:text-amber-300 theme-dark:hover:border-amber-700 theme-dark:hover:text-amber-100',
  },
}

const dotStyles = {
  gray: 'bg-slate-400 theme-dark:bg-slate-500',
  blue: 'bg-sky-500 theme-dark:bg-sky-400',
  green: 'bg-emerald-500 theme-dark:bg-emerald-400',
  purple: 'bg-violet-500 theme-dark:bg-violet-400',
  orange: 'bg-amber-500 theme-dark:bg-amber-400',
}

interface CategoryFilterProps {
  currentCategory: Category
  onCategoryChange: (category: Category) => void
}

export function CategoryFilter({
  currentCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="mb-8 overflow-x-auto pb-2">
      <div className="flex min-w-max items-center gap-2">
        {categories.map((category) => {
          const tone = getCategoryColor(category.name)
          const isActive = currentCategory === category.name

          return (
            <button
              key={category.name}
              type="button"
              aria-pressed={isActive}
              onClick={() => onCategoryChange(category.name)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${isActive ? colorStyles[tone].active : colorStyles[tone].inactive}`}
            >
              <span
                aria-hidden="true"
                className={`h-2.5 w-2.5 rounded-full ${dotStyles[tone]}`}
              />
              {category.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}

