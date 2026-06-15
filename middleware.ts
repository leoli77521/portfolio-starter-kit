import createMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'
import { slugify } from './app/lib/formatters'
import {
  defaultLocale,
  getContentPath,
  isArticlePath,
  localizePath,
  stripLocaleFromPath,
} from './app/lib/i18n-paths'

const intlMiddleware = createMiddleware(routing)

function logRedirect(from: string, to: string, statusCode: number) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`SEO Redirect: ${from} -> ${to} (${statusCode})`)
  }
}

function shouldSkipMiddleware(pathname: string) {
  return (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    (pathname.includes('.') &&
      !pathname.endsWith('.html') &&
      !pathname.endsWith('.php') &&
      !pathname.endsWith('.htm')) ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/robots') ||
    pathname.startsWith('/sitemap') ||
    pathname.startsWith('/manifest') ||
    pathname.startsWith('/ads.txt') ||
    pathname.startsWith('/llms.txt')
  )
}

function normalizeSlug(value: string) {
  let decoded = value
  try {
    decoded = decodeURIComponent(value)
  } catch {
    // Keep raw segment when decoding fails.
  }
  const slug = slugify(decoded)
  if (slug) {
    return slug
  }
  return decoded.trim().toLowerCase().replace(/\s+/g, '-')
}

function localizedRedirectPath(pathname: string, locale: string) {
  if (pathname === '/rss') {
    return '/rss'
  }

  return getContentPath(pathname, locale)
}

