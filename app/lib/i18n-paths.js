const locales = Object.freeze(['en', 'zh', 'de', 'fr', 'th', 'pt'])
const defaultLocale = 'en'

const localeLanguageTags = Object.freeze({
  en: 'en-US',
  zh: 'zh-CN',
  de: 'de-DE',
  fr: 'fr-FR',
  th: 'th-TH',
  pt: 'pt-BR',
})

const localeOpenGraph = Object.freeze({
  en: 'en_US',
  zh: 'zh_CN',
  de: 'de_DE',
  fr: 'fr_FR',
  th: 'th_TH',
  pt: 'pt_BR',
})

const localeLabels = Object.freeze({
  en: 'English',
  zh: '简体中文',
  de: 'Deutsch',
  fr: 'Français',
  th: 'ไทย',
  pt: 'Português',
})

function isLocale(value) {
  return typeof value === 'string' && locales.includes(value)
}

function getLocaleLanguageTag(locale) {
  return localeLanguageTags[isLocale(locale) ? locale : defaultLocale]
}

function getLocaleOpenGraph(locale) {
  return localeOpenGraph[isLocale(locale) ? locale : defaultLocale]
}

function getLocaleLabel(locale) {
  return localeLabels[isLocale(locale) ? locale : defaultLocale]
}

function normalizePath(pathname) {
  if (!pathname || pathname === '/') {
    return '/'
  }

  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
}

function splitPathSuffix(pathname) {
  const value = pathname || '/'
  const queryIndex = value.indexOf('?')
  const hashIndex = value.indexOf('#')
  const suffixIndex = [queryIndex, hashIndex]
    .filter((index) => index >= 0)
    .sort((left, right) => left - right)[0]

  if (suffixIndex === undefined) {
    return {path: value, suffix: ''}
  }

  return {
    path: value.slice(0, suffixIndex) || '/',
    suffix: value.slice(suffixIndex),
  }
}

function stripLocaleFromPath(pathname) {
  const {path, suffix} = splitPathSuffix(pathname)
  const normalizedPath = normalizePath(path)
  const [, maybeLocale, rest = ''] = normalizedPath.match(/^\/([^/]+)(\/.*)?$/) || []

  if (isLocale(maybeLocale) && maybeLocale !== defaultLocale) {
    return {
      locale: maybeLocale,
      pathname: `${normalizePath(rest || '/')}${suffix}`,
    }
  }

  if (maybeLocale === defaultLocale) {
    return {
      locale: defaultLocale,
      pathname: `${normalizePath(rest || '/')}${suffix}`,
    }
  }

  return {
    locale: defaultLocale,
    pathname: `${normalizedPath}${suffix}`,
  }
}

function localizePath(pathname, locale = defaultLocale) {
  const safeLocale = isLocale(locale) ? locale : defaultLocale
  const stripped = stripLocaleFromPath(pathname)
  const {path, suffix} = splitPathSuffix(stripped.pathname)
  const normalizedPath = normalizePath(path)

  if (safeLocale === defaultLocale) {
    return `${normalizedPath}${suffix}`
  }

  const localizedPath = normalizedPath === '/' ? `/${safeLocale}` : `/${safeLocale}${normalizedPath}`
  return `${localizedPath}${suffix}`
}

function isArticlePath(pathname) {
  const normalizedPath = normalizePath(stripLocaleFromPath(pathname).pathname)
  return /^\/blog\/[^/]+$/.test(normalizedPath)
}

function getContentPath(pathname, locale = defaultLocale) {
  const strippedPathname = stripLocaleFromPath(pathname).pathname
  const {path, suffix} = splitPathSuffix(strippedPathname)
  const normalizedPath = normalizePath(path)

  return localizePath(`${normalizedPath}${suffix}`, locale)
}

function getLocalizedAlternates(pathname) {
  const {path} = splitPathSuffix(stripLocaleFromPath(pathname).pathname)
  const normalizedPath = normalizePath(path)

  const alternates = {}
  locales.forEach((locale) => {
    alternates[localeLanguageTags[locale]] = localizePath(normalizedPath, locale)
  })
  alternates['x-default'] = localizePath(normalizedPath, defaultLocale)

  return alternates
}

function getAbsoluteLocalizedAlternates(pathname, baseUrl) {
  return Object.fromEntries(
    Object.entries(getLocalizedAlternates(pathname)).map(([language, path]) => [
      language,
      `${baseUrl}${path === '/' ? '' : path}`,
    ])
  )
}

function getCanonicalUrl(pathname, locale, baseUrl) {
  const path = getContentPath(pathname, locale)
  return `${baseUrl}${path === '/' ? '' : path}`
}

module.exports = {
  locales,
  defaultLocale,
  localeLanguageTags,
  localeOpenGraph,
  localeLabels,
  isLocale,
  getLocaleLanguageTag,
  getLocaleOpenGraph,
  getLocaleLabel,
  isArticlePath,
  localizePath,
  stripLocaleFromPath,
  getContentPath,
  getLocalizedAlternates,
  getAbsoluteLocalizedAlternates,
  getCanonicalUrl,
}
