// SEO权重传递验证工具
export interface RedirectSEOImpact {
  from: string
  to: string
  statusCode: number
  preservesLinkJuice: boolean
  seoRisk: 'low' | 'medium' | 'high'
  recommendation: string
}

export function analyzeSEOImpact(from: string, to: string, statusCode: number): RedirectSEOImpact {
  let preservesLinkJuice = false
  let seoRisk: 'low' | 'medium' | 'high' = 'high'
  let recommendation = ''

  // 301重定向保持SEO权重
  if (statusCode === 301) {
    preservesLinkJuice = true
    seoRisk = 'low'
    recommendation = 'Good: 301 redirect preserves link juice and SEO authority.'
  }

  // 302重定向不传递权重
  if (statusCode === 302) {
    preservesLinkJuice = false
    seoRisk = 'medium'
    recommendation = 'Caution: 302 redirect is temporary and may not pass full link juice.'
  }

  // 检查重定向是否合理
  const fromDomain = extractDomain(from)
  const toDomain = extractDomain(to)
  
  // 跨域重定向风险更高
  if (fromDomain !== toDomain) {
    seoRisk = 'high'
    recommendation = 'Warning: Cross-domain redirect may lose significant SEO value.'
  }

  // 检查URL结构变化
  const fromPath = new URL(from, 'https://example.com').pathname
  const toPath = new URL(to, 'https://example.com').pathname
  
  if (fromPath.split('/').length !== toPath.split('/').length) {
    if (seoRisk === 'low') seoRisk = 'medium'
    recommendation += ' URL structure change detected - monitor rankings.'
  }

  return {
    from,
    to,
    statusCode,
    preservesLinkJuice,
    seoRisk,
    recommendation
  }
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    // 如果是相对URL，返回空字符串表示同域
    return ''
  }
}

// 生成重定向映射表用于搜索引擎
export function generateRedirectMap(redirects: Array<{from: string, to: string}>) {
  const map = new Map<string, string>()
  
  for (const redirect of redirects) {
    map.set(redirect.from, redirect.to)
  }
  
  // 检查并警告重定向链
  const chains = findRedirectChains(map)
  if (chains.length > 0) {
    console.warn('⚠️ SEO Warning: Redirect chains detected:', chains)
  }
  
  return map
}

function findRedirectChains(redirectMap: Map<string, string>): string[][] {
  const chains: string[][] = []
  const visited = new Set<string>()
  
  // 兼容ES5的Map迭代方式
  const keys = Array.from(redirectMap.keys())
  
  for (let i = 0; i < keys.length; i++) {
    const from = keys[i]
    if (visited.has(from)) continue
    
    const chain = [from]
    let current = from
    
    while (redirectMap.has(redirectMap.get(current)!)) {
      const next = redirectMap.get(current)!
      if (chain.includes(next)) {
        // 检测到循环
        chains.push([...chain, next])
        break
      }
      chain.push(next)
      current = next
    }
    
    if (chain.length > 2) {
      chains.push(chain)
    }
    
    for (let j = 0; j < chain.length; j++) {
      visited.add(chain[j])
    }
  }
  
  return chains
}

// 验证canonical标签的正确性
export function validateCanonical(currentUrl: string, canonicalUrl: string): {
  isValid: boolean
  issues: string[]
  seoImpact: string
} {
  const issues: string[] = []
  let isValid = true
  let seoImpact = 'positive'

  try {
    const current = new URL(currentUrl)
    const canonical = new URL(canonicalUrl)

    // 检查协议
    if (current.protocol !== canonical.protocol) {
      issues.push('Protocol mismatch between current and canonical URL')
      isValid = false
    }

    // 检查域名
    if (current.hostname !== canonical.hostname) {
      issues.push('Domain mismatch - canonical should point to same domain')
      isValid = false
      seoImpact = 'negative'
    }

    // 检查自引用
    if (currentUrl === canonicalUrl) {
      seoImpact = 'neutral'
    }

    // 检查参数处理
    if (current.search !== canonical.search && current.pathname === canonical.pathname) {
      seoImpact = 'positive' // 正确处理了参数去重
    }

  } catch (error) {
    issues.push('Invalid URL format')
    isValid = false
    seoImpact = 'negative'
  }

  return { isValid, issues, seoImpact }
}

export default { analyzeSEOImpact, generateRedirectMap, validateCanonical }