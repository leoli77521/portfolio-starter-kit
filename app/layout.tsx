import './global.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from './components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from './components/footer'
import { baseUrl } from './sitemap'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'ToLearn Blog - 专业的编程技术与AI洞察分享',
    template: '%s | ToLearn Blog',
  },
  description: '专注于分享前沿编程技术、AI人工智能、SEO优化策略和Web开发最佳实践。深度技术文章，助力开发者成长。',
  keywords: ['编程技术', 'AI人工智能', 'SEO优化', 'Web开发', '前端开发', '技术博客', 'JavaScript', 'React', 'Next.js'],
  authors: [{ name: 'ToLearn Blog' }],
  creator: 'ToLearn Blog',
  publisher: 'ToLearn Blog',
  applicationName: 'ToLearn Blog',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
  openGraph: {
    title: 'ToLearn Blog - 专业的编程技术与AI洞察分享',
    description: '专注于分享前沿编程技术、AI人工智能、SEO优化策略和Web开发最佳实践。深度技术文章，助力开发者成长。',
    url: baseUrl,
    siteName: 'ToLearn Blog',
    locale: 'zh_CN',
    type: 'website',
    images: [{
      url: `${baseUrl}/og-image.jpg`,
      width: 1200,
      height: 630,
      alt: 'ToLearn Blog - 专业技术博客'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToLearn Blog - 专业的编程技术与AI洞察分享',
    description: '专注于分享前沿编程技术、AI人工智能、SEO优化策略和Web开发最佳实践。深度技术文章，助力开发者成长。',
    images: [`${baseUrl}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      'en-US': baseUrl,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  category: 'technology',
}

const cx = (...classes) => classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={cx(
        'text-black bg-white dark:text-white dark:bg-black',
        GeistSans.variable,
        GeistMono.variable
      )}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Vim Portfolio" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="antialiased max-w-xl mx-4 mt-8 lg:mx-auto">
        <main className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0">
          <Navbar />
          {children}
          <Footer />
          <Analytics />
          <SpeedInsights />
        </main>
      </body>
    </html>
  )
}
