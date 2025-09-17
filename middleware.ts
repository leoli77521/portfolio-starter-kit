import { NextRequest, NextResponse } from 'next/server'

// 记录重定向用于SEO分析
function logRedirect(from: string, to: string, statusCode: number) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔄 SEO Redirect: ${from} → ${to} (${statusCode})`)
  }
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const pathname = url.pathname

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') && !pathname.endsWith('.html') && !pathname.endsWith('.php') && !pathname.endsWith('.htm') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/robots') ||
    pathname.startsWith('/sitemap')
  ) {
    return NextResponse.next()
  }

  // Handle URL normalization and canonical redirects
  let shouldRedirect = false
  let newPathname = pathname
  let pathAlreadyModified = false
  const redirectReasons: string[] = []

  // Strip tracking query parameters so crawlers land on canonical URLs
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

  // Remove trailing slash (except for root)
  if (pathname !== '/' && pathname.endsWith('/')) {
    newPathname = pathname.slice(0, -1)
    shouldRedirect = true
    pathAlreadyModified = true
    redirectReasons.push('trailing-slash-removal')
  }

  // Handle double slashes
  if (pathname.includes('//')) {
    newPathname = pathname.replace(/\/+/g, '/')
    shouldRedirect = true
    pathAlreadyModified = true
    redirectReasons.push('double-slash-cleanup')
  }

  // Handle blog URL variations with proper 301 redirects
  const blogRedirects: { [key: string]: string } = {
    '/posts': '/blog',
    '/articles': '/blog',
    '/article': '/blog',
    '/blog/posts': '/blog',
    '/blog/articles': '/blog',
    '/home': '/',
    '/index': '/',
    '/feed': '/rss',
    '/rss.xml': '/rss',
    '/feed.xml': '/rss'
  }

  // Check for exact matches first
  if (!pathAlreadyModified && blogRedirects[pathname]) {
    newPathname = blogRedirects[pathname]
    shouldRedirect = true
    pathAlreadyModified = true
    redirectReasons.push('url-structure-normalization')
  }

  // Handle blog post URL variations
  if (!pathAlreadyModified) {
    const blogPostPatterns = [
      { pattern: /^\/posts\/(.+)$/, replacement: '/blog/$1', reason: 'posts-to-blog' },
      { pattern: /^\/articles\/(.+)$/, replacement: '/blog/$1', reason: 'articles-to-blog' },
      { pattern: /^\/article\/(.+)$/, replacement: '/blog/$1', reason: 'article-to-blog' },
      { pattern: /^\/blog\/post\/(.+)$/, replacement: '/blog/$1', reason: 'blog-post-cleanup' },
      { pattern: /^\/blog\/(.+)\.html$/, replacement: '/blog/$1', reason: 'html-extension-removal' },
      { pattern: /^\/blog\/(.+)\.php$/, replacement: '/blog/$1', reason: 'php-extension-removal' },
      { pattern: /^\/blog\/(.+)\.aspx$/, replacement: '/blog/$1', reason: 'aspx-extension-removal' }
    ]

    for (const { pattern, replacement, reason } of blogPostPatterns) {
      if (pattern.test(pathname)) {
        newPathname = pathname.replace(pattern, replacement)
        shouldRedirect = true
        pathAlreadyModified = true
        redirectReasons.push(reason)
        break
      }
    }
  }

  // Handle category and tag redirects
  if (!pathAlreadyModified) {
    const categoryTagPatterns = [
      { pattern: /^\/blog\/category\/(.+)$/, reason: 'category-to-blog' },
      { pattern: /^\/category\/(.+)$/, reason: 'category-to-blog' },
      { pattern: /^\/tag\/(.+)$/, reason: 'tag-to-blog' },
      { pattern: /^\/tags\/(.+)$/, reason: 'tags-to-blog' }
    ]

    for (const { pattern, reason } of categoryTagPatterns) {
      if (pattern.test(pathname)) {
        newPathname = '/blog'
        shouldRedirect = true
        pathAlreadyModified = true
        redirectReasons.push(reason)
        break
      }
    }
  }

  // Handle WordPress and admin redirects
  if (!pathAlreadyModified) {
    const blockPatterns = [
      { pattern: /^\/wp-admin/, reason: 'wp-admin-block' },
      { pattern: /^\/wp-content/, reason: 'wp-content-block' },
      { pattern: /^\/wp-includes/, reason: 'wp-includes-block' },
      { pattern: /^\/admin/, reason: 'admin-block' },
      { pattern: /^\/login/, reason: 'login-block' },
      { pattern: /^\/register/, reason: 'register-block' }
    ]

    for (const { pattern, reason } of blockPatterns) {
      if (pattern.test(pathname)) {
        newPathname = '/'
        shouldRedirect = true
        pathAlreadyModified = true
        redirectReasons.push(reason)
        break
      }
    }
  }

  // Perform redirect if needed
  if (shouldRedirect) {
    url.pathname = newPathname
    
    // Log redirect for analysis
    logRedirect(pathname, newPathname, 301)
    
    // Use 301 for SEO-friendly permanent redirects
    const response = NextResponse.redirect(url, 301)
    
    // Add cache headers for redirect
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    
    // Add redirect reason for debugging
    if (redirectReasons.length > 0) {
      response.headers.set('X-Redirect-Reason', redirectReasons.join(','))
    }
    
    return response
  }

  // Add canonical headers for proper pages
  const response = NextResponse.next()
  
  // Add canonical headers to prevent duplicate content issues
  if (pathname.startsWith('/blog/') && pathname !== '/blog') {
    // This is a blog post, canonical is handled in metadata
    response.headers.set('X-Canonical-Path', pathname)
  } else if (pathname === '/blog' || pathname === '/') {
    response.headers.set('X-Canonical-Path', pathname)
  }

  // Add headers for SEO monitoring
  response.headers.set('X-SEO-Processed', 'true')
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sitemap.xml, robots.txt (SEO files)
     * - files with extensions (.png, .jpg, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js)$).*)',
  ],
}