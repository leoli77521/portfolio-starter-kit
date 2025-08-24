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
    <footer className="mb-16">
      <ul className="font-sm mt-8 flex flex-col space-x-0 space-y-2 text-neutral-600 md:flex-row md:space-x-4 md:space-y-0 dark:text-neutral-300">
        <li>
          <a
            className="footer-link"
            rel="noopener noreferrer"
            target="_blank"
            href="/rss"
            title="Subscribe to RSS Feed for Latest AI Tech and SEO Tutorials"
          >
            <ArrowIcon />
            <p className="ml-2 h-7">RSS Feed</p>
          </a>
        </li>
        <li>
          <a
            className="footer-link"
            rel="noopener noreferrer"
            target="_blank"
            href="https://github.com/vercel/next.js"
            title="Next.js GitHub Repository - React Framework for Production"
          >
            <ArrowIcon />
            <p className="ml-2 h-7">Next.js GitHub</p>
          </a>
        </li>
        <li>
          <a
            className="footer-link"
            rel="noopener noreferrer"
            target="_blank"
            href="https://vercel.com/templates/next.js/portfolio-starter-kit"
            title="Portfolio Starter Kit Template Source Code on Vercel"
          >
            <ArrowIcon />
            <p className="ml-2 h-7">Template Source</p>
          </a>
        </li>
      </ul>

      {/* Tech Communities & Resources Section */}
      <div className="mt-12 border-t border-neutral-200 dark:border-neutral-800 pt-8">
        <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-4">Developer Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tech Communities */}
          <div>
            <h4 className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">Tech Communities</h4>
            <ul className="space-y-1">
              <li>
                <a
                  className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://github.com"
                  title="GitHub - World's Leading Development Platform"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://dev.to"
                  title="DEV Community - Developer Articles and Discussions"
                >
                  DEV Community
                </a>
              </li>
              <li>
                <a
                  className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://stackoverflow.com"
                  title="Stack Overflow - Programming Q&A Platform"
                >
                  Stack Overflow
                </a>
              </li>
            </ul>
          </div>

          {/* Content Platforms */}
          <div>
            <h4 className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">Content Platforms</h4>
            <ul className="space-y-1">
              <li>
                <a
                  className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://medium.com"
                  title="Medium - Quality Tech Content and Articles"
                >
                  Medium
                </a>
              </li>
              <li>
                <a
                  className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://news.ycombinator.com"
                  title="Hacker News - Tech News and Discussions"
                >
                  Hacker News
                </a>
              </li>
              <li>
                <a
                  className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://www.reddit.com/r/programming/"
                  title="Reddit Programming - Developer Discussions"
                >
                  Reddit /r/programming
                </a>
              </li>
            </ul>
          </div>

          {/* Professional Networks */}
          <div>
            <h4 className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">Professional Networks</h4>
            <ul className="space-y-1">
              <li>
                <a
                  className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://towardsdatascience.com"
                  title="Towards Data Science - AI and Machine Learning Articles"
                >
                  Towards Data Science
                </a>
              </li>
              <li>
                <a
                  className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://www.producthunt.com"
                  title="Product Hunt - Discover New Tech Products"
                >
                  Product Hunt
                </a>
              </li>
              <li>
                <a
                  className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors"
                  rel="noopener noreferrer"
                  target="_blank"
                  href="https://www.indiehackers.com"
                  title="Indie Hackers - Independent Developer Community"
                >
                  Indie Hackers
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <p className="mt-8 text-neutral-600 dark:text-neutral-300">
        © {new Date().getFullYear()} MIT Licensed
      </p>
    </footer>
  )
}
