import { NextRequest, NextResponse } from 'next/server'
import { baseUrl } from 'app/sitemap'

// SEO健康检查配置
interface SEOCheck {
  name: string
  check: () => Promise<{ passed: boolean; message: string; details?: any }>
}

const seoChecks: SEOCheck[] = [
  {
    name: 'Sitemap Accessibility',
    check: async () => {
      try {
        const response = await fetch(`${baseUrl}/sitemap.xml`)
        return {
          passed: response.ok,
          message: response.ok ? 'Sitemap is accessible' : `Sitemap returned ${response.status}`,
          details: { status: response.status, url: `${baseUrl}/sitemap.xml` }
        }
      } catch (error) {
        return {
          passed: false,
          message: 'Failed to fetch sitemap',
          details: { error: error instanceof Error ? error.message : 'Unknown error' }
        }
      }
    }
  },
  {
    name: 'Robots.txt Accessibility',
    check: async () => {
      try {
        const response = await fetch(`${baseUrl}/robots.txt`)
        return {
          passed: response.ok,
          message: response.ok ? 'Robots.txt is accessible' : `Robots.txt returned ${response.status}`,
          details: { status: response.status, url: `${baseUrl}/robots.txt` }
        }
      } catch (error) {
        return {
          passed: false,
          message: 'Failed to fetch robots.txt',
          details: { error: error instanceof Error ? error.message : 'Unknown error' }
        }
      }
    }
  },
  {
    name: 'Homepage Meta Tags',
    check: async () => {
      try {
        const response = await fetch(baseUrl)
        const html = await response.text()
        
        const hasTitle = html.includes('<title>')
        const hasDescription = html.includes('<meta name="description"')
        const hasCanonical = html.includes('<link rel="canonical"')
        const hasOGImage = html.includes('<meta property="og:image"')
        
        const checks = {
          title: hasTitle,
          description: hasDescription,
          canonical: hasCanonical,
          ogImage: hasOGImage
        }
        
        const passedCount = Object.values(checks).filter(Boolean).length
        const totalCount = Object.keys(checks).length
        
        return {
          passed: passedCount === totalCount,
          message: `Meta tags check: ${passedCount}/${totalCount} passed`,
          details: checks
        }
      } catch (error) {
        return {
          passed: false,
          message: 'Failed to check homepage meta tags',
          details: { error: error instanceof Error ? error.message : 'Unknown error' }
        }
      }
    }
  },
  {
    name: 'Structured Data Validation',
    check: async () => {
      try {
        const response = await fetch(baseUrl)
        const html = await response.text()
        
        const jsonLdScripts = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi)
        
        if (!jsonLdScripts) {
          return {
            passed: false,
            message: 'No structured data found',
            details: { count: 0 }
          }
        }
        
        let validJsonCount = 0
        const errors: string[] = []
        
        jsonLdScripts.forEach((script, index) => {
          try {
            const jsonContent = script.replace(/<script[^>]*>/, '').replace(/<\/script>/, '').trim()
            JSON.parse(jsonContent)
            validJsonCount++
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            errors.push(`Script ${index + 1}: ${errorMessage}`)
          }
        })
        
        return {
          passed: validJsonCount === jsonLdScripts.length && errors.length === 0,
          message: `Structured data: ${validJsonCount}/${jsonLdScripts.length} valid`,
          details: { validCount: validJsonCount, totalCount: jsonLdScripts.length, errors }
        }
      } catch (error) {
        return {
          passed: false,
          message: 'Failed to validate structured data',
          details: { error: error instanceof Error ? error.message : 'Unknown error' }
        }
      }
    }
  },
  {
    name: 'Page Speed Basics',
    check: async () => {
      try {
        const startTime = Date.now()
        const response = await fetch(baseUrl)
        const endTime = Date.now()
        const responseTime = endTime - startTime
        
        const html = await response.text()
        const hasLazyLoading = html.includes('loading="lazy"')
        const hasPreconnect = html.includes('rel="preconnect"')
        const hasCompression = response.headers.get('content-encoding') === 'gzip' || 
                               response.headers.get('content-encoding') === 'br'
        
        const checks = {
          responseTime: responseTime < 3000,
          lazyLoading: hasLazyLoading,
          preconnect: hasPreconnect,
          compression: hasCompression
        }
        
        const passedCount = Object.values(checks).filter(Boolean).length
        const totalCount = Object.keys(checks).length
        
        return {
          passed: passedCount >= totalCount * 0.75, // 75% pass rate
          message: `Performance basics: ${passedCount}/${totalCount} passed`,
          details: { ...checks, responseTime: `${responseTime}ms` }
        }
      } catch (error) {
        return {
          passed: false,
          message: 'Failed to check page speed basics',
          details: { error: error instanceof Error ? error.message : 'Unknown error' }
        }
      }
    }
  },
  {
    name: 'Mobile Friendliness',
    check: async () => {
      try {
        const response = await fetch(baseUrl)
        const html = await response.text()
        
        const hasViewport = html.includes('<meta name="viewport"')
        const hasResponsiveImages = html.includes('srcset=') || html.includes('sizes=')
        const hasTouchIcons = html.includes('apple-touch-icon')
        
        const checks = {
          viewport: hasViewport,
          responsiveImages: hasResponsiveImages,
          touchIcons: hasTouchIcons
        }
        
        const passedCount = Object.values(checks).filter(Boolean).length
        const totalCount = Object.keys(checks).length
        
        return {
          passed: checks.viewport, // Viewport is essential
          message: `Mobile friendliness: ${passedCount}/${totalCount} passed`,
          details: checks
        }
      } catch (error) {
        return {
          passed: false,
          message: 'Failed to check mobile friendliness',
          details: { error: error instanceof Error ? error.message : 'Unknown error' }
        }
      }
    }
  }
]

export async function GET() {
  const results = await Promise.all(
    seoChecks.map(async (check) => ({
      name: check.name,
      ...(await check.check())
    }))
  )
  
  const passedCount = results.filter(r => r.passed).length
  const totalCount = results.length
  const overallScore = Math.round((passedCount / totalCount) * 100)
  
  const report = {
    timestamp: new Date().toISOString(),
    overallScore,
    summary: {
      passed: passedCount,
      total: totalCount,
      status: overallScore >= 80 ? 'excellent' : overallScore >= 60 ? 'good' : overallScore >= 40 ? 'needs-improvement' : 'poor'
    },
    checks: results
  }
  
  return NextResponse.json(report, {
    headers: {
      'Cache-Control': 'no-store, max-age=0'
    }
  })
}

// POST endpoint for external monitoring services
export async function POST(request: NextRequest) {
  try {
    const { webhook } = await request.json()
    
    if (webhook && process.env.SEO_WEBHOOK_URL) {
      const results = await Promise.all(
        seoChecks.map(async (check) => ({
          name: check.name,
          ...(await check.check())
        }))
      )
      
      const passedCount = results.filter(r => r.passed).length
      const totalCount = results.length
      
      // Send to webhook
      await fetch(process.env.SEO_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          site: baseUrl,
          score: Math.round((passedCount / totalCount) * 100),
          results
        })
      })
    }
    
    return NextResponse.json({ success: true, message: 'SEO monitoring triggered' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process monitoring request' },
      { status: 500 }
    )
  }
}