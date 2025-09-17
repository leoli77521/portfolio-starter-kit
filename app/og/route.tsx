import { ImageResponse } from 'next/og'

const DEFAULT_TITLE = 'ToLearn Blog'
const MAX_TITLE_LENGTH = 120

function normalizeTitle(rawTitle: string | null): string {
  if (!rawTitle) return DEFAULT_TITLE
  const trimmed = rawTitle.trim().replace(/\s+/g, ' ')
  if (!trimmed) return DEFAULT_TITLE
  if (trimmed.length <= MAX_TITLE_LENGTH) return trimmed
  return trimmed.slice(0, MAX_TITLE_LENGTH - 3).trimEnd() + '...'
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const title = normalizeTitle(url.searchParams.get('title'))

  const response = new ImageResponse(
    (
      <div tw="flex flex-col w-full h-full items-center justify-center bg-white">
        <div tw="flex flex-col md:flex-row w-full py-12 px-6 md:items-center justify-between">
          <h2 tw="text-4xl font-bold text-left leading-tight">{title}</h2>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )

  response.headers.set('Cache-Control', 'public, max-age=86400, immutable')
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noimageindex')

  return response
}

