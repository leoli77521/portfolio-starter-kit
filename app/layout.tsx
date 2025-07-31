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
    default: 'Vim Enthusiast Portfolio: Coding Insights & AI Blog',
    template: '%s | Vim Enthusiast Portfolio',
  },
  description: 'Explore my portfolio showcasing my passion for Vim, static typing, and dark mode, alongside insights into AI and SEO.',
  keywords: ['Vim', 'coding', 'portfolio', 'AI', 'SEO', 'web development', 'programming', 'tech blog'],
  authors: [{ name: 'Vim Enthusiast Portfolio' }],
  creator: 'Vim Enthusiast Portfolio',
  publisher: 'Vim Enthusiast Portfolio',
  applicationName: 'Vim Enthusiast Portfolio',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
  openGraph: {
    title: 'Vim Enthusiast Portfolio: Coding Insights & AI Blog',
    description: 'Explore my portfolio showcasing my passion for Vim, static typing, and dark mode, alongside insights into AI and SEO.',
    url: baseUrl,
    siteName: 'Vim Enthusiast Portfolio',
    locale: 'en_US',
    type: 'website',
    images: [{
      url: `${baseUrl}/og-image.jpg`,
      width: 1200,
      height: 630,
      alt: 'Vim Enthusiast Portfolio'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vim Enthusiast Portfolio: Coding Insights & AI Blog',
    description: 'Explore my portfolio showcasing my passion for Vim, static typing, and dark mode, alongside insights into AI and SEO.',
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
