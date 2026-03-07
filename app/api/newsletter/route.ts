import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  let payload: { email?: unknown }

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 })
  }

  const { email } = payload
  const normalizedEmail = typeof email === 'string' ? email.trim() : ''

  if (!normalizedEmail) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)

  if (!isEmailValid) {
    return NextResponse.json(
      { error: 'Please enter a valid email address' },
      { status: 400 }
    )
  }

  const apiKey =
    process.env.CONVERTKIT_API_KEY || process.env.NEXT_PUBLIC_CONVERTKIT_API_KEY
  const formId =
    process.env.CONVERTKIT_FORM_ID || process.env.NEXT_PUBLIC_CONVERTKIT_FORM_ID

  if (!apiKey || !formId) {
    return NextResponse.json(
      { error: 'Newsletter is not configured on the server' },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: normalizedEmail,
        api_key: apiKey,
      }),
    })

    if (response.status >= 400) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.message || 'Subscription failed' },
        { status: response.status }
      )
    }

    return NextResponse.json({ error: '' }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Subscription failed' },
      { status: 500 }
    )
  }
}
