import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const metric = await req.json()
  
  // 验证数据格式
  if (!metric.name || typeof metric.value !== 'number') {
    return NextResponse.json({ error: 'Invalid metric data' }, { status: 400 })
  }

  try {
    // 在这里可以将数据发送到你的分析服务
    // 例如：Google Analytics, Datadog, New Relic 等
    
    // 记录到控制台（开发用）
    console.log('Web Vitals metric:', {
      name: metric.name,
      value: metric.value,
      id: metric.id,
      timestamp: new Date().toISOString(),
      url: req.headers.get('referer') || 'unknown'
    })

    // 可以选择性地将数据发送到外部服务
    if (process.env.ANALYTICS_WEBHOOK_URL) {
      await fetch(process.env.ANALYTICS_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...metric,
          timestamp: new Date().toISOString(),
          url: req.headers.get('referer') || 'unknown',
          userAgent: req.headers.get('user-agent') || 'unknown'
        })
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error recording web vitals:', error)
    return NextResponse.json({ error: 'Failed to record metric' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Web Vitals endpoint is active' })
}