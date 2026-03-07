'use client'

import { useState } from 'react'
import { Mail, CheckCircle, Loader2 } from 'lucide-react'

export function NewsletterCTA() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        setStatus('error')
        setErrorMessage(data.error || 'Subscription failed. Please try again.')
        return
      }

      setStatus('success')
      setEmail('')
      window.setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
      setErrorMessage('Unable to subscribe right now. Please try again later.')
    }
  }

  return (
    <section id="newsletter" className="py-16 md:py-20">
      <div className="max-w-2xl mx-auto">
        <div className="relative overflow-hidden bg-white theme-dark:bg-slate-900 rounded-3xl border border-gray-200 theme-dark:border-slate-800 p-8 md:p-12 shadow-xl">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500/10 to-indigo-500/10 rounded-full blur-3xl -z-10" />

          <div className="text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 mb-6 shadow-lg shadow-indigo-500/25">
              <Mail className="w-7 h-7 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 theme-dark:text-white mb-4">
              Get Weekly Tech Insights
            </h2>

            {/* Description */}
            <p className="text-gray-600 theme-dark:text-gray-400 mb-8 max-w-md mx-auto">
              Subscribe to receive curated AI and development articles directly in your inbox.
            </p>

            {/* Form */}
            {status === 'success' ? (
              <div className="flex items-center justify-center gap-2 text-emerald-600 theme-dark:text-emerald-400 font-medium py-4">
                <CheckCircle className="w-5 h-5" />
                Thanks for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-5 py-3.5 rounded-xl bg-gray-50 theme-dark:bg-slate-800 border border-gray-200 theme-dark:border-slate-700 text-gray-900 theme-dark:text-white placeholder:text-gray-500 theme-dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </form>
            )}

            {status === 'error' && (
              <p className="mt-4 text-sm text-red-600 theme-dark:text-red-400">
                {errorMessage}
              </p>
            )}

            {/* Privacy note */}
            <p className="mt-4 text-xs text-gray-500 theme-dark:text-gray-500">
              No spam, unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

