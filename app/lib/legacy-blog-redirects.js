const nonDefaultLocalePattern = 'zh|de|fr|th|pt'

const legacyBlogRedirects = Object.freeze([
  {
    source: '/blog/claude-ai-now-executes-code',
    destination: '/blog/2026-03-09-gpt-5-4-codex-agent-stack',
  },
  {
    source: '/blog/2026-03-09-claude-firefox-ai-bug-hunters',
    destination: '/blog/2026-03-09-gpt-5-4-codex-agent-stack',
  },
])

function getLegacyBlogRedirects() {
  return legacyBlogRedirects.flatMap(({source, destination}) => [
    {source, destination, permanent: true},
    {
      source: `/:locale(${nonDefaultLocalePattern})${source}`,
      destination: `/:locale${destination}`,
      permanent: true,
    },
  ])
}

function isLegacyBlogSlug(slug) {
  return legacyBlogRedirects.some((redirect) => redirect.source === `/blog/${slug}`)
}

module.exports = {
  getLegacyBlogRedirects,
  isLegacyBlogSlug,
  legacyBlogRedirects,
}
