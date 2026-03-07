import './global.css'
import type { Metadata, Viewport } from 'next'
import { inter, jetBrainsMono } from './fonts'
import { Navbar } from './components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from './components/footer'
import GoogleAnalytics from './components/google-analytics'
import GoogleAdSense from './components/google-adsense'
import { baseUrl } from './sitemap'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'dark light',
}

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'ToLearn Blog - AI, SEO & Programming Tutorials',
    template: '%s | ToLearn Blog',
  },
  description: 'ToLearn Blog - Your gateway to AI innovation, SEO mastery, and modern web development. Expert tutorials and insights for tech professionals.',
  keywords: ['AI Technology', 'SEO Optimization', 'Programming Tutorials', 'Artificial Intelligence', 'Website Optimization', 'Frontend Development', 'Tech Blog', 'JavaScript Tutorials', 'React Development', 'Next.js Framework'],
  authors: [{ name: 'ToLearn Blog' }],
  creator: 'ToLearn Blog',
  publisher: 'ToLearn Blog',
  applicationName: 'ToLearn Blog',
  referrer: 'origin-when-cross-origin',
  openGraph: {
    title: 'ToLearn Blog - AI, SEO & Programming Tutorials',
    description: 'ToLearn Blog - Your gateway to AI innovation, SEO mastery, and modern web development. Expert tutorials and insights for tech professionals.',
    url: baseUrl,
    siteName: 'ToLearn Blog',
    locale: 'en_US',
    type: 'website',
    images: [{
      url: `${baseUrl}/og`,
      width: 1200,
      height: 630,
      alt: 'ToLearn Blog - Professional Technology Blog'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToLearn Blog - AI, SEO & Programming Tutorials',
    description: 'Discover cutting-edge AI tools, proven SEO techniques, and modern programming best practices. Elevate your development skills with ToLearn.',
    images: [`${baseUrl}/og`],
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
    // canonical: baseUrl, // Removed global canonical to avoid duplicate content issues
    languages: {
      'en-US': baseUrl,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  category: 'technology',
  manifest: '/manifest.json',
}

const cx = (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(' ')

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cx(
        inter.variable,
        jetBrainsMono.variable
      )}
    >
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ToLearn Blog" />
        <meta name="theme-color" content="#fafafa" />

        {/* 璧勬簮鎻愮ず浼樺寲 - 棰勮繛鎺ュ埌鍏抽敭鍩熷悕 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />

        {/* 鍥炬爣浼樺寲 */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="alternate" type="application/rss+xml" href="/rss" title="ToLearn Blog RSS Feed" />

        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var dark='#0b0f1a',light='#fafafa',saved=localStorage.getItem('theme'),prefersDark=window.matchMedia('(prefers-color-scheme:dark)').matches,theme=(saved==='dark'||(!saved&&prefersDark))?'dark':'light',meta=document.querySelector('meta[name="theme-color"]');document.documentElement.classList.toggle('dark',theme==='dark');document.documentElement.style.colorScheme=theme;if(meta){meta.setAttribute('content',theme==='dark'?dark:light)}}catch(e){}})()`
          }}
        />
      </head>
      <body className={cx('antialiased max-w-7xl mx-4 lg:mx-auto mt-8 lg:mt-12', inter.className)}>
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <GoogleAnalytics />
        <main id="main-content" className="flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0" role="main">
          <Navbar />
          {children}
          <Footer />
          <Analytics />
          <SpeedInsights />
          <GoogleAdSense />
        </main>
      </body>
    </html>
  )
}
