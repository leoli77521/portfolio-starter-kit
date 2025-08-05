import './global.css'
import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from './components/nav'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Footer from './components/footer'
import GoogleAnalytics from './components/google-analytics'
import { baseUrl } from './sitemap'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'dark light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
}

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'ToLearn Blog - AI Tech Blog | SEO Optimization | Programming Tutorials',
    template: '%s | ToLearn Blog',
  },
  description: 'Professional technology blog sharing AI artificial intelligence, SEO optimization, and programming development best practices. In-depth technical articles helping developers improve skills, covering frontend development, website optimization, AI applications and trending tech topics.',
  keywords: ['AI Technology', 'SEO Optimization', 'Programming Tutorials', 'Artificial Intelligence', 'Website Optimization', 'Frontend Development', 'Tech Blog', 'JavaScript Tutorials', 'React Development', 'Next.js Framework'],
  authors: [{ name: 'ToLearn Blog' }],
  creator: 'ToLearn Blog',
  publisher: 'ToLearn Blog',
  applicationName: 'ToLearn Blog',
  referrer: 'origin-when-cross-origin',
  openGraph: {
    title: 'ToLearn Blog - AI Tech Blog | SEO Optimization | Programming Tutorials',
    description: 'Professional technology blog sharing AI artificial intelligence, SEO optimization, and programming development best practices. In-depth technical articles helping developers improve skills, covering frontend development, website optimization, AI applications and trending tech topics.',
    url: baseUrl,
    siteName: 'ToLearn Blog',
    locale: 'en_US',
    type: 'website',
    images: [{
      url: `${baseUrl}/og-image.jpg`,
      width: 1200,
      height: 630,
      alt: 'ToLearn Blog - Professional Technology Blog'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToLearn Blog - AI Tech Blog | SEO Optimization | Programming Tutorials',
    description: 'Professional technology blog sharing AI artificial intelligence, SEO optimization, and programming development best practices. In-depth technical articles helping developers improve skills, covering frontend development, website optimization, AI applications and trending tech topics.',
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
  manifest: '/manifest.json',
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
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ToLearn Blog" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased max-w-2xl mx-4 mt-8 lg:mx-auto bg-gradient-primary">
        <GoogleAnalytics />
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