function redirectTo(url: URL, from: string, to: string, reasons: string[], status = 301) {
  url.pathname = to
  logRedirect(from, to, status)

  const response = NextResponse.redirect(url, status)
  response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')

  if (reasons.length > 0) {
    response.headers.set('X-Redirect-Reason', reasons.join(','))
  }

  return response
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const pathname = url.pathname

  if (shouldSkipMiddleware(pathname)) {
    return NextResponse.next()
  }

  let shouldRedirect = false
  let newPathname = pathname
  let pathAlreadyModified = false
  const redirectReasons: string[] = []

  const trackingParamNames = new Set(['gclid', 'fbclid', 'msclkid', 'igshid', 'ref', 'ref_src'])
  let removedTrackingParams = false
  for (const paramKey of [...url.searchParams.keys()]) {
    const lowerKey = paramKey.toLowerCase()
    if (lowerKey.startsWith('utm_') || trackingParamNames.has(lowerKey)) {
      url.searchParams.delete(paramKey)
      removedTrackingParams = true
    }
  }
  if (removedTrackingParams) {
    shouldRedirect = true
    redirectReasons.push('tracking-param-cleanup')
  }

  if (pathname !== '/' && pathname.endsWith('/')) {
    newPathname = pathname.slice(0, -1)
    shouldRedirect = true
    pathAlreadyModified = true
    redirectReasons.push('trailing-slash-removal')
  }

  if (pathname.includes('//')) {
    newPathname = pathname.replace(/\/+/g, '/')
    shouldRedirect = true
    pathAlreadyModified = true
    redirectReasons.push('double-slash-cleanup')
  }

  const pathToNormalize = pathAlreadyModified ? newPathname : pathname
  const strippedPath = stripLocaleFromPath(pathToNormalize)
  const activeLocale = strippedPath.locale
  const contentPath = strippedPath.pathname

  if (activeLocale !== defaultLocale && isArticlePath(contentPath)) {
    url.pathname = contentPath
    logRedirect(pathname, contentPath, 302)
    const response = NextResponse.redirect(url, 302)
    response.headers.set('X-Redirect-Reason', 'localized-article-fallback')
    return response
  }

  const blogRedirects: Record<string, string> = {
    '/posts': '/blog',
    '/articles': '/blog',
    '/article': '/blog',
    '/blog/posts': '/blog',
    '/blog/articles': '/blog',
    '/home': '/',
    '/index': '/',
    '/feed': '/rss',
    '/rss.xml': '/rss',
    '/feed.xml': '/rss',
  }

  if (!pathAlreadyModified && blogRedirects[contentPath]) {
    newPathname = localizedRedirectPath(blogRedirects[contentPath], activeLocale)
    shouldRedirect = true
    pathAlreadyModified = true
    redirectReasons.push('url-structure-normalization')
  }

  if (!pathAlreadyModified) {
    const blogPostPatterns = [
      { pattern: /^\/posts\/(.+)$/, replacement: '/blog/$1', reason: 'posts-to-blog' },
      { pattern: /^\/articles\/(.+)$/, replacement: '/blog/$1', reason: 'articles-to-blog' },
      { pattern: /^\/article\/(.+)$/, replacement: '/blog/$1', reason: 'article-to-blog' },
      { pattern: /^\/blog\/post\/(.+)$/, replacement: '/blog/$1', reason: 'blog-post-cleanup' },
      { pattern: /^\/blog\/(.+)\.html$/, replacement: '/blog/$1', reason: 'html-extension-removal' },
      { pattern: /^\/blog\/(.+)\.php$/, replacement: '/blog/$1', reason: 'php-extension-removal' },
      { pattern: /^\/blog\/(.+)\.aspx$/, replacement: '/blog/$1', reason: 'aspx-extension-removal' },
    ]

    for (const { pattern, replacement, reason } of blogPostPatterns) {
      if (pattern.test(contentPath)) {
        newPathname = localizedRedirectPath(contentPath.replace(pattern, replacement), activeLocale)
        shouldRedirect = true
        pathAlreadyModified = true
        redirectReasons.push(reason)
        break
      }
    }
  }

  const nextPathToNormalize = pathAlreadyModified ? newPathname : pathToNormalize
  const nextStrippedPath = stripLocaleFromPath(nextPathToNormalize)
  const nextContentPath = nextStrippedPath.pathname
  const nextLocale = nextStrippedPath.locale

  const legacyTagMatch = nextContentPath.match(/^\/tag\/(.+)$/)
  if (legacyTagMatch) {
    const normalizedTag = normalizeSlug(legacyTagMatch[1])
    if (normalizedTag) {
      const canonicalPath = localizePath(`/tags/${normalizedTag}`, nextLocale)
      if (canonicalPath !== nextPathToNormalize) {
        newPathname = canonicalPath
        shouldRedirect = true
        pathAlreadyModified = true
        redirectReasons.push('tag-route-normalization')
      }
    }
  }

  const tagMatch = nextContentPath.match(/^\/tags\/(.+)$/)
  if (tagMatch) {
    const normalizedTag = normalizeSlug(tagMatch[1])
    if (normalizedTag) {
      const canonicalPath = localizePath(`/tags/${normalizedTag}`, nextLocale)
      if (canonicalPath !== nextPathToNormalize) {
        newPathname = canonicalPath
        shouldRedirect = true
        pathAlreadyModified = true
        redirectReasons.push('tag-slug-normalization')
      }
    }
  }

  const legacyCategoryMatch =
    nextContentPath.match(/^\/category\/(.+)$/) ||
    nextContentPath.match(/^\/blog\/category\/(.+)$/)

  if (legacyCategoryMatch) {
    const normalizedCategory = normalizeSlug(legacyCategoryMatch[1])
    if (normalizedCategory) {
      const canonicalPath = localizePath(`/categories/${normalizedCategory}`, nextLocale)
      if (canonicalPath !== nextPathToNormalize) {
        newPathname = canonicalPath
        shouldRedirect = true
        pathAlreadyModified = true
        redirectReasons.push('category-route-normalization')
      }
    }
  }

  const categoryMatch = nextContentPath.match(/^\/categories\/(.+)$/)
  if (categoryMatch) {
    const normalizedCategory = normalizeSlug(categoryMatch[1])
    if (normalizedCategory) {
      const canonicalPath = localizePath(`/categories/${normalizedCategory}`, nextLocale)
      if (canonicalPath !== nextPathToNormalize) {
        newPathname = canonicalPath
        shouldRedirect = true
        pathAlreadyModified = true
        redirectReasons.push('category-slug-normalization')
      }
    }
  }

  if (!pathAlreadyModified) {
    const blockPatterns = [
      { pattern: /^\/wp-admin/, reason: 'wp-admin-block' },
      { pattern: /^\/wp-content/, reason: 'wp-content-block' },
      { pattern: /^\/wp-includes/, reason: 'wp-includes-block' },
      { pattern: /^\/admin/, reason: 'admin-block' },
      { pattern: /^\/login/, reason: 'login-block' },
      { pattern: /^\/register/, reason: 'register-block' },
    ]

    for (const { pattern, reason } of blockPatterns) {
      if (pattern.test(nextContentPath)) {
        newPathname = localizePath('/', nextLocale)
        shouldRedirect = true
        pathAlreadyModified = true
        redirectReasons.push(reason)
        break
      }
    }
  }

  if (shouldRedirect) {
    return redirectTo(url, pathname, newPathname, redirectReasons)
  }

  const response = intlMiddleware(request)
  const canonicalPath = stripLocaleFromPath(pathname).pathname

  response.headers.set('X-Canonical-Path', canonicalPath)
  response.headers.set('X-SEO-Processed', 'true')

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js)$).*)',
  ],
}
