import { ImageResponse } from 'next/og'

const DEFAULT_TITLE = 'ToLearn Blog'
const MAX_TITLE_LENGTH = 100

function normalizeTitle(rawTitle: string | null): string {
  if (!rawTitle) return DEFAULT_TITLE
  const trimmed = rawTitle.trim().replace(/\s+/g, ' ')
  if (!trimmed) return DEFAULT_TITLE
  if (trimmed.length <= MAX_TITLE_LENGTH) return trimmed
  return trimmed.slice(0, MAX_TITLE_LENGTH - 3).trimEnd() + '...'
}

// Detect content type for visual theming
function detectContentType(title: string): 'ai' | 'seo' | 'coding' | 'guide' | 'default' {
  const lower = title.toLowerCase()
  if (lower.includes('ai') || lower.includes('llm') || lower.includes('gpt') || lower.includes('claude')) {
    return 'ai'
  }
  if (lower.includes('seo') || lower.includes('search') || lower.includes('ranking')) {
    return 'seo'
  }
  if (lower.includes('code') || lower.includes('programming') || lower.includes('benchmark') || lower.includes('developer')) {
    return 'coding'
  }
  if (lower.includes('guide') || lower.includes('tutorial') || lower.includes('how to')) {
    return 'guide'
  }
  return 'default'
}

// Get theme colors based on content type
function getThemeColors(type: ReturnType<typeof detectContentType>): {
  gradientStart: string
  gradientEnd: string
  accent: string
  emoji: string
} {
  const themes = {
    ai: {
      gradientStart: '#0A0F1C',
      gradientEnd: '#1E1B4B',
      accent: '#8B5CF6',
      emoji: '🤖',
    },
    seo: {
      gradientStart: '#0F172A',
      gradientEnd: '#1E3A5F',
      accent: '#22C55E',
      emoji: '📈',
    },
    coding: {
      gradientStart: '#0C0C0C',
      gradientEnd: '#1A1A2E',
      accent: '#6366F1',
      emoji: '💻',
    },
    guide: {
      gradientStart: '#0F172A',
      gradientEnd: '#1E293B',
      accent: '#F59E0B',
      emoji: '📖',
    },
    default: {
      gradientStart: '#0A0F1C',
      gradientEnd: '#1E293B',
      accent: '#6366F1',
      emoji: '📝',
    },
  }
  return themes[type]
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const title = normalizeTitle(url.searchParams.get('title'))
  const category = url.searchParams.get('category') || ''

  const contentType = detectContentType(title)
  const theme = getThemeColors(contentType)

  const response = new ImageResponse(
    (
      <div
        tw="flex flex-col w-full h-full relative"
        style={{
          background: `linear-gradient(135deg, ${theme.gradientStart} 0%, ${theme.gradientEnd} 100%)`,
        }}
      >
        {/* Decorative gradient orbs */}
        <div
          tw="absolute"
          style={{
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            background: `radial-gradient(circle, ${theme.accent}40 0%, transparent 70%)`,
            borderRadius: '50%',
          }}
        />
        <div
          tw="absolute"
          style={{
            bottom: '-150px',
            left: '-100px',
            width: '500px',
            height: '500px',
            background: `radial-gradient(circle, ${theme.accent}20 0%, transparent 70%)`,
            borderRadius: '50%',
          }}
        />

        {/* Content container */}
        <div tw="flex flex-col w-full h-full justify-between p-16 relative">
          {/* Header with logo and category */}
          <div tw="flex items-center justify-between w-full">
            <div tw="flex items-center">
              <div
                tw="flex items-center justify-center rounded-xl mr-4"
                style={{
                  width: '56px',
                  height: '56px',
                  background: `linear-gradient(135deg, ${theme.accent} 0%, ${theme.accent}80 100%)`,
                }}
              >
                <span tw="text-3xl">{theme.emoji}</span>
              </div>
              <span tw="text-2xl font-bold text-white opacity-90">ToLearn Blog</span>
            </div>
            {category && (
              <div
                tw="flex px-4 py-2 rounded-full"
                style={{ backgroundColor: `${theme.accent}30` }}
              >
                <span tw="text-lg text-white opacity-80">{category}</span>
              </div>
            )}
          </div>

          {/* Main title */}
          <div tw="flex flex-col flex-1 justify-center max-w-4xl">
            <h1
              tw="font-bold text-white leading-tight"
              style={{
                fontSize: title.length > 60 ? '48px' : title.length > 40 ? '56px' : '64px',
                lineHeight: 1.2,
                textShadow: '0 2px 20px rgba(0,0,0,0.3)',
              }}
            >
              {title}
            </h1>
          </div>

          {/* Footer with branding */}
          <div tw="flex items-center justify-between w-full">
            <div tw="flex items-center text-white opacity-60">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span tw="ml-2 text-lg">tolearn.blog</span>
            </div>
            <div tw="flex items-center">
              <div
                tw="flex h-1 rounded-full"
                style={{
                  width: '120px',
                  background: `linear-gradient(90deg, ${theme.accent} 0%, ${theme.accent}40 100%)`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          tw="absolute bottom-0 left-0 right-0 h-1"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${theme.accent} 50%, transparent 100%)`,
          }}
        />
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
