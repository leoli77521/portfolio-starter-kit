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

export function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = useTranslations('LanguageSwitcher')

  return (
    <label
      className="utility-button gap-2 px-3"
      title={t('title')}
    >
      <Globe2 className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">{t('label')}</span>
      <select
        aria-label={t('label')}
        value={locale || defaultLocale}
        onChange={(event) => {
          const query = searchParams.toString()
          const nextPath = getContentPath(pathname || '/', event.target.value)
          window.location.href = query ? `${nextPath}?${query}` : nextPath
        }}
        className="cursor-pointer bg-transparent text-sm font-medium text-slate-700 outline-none theme-dark:text-slate-200"
      >
        {locales.map((item) => (
          <option key={item} value={item}>
            {getLocaleLabel(item)}
          </option>
        ))}
      </select>
    </label>
  )
}
