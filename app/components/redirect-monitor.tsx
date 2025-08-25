interface RedirectMonitorProps {
  from: string
  to: string
  statusCode: number
  timestamp?: string
}

export function RedirectMonitor({ from, to, statusCode, timestamp = new Date().toISOString() }: RedirectMonitorProps) {
  // 在开发环境中记录重定向信息
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔄 SEO Redirect: ${from} → ${to} (${statusCode})`, {
      from,
      to,
      statusCode,
      timestamp,
      seoImpact: statusCode === 301 ? 'Link juice preserved' : 'Temporary redirect'
    })
  }

  return null
}

// 分析重定向链的函数
export function analyzeRedirectChain(redirects: Array<{ from: string; to: string }>) {
  const redirectMap = new Map(redirects.map(r => [r.from, r.to]))
  const chains: string[][] = []
  const processed = new Set<string>()

  for (const redirect of redirects) {
    if (processed.has(redirect.from)) continue

    const chain = [redirect.from]
    let current = redirect.from

    // 跟踪重定向链
    while (redirectMap.has(redirectMap.get(current)!)) {
      current = redirectMap.get(current)!
      if (chain.includes(current)) {
        // 检测到循环重定向
        console.warn(`🔄 Redirect loop detected: ${chain.join(' → ')} → ${current}`)
        break
      }
      chain.push(current)
    }

    if (chain.length > 1) {
      chains.push(chain)
      chain.forEach(url => processed.add(url))
    }

    // 警告过长的重定向链
    if (chain.length > 3) {
      console.warn(`⚠️ Long redirect chain (${chain.length} hops): ${chain.join(' → ')}`)
    }
  }

  return chains
}

export default RedirectMonitor