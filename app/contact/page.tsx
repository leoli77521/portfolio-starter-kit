import type { Metadata } from 'next'
import Link from 'next/link'
import { baseUrl, organization } from 'app/lib/constants'
import { ContactForm } from 'app/components/contact-form'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Reach ToLearn by email for article feedback, questions, or collaboration.',
}

const contactTopics = [
  'Article feedback or corrections',
  'Questions about AI, search, or implementation details',
  'Collaboration or partnership inquiries',
]

export default function ContactPage() {
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${baseUrl}/contact/#contact`,
    url: `${baseUrl}/contact`,
    name: 'Contact ToLearn',
    description: 'Reach ToLearn by email for article feedback, questions, or collaboration.',
    mainEntity: organization,
  }

  return (
    <section className="space-y-8">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactSchema),
        }}
      />

      <div className="surface-panel px-6 py-8 md:px-8 md:py-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.8fr)] lg:items-end">
          <div>
            <p className="section-kicker">Get in touch</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white md:text-5xl">
              The fastest route is still email
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600 theme-dark:text-slate-300 md:text-lg">
              If you have a question, found an error, or want to talk about the work, send a
              note. The form below opens a prefilled email draft in your local mail app.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="stat-pill">
              <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
                Email
              </span>
              <span>{organization.email}</span>
            </div>
            <div className="stat-pill">
              <span className="text-lg font-semibold text-slate-950 theme-dark:text-white">
                Best for
              </span>
              <span>feedback, questions, collaboration</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="surface-panel px-6 py-6 md:px-8">
          <p className="section-kicker">Start an email</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 theme-dark:text-white">
            Write the message in the browser, send it in your mail client
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 theme-dark:text-slate-300">
            This keeps the contact flow honest. No fake success state, no hidden backend queue,
            and no guesswork about whether the message actually went out.
          </p>

          <div className="mt-6">
            <ContactForm recipientEmail={organization.email} />
          </div>
        </div>

        <aside className="space-y-5">
          <div className="surface-card px-5 py-5">
            <p className="section-kicker">Good reasons to write</p>
            <div className="mt-4 space-y-3">
              {contactTopics.map((topic) => (
                <div
                  key={topic}
                  className="rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 theme-dark:border-slate-800 theme-dark:bg-slate-950/70 theme-dark:text-slate-300"
                >
                  {topic}
                </div>
              ))}
            </div>
          </div>

          <div className="surface-card px-5 py-5">
            <p className="section-kicker">Prefer browsing first?</p>
            <div className="mt-4 flex flex-col gap-3">
              <Link href="/about" className="editorial-link">
                Read about the project
              </Link>
              <Link href="/blog" className="editorial-link">
                Open the journal
              </Link>
              <Link href="/guides" className="editorial-link">
                Browse guides
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

