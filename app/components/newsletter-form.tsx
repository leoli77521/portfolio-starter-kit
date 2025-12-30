'use client'

import { useRef, useState } from 'react'
import { ArrowIcon } from './footer'

export default function NewsletterForm() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const subscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(false)
    setSuccess(false)

    const res = await fetch('/api/newsletter', {
      body: JSON.stringify({
        email: inputRef.current?.value,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    const { error } = await res.json()

    if (error) {
      setError(true)
      setLoading(false)
      return
    }

    if (inputRef.current) {
      inputRef.current.value = ''
    }

    setSuccess(true)
    setLoading(false)
  }

  return (
    <div className="w-full">
      <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">
        Stay Connected
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Join our newsletter for the latest AI insights and tech tutorials.
      </p>
      
      {!success ? (
        <form onSubmit={subscribe} className="relative max-w-sm">
          <div className="relative">
            <input
              ref={inputRef}
              aria-label="Email for newsletter"
              placeholder="jane@example.com"
              type="email"
              autoComplete="email"
              required
              className="w-full px-4 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white/50 dark:bg-black/50 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-sm transition-all"
            />
            <button
              className="absolute right-1 top-1 p-1.5 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-600" />
              ) : (
                <ArrowIcon />
              )}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-xs text-red-600 dark:text-red-400">
              Something went wrong. Please try again.
            </p>
          )}
        </form>
      ) : (
        <div className="flex items-center gap-2 p-3 text-sm text-emerald-800 dark:text-emerald-200 bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-lg backdrop-blur-sm">
          <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Thanks for subscribing! Check your inbox to confirm.</span>
        </div>
      )}
    </div>
  )
}
