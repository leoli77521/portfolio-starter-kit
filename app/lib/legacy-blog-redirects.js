const nonDefaultLocalePattern = 'zh|de|fr|th|pt'

const legacyPathPrefixes = ['/blog', '/posts', '/articles', '/article', '/blog/post']
const legacyFileSuffixes = ['', '.html', '.htm', '.php', '.aspx']

const legacyBlogRedirects = Object.freeze([
  {
    source: '/blog/claude-ai-now-executes-code',
    destination: '/blog/2026-03-09-gpt-5-4-codex-agent-stack',
  },
  {
    source: '/blog/2026-03-09-claude-firefox-ai-bug-hunters',
    destination: '/blog/2026-03-09-gpt-5-4-codex-agent-stack',
  },
  {
    source: '/topics/ai-model-comparisons',
    destination: '/ai-models',
  },
])

function getLegacyBlogRedirects() {
  return legacyBlogRedirects.flatMap(({source, destination}) => {
    const isArticleRedirect = source.startsWith('/blog/')
    const articleSlug = isArticleRedirect ? source.slice('/blog/'.length) : null
    const sources = articleSlug
      ? legacyPathPrefixes.flatMap((prefix) =>
          legacyFileSuffixes.map((suffix) => `${prefix}/${articleSlug}${suffix}`)
        )
      : [source]

    return sources.flatMap((redirectSource) => [
      {source: redirectSource, destination, permanent: true},
      {
        source: `/:locale(${nonDefaultLocalePattern})${redirectSource}`,
        destination: isArticleRedirect ? `/:locale${destination}` : destination,
        permanent: true,
      },
    ])
  })
}

function isLegacyBlogSlug(slug) {
  return legacyBlogRedirects.some((redirect) => redirect.source === `/blog/${slug}`)
}

module.exports = {
  getLegacyBlogRedirects,
  isLegacyBlogSlug,
  legacyBlogRedirects,
}
