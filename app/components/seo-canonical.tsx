import { headers } from 'next/headers'
import { baseUrl } from 'app/sitemap'

interface SEOCanonicalProps {
  path: string
  title?: string
  description?: string
}

export function SEOCanonical({ path, title, description }: SEOCanonicalProps) {
  // 确保path以/开头但不以/结尾（除非是根路径）
  const normalizedPath = path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}`
  const canonicalUrl = `${baseUrl}${normalizedPath}`

  return (
    <>
      <link rel="canonical" href={canonicalUrl} />
      {title && <meta property="og:url" content={canonicalUrl} />}
      {/* 添加hreflang标签支持 */}
      <link rel="alternate" hrefLang="en" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
    </>
  )
}

export function getCanonicalUrl(path: string): string {
  const normalizedPath = path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}`
  return `${baseUrl}${normalizedPath}`
}

// 用于中间件和服务端组件检查重定向
export function shouldRedirectForSEO(requestedPath: string): string | null {
  // 移除尾部斜杠（除了根路径）
  if (requestedPath !== '/' && requestedPath.endsWith('/')) {
    return requestedPath.slice(0, -1)
  }

  // 处理双斜杠
  if (requestedPath.includes('//')) {
    return requestedPath.replace(/\/+/g, '/')
  }

  // 处理查询参数的清理（如果需要）
  if (requestedPath.includes('?')) {
    // 对于不需要查询参数的页面，可以重定向移除它们
    const pathWithoutQuery = requestedPath.split('?')[0]
    if (pathWithoutQuery === '/blog' || pathWithoutQuery === '/') {
      return pathWithoutQuery
    }
  }

  return null
}

export default SEOCanonical