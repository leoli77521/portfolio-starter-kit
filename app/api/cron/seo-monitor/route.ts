import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // 验证cron密钥（防止未授权访问）
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET || 'your-secret-key'
  
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    // 触发SEO健康检查
    const response = await fetch(`${request.nextUrl.origin}/api/seo-health`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ webhook: true })
    })
    
    if (!response.ok) {
      throw new Error(`SEO health check failed: ${response.status}`)
    }
    
    const result = await response.json()
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: 'SEO monitoring completed',
      result
    })
  } catch (error) {
    console.error('Cron job failed:', error)
    
    return NextResponse.json({
      success: false,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// 备用POST方法
export async function POST(request: NextRequest) {
  return GET(request)
}