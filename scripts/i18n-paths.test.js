const assert = require('node:assert/strict')
const {test} = require('node:test')

const {
  defaultLocale,
  isLocale,
  localizePath,
  stripLocaleFromPath,
  getContentPath,
  getLocalizedAlternates,
  shouldUseLocaleRouting,
} = require('../app/lib/i18n-paths')

test('default locale keeps existing root URLs unchanged', () => {
  assert.equal(defaultLocale, 'en')
  assert.equal(localizePath('/', 'en'), '/')
  assert.equal(localizePath('/blog', 'en'), '/blog')
  assert.equal(localizePath('/blog/example-post', 'en'), '/blog/example-post')
})

test('non-default locales use a locale prefix', () => {
  assert.equal(localizePath('/', 'zh'), '/zh')
  assert.equal(localizePath('/#start-here', 'zh'), '/zh#start-here')
  assert.equal(localizePath('/search?q=agents', 'fr'), '/fr/search?q=agents')
  assert.equal(localizePath('/blog', 'de'), '/de/blog')
  assert.equal(localizePath('/about', 'pt'), '/pt/about')
})

test('locale stripping returns the content path and locale', () => {
  assert.deepEqual(stripLocaleFromPath('/zh/blog'), {locale: 'zh', pathname: '/blog'})
  assert.deepEqual(stripLocaleFromPath('/fr'), {locale: 'fr', pathname: '/'})
  assert.deepEqual(stripLocaleFromPath('/blog'), {locale: 'en', pathname: '/blog'})
})

test('article content paths can use locale prefixes after translation rollout', () => {
  assert.equal(getContentPath('/blog/example-post', 'zh'), '/zh/blog/example-post')
  assert.equal(getContentPath('/blog/example-post', 'en'), '/blog/example-post')
  assert.equal(getContentPath('/topics', 'th'), '/th/topics')
})

test('dynamic non-article routes stay English until localized routes exist', () => {
  assert.equal(localizePath('/categories/ai-technology', 'zh'), '/categories/ai-technology')
  assert.equal(localizePath('/tags/ai-coding-agents', 'de'), '/tags/ai-coding-agents')
  assert.equal(localizePath('/topics/ai-coding-agent-stack', 'fr'), '/topics/ai-coding-agent-stack')
  assert.equal(localizePath('/guides/seo-optimization-complete-guide', 'pt'), '/guides/seo-optimization-complete-guide')
  assert.equal(getContentPath('/blog/example-post', 'th'), '/th/blog/example-post')
})

test('dynamic non-article routes bypass locale middleware', () => {
  assert.equal(shouldUseLocaleRouting('/categories/ai-technology'), false)
  assert.equal(shouldUseLocaleRouting('/tags/ai-coding-agents'), false)
  assert.equal(shouldUseLocaleRouting('/topics/ai-coding-agent-stack'), false)
  assert.equal(shouldUseLocaleRouting('/guides/seo-optimization-complete-guide'), false)
  assert.equal(shouldUseLocaleRouting('/templates/nextjs/developer'), false)
  assert.equal(shouldUseLocaleRouting('/solutions/performance'), false)
  assert.equal(shouldUseLocaleRouting('/blog/example-post'), true)
  assert.equal(shouldUseLocaleRouting('/zh/blog/example-post'), true)
  assert.equal(shouldUseLocaleRouting('/zh/categories'), true)
})

test('localized alternates include all UI locales for localizable pages', () => {
  assert.equal(isLocale('zh'), true)
  assert.equal(isLocale('en-US'), false)
  assert.deepEqual(getLocalizedAlternates('/about'), {
    'en-US': '/about',
    'zh-CN': '/zh/about',
    'de-DE': '/de/about',
    'fr-FR': '/fr/about',
    'th-TH': '/th/about',
    'pt-BR': '/pt/about',
    'x-default': '/about',
  })
  assert.deepEqual(getLocalizedAlternates('/blog/example-post'), {
    'en-US': '/blog/example-post',
    'zh-CN': '/zh/blog/example-post',
    'de-DE': '/de/blog/example-post',
    'fr-FR': '/fr/blog/example-post',
    'th-TH': '/th/blog/example-post',
    'pt-BR': '/pt/blog/example-post',
    'x-default': '/blog/example-post',
  })
  assert.deepEqual(getLocalizedAlternates('/topics/ai-coding-agent-stack'), {
    'en-US': '/topics/ai-coding-agent-stack',
    'x-default': '/topics/ai-coding-agent-stack',
  })
})
