import {getRequestConfig} from 'next-intl/server'
import {defaultLocale, isLocale} from '../app/lib/i18n-paths'

export default getRequestConfig(async ({requestLocale}) => {
  const requestedLocale = await requestLocale
  const locale: string =
    typeof requestedLocale === 'string' && isLocale(requestedLocale)
      ? requestedLocale
      : defaultLocale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
