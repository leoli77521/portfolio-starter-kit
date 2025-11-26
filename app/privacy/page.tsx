import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Privacy Policy for ToLearn Blog',
}

export default function PrivacyPage() {
    return (
        <section className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Privacy Policy</h1>
            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

                <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">1. Introduction</h2>
                <p className="mb-4">
                    Welcome to ToLearn Blog ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy.
                    This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">2. Information We Collect</h2>
                <p className="mb-4">
                    We may collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website, or otherwise when you contact us.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">3. Use of Cookies and Web Beacons</h2>
                <p className="mb-4">
                    We may use cookies, web beacons, tracking pixels, and other tracking technologies on the website to help customize the website and improve your experience. When you access the website, your personal information is not collected through the use of tracking technology.
                </p>

                <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-gray-100">Google AdSense</h3>
                <p className="mb-4">
                    We use Google AdSense to display ads. Google and its partners use cookies (such as the DoubleClick cookie) to serve ads based on your prior visits to our website or other websites on the internet.
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                    <li>
                        Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.
                    </li>
                    <li>
                        Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.
                    </li>
                    <li>
                        Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Google Ads Settings</a>.
                    </li>
                </ul>

                <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">4. Third-Party Websites</h2>
                <p className="mb-4">
                    The website may contain links to third-party websites and applications of interest, including advertisements and external services, that are not affiliated with us. Once you have used these links to leave the website, any information you provide to these third parties is not covered by this Privacy Policy, and we cannot guarantee the safety and privacy of your information.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-gray-100">5. Contact Us</h2>
                <p className="mb-4">
                    If you have questions or comments about this Privacy Policy, please contact us at:
                </p>
                <p className="font-medium">contact@tolearn.com</p>
            </div>
        </section>
    )
}
