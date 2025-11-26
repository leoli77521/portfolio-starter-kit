function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="mt-20 mb-16 border-t border-gray-200 dark:border-gray-700 pt-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {/* About Section */}
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">About ToLearn</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Your trusted source for cutting-edge AI insights, programming tutorials, and web development best practices.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                href="/"
                title="Homepage"
              >
                Home
              </a>
            </li>
            <li>
              <a
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                href="/about"
                title="About Us"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                href="/blog"
                title="Blog"
              >
                Blog
              </a>
            </li>
            <li>
              <a
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                href="/rss"
                title="RSS Feed"
              >
                RSS Feed
              </a>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Resources</h3>
          <ul className="space-y-2">
            <li>
              <a
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                rel="noopener noreferrer"
                target="_blank"
                href="https://github.com"
                title="GitHub"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                rel="noopener noreferrer"
                target="_blank"
                href="https://dev.to"
                title="DEV Community"
              >
                DEV Community
              </a>
            </li>
            <li>
              <a
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                rel="noopener noreferrer"
                target="_blank"
                href="https://stackoverflow.com"
                title="Stack Overflow"
              >
                Stack Overflow
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Legal</h3>
          <ul className="space-y-2">
            <li>
              <a
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                href="/privacy"
                title="Privacy Policy"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                href="/terms"
                title="Terms of Service"
              >
                Terms of Service
              </a>
            </li>
            <li>
              <a
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                href="/contact"
                title="Contact Us"
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Stay Connected</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Subscribe to our RSS feed for the latest updates on AI, programming, and tech trends.
          </p>
          <a
            href="/rss"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-full transition-colors"
            title="Subscribe to RSS"
          >
            Subscribe to RSS
          </a>
        </div>
      </div>


      <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} ToLearn Blog. All rights reserved.
        </p>
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <a
            href="https://github.com/vercel/next.js"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            rel="noopener noreferrer"
            target="_blank"
            title="Next.js"
          >
            Built with Next.js
          </a>
          <a
            href="https://vercel.com"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            rel="noopener noreferrer"
            target="_blank"
            title="Vercel"
          >
            Powered by Vercel
          </a>
        </div>
      </div>
    </footer>
  )
}
