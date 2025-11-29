import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Terms of Service',
    description: 'Terms of Service for ToLearn Blog',
}

export default function TermsPage() {
    return (
        <section className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Terms of Service</h1>
            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

                <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">1. Agreement to Terms</h2>
                <p className="mb-4">
                    These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and ToLearn Blog ("we," "us," or "our"), concerning your access to and use of the website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">2. Intellectual Property Rights</h2>
                <p className="mb-4">
                    Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">3. User Representations</h2>
                <p className="mb-4">
                    By using the Site, you represent and warrant that: (1) you have the legal capacity and you agree to comply with these Terms of Service; (2) you are not a minor in the jurisdiction in which you reside; (3) you will not access the Site through automated or non-human means, whether through a bot, script or otherwise; (4) you will not use the Site for any illegal or unauthorized purpose; and (5) your use of the Site will not violate any applicable law or regulation.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">4. Disclaimer</h2>
                <p className="mb-4">
                    The Site is provided on an as-is and as-available basis. You agree that your use of the Site and our services will be at your sole risk. To the fullest extent permitted by law, we disclaim all warranties, express or implied, in connection with the Site and your use thereof, including, without limitation, the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">5. Contact Us</h2>
                <p className="mb-4">
                    In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
                </p>
                <p className="font-medium">lileo16881533@gmail.com</p>
            </div>
        </section>
    )
}
