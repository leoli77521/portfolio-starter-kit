'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useSearchParams } from 'next/navigation'
import { Globe2 } from 'lucide-react'
import {
  defaultLocale,
  getContentPath,
  getLocaleLabel,
  locales,
} from 'app/lib/i18n-paths'

interface LanguageSwitcherProps {
  variant?: 'header' | 'mobile'
}

export function LanguageSwitcher({ variant = 'header' }: LanguageSwitcherProps) {
  const locale = useLocale()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = useTranslations('LanguageSwitcher')
  const currentLocale = locales.includes(locale) ? locale : defaultLocale

  const handleChange = (nextLocale: string) => {
    const query = searchParams.toString()
    const nextPath = getContentPath(pathname || '/', nextLocale)
    window.location.href = query ? `${nextPath}?${query}` : nextPath
  }

  const languageOptions = locales.map((item) => (
    <option key={item} value={item}>
      {getLocaleLabel(item)}
    </option>
  ))

  if (variant === 'mobile') {
    return (
      <label
        className="block rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 theme-dark:border-slate-800 theme-dark:bg-slate-900/70"
        title={t('title')}
      >
        <span className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-700 theme-dark:border-slate-800 theme-dark:bg-slate-950 theme-dark:text-slate-200">
            <Globe2 className="h-4 w-4" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-slate-900 theme-dark:text-slate-100">
              {t('label')}
            </span>
            <span className="mt-1 block text-sm text-slate-600 theme-dark:text-slate-400">
              {t('title')}
            </span>
          </span>
        </span>
        <select
          aria-label={t('label')}
          value={currentLocale}
          onChange={(event) => handleChange(event.target.value)}
          className="mt-4 w-full cursor-pointer rounded-full border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 outline-none transition-colors hover:border-slate-300 theme-dark:border-slate-800 theme-dark:bg-slate-950 theme-dark:text-slate-100 theme-dark:hover:border-slate-700"
        >
          {languageOptions}
        </select>
      </label>
    )
  }

  return (
    <label
      className="utility-button relative h-11 w-11 shrink-0 overflow-hidden p-0 sm:w-auto sm:px-3"
      title={t('title')}
    >
      <Globe2 className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">{t('label')}</span>
      <span className="hidden max-w-28 truncate text-sm font-medium sm:inline">
        {getLocaleLabel(currentLocale)}
      </span>
      <select
        aria-label={t('label')}
        value={currentLocale}
        onChange={(event) => handleChange(event.target.value)}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      >
        {languageOptions}
      </select>
    </label>
  )
}
