'use client'

import { useRef, useState } from 'react'
import { ArrowUpRight, Mail } from 'lucide-react'

export default function NewsletterForm() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const subscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(false)
    setSuccess(false)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: inputRef.current?.value,
        }),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        setError(true)
        setLoading(false)
        return
      }

      if (inputRef.current) {
        inputRef.current.value = ''
      }

      setSuccess(true)
      setLoading(false)
    } catch {
      setError(true)
      setLoading(false)
    }
  }

  return (
    <div className="rounded-[1.75rem] border border-slate-200/70 bg-white/80 p-5 shadow-sm backdrop-blur theme-dark:border-slate-800 theme-dark:bg-slate-950/80">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/80 bg-slate-100/80 text-slate-700 theme-dark:border-slate-800 theme-dark:bg-slate-900 theme-dark:text-slate-200">
          <Mail className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="section-kicker">Newsletter</p>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950 theme-dark:text-white">
            Weekly notes, not filler
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 theme-dark:text-slate-300">
            Get the newest analysis and practical writeups in your inbox.
          </p>
        </div>
      </div>

      {!success ? (
        <form onSubmit={subscribe} className="mt-5">
          <div className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 p-2 theme-dark:border-slate-800 theme-dark:bg-slate-950/90">
            <input
              ref={inputRef}
              aria-label="Email for newsletter"
              placeholder="jane@example.com"
              type="email"
              autoComplete="email"
              required
              className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 theme-dark:text-slate-100 theme-dark:placeholder:text-slate-500"
            />
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 theme-dark:bg-slate-100 theme-dark:text-slate-950"
              type="submit"
              disabled={loading}
              aria-label="Subscribe"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white theme-dark:border-slate-400 theme-dark:border-t-slate-950" />
              ) : (
                <ArrowUpRight className="h-4 w-4" />
              )}
            </button>
          </div>

          {error ? (
            <p className="mt-3 text-xs text-red-600 theme-dark:text-red-400">
              Subscription failed. Please try again with a valid email.
            </p>
          ) : (
            <p className="mt-3 text-xs text-slate-500 theme-dark:text-slate-400">
              One concise update at a time. No noisy autoresponder sequence.
            </p>
          )}
        </form>
      ) : (
        <div className="mt-5 rounded-[1.25rem] border border-emerald-200/80 bg-emerald-50/90 px-4 py-4 text-sm text-emerald-800 theme-dark:border-emerald-900/80 theme-dark:bg-emerald-950/40 theme-dark:text-emerald-200">
          Thanks. Check your inbox to confirm the subscription.
        </div>
      )}
    </div>
  )
}

