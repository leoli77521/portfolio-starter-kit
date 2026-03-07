import { timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'

function isAuthorized(authHeader: string | null, secret: string) {
  const expected = `Bearer ${secret}`

  if (!authHeader || authHeader.length !== expected.length) {
    return false
  }

  return timingSafeEqual(Buffer.from(authHeader), Buffer.from(expected))
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    console.error('Missing CRON_SECRET for seo-monitor route')
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  if (!isAuthorized(authHeader, cronSecret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const response = await fetch(`${request.nextUrl.origin}/api/seo-health`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ webhook: true }),
    })

    if (!response.ok) {
      throw new Error(`SEO health check failed: ${response.status}`)
    }

    const result = await response.json()

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: 'SEO monitoring completed',
      result,
    })
  } catch (error) {
    console.error('Cron job failed:', error)

    return NextResponse.json(
      {
        success: false,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
