'use client'

import { useState } from 'react'

type ContactFormProps = {
  recipientEmail: string
}

type ContactStatus = 'idle' | 'opened'

export function ContactForm({ recipientEmail }: ContactFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<ContactStatus>('idle')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedMessage = message.trim()
    const subject = trimmedName
      ? `Website contact from ${trimmedName}`
      : 'Website contact'
    const body = [
      trimmedName ? `Name: ${trimmedName}` : undefined,
      `Email: ${trimmedEmail}`,
      '',
      trimmedMessage,
    ]
      .filter(Boolean)
      .join('\n')

    window.location.href = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setStatus('opened')
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-slate-700 theme-dark:text-slate-300"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="w-full rounded-[1.25rem] border border-slate-200/80 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-300 theme-dark:border-slate-800 theme-dark:bg-slate-950/90 theme-dark:text-slate-100 theme-dark:placeholder:text-slate-500 theme-dark:focus:border-indigo-500/60"
            placeholder="Your name"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-slate-700 theme-dark:text-slate-300"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full rounded-[1.25rem] border border-slate-200/80 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-300 theme-dark:border-slate-800 theme-dark:bg-slate-950/90 theme-dark:text-slate-100 theme-dark:placeholder:text-slate-500 theme-dark:focus:border-indigo-500/60"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-medium text-slate-700 theme-dark:text-slate-300"
          >
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            required
            className="w-full rounded-[1.25rem] border border-slate-200/80 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-300 theme-dark:border-slate-800 theme-dark:bg-slate-950/90 theme-dark:text-slate-100 theme-dark:placeholder:text-slate-500 theme-dark:focus:border-indigo-500/60"
            placeholder="What are you reaching out about?"
          />
        </div>

        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 theme-dark:bg-slate-100 theme-dark:text-slate-950"
        >
          Open email draft
        </button>
      </form>

      <p className="mt-4 text-sm leading-6 text-slate-600 theme-dark:text-slate-300">
        This opens your local mail app with a prefilled draft.
      </p>

      {status === 'opened' ? (
        <p className="mt-3 text-sm text-emerald-600 theme-dark:text-emerald-400">
          Draft opened. If nothing happened, use the direct email link below.
        </p>
      ) : null}

      <a
        href={`mailto:${recipientEmail}`}
        className="mt-4 inline-flex text-sm font-medium text-slate-700 transition-colors hover:text-slate-950 theme-dark:text-slate-300 theme-dark:hover:text-white"
      >
        Email {recipientEmail}
      </a>
    </div>
  )
}

