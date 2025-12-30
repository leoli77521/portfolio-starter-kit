import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email } = await request.json()

  if (!email || !email.length) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  const API_KEY = process.env.NEXT_PUBLIC_CONVERTKIT_API_KEY
  const FORM_ID = process.env.NEXT_PUBLIC_CONVERTKIT_FORM_ID
  const API_URL = `https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`

  const data = {
    email,
    api_key: API_KEY,
  }

  try {
    const response = await fetch(API_URL, {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
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
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    )
  }
}
