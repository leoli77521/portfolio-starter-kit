import type { Metadata } from 'next'
import { baseUrl, organization } from 'app/lib/constants'

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Contact ToLearn Blog',
}

export default function ContactPage() {
    // Organization data is imported from constants
    const contactSchema = {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        '@id': `${baseUrl}/contact/#contact`,
        url: `${baseUrl}/contact`,
        name: 'Contact ToLearn Blog',
        description: 'Contact ToLearn Blog',
        mainEntity: organization,
    }

    return (
        <section className="max-w-3xl mx-auto px-4 py-12">
            <script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(contactSchema),
                }}
            />
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Contact Us</h1>

            <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                        We'd love to hear from you. Whether you have a question about our tutorials, need assistance, or just want to talk about AI and tech, we are here to help.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-xl">📧</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Email</h3>
                                <p className="text-gray-600 dark:text-gray-400">{organization.email}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                <span className="text-xl">💬</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Social Media</h3>
                                <p className="text-gray-600 dark:text-gray-400">Follow us on Twitter and GitHub for updates.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">Send us a message</h2>
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                            <input
                                type="text"
                                id="name"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Your name"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="your@email.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                            <textarea
                                id="message"
                                rows={4}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="How can we help?"
                            ></textarea>
                        </div>
                        <button
                            type="button"
                            className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}
