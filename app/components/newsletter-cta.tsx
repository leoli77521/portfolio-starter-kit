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
      <div className="surface-panel relative overflow-hidden px-6 py-8 md:px-10 md:py-10">
        <div className="absolute inset-x-0 top-0 -z-10 h-48 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.18),transparent_42%),radial-gradient(circle_at_82%_22%,rgba(13,148,136,0.16),transparent_36%)]" />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.86fr)] lg:items-start">
          <div>
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-100/85 text-slate-900 theme-dark:border-slate-800 theme-dark:bg-slate-900/80 theme-dark:text-white">
              <Mail className="h-6 w-6" />
            </div>

            <p className="section-kicker mt-6">Get the weekly brief</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white md:text-4xl">
              One sharp weekly email for AI builders and web operators.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 theme-dark:text-slate-300">
              Get a concise brief on product shifts, search changes, and practical implementation
              patterns worth paying attention to.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                'Clear analysis, not trend-chasing',
                'Practical takeaways you can actually use',
                'One concise update each week',
                'No noisy autoresponder sequence',
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.25rem] border border-slate-200/80 bg-slate-50/85 px-4 py-4 text-sm text-slate-700 theme-dark:border-slate-800 theme-dark:bg-slate-950/70 theme-dark:text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card px-5 py-5 md:px-6 md:py-6">
            <p className="section-kicker">Subscribe</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-slate-950 theme-dark:text-white">
              Weekly analysis, not filler
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
              One concise email per week with signal-first notes on coding agents, search
              visibility, and real execution patterns.
            </p>

            {status === 'success' ? (
              <div className="mt-6 flex items-center gap-2 rounded-[1.25rem] border border-emerald-200/80 bg-emerald-50/90 px-4 py-4 text-sm font-medium text-emerald-700 theme-dark:border-emerald-900/80 theme-dark:bg-emerald-950/40 theme-dark:text-emerald-300">
                <CheckCircle className="h-5 w-5" />
                Thanks for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-xl border border-slate-200/80 bg-white/90 px-5 py-3.5 text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-300 theme-dark:border-slate-800 theme-dark:bg-slate-950/80 theme-dark:text-white theme-dark:placeholder:text-slate-500 theme-dark:focus:border-indigo-500/60"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 theme-dark:bg-slate-100 theme-dark:text-slate-950"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
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

            <p className="mt-4 text-xs text-slate-500 theme-dark:text-slate-400">
              No spam. Easy unsubscribe. Just signal.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
