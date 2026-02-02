'use client'

import Link from 'next/link'
import { ArrowRight, FileText, Eye, Star, Sparkles } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center py-16 md:py-24 px-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-800/50 mb-8">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
            AI-Powered Tech Insights
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white">
            Exploring AI &
          </span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Modern Development
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          In-depth articles on artificial intelligence, programming, and web development.
          Stay ahead with practical tutorials and industry insights.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300"
          >
            Browse Articles
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="#newsletter"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-all duration-300"
          >
            Subscribe
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-medium">100+ Articles</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Eye className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-medium">10K+ Readers</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Star className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-medium">4.8 Rating</span>
          </div>
        </div>
      </div>
    </section>
  )
}
